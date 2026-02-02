#!/usr/bin/env node

/**
 * Sales Performance Analytics Engine
 * Analyzes follow-up tracker data to generate insights and recommendations
 * Built for Icky - Kärcher Key Account Manager
 */

const fs = require('fs');
const path = require('path');
const csv = require('csv-parse/sync');

const ACCOUNTS_FILE = path.join(__dirname, 'accounts.csv');
const ACTIVITIES_FILE = path.join(__dirname, 'activities.csv');
const METRICS_FILE = path.join(__dirname, 'metrics.json');

// ============================================================================
// DATA LOADING
// ============================================================================

function loadAccounts() {
  try {
    const content = fs.readFileSync(ACCOUNTS_FILE, 'utf8');
    const records = csv.parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    return records;
  } catch (err) {
    console.error(`❌ Error loading accounts: ${err.message}`);
    return [];
  }
}

function loadActivities() {
  try {
    const content = fs.readFileSync(ACTIVITIES_FILE, 'utf8');
    const records = csv.parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    return records;
  } catch (err) {
    console.error(`❌ Error loading activities: ${err.message}`);
    return [];
  }
}

function loadMetrics() {
  try {
    if (fs.existsSync(METRICS_FILE)) {
      return JSON.parse(fs.readFileSync(METRICS_FILE, 'utf8'));
    }
  } catch (err) {
    console.error(`⚠️  Could not load metrics history: ${err.message}`);
  }
  return {};
}

function saveMetrics(metrics) {
  try {
    fs.writeFileSync(METRICS_FILE, JSON.stringify(metrics, null, 2));
    return true;
  } catch (err) {
    console.error(`❌ Error saving metrics: ${err.message}`);
    return false;
  }
}

// ============================================================================
// ANALYTICS CALCULATIONS
// ============================================================================

function calculateMetrics(accounts, activities) {
  const metrics = {};
  const closedStatuses = ['CLOSED', 'DEAL CLOSED', 'CLOSED WON'];

  // STATUS BREAKDOWN
  const statusCounts = {};
  const statusValues = {};
  accounts.forEach(acc => {
    const status = acc.Status || 'Unknown';
    statusCounts[status] = (statusCounts[status] || 0) + 1;
    const dealValue = parseFloat((acc['Deal Size EUR'] || acc['Deal Value'] || 0).toString().replace(/[€,]/g, ''));
    statusValues[status] = (statusValues[status] || 0) + dealValue;
  });
  metrics.statusBreakdown = statusCounts;
  metrics.valueByStatus = statusValues;

  // CONVERSION RATES (Check for "closed" status values)
  const closed = accounts.filter(a => closedStatuses.includes((a.Status || '').toUpperCase())).length;
  const total = accounts.length;
  metrics.closureRate = total > 0 ? ((closed / total) * 100).toFixed(1) : '0.0';

  // ACTIVITY COUNTS
  const activityByType = {};
  activities.forEach(act => {
    const type = (act.Type || 'Other').toLowerCase();
    activityByType[type] = (activityByType[type] || 0) + 1;
  });
  metrics.activityByType = activityByType;
  metrics.totalActivities = activities.length;
  metrics.activitiesPerAccount = total > 0 ? (activities.length / total).toFixed(1) : '0.0';

  // AVERAGE DEAL SIZE
  const dealValues = accounts
    .map(a => {
      const val = (a['Deal Size EUR'] || a['Deal Value'] || 0).toString().replace(/[€,]/g, '');
      return parseFloat(val) || 0;
    })
    .filter(v => v > 0);
  metrics.averageDealSize = dealValues.length > 0 
    ? Math.round(dealValues.reduce((a, b) => a + b, 0) / dealValues.length)
    : 0;

  // PIPELINE VALUE
  metrics.totalPipeline = dealValues.reduce((a, b) => a + b, 0);
  metrics.closedDeals = accounts
    .filter(a => closedStatuses.includes((a.Status || '').toUpperCase()))
    .map(a => {
      const val = (a['Deal Size EUR'] || a['Deal Value'] || 0).toString().replace(/[€,]/g, '');
      return parseFloat(val) || 0;
    })
    .reduce((a, b) => a + b, 0);

  // SALES CYCLE ANALYSIS
  metrics.salesCycleDays = estimateSalesCycleDays(accounts, activities);

  // ENGAGEMENT SCORING
  metrics.engagementScores = calculateEngagementScores(accounts, activities, closedStatuses);

  return metrics;
}

function estimateSalesCycleDays(accounts, activities) {
  // Group activities by account
  const activitiesByAccount = {};
  activities.forEach(act => {
    const accountId = act.Account || act['Account Name'];
    if (!activitiesByAccount[accountId]) {
      activitiesByAccount[accountId] = [];
    }
    activitiesByAccount[accountId].push(act);
  });

  // For each account with multiple activities, estimate cycle time
  const cycles = [];
  Object.keys(activitiesByAccount).forEach(accId => {
    const accs = activitiesByAccount[accId];
    if (accs.length > 1) {
      // Simple approximation: spread of dates
      const dates = accs
        .map(a => new Date(a.Date || new Date()))
        .filter(d => !isNaN(d))
        .sort((a, b) => a - b);
      if (dates.length > 1) {
        const diff = Math.floor((dates[dates.length - 1] - dates[0]) / (1000 * 60 * 60 * 24));
        cycles.push(diff);
      }
    }
  });

  if (cycles.length === 0) return 0;
  return Math.round(cycles.reduce((a, b) => a + b, 0) / cycles.length);
}

function calculateEngagementScores(accounts, activities, closedStatuses) {
  const scores = {};
  const activityByAccount = {};

  activities.forEach(act => {
    const accId = act.Account || act['Account Name'];
    activityByAccount[accId] = (activityByAccount[accId] || 0) + 1;
  });

  accounts.forEach(acc => {
    const accId = acc['Account Name'] || acc.Name;
    const actCount = activityByAccount[accId] || 0;
    
    // Score: activity count (higher = more engagement)
    // Bonus if closed, penalty if stalled
    let score = Math.min(actCount * 10, 50); // Max 50 points for activities
    
    const status = (acc.Status || '').toUpperCase();
    if (closedStatuses.includes(status)) {
      score += 50; // Bonus for closed deals
    } else if (status === 'STALLED' || status === 'NO RESPONSE') {
      score -= 20; // Penalty for stalled
    } else if (status === 'QUALIFIED' || status === 'DEMO COMPLETED' || status === 'NEGOTIATING') {
      score += 15; // Bonus for active status
    }
    
    score = Math.max(0, Math.min(100, score)); // Clamp to 0-100
    scores[accId] = score;
  });

  return scores;
}

// ============================================================================
// INSIGHTS & RECOMMENDATIONS
// ============================================================================

function generateInsights(metrics, accounts, activities) {
  const insights = [];

  // High closure rate
  const closureRate = parseFloat(metrics.closureRate);
  if (closureRate > 30) {
    insights.push({
      type: 'positive',
      title: '🎯 Excellent Closure Rate',
      message: `${metrics.closureRate}% of deals are closing - well above industry average (~20%)`
    });
  } else if (closureRate < 10) {
    insights.push({
      type: 'warning',
      title: '⚠️ Low Closure Rate',
      message: `Only ${metrics.closureRate}% closure rate. Consider: better qualification, earlier follow-ups, or improved pitch`
    });
  }

  // Activity engagement
  const actPerAcc = parseFloat(metrics.activitiesPerAccount);
  if (actPerAcc > 2) {
    insights.push({
      type: 'positive',
      title: '📞 Strong Account Engagement',
      message: `Average ${metrics.activitiesPerAccount} touches per account - excellent follow-up discipline`
    });
  } else if (actPerAcc < 1) {
    insights.push({
      type: 'warning',
      title: '📉 Low Activity per Account',
      message: `Only ${metrics.activitiesPerAccount} touches per account. Most deals need 5-7 touches to close.`
    });
  }

  // Sales cycle analysis
  if (metrics.salesCycleDays > 90) {
    insights.push({
      type: 'info',
      title: '📅 Long Sales Cycle',
      message: `Average ${metrics.salesCycleDays} days. Consider implementing email automation to shorten cycle.`
    });
  } else if (metrics.salesCycleDays > 0 && metrics.salesCycleDays < 30) {
    insights.push({
      type: 'positive',
      title: '⚡ Fast Sales Cycle',
      message: `Only ${metrics.salesCycleDays} days average - keep this momentum!`
    });
  }

  // Pipeline health
  const closedPercent = metrics.totalPipeline > 0 
    ? ((metrics.closedDeals / metrics.totalPipeline) * 100).toFixed(0)
    : 0;
  
  if (closedPercent < 20) {
    insights.push({
      type: 'warning',
      title: '💰 Pipeline Concentration',
      message: `Only ${closedPercent}% of pipeline is closed. Focus on moving deals forward.`
    });
  }

  // Activity type balance
  const totalAct = metrics.totalActivities;
  if (totalAct > 0) {
    const callPct = Math.round((metrics.activityByType.call || 0) / totalAct * 100);
    const emailPct = Math.round((metrics.activityByType.email || 0) / totalAct * 100);
    
    if (callPct < 20 && callPct > 0) {
      insights.push({
        type: 'info',
        title: '☎️ Increase Phone Calls',
        message: `Only ${callPct}% of activities are calls. Calls close faster than emails.`
      });
    }
  }

  return insights;
}

function generateRecommendations(metrics, accounts) {
  const recs = [];

  // Helper to get deal value
  const getDealValue = (acc) => {
    const val = (acc['Deal Size EUR'] || acc['Deal Value'] || 0).toString().replace(/[€,]/g, '');
    return parseFloat(val) || 0;
  };

  // Find stalled deals
  const stalledDeals = accounts.filter(a => (a.Status || '').toUpperCase() === 'STALLED' || (a.Status || '').toUpperCase() === 'NO RESPONSE');
  if (stalledDeals.length > 0) {
    const totalValue = stalledDeals.reduce((sum, a) => sum + getDealValue(a), 0);
    recs.push({
      priority: 'high',
      action: `Revive ${stalledDeals.length} stalled/no-response deals (€${Math.round(totalValue).toLocaleString()})`,
      details: stalledDeals.slice(0, 3).map(d => `  • ${d['Account Name']}: ${d.Contact} (€${Math.round(getDealValue(d))})`).join('\n'),
      template: 'Check-in'
    });
  }

  // Find qualified/demo deals needing follow-up
  const activeStatuses = ['QUALIFIED', 'DEMO COMPLETED', 'AWAITING RESPONSE', 'QUOTE SENT'];
  const activeDeals = accounts.filter(a => activeStatuses.includes((a.Status || '').toUpperCase()));
  if (activeDeals.length > 3) {
    recs.push({
      priority: 'high',
      action: `Push forward ${Math.min(5, activeDeals.length)} hot leads ready to close`,
      details: activeDeals.slice(0, 5).map(d => `  • ${d['Account Name']}: €${Math.round(getDealValue(d))}`).join('\n'),
      template: 'Follow-up'
    });
  }

  // Find new prospects to engage
  const newProspects = accounts.filter(a => (a.Status || '').toUpperCase() === 'NEW');
  if (newProspects.length > 0) {
    recs.push({
      priority: 'medium',
      action: `Qualify ${newProspects.length} new prospect(s) - first touch is critical`,
      details: newProspects.map(d => `  • ${d['Account Name']}: ${d.Contact}`).join('\n'),
      template: 'Cold-Outreach'
    });
  }

  // Find high-value opportunities
  const highValue = accounts
    .filter(a => getDealValue(a) > 15000)
    .sort((a, b) => getDealValue(b) - getDealValue(a));
  
  if (highValue.length > 0) {
    const topValue = getDealValue(highValue[0]);
    recs.push({
      priority: 'high',
      action: `Prioritize ${highValue.length} high-value deal(s): €${Math.round(topValue)} +`,
      details: highValue.slice(0, 3).map(d => `  • ${d['Account Name']}: €${Math.round(getDealValue(d))}`).join('\n'),
      template: 'Strategic-Follow-up'
    });
  }

  return recs;
}

// ============================================================================
// REPORT GENERATION
// ============================================================================

function generateWeeklyReport(metrics, insights, recommendations, accounts, activities, closedStatuses) {
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const recentActivities = activities.filter(a => {
    try {
      const actDate = new Date(a.Date);
      return actDate >= weekAgo && actDate <= today;
    } catch {
      return false;
    }
  });

  const report = {
    title: '📊 Weekly Sales Report',
    period: `${weekAgo.toLocaleDateString()} - ${today.toLocaleDateString()}`,
    generatedAt: new Date().toISOString(),
    
    // Summary metrics
    summary: {
      totalAccounts: accounts.length,
      pipeline: `€${metrics.totalPipeline.toLocaleString()}`,
      closedThisWeek: recentActivities.filter(a => (a.Type || '').toLowerCase() === 'deal-closed').length,
      activitiesThisWeek: recentActivities.length,
      avgDeal: `€${metrics.averageDealSize.toLocaleString()}`,
      closureRate: `${metrics.closureRate}%`
    },
    
    // Status breakdown
    statuses: {
      active: accounts.filter(a => {
        const s = (a.Status || '').toUpperCase();
        return ['QUALIFIED', 'DEMO COMPLETED', 'NEGOTIATING', 'QUOTE SENT', 'AWAITING RESPONSE'].includes(s);
      }).length,
      stalled: accounts.filter(a => (a.Status || '').toUpperCase() === 'STALLED' || (a.Status || '').toUpperCase() === 'NO RESPONSE').length,
      closed: accounts.filter(a => closedStatuses.includes((a.Status || '').toUpperCase())).length,
      new: accounts.filter(a => (a.Status || '').toUpperCase() === 'NEW').length
    },
    
    // Activity breakdown
    activities: metrics.activityByType,
    
    // Insights
    insights: insights,
    
    // Recommendations
    recommendations: recommendations,
    
    // Top performers (by engagement score)
    topAccounts: Object.entries(metrics.engagementScores || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, score]) => ({ name, score })),
    
    // At-risk deals (stalled > 30 days or no recent activity)
    atRisk: accounts
      .filter(a => {
        const status = (a.Status || '').toUpperCase();
        return status === 'STALLED' || status === 'NO RESPONSE';
      })
      .map(a => {
        const val = (a['Deal Size EUR'] || a['Deal Value'] || 0).toString().replace(/[€,]/g, '');
        return { 
          name: a['Account Name'], 
          value: Math.round(parseFloat(val) || 0), 
          lastUpdate: a['Last Activity Date'] || 'Unknown' 
        };
      })
      .slice(0, 5)
  };

  return report;
}

function formatReportForDisplay(report) {
  let output = '\n';
  output += '═'.repeat(70) + '\n';
  output += `  ${report.title}\n`;
  output += `  ${report.period}\n`;
  output += '═'.repeat(70) + '\n\n';

  // Summary boxes
  output += '📈 KEY METRICS\n';
  output += '─'.repeat(70) + '\n';
  output += `  Pipeline Value:        €${report.summary.pipeline}\n`;
  output += `  Total Accounts:        ${report.summary.totalAccounts}\n`;
  output += `  Closure Rate:          ${report.summary.closureRate}\n`;
  output += `  Avg Deal Size:         ${report.summary.avgDeal}\n`;
  output += `  Activities This Week:  ${report.summary.activitiesThisWeek}\n`;
  output += `  Deals Closed:          ${report.summary.closedThisWeek}\n\n`;

  // Status breakdown
  output += '🎯 ACCOUNT STATUS\n';
  output += '─'.repeat(70) + '\n';
  output += `  Active:     ${report.statuses.active}\n`;
  output += `  Qualified:  ${report.statuses.qualified}\n`;
  output += `  Stalled:    ${report.statuses.stalled}\n`;
  output += `  New:        ${report.statuses.new}\n`;
  output += `  Closed:     ${report.statuses.closed}\n\n`;

  // Activity types
  output += '📊 ACTIVITY BREAKDOWN\n';
  output += '─'.repeat(70) + '\n';
  Object.entries(report.activities).forEach(([type, count]) => {
    output += `  ${type.charAt(0).toUpperCase() + type.slice(1)}: ${count}\n`;
  });
  output += '\n';

  // Insights
  if (report.insights.length > 0) {
    output += '💡 KEY INSIGHTS\n';
    output += '─'.repeat(70) + '\n';
    report.insights.forEach(insight => {
      output += `  ${insight.title}\n`;
      output += `  ${insight.message}\n\n`;
    });
  }

  // Recommendations
  if (report.recommendations.length > 0) {
    output += '🎬 ACTION ITEMS\n';
    output += '─'.repeat(70) + '\n';
    report.recommendations.forEach((rec, idx) => {
      const priority = rec.priority === 'high' ? '🔴' : '🟡';
      output += `  ${priority} [${rec.priority.toUpperCase()}] ${rec.action}\n`;
      if (rec.details) {
        output += rec.details + '\n';
      }
      output += '\n';
    });
  }

  // Top accounts
  if (report.topAccounts.length > 0) {
    output += '⭐ TOP PERFORMING ACCOUNTS\n';
    output += '─'.repeat(70) + '\n';
    report.topAccounts.forEach((acc, idx) => {
      output += `  ${idx + 1}. ${acc.name} (engagement: ${acc.score}/100)\n`;
    });
    output += '\n';
  }

  // At-risk deals
  if (report.atRisk.length > 0) {
    output += '⚠️  AT-RISK DEALS (Need Immediate Action)\n';
    output += '─'.repeat(70) + '\n';
    report.atRisk.forEach(deal => {
      output += `  • ${deal.name}: €${deal.value} (Last: ${deal.lastUpdate})\n`;
    });
    output += '\n';
  }

  output += '═'.repeat(70) + '\n\n';
  return output;
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

function main() {
  console.log('\n🔍 Sales Analytics Engine Starting...\n');

  // Load data
  const accounts = loadAccounts();
  const activities = loadActivities();
  const priorMetrics = loadMetrics();

  if (accounts.length === 0) {
    console.error('❌ No accounts found. Please add data to accounts.csv first.');
    process.exit(1);
  }

  console.log(`📊 Analyzing ${accounts.length} accounts and ${activities.length} activities...\n`);

  // Calculate metrics
  const metrics = calculateMetrics(accounts, activities);

  // Generate insights
  const insights = generateInsights(metrics, accounts, activities);

  // Generate recommendations
  const recommendations = generateRecommendations(metrics, accounts);

  // Define closed statuses
  const closedStatuses = ['CLOSED', 'DEAL CLOSED', 'CLOSED WON'];

  // Generate weekly report
  const report = generateWeeklyReport(metrics, insights, recommendations, accounts, activities, closedStatuses);

  // Display report
  console.log(formatReportForDisplay(report));

  // Save metrics for trend analysis
  metrics.timestamp = new Date().toISOString();
  if (!priorMetrics.history) {
    priorMetrics.history = [];
  }
  priorMetrics.history.push(metrics);
  // Keep only last 12 weeks
  if (priorMetrics.history.length > 12) {
    priorMetrics.history = priorMetrics.history.slice(-12);
  }
  priorMetrics.latest = metrics;
  priorMetrics.lastReport = report;

  saveMetrics(priorMetrics);

  console.log('✅ Analytics complete! Metrics saved for trend tracking.\n');
  
  // Save report as JSON for programmatic use
  const reportFile = path.join(__dirname, 'latest-report.json');
  try {
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    console.log(`📄 Report saved to: latest-report.json\n`);
  } catch (err) {
    console.error(`⚠️  Could not save report: ${err.message}\n`);
  }
}

main();

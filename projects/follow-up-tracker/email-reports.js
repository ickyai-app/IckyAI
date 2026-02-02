#!/usr/bin/env node

/**
 * Email Report Generator
 * Creates formatted email reports from sales data
 * Ready to send via email or Slack
 */

const fs = require('fs');
const path = require('path');

const LATEST_REPORT_FILE = path.join(__dirname, 'latest-report.json');

function formatEmailReport(report) {
  let email = '';

  email += `Subject: Weekly Sales Report - ${report.period}\n\n`;

  email += `Hi there,\n\n`;

  email += `Here's your weekly sales snapshot:\n\n`;

  // Quick metrics
  email += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  email += `📊 THIS WEEK'S METRICS\n`;
  email += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  email += `Pipeline Value:      ${report.summary.pipeline}\n`;
  email += `Active Deals:        ${report.statuses.active}\n`;
  email += `Closure Rate:        ${report.summary.closureRate}\n`;
  email += `Activities Logged:   ${report.summary.activitiesThisWeek}\n`;
  email += `Deals Closed:        ${report.summary.closedThisWeek}\n\n`;

  // Account status
  email += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  email += `🎯 DEAL PIPELINE STATUS\n`;
  email += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  email += `Active:       ${report.statuses.active} deals in motion\n`;
  email += `Qualified:    ${report.statuses.qualified} deals qualified\n`;
  email += `Stalled:      ${report.statuses.stalled} deals need revival\n`;
  email += `New:          ${report.statuses.new} prospects to qualify\n`;
  email += `Closed:       ${report.statuses.closed} deals closed\n\n`;

  // Top accounts
  if (report.topAccounts.length > 0) {
    email += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    email += `⭐ YOUR BEST ACCOUNTS (By Engagement)\n`;
    email += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    report.topAccounts.forEach((acc, idx) => {
      const bar = '█'.repeat(Math.floor(acc.score / 5)) + '░'.repeat(20 - Math.floor(acc.score / 5));
      email += `${idx + 1}. ${acc.name}\n   ${bar} ${acc.score}/100\n\n`;
    });
  }

  // At-risk deals
  if (report.atRisk.length > 0) {
    email += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    email += `⚠️  DEALS AT RISK (Stalled - Needs Action)\n`;
    email += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    report.atRisk.forEach(deal => {
      email += `• ${deal.name}: €${deal.value}\n`;
      email += `  Last contact: ${deal.lastUpdate}\n\n`;
    });
  }

  // Key insights
  if (report.insights.length > 0) {
    email += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    email += `💡 KEY INSIGHTS\n`;
    email += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    report.insights.forEach(insight => {
      email += `${insight.title}\n`;
      email += `${insight.message}\n\n`;
    });
  }

  // Action items
  if (report.recommendations.length > 0) {
    email += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    email += `🎬 TOP ACTIONS FOR THIS WEEK\n`;
    email += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    // Show only high and medium priority
    const priorityRecs = report.recommendations.filter(r => r.priority !== 'low').slice(0, 3);
    priorityRecs.forEach((rec, idx) => {
      const icon = rec.priority === 'high' ? '🔴' : '🟡';
      email += `${idx + 1}. ${icon} ${rec.action}\n`;
      if (rec.details) {
        email += `   ${rec.details}\n`;
      }
      email += `\n`;
    });
  }

  email += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  email += `Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}\n`;
  email += `For detailed analytics, run: node analytics.js\n\n`;

  email += `Good luck this week!\n`;

  return email;
}

function formatSlackReport(report) {
  let slack = '';

  slack += `📊 *Weekly Sales Report* - ${report.period}\n\n`;

  slack += `*Key Metrics:*\n`;
  slack += `• Pipeline: *${report.summary.pipeline}*\n`;
  slack += `• Active Deals: *${report.statuses.active}*\n`;
  slack += `• Closure Rate: *${report.summary.closureRate}*\n`;
  slack += `• Activities: *${report.summary.activitiesThisWeek}*\n`;
  slack += `• Closed: *${report.summary.closedThisWeek}*\n\n`;

  slack += `*Status Breakdown:*\n`;
  slack += `Active: ${report.statuses.active} | Qualified: ${report.statuses.qualified} | `;
  slack += `Stalled: ${report.statuses.stalled} | New: ${report.statuses.new} | `;
  slack += `Closed: ${report.statuses.closed}\n\n`;

  if (report.topAccounts.length > 0) {
    slack += `*Top Performers:*\n`;
    report.topAccounts.slice(0, 3).forEach((acc, idx) => {
      slack += `${idx + 1}. ${acc.name} (${acc.score}/100)\n`;
    });
    slack += '\n';
  }

  if (report.atRisk.length > 0) {
    slack += `⚠️  *Deals at Risk:* ${report.atRisk.length} stalled deals need attention\n`;
    report.atRisk.slice(0, 2).forEach(deal => {
      slack += `• ${deal.name}: €${deal.value}\n`;
    });
    slack += '\n';
  }

  if (report.recommendations.length > 0) {
    const topRec = report.recommendations.find(r => r.priority === 'high') || report.recommendations[0];
    slack += `*Next Action:* ${topRec.action}\n`;
  }

  return slack;
}

function formatMarkdownReport(report) {
  let md = '';

  md += `# Weekly Sales Report\n\n`;
  md += `**Period:** ${report.period}  \n`;
  md += `**Generated:** ${new Date().toLocaleDateString()}\n\n`;

  md += `## 📊 Key Metrics\n\n`;
  md += `| Metric | Value |\n`;
  md += `|--------|-------|\n`;
  md += `| Pipeline Value | ${report.summary.pipeline} |\n`;
  md += `| Total Accounts | ${report.summary.totalAccounts} |\n`;
  md += `| Active Deals | ${report.statuses.active} |\n`;
  md += `| Closure Rate | ${report.summary.closureRate} |\n`;
  md += `| Avg Deal Size | ${report.summary.avgDeal} |\n`;
  md += `| Activities This Week | ${report.summary.activitiesThisWeek} |\n`;
  md += `| Deals Closed | ${report.summary.closedThisWeek} |\n\n`;

  md += `## 🎯 Account Status\n\n`;
  md += `- **Active:** ${report.statuses.active}\n`;
  md += `- **Qualified:** ${report.statuses.qualified}\n`;
  md += `- **Stalled:** ${report.statuses.stalled}\n`;
  md += `- **New:** ${report.statuses.new}\n`;
  md += `- **Closed:** ${report.statuses.closed}\n\n`;

  if (report.topAccounts.length > 0) {
    md += `## ⭐ Top Performing Accounts\n\n`;
    report.topAccounts.forEach((acc, idx) => {
      md += `${idx + 1}. **${acc.name}** - ${acc.score}/100 engagement\n`;
    });
    md += '\n';
  }

  if (report.atRisk.length > 0) {
    md += `## ⚠️ At-Risk Deals\n\n`;
    report.atRisk.forEach(deal => {
      md += `- **${deal.name}:** €${deal.value} (Last: ${deal.lastUpdate})\n`;
    });
    md += '\n';
  }

  if (report.recommendations.length > 0) {
    md += `## 🎬 Action Items\n\n`;
    report.recommendations.forEach(rec => {
      const priority = rec.priority === 'high' ? '🔴 HIGH' : '🟡 MEDIUM';
      md += `### ${priority}: ${rec.action}\n`;
      md += `${rec.details}\n\n`;
    });
  }

  return md;
}

function main() {
  // Check if latest report exists
  if (!fs.existsSync(LATEST_REPORT_FILE)) {
    console.error('❌ No report found. Run analytics.js first.\n');
    process.exit(1);
  }

  // Load latest report
  const report = JSON.parse(fs.readFileSync(LATEST_REPORT_FILE, 'utf8'));

  // Generate formats
  const emailFormat = formatEmailReport(report);
  const slackFormat = formatSlackReport(report);
  const markdownFormat = formatMarkdownReport(report);

  // Save formats
  fs.writeFileSync(path.join(__dirname, 'report-email.txt'), emailFormat);
  fs.writeFileSync(path.join(__dirname, 'report-slack.txt'), slackFormat);
  fs.writeFileSync(path.join(__dirname, 'report-markdown.md'), markdownFormat);

  console.log('\n✅ Reports generated in 3 formats:\n');
  console.log('📧 Email version:    report-email.txt');
  console.log('💬 Slack version:    report-slack.txt');
  console.log('📝 Markdown version: report-markdown.md\n');

  console.log('Email Preview:\n');
  console.log('─'.repeat(70));
  console.log(emailFormat);
  console.log('─'.repeat(70));
}

main();

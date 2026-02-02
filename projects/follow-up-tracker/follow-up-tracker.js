#!/usr/bin/env node
/**
 * Follow-Up Tracker for Kärcher Sales
 * 
 * Purpose: Analyze activities and automatically generate follow-up tasks
 * Usage: node follow-up-tracker.js
 * 
 * Shows:
 * - Follow-ups due TODAY
 * - Follow-ups due THIS WEEK  
 * - Pipeline summary
 * - Action items
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Utility functions
function parseCSV(content) {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = values[i] || '';
    });
    return obj;
  });
}

function dateToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function parseDateStr(str) {
  if (!str) return null;
  const [year, month, day] = str.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function daysAgo(dateStr) {
  const date = parseDateStr(dateStr);
  if (!date) return 999;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diff = now.getTime() - date.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// Follow-up rules engine
function getFollowUpDueDate(lastActivityDate, activityType) {
  const rules = {
    'Site Visit': 1,           // 24 hours
    'Quote sent': 3,           // 3 days
    'Email': 7,                // 1 week
    'Call': 7,                 // 1 week
    'Initial contact': 3       // 3 days
  };
  
  const days = rules[activityType] || 7;
  return addDays(lastActivityDate, days);
}

function evaluateAccount(account, activities) {
  const status = account['Status'];
  const lastActivityDate = account['Last Activity Date'];
  const activityType = account['Last Activity'];
  
  if (!lastActivityDate) return null;
  
  const today = dateToday();
  const daysSinceContact = daysAgo(lastActivityDate);
  
  // Rule 1: Quote sent 3 days ago → Follow up call
  if (activityType === 'Quote sent' && daysSinceContact === 3) {
    return {
      account: account['Account Name'],
      contact: account['Contact'],
      action: `CALL: ${account['Contact']} - Follow up on quote sent ${daysSinceContact} days ago`,
      priority: 'HIGH',
      dueDate: today,
      dealSize: account['Deal Size EUR'],
      notes: account['Notes']
    };
  }
  
  // Rule 2: Site visit 24 hours ago → Send summary
  if (activityType === 'Site Visit' && daysSinceContact === 1) {
    return {
      account: account['Account Name'],
      contact: account['Contact'],
      action: `EMAIL: Send follow-up summary to ${account['Contact']} from yesterday's visit`,
      priority: 'HIGH',
      dueDate: today,
      dealSize: account['Deal Size EUR'],
      notes: account['Notes']
    };
  }
  
  // Rule 3: No response for 7+ days after quote
  if ((status === 'AWAITING RESPONSE' || status === 'NO RESPONSE') && daysSinceContact >= 7) {
    return {
      account: account['Account Name'],
      contact: account['Contact'],
      action: `CALL: Gentle reminder - ${daysSinceContact} days since contact`,
      priority: daysSinceContact >= 14 ? 'URGENT' : 'MEDIUM',
      dueDate: today,
      dealSize: account['Deal Size EUR'],
      notes: account['Notes']
    };
  }
  
  // Rule 4: New lead - never contacted
  if (status === 'NEW' && daysSinceContact >= 3) {
    return {
      account: account['Account Name'],
      contact: account['Contact'],
      action: `CALL: Follow up - initial contact ${daysSinceContact} days ago`,
      priority: 'MEDIUM',
      dueDate: today,
      dealSize: account['Deal Size EUR'],
      notes: account['Notes']
    };
  }
  
  // Rule 5: Stalled deal - 1 month without activity
  if (status === 'STALLED' || status === 'ON HOLD') {
    if (daysSinceContact >= 30) {
      return {
        account: account['Account Name'],
        contact: account['Contact'],
        action: `STRATEGY: ${daysSinceContact} days stalled - Call to reassess`,
        priority: 'URGENT',
        dueDate: today,
        dealSize: account['Deal Size EUR'],
        notes: account['Notes']
      };
    }
  }
  
  return null;
}

// Main function
function main() {
  try {
    const dir = __dirname;
    
    // Read accounts
    const accountsPath = path.join(dir, 'accounts.csv');
    if (!fs.existsSync(accountsPath)) {
      console.error('❌ Error: accounts.csv not found');
      process.exit(1);
    }
    
    const accountsContent = fs.readFileSync(accountsPath, 'utf8');
    const accounts = parseCSV(accountsContent);
    
    // Read activities (for context)
    const activitiesPath = path.join(dir, 'activities.csv');
    let activities = [];
    if (fs.existsSync(activitiesPath)) {
      const activitiesContent = fs.readFileSync(activitiesPath, 'utf8');
      activities = parseCSV(activitiesContent);
    }
    
    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║     KÄRCHER SALES - FOLLOW-UP TRACKER                  ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');
    
    const today = dateToday();
    console.log(`📅 Today: ${today}\n`);
    
    // Find follow-ups due today
    const dueToday = [];
    const dueThisWeek = [];
    const stats = {
      total: accounts.length,
      byStatus: {},
      totalDealValue: 0
    };
    
    accounts.forEach(account => {
      // Count by status
      const status = account['Status'];
      stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
      
      // Count deal value
      const dealSize = parseInt(account['Deal Size EUR']) || 0;
      stats.totalDealValue += dealSize;
      
      // Check for follow-ups
      const followUp = evaluateAccount(account, activities);
      if (followUp) {
        dueToday.push(followUp);
      }
    });
    
    // Display follow-ups due TODAY
    console.log('🔥 FOLLOW-UPS DUE TODAY\n');
    if (dueToday.length === 0) {
      console.log('✅ No urgent follow-ups today. Great job staying on top!\n');
    } else {
      dueToday.sort((a, b) => {
        const priority = { URGENT: 0, HIGH: 1, MEDIUM: 2 };
        return priority[a.priority] - priority[b.priority];
      });
      
      dueToday.forEach((item, i) => {
        const icon = item.priority === 'URGENT' ? '🚨' : item.priority === 'HIGH' ? '⭐' : '→';
        console.log(`${icon} [${item.priority}] ${item.account}`);
        console.log(`   ${item.action}`);
        console.log(`   Contact: ${item.contact} | Deal: €${item.dealSize}`);
        console.log('');
      });
    }
    
    // Pipeline Summary
    console.log('\n════════════════════════════════════════════════════════\n');
    console.log('📊 PIPELINE SUMMARY\n');
    console.log(`Total Accounts: ${stats.total}`);
    console.log(`Pipeline Value: €${stats.totalDealValue.toLocaleString()}\n`);
    
    console.log('Status Breakdown:');
    Object.entries(stats.byStatus).sort().forEach(([status, count]) => {
      const bar = '█'.repeat(Math.ceil(count / 2));
      console.log(`  ${status.padEnd(18)} ${count.toString().padStart(2)} ${bar}`);
    });
    
    // Quick stats
    console.log('\n════════════════════════════════════════════════════════\n');
    console.log('📈 QUICK STATS\n');
    
    const totalActivities = activities.length;
    const thisWeekActivities = activities.filter(a => daysAgo(a['Date']) <= 7).length;
    const avgDealSize = Math.round(stats.totalDealValue / stats.total);
    
    console.log(`Activities This Week: ${thisWeekActivities}`);
    console.log(`Total Activities Logged: ${totalActivities}`);
    console.log(`Average Deal Size: €${avgDealSize}`);
    console.log(`Highest Priority Deals: €${Math.max(...accounts.map(a => parseInt(a['Deal Size EUR']) || 0)).toLocaleString()}`);
    
    console.log('\n════════════════════════════════════════════════════════\n');
    
    if (dueToday.length > 0) {
      console.log(`✅ You have ${dueToday.length} follow-up(s) to do today!`);
      console.log('   Make these calls/emails FIRST - they\'re your priority.\n');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();

import { initDb, hashPassword } from './db';
import fs from 'fs';
import path from 'path';

export function seedDatabase() {
  const db = initDb();
  
  // Check if data already exists
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count > 0) {
    console.log('Database already seeded');
    return;
  }

  // Create default user
  const userEmail = 'Klemen.witwicky@gmail.com';
  const userPassword = 'Icky44ewa';
  const passwordHash = hashPassword(userPassword);

  const userStmt = db.prepare(`
    INSERT INTO users (email, password_hash)
    VALUES (?, ?)
  `);
  const userResult = userStmt.run(userEmail, passwordHash) as any;
  const userId = userResult.lastInsertRowid as number;

  // Sample accounts
  const accounts = [
    { name: 'Acme Corporation', contact: 'John Smith', phone: '+1 555-0101', email: 'john@acme.com', status: 'qualified', deal_size: 50000 },
    { name: 'TechStart Inc', contact: 'Sarah Johnson', phone: '+1 555-0102', email: 'sarah@techstart.com', status: 'prospect', deal_size: 25000 },
    { name: 'Global Solutions', contact: 'Mike Davis', phone: '+1 555-0103', email: 'mike@globalsol.com', status: 'negotiation', deal_size: 75000 },
    { name: 'Innovation Labs', contact: 'Emily Chen', phone: '+1 555-0104', email: 'emily@innovlabs.com', status: 'prospect', deal_size: 30000 },
    { name: 'Enterprise Dynamics', contact: 'Robert Wilson', phone: '+1 555-0105', email: 'robert@entdyn.com', status: 'active', deal_size: 100000 },
    { name: 'Digital Ventures', contact: 'Lisa Anderson', phone: '+1 555-0106', email: 'lisa@digvent.com', status: 'qualified', deal_size: 45000 },
    { name: 'Strategic Partners', contact: 'James Martin', phone: '+1 555-0107', email: 'james@stratpart.com', status: 'prospect', deal_size: 20000 },
    { name: 'Future Systems', contact: 'Amanda Lee', phone: '+1 555-0108', email: 'amanda@futuresys.com', status: 'negotiation', deal_size: 60000 },
    { name: 'Prime Industries', contact: 'David Brown', phone: '+1 555-0109', email: 'david@primind.com', status: 'qualified', deal_size: 55000 },
    { name: 'NextGen Technologies', contact: 'Jennifer Garcia', phone: '+1 555-0110', email: 'jen@nextgen.com', status: 'active', deal_size: 80000 },
  ];

  const accountStmt = db.prepare(`
    INSERT INTO accounts (user_id, name, contact, phone, email, status, deal_size, notes, last_activity, next_action)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const accountIds: number[] = [];
  accounts.forEach((acc) => {
    const result = accountStmt.run(
      userId,
      acc.name,
      acc.contact,
      acc.phone,
      acc.email,
      acc.status,
      acc.deal_size,
      'Initial contact made',
      new Date().toISOString(),
      'Follow up call'
    ) as any;
    accountIds.push(result.lastInsertRowid as number);
  });

  // Add sample activities
  const activityStmt = db.prepare(`
    INSERT INTO activities (user_id, account_id, date, type, contact, notes, duration, outcome, next_step, follow_up_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  accountIds.slice(0, 5).forEach((accountId, idx) => {
    activityStmt.run(
      userId,
      accountId,
      new Date(Date.now() - (5 - idx) * 86400000).toISOString(),
      ['call', 'email', 'meeting'][idx % 3],
      accounts[idx].contact,
      `Initial conversation about project requirements`,
      45,
      'interested',
      'Send proposal',
      new Date(Date.now() + 7 * 86400000).toISOString()
    );
  });

  // Add email templates
  const templateStmt = db.prepare(`
    INSERT INTO templates (user_id, name, subject, body, category)
    VALUES (?, ?, ?, ?, ?)
  `);

  const templates = [
    {
      name: 'Initial Contact',
      subject: 'Let\'s explore partnership opportunities',
      body: 'Hi {{contact_name}},\n\nI hope this message finds you well. I\'ve been following {{company_name}} and think there could be great synergy between our organizations.\n\nWould you be open to a brief call this week to explore how we can work together?\n\nBest regards,\nKlemen'
    },
    {
      name: 'Follow-up',
      subject: 'Quick follow-up on our conversation',
      body: 'Hi {{contact_name}},\n\nThank you for taking the time to chat last week. I really appreciated your insights.\n\nAs discussed, I\'ve attached some information that might be relevant to {{company_name}}.\n\nLooking forward to continuing our conversation.\n\nBest regards,\nKlemen'
    },
    {
      name: 'Proposal',
      subject: 'Proposal for {{company_name}}',
      body: 'Hi {{contact_name}},\n\nPlease find attached our proposal for {{company_name}}.\n\nI\'d love to discuss this at your earliest convenience. Are you available for a call next week?\n\nBest regards,\nKlemen'
    },
    {
      name: 'Closing',
      subject: 'Let\'s finalize our partnership',
      body: 'Hi {{contact_name}},\n\nI\'m excited about the progress we\'ve made. I believe we\'re ready to move forward.\n\nLet\'s schedule a time to sign off and get started.\n\nBest regards,\nKlemen'
    }
  ];

  templates.forEach((template) => {
    templateStmt.run(
      userId,
      template.name,
      template.subject,
      template.body,
      'email'
    );
  });

  console.log('Database seeded successfully!');
  db.close();
}

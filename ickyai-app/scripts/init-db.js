const Database = require('better-sqlite3');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'ickyai.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    contact TEXT,
    phone TEXT,
    email TEXT,
    status TEXT DEFAULT 'prospect',
    deal_size REAL DEFAULT 0,
    notes TEXT,
    last_activity DATETIME,
    next_action TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    account_id INTEGER NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    type TEXT,
    contact TEXT,
    notes TEXT,
    duration INTEGER,
    outcome TEXT,
    next_step TEXT,
    follow_up_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (account_id) REFERENCES accounts(id)
  );

  CREATE TABLE IF NOT EXISTS templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    subject TEXT,
    body TEXT,
    category TEXT DEFAULT 'email',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS follow_up_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    account_id INTEGER NOT NULL,
    rule_type TEXT,
    description TEXT,
    next_follow_up DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (account_id) REFERENCES accounts(id)
  );

  CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
  CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
  CREATE INDEX IF NOT EXISTS idx_activities_account_id ON activities(account_id);
  CREATE INDEX IF NOT EXISTS idx_templates_user_id ON templates(user_id);
`);

// Check if user already exists
const existingUser = db.prepare('SELECT COUNT(*) as count FROM users').get();
if (existingUser.count > 0) {
  console.log('✅ Database already initialized and seeded');
  db.close();
  process.exit(0);
}

// Create default user
const userEmail = 'Klemen.witwicky@gmail.com';
const userPassword = 'Icky44ewa';
const passwordHash = hashPassword(userPassword);

const userStmt = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)');
const userResult = userStmt.run(userEmail, passwordHash);
const userId = userResult.lastInsertRowid;

console.log(`✅ User created: ${userEmail}`);

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

const accountIds = [];
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
  );
  accountIds.push(result.lastInsertRowid);
});

console.log(`✅ Added ${accounts.length} sample accounts`);

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

console.log(`✅ Added 5 sample activities`);

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
  templateStmt.run(userId, template.name, template.subject, template.body, 'email');
});

console.log(`✅ Added 4 email templates`);

db.close();
console.log('\n✅ Database initialization complete!');
console.log(`📁 Database location: ${dbPath}`);
console.log(`👤 Login with: ${userEmail} / ${userPassword}`);

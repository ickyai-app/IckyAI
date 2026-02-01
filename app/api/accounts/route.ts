const mockAccounts = [
  { id: 1, name: 'Tech Solutions Inc', contact: 'John Smith', phone: '+1-555-0101', email: 'john@techsolutions.com', status: 'qualified', deal_size: 75000, last_activity: '2026-02-01' },
  { id: 2, name: 'Global Industries', contact: 'Jane Doe', phone: '+1-555-0102', email: 'jane@global.com', status: 'active', deal_size: 120000, last_activity: '2026-01-31' },
  { id: 3, name: 'Local Services LLC', contact: 'Bob Johnson', phone: '+1-555-0103', email: 'bob@localservices.com', status: 'prospect', deal_size: 45000, last_activity: '2026-01-28' },
];

export async function GET(request: Request) {
  return Response.json({ accounts: mockAccounts });
}

export async function POST(request: Request) {
  const body = await request.json();
  
  const newAccount = {
    id: mockAccounts.length + 1,
    ...body,
    last_activity: new Date().toISOString().split('T')[0]
  };

  mockAccounts.push(newAccount);
  
  return Response.json({ account: newAccount, accounts: mockAccounts }, { status: 201 });
}

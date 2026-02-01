const mockActivities = [
  { id: 1, account_id: 1, account_name: 'Tech Solutions Inc', type: 'call', contact: 'John Smith', notes: 'Discussed pricing and timeline. Very interested.', date: '2026-02-01T10:30:00Z', outcome: 'interested', duration: 25 },
  { id: 2, account_id: 2, account_name: 'Global Industries', type: 'meeting', contact: 'Jane Doe', notes: 'In-person demo went well. Ready to move to proposal.', date: '2026-01-31T14:00:00Z', outcome: 'interested', duration: 45 },
  { id: 3, account_id: 3, account_name: 'Local Services LLC', type: 'email', contact: 'Bob Johnson', notes: 'Follow-up email sent with proposal attached.', date: '2026-01-28T09:15:00Z', outcome: 'need_follow_up', duration: 5 },
];

export async function GET(request: Request) {
  return Response.json({ activities: mockActivities });
}

export async function POST(request: Request) {
  const body = await request.json();
  
  // Find account name from mockAccounts
  const mockAccounts = [
    { id: 1, name: 'Tech Solutions Inc' },
    { id: 2, name: 'Global Industries' },
    { id: 3, name: 'Local Services LLC' },
  ];
  
  const account = mockAccounts.find(a => a.id === body.account_id);
  const account_name = account?.name || 'Unknown Account';
  
  const newActivity = {
    id: mockActivities.length + 1,
    account_name: account_name,
    ...body,
    date: body.date || new Date().toISOString()
  };

  mockActivities.push(newActivity);
  
  return Response.json({ activity: newActivity, activities: mockActivities }, { status: 201 });
}

const mockAccounts = [
  { id: 1, name: 'Tech Solutions Inc' },
  { id: 2, name: 'Global Industries' },
  { id: 3, name: 'Local Services LLC' },
];

let mockActivities = [
  { id: 1, account_id: 1, account_name: 'Tech Solutions Inc', type: 'call', contact: 'John Smith', notes: 'Discussed pricing and timeline. Very interested.', date: '2026-02-01T10:30:00Z', start_time: '10:30', end_time: '11:00', outcome: 'interested', duration: 25 },
  { id: 2, account_id: 2, account_name: 'Global Industries', type: 'meeting', contact: 'Jane Doe', notes: 'In-person demo went well. Ready to move to proposal.', date: '2026-01-31T14:00:00Z', start_time: '14:00', end_time: '14:45', outcome: 'interested', duration: 45 },
  { id: 3, account_id: 3, account_name: 'Local Services LLC', type: 'email', contact: 'Bob Johnson', notes: 'Follow-up email sent with proposal attached.', date: '2026-01-28T09:15:00Z', start_time: '09:15', end_time: '09:20', outcome: 'need_follow_up', duration: 5 },
];

export async function GET(request: Request) {
  return Response.json({ activities: mockActivities });
}

export async function POST(request: Request) {
  const body = await request.json();
  
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

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, ...updates } = body;

  const account = mockAccounts.find(a => a.id === updates.account_id);
  const account_name = account?.name || 'Unknown Account';

  const index = mockActivities.findIndex(a => a.id === id);
  if (index === -1) {
    return Response.json({ error: 'Activity not found' }, { status: 404 });
  }

  mockActivities[index] = {
    ...mockActivities[index],
    ...updates,
    account_name: account_name,
    id: id
  };

  return Response.json({ activity: mockActivities[index], activities: mockActivities });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get('id') || '0');

  const index = mockActivities.findIndex(a => a.id === id);
  if (index === -1) {
    return Response.json({ error: 'Activity not found' }, { status: 404 });
  }

  const deleted = mockActivities.splice(index, 1);
  return Response.json({ activity: deleted[0], activities: mockActivities });
}

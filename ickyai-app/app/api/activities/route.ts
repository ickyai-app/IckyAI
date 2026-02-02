import { NextRequest, NextResponse } from 'next/server';

const mockActivities = [
  { id: 1, account_id: 1, account_name: 'Acme Corporation', type: 'call', contact: 'John Smith', notes: 'Discussed floor cleaning needs', date: new Date(Date.now() - 2*86400000).toISOString(), outcome: 'interested' },
  { id: 2, account_id: 2, account_name: 'TechStart Inc', type: 'email', contact: 'Sarah Johnson', notes: 'Sent proposal', date: new Date(Date.now() - 3*86400000).toISOString(), outcome: 'sent' },
  { id: 3, account_id: 3, account_name: 'Global Solutions', type: 'meeting', contact: 'Mike Davis', notes: 'Site assessment completed', date: new Date(Date.now() - 1*86400000).toISOString(), outcome: 'positive' },
];

let activities = [...mockActivities];

export async function GET(request: NextRequest) {
  return NextResponse.json({ activities });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { account_id, type, contact, notes, duration, outcome, next_step, follow_up_date } = body;

    const newActivity = {
      id: Math.max(...activities.map(a => a.id), 0) + 1,
      account_id,
      account_name: `Account ${account_id}`,
      type,
      contact,
      notes,
      date: new Date().toISOString(),
      outcome
    };

    activities.push(newActivity);

    return NextResponse.json({
      success: true,
      activity: newActivity
    });
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

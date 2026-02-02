import { NextRequest, NextResponse } from 'next/server';

// Mock data
const mockAccounts = [
  { id: 1, name: 'Acme Corporation', contact: 'John Smith', phone: '+1 555-0101', email: 'john@acme.com', status: 'qualified', deal_size: 50000, last_activity: new Date(Date.now() - 2*86400000).toISOString(), next_action: 'Call' },
  { id: 2, name: 'TechStart Inc', contact: 'Sarah Johnson', phone: '+1 555-0102', email: 'sarah@techstart.com', status: 'prospect', deal_size: 25000, last_activity: new Date(Date.now() - 3*86400000).toISOString(), next_action: 'Email' },
  { id: 3, name: 'Global Solutions', contact: 'Mike Davis', phone: '+1 555-0103', email: 'mike@globalsol.com', status: 'negotiation', deal_size: 75000, last_activity: new Date(Date.now() - 1*86400000).toISOString(), next_action: 'Meeting' },
];

let accounts = [...mockAccounts];

export async function GET(request: NextRequest) {
  return NextResponse.json({ accounts });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, contact, phone, email, status, deal_size, notes } = body;

    const newAccount = {
      id: Math.max(...accounts.map(a => a.id), 0) + 1,
      name,
      contact,
      phone,
      email,
      status: status || 'prospect',
      deal_size: deal_size || 0,
      last_activity: new Date().toISOString(),
      next_action: 'Follow up'
    };

    accounts.push(newAccount);

    return NextResponse.json({
      success: true,
      account: newAccount
    });
  } catch (error) {
    console.error('Error creating account:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

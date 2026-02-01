const mockReminders = [
  { id: 1, account_id: 1, account_name: 'Tech Solutions Inc', reminder_text: 'Follow up on proposal', reminder_date: '2026-02-05', completed: false },
  { id: 2, account_id: 2, account_name: 'Global Industries', reminder_text: 'Schedule implementation call', reminder_date: '2026-02-08', completed: false },
];

export async function GET(request: Request) {
  return Response.json({ reminders: mockReminders });
}

export async function POST(request: Request) {
  const body = await request.json();
  
  const newReminder = {
    id: mockReminders.length + 1,
    ...body,
    completed: false
  };

  mockReminders.push(newReminder);
  
  return Response.json({ reminder: newReminder, reminders: mockReminders }, { status: 201 });
}

import { NextRequest, NextResponse } from 'next/server';

const mockTemplates = [
  {
    id: 1,
    name: 'Initial Contact',
    subject: 'Let\'s explore partnership opportunities',
    body: 'Hi {{contact_name}},\n\nI hope this message finds you well. I\'ve been following {{company_name}} and think there could be great synergy between our organizations.\n\nWould you be open to a brief call this week to explore how we can work together?\n\nBest regards,\nKlemen'
  },
  {
    id: 2,
    name: 'Follow-up',
    subject: 'Quick follow-up on our conversation',
    body: 'Hi {{contact_name}},\n\nThank you for taking the time to chat. I really appreciated your insights.\n\nAs discussed, I\'ve attached some information that might be relevant to {{company_name}}.\n\nLooking forward to continuing our conversation.\n\nBest regards,\nKlemen'
  },
  {
    id: 3,
    name: 'Quote Follow-up',
    subject: 'Quick Question on Your Quote',
    body: 'Hi {{contact_name}},\n\nHope you had a chance to review the quote I sent on {{date}}.\n\nDo you have any questions on the specs or pricing?\n\nLooking forward to hearing from you.\n\nBest regards,\nKlemen'
  }
];

export async function GET(request: NextRequest) {
  return NextResponse.json({ templates: mockTemplates });
}

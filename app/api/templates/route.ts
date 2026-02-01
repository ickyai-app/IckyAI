const mockTemplates = [
  {
    id: 1,
    name: 'Initial Outreach',
    subject: 'Introduction - {{company_name}}',
    body: `Hi {{contact_name}},

I hope this email finds you well. I'm reaching out because I believe {{company_name}} could benefit from our solutions.

Would you be open to a brief 15-minute call this week to discuss how we can help?

Best regards,
Icky`
  },
  {
    id: 2,
    name: 'Follow-up After Meeting',
    subject: 'Follow-up from our meeting - {{date}}',
    body: `Hi {{contact_name}},

Thank you for taking the time to meet with me yesterday. I enjoyed our conversation and learning more about {{company_name}}.

As discussed, I have attached a proposal tailored to your needs. Please review it at your convenience.

I will follow up next week to answer any questions.

Best regards,
Icky`
  },
  {
    id: 3,
    name: 'Demo Request',
    subject: 'Schedule Your Demo - {{company_name}}',
    body: `Hi {{contact_name}},

I would like to show you how our solution can streamline your operations at {{company_name}}.

Would you prefer a demo this Thursday or Friday? I am flexible on timing.

Let me know!

Best regards,
Icky`
  },
  {
    id: 4,
    name: 'Proposal Follow-up',
    subject: 'Quick Check-in on Our Proposal',
    body: `Hi {{contact_name}},

I wanted to check in on the proposal I sent last week. Do you have any questions or concerns I can address?

I am confident this solution is the right fit for {{company_name}}.

Looking forward to working with you.

Best regards,
Icky`
  },
  {
    id: 5,
    name: 'Closing Email',
    subject: 'Ready to Move Forward - {{company_name}}',
    body: `Hi {{contact_name}},

Based on our conversations, I am confident we can deliver significant value to {{company_name}}.

I have included a final summary and next steps below:

1. Sign the agreement
2. Onboarding scheduled for next month
3. Dedicated support from our team

Let us get started!

Best regards,
Icky`
  },
  {
    id: 6,
    name: 'Lost Deal Follow-up',
    subject: 'We would love to work with {{company_name}} in the future',
    body: `Hi {{contact_name}},

I understand you have chosen another solution. That is totally okay!

I would like to stay connected. If circumstances change or you would like to revisit, I am just an email away.

All the best with your project.

Best regards,
Icky`
  },
];

export async function GET(request: Request) {
  return Response.json({ templates: mockTemplates });
}

'use client';

import { useState } from 'react';

const TEMPLATES = [
  {
    id: 1,
    name: 'Post-Site Visit Follow-up',
    trigger: 'Send within 24 hours',
    subject: '[FACILITY NAME] - Proposal & Next Steps ✨',
    body: `Hi [CONTACT NAME],

Thanks for taking the time today to show me around [FACILITY]. I really appreciated seeing your [AREA] and understanding your challenges with [SPECIFIC PROBLEM].

Based on what I saw, here's what I recommend:
✓ [KEY RECOMMENDATION 1] - will improve [BENEFIT]
✓ [KEY RECOMMENDATION 2] - especially given your [REQUIREMENT]
✓ [KEY RECOMMENDATION 3] - perfect fit for [NEED]

I'm putting together a detailed proposal with specifications and pricing. I'll have that to you by [DATE - typically next business day].

Looking forward to helping [FACILITY] succeed with Kärcher!

Best regards,
Icky`,
  },
  {
    id: 2,
    name: 'Quote Follow-up',
    trigger: 'Send 3 days after quote',
    subject: 'Quick Question on Your Quote - [FACILITY NAME]',
    body: `Hi [CONTACT NAME],

Hope you had a chance to review the quote I sent on [DATE].

A few quick questions to help move things forward:
1️⃣ Does the proposal cover everything we discussed?
2️⃣ Is there anything on pricing you'd like to revisit?
3️⃣ What's your timeline for making a decision?

Available for a quick call if that's easier than email.

Best regards,
Icky`,
  },
  {
    id: 3,
    name: 'Gentle Reminder',
    trigger: 'After 1 week of no response',
    subject: 'Checking In - [FACILITY NAME]',
    body: `Hi [CONTACT NAME],

Just wanted to circle back on our conversation from [DATE] about [SOLUTION/EQUIPMENT].

Still exploring options for [YOUR FACILITY/NEED]?

I know things get busy, but I wanted to make sure you have everything you need. Happy to:
- Answer any technical questions
- Adjust pricing if needed
- Schedule a call at your convenience

Let me know where you're at, and I'll help move things forward.

Cheers,
Icky`,
  },
  {
    id: 4,
    name: 'Are You Still Interested?',
    trigger: 'After 2 weeks of no response',
    subject: 'Are You Still Interested? [FACILITY NAME]',
    body: `Hi [CONTACT NAME],

It's been a couple weeks since I sent over the proposal. Just want to check: Is this still something you're considering?

If we should move forward, I'm ready. If not now, that's fine too - but I'd love to stay in touch.

Either way, drop me a line so I know where we stand.

Thanks,
Icky`,
  },
  {
    id: 5,
    name: 'Let\'s Reconnect',
    trigger: 'After 1 month of silence',
    subject: 'Let\'s Reconnect - [FACILITY NAME]',
    body: `Hi [CONTACT NAME],

It's been [TIME PERIOD] since we last talked about [SOLUTION].

Quick question: Is this project still on your radar?

If yes → Let's schedule a call.
If no → That's totally fine! Can I stay in touch?
If unsure → Let's do a quick 15-min call.

What works best for you?

Best,
Icky`,
  },
  {
    id: 6,
    name: 'Cold Outreach',
    trigger: 'To new prospects',
    subject: 'Quick Question About [FACILITY]',
    body: `Hi [CONTACT NAME],

I'm Icky, a Key Account Manager with Kärcher. I work with [INDUSTRY] facilities in the [REGION] area.

I noticed [FACILITY] does [THEIR ACTIVITY], and I thought you might be interested in learning how we help similar companies with [SPECIFIC BENEFIT].

Quick question: Who handles [EQUIPMENT/SERVICES] at your facility?

No pressure - just thought I'd reach out.

Thanks!
Icky`,
  },
];

export default function EmailTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2">📧 Email Templates Library</h2>
        <p className="text-cyan-300">Ready-to-use email templates for every stage of the sales cycle</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Templates List */}
        <div className="lg:col-span-1">
          <div className="neon-card">
            <h3 className="text-xl font-bold mb-4">Available Templates</h3>
            <div className="space-y-2">
              {TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedTemplate?.id === template.id
                      ? 'bg-red-500 text-cyan-100'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <div className="font-semibold">{template.name}</div>
                  <div className="text-xs mt-1 opacity-75">{template.trigger}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Template Preview */}
        <div className="lg:col-span-2">
          {selectedTemplate ? (
            <div className="neon-card">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-cyan-100">{selectedTemplate.name}</h3>
                <p className="text-sm text-cyan-300 mt-1">🎯 {selectedTemplate.trigger}</p>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg mb-4">
                <div className="text-xs text-cyan-300 mb-1">Subject Line:</div>
                <div className="font-semibold text-cyan-100">{selectedTemplate.subject}</div>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg mb-6 min-h-64">
                <div className="text-xs text-cyan-300 mb-2">Email Body:</div>
                <div className="text-cyan-100 whitespace-pre-wrap text-sm leading-relaxed">
                  {selectedTemplate.body}
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => handleCopy(selectedTemplate.subject + '\n\n' + selectedTemplate.body)}
                  className="w-full btn-primary"
                >
                  {copiedId === selectedTemplate.subject + '\n\n' + selectedTemplate.body
                    ? '✅ Copied!'
                    : '📋 Copy Template'}
                </button>
                <button className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-cyan-100 font-semibold transition-colors">
                  📧 Send Email
                </button>
              </div>

              <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-200 text-sm">
                <p className="font-semibold mb-2">💡 Pro Tips:</p>
                <ul className="space-y-1 text-xs">
                  <li>✓ Personalize all [BRACKETS] with actual details</li>
                  <li>✓ Read it aloud - does it sound like you?</li>
                  <li>✓ Keep it 2-3 short paragraphs max</li>
                  <li>✓ Always end with a clear next step</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="card text-center py-12">
              <div className="text-4xl mb-4">📧</div>
              <p className="text-cyan-300 text-lg">Select a template to preview and copy</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


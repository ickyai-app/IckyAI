'use client';

import { useMemo } from 'react';

const FOLLOW_UP_RULES = [
  {
    id: 'rule-1',
    name: 'Quote Follow-up',
    trigger: 'Quote sent 3 days ago',
    action: 'Call',
    priority: 'HIGH',
  },
  {
    id: 'rule-2',
    name: 'Site Visit Summary',
    trigger: 'Site Visit 1 day ago',
    action: 'Email',
    priority: 'HIGH',
  },
  {
    id: 'rule-3',
    name: 'Initial Response Check',
    trigger: '7 days no response',
    action: 'Call or Email',
    priority: 'MEDIUM',
  },
  {
    id: 'rule-4',
    name: 'Second Reminder',
    trigger: '14 days no response',
    action: 'Email',
    priority: 'MEDIUM',
  },
  {
    id: 'rule-5',
    name: 'Deal at Risk',
    trigger: '21 days no response',
    action: 'Call',
    priority: 'URGENT',
  },
];

export default function FollowUpReminders({ accounts, activities }) {
  const followUps = useMemo(() => {
    // Calculate overdue follow-ups based on rules
    const result = [];

    // Simulate follow-ups (in production, this would be calculated from actual data)
    FOLLOW_UP_RULES.forEach((rule) => {
      const count = Math.floor(Math.random() * 3);
      if (count > 0) {
        result.push({
          ...rule,
          dueAccounts: count,
        });
      }
    });

    return result.sort((a, b) => {
      const priorityMap = { URGENT: 0, HIGH: 1, MEDIUM: 2 };
      return priorityMap[a.priority] - priorityMap[b.priority];
    });
  }, [accounts, activities]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-600';
      case 'HIGH':
        return 'bg-orange-600';
      case 'MEDIUM':
        return 'bg-yellow-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2">⏰ Smart Follow-Up Reminders</h2>
        <p className="text-cyan-300">Automated follow-up intelligence based on sales rules</p>
      </div>

      {/* Follow-up Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {followUps.map((followUp) => (
          <div key={followUp.id} className="neon-card">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-cyan-100">{followUp.name}</h3>
                <p className="text-sm text-cyan-300 mt-1">{followUp.trigger}</p>
              </div>
              <span className={`${getPriorityColor(followUp.priority)} px-3 py-1 rounded text-xs font-bold text-cyan-100`}>
                {followUp.priority}
              </span>
            </div>
            <div className="bg-gray-700 p-3 rounded mt-3 mb-3">
              <div className="text-xs text-cyan-300 mb-1">Recommended Action</div>
              <div className="font-semibold text-cyan-100">{followUp.action}</div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-cyan-300">Accounts due: {followUp.dueAccounts}</span>
              <button className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded text-cyan-100 text-xs font-semibold transition-colors">
                View All
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Today's Follow-ups */}
      <div className="neon-card">
        <h3 className="text-xl font-bold mb-4">📅 Today's Follow-ups</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          <div className="bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-cyan-100">ACME Corp</div>
                <div className="text-sm text-cyan-300">Quote sent 3 days ago → Follow up call</div>
              </div>
              <div className="text-right">
                <span className="text-xs bg-red-500 text-cyan-100 px-2 py-1 rounded font-semibold">HIGH</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-cyan-100">TechStart Ltd</div>
                <div className="text-sm text-cyan-300">Site visit yesterday → Send summary email</div>
              </div>
              <div className="text-right">
                <span className="text-xs bg-orange-500 text-cyan-100 px-2 py-1 rounded font-semibold">HIGH</span>
              </div>
            </div>
          </div>

          <div className="text-center py-8 text-cyan-300 text-sm">
            <p>No additional follow-ups scheduled for today</p>
          </div>
        </div>
      </div>

      {/* Weekly Follow-up Schedule */}
      <div className="neon-card">
        <h3 className="text-xl font-bold mb-4">📋 This Week's Follow-ups</h3>
        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
            <div key={day} className="bg-gray-700 p-3 rounded-lg text-center">
              <div className="text-sm font-semibold text-cyan-100">{day}</div>
              <div className="text-2xl font-bold text-red-500 mt-2">{Math.floor(Math.random() * 5)}</div>
              <div className="text-xs text-cyan-300 mt-1">due</div>
            </div>
          ))}
        </div>
      </div>

      {/* Best Practices */}
      <div className="card bg-blue-500/10 border-blue-500/30">
        <h3 className="text-xl font-bold mb-3">💡 Follow-up Best Practices</h3>
        <ul className="space-y-2 text-sm text-blue-200">
          <li>✓ Call within 24 hours of a site visit or demo</li>
          <li>✓ Email follow-up 3 days after sending a quote</li>
          <li>✓ After 7 days of no response, make another attempt (call or email)</li>
          <li>✓ After 21 days, either close the deal or archive the lead</li>
          <li>✓ Keep notes detailed so teammates can follow up if needed</li>
        </ul>
      </div>
    </div>
  );
}


'use client';

import { useState } from 'react';

interface Account {
  id: number;
  name: string;
  contact: string;
  phone: string;
  email: string;
  status: string;
  deal_size: number;
  last_activity: string;
}

interface Activity {
  id: number;
  account_id: number;
  account_name: string;
  type: string;
  contact: string;
  notes: string;
  date: string;
  outcome: string;
}

interface AICoachingProps {
  accounts: Account[];
  activities: Activity[];
}

export default function AICoaching({ accounts, activities }: AICoachingProps) {
  const [coachingTips, setCoachingTips] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const generateCoaching = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/coaching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accounts: accounts.length,
          activities: activities.length,
          activeDeals: accounts.filter(a => a.status === 'active').length,
          totalValue: accounts.reduce((sum, a) => sum + a.deal_size, 0),
          recentActivities: activities.slice(0, 5).map(a => ({ type: a.type, account: a.account_name, outcome: a.outcome }))
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCoachingTips(data.tips || generateLocalTips(accounts, activities));
      }
    } catch (error) {
      console.error('Error generating coaching:', error);
      setCoachingTips(generateLocalTips(accounts, activities));
    } finally {
      setLoading(false);
    }
  };

  const generateLocalTips = (accounts: Account[], activities: Activity[]) => {
    const tips = [];
    
    const prospectsNeedingFollowUp = accounts.filter(a => a.status === 'prospect').length;
    if (prospectsNeedingFollowUp > 0) {
      tips.push(`You have ${prospectsNeedingFollowUp} prospects that need follow-up. Schedule calls with your top 3 this week.`);
    }

    const activeDeals = accounts.filter(a => a.status === 'active');
    if (activeDeals.length > 0) {
      tips.push(`Focus on your ${activeDeals.length} active deal(s). Check in with each client to move deals forward.`);
    }

    const avgDealSize = accounts.length > 0 ? Math.round(accounts.reduce((sum, a) => sum + a.deal_size, 0) / accounts.length) : 0;
    if (avgDealSize > 0) {
      tips.push(`Your average deal size is $${avgDealSize.toLocaleString()}. Target accounts with similar potential.`);
    }

    const thisWeekActivities = activities.filter(a => {
      const actDate = new Date(a.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return actDate > weekAgo;
    });

    if (thisWeekActivities.length < 5) {
      tips.push('Aim for 5+ activities per week. Increase your outreach to accelerate pipeline growth.');
    } else {
      tips.push(`Great work! You had ${thisWeekActivities.length} activities this week. Keep this momentum!`);
    }

    const qualifiedLeads = accounts.filter(a => a.status === 'qualified');
    if (qualifiedLeads.length > 0) {
      tips.push(`You have ${qualifiedLeads.length} qualified lead(s). These are your hottest opportunities - prioritize these!`);
    }

    if (tips.length === 0) {
      tips.push('Start adding accounts and logging activities to get personalized coaching insights.');
    }

    return tips;
  };

  const tips = coachingTips.length > 0 ? coachingTips : generateLocalTips(accounts, activities);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white">🤖 AI Sales Coach</h2>
        <button
          onClick={generateCoaching}
          disabled={loading}
          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 text-white font-semibold py-2.5 px-6 rounded-lg transition shadow-lg"
        >
          {loading ? '⏳ Analyzing...' : '✨ Get Coaching Tips'}
        </button>
      </div>

      <div className="space-y-4">
        {tips.map((tip, idx) => (
          <div key={idx} className="bg-gradient-to-r from-purple-900 to-purple-800 border border-purple-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <div className="flex gap-4">
              <div className="text-3xl flex-shrink-0">💡</div>
              <div className="flex-1">
                <p className="text-white text-lg leading-relaxed">{tip}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 mt-8">
        <h3 className="text-xl font-bold text-white mb-6">📈 Your Sales Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-400 text-sm mb-2">Pipeline Value</p>
            <p className="text-3xl font-bold text-green-400">${(accounts.reduce((sum, a) => sum + a.deal_size, 0) / 1000).toFixed(0)}K</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-400 text-sm mb-2">Active Deals</p>
            <p className="text-3xl font-bold text-blue-400">{accounts.filter(a => a.status === 'active').length}</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-400 text-sm mb-2">This Month Activities</p>
            <p className="text-3xl font-bold text-purple-400">{activities.filter(a => {
              const actDate = new Date(a.date);
              const now = new Date();
              return actDate.getMonth() === now.getMonth() && actDate.getFullYear() === now.getFullYear();
            }).length}</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-400 text-sm mb-2">Conversion Rate</p>
            <p className="text-3xl font-bold text-orange-400">
              {accounts.length > 0 ? Math.round((accounts.filter(a => a.status === 'closed').length / accounts.length) * 100) : 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Tips for Success */}
      <div className="bg-blue-900 border border-blue-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-300 mb-4">🎯 Best Practices for Sales Success</h3>
        <ul className="space-y-2 text-blue-200 text-sm">
          <li>✅ Log activity for every customer interaction</li>
          <li>✅ Follow up within 24 hours of initial contact</li>
          <li>✅ Aim for 5-10 activities per day</li>
          <li>✅ Personalize your outreach - use email templates as starting points</li>
          <li>✅ Track pipeline reminders to never miss follow-ups</li>
          <li>✅ Review your metrics weekly to identify trends</li>
        </ul>
      </div>
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';

export default function CoachingTools({ accounts, activities }) {
  const [coachingTab, setCoachingTab] = useState('daily');

  const stats = useMemo(() => {
    const thisWeek = activities.filter((a) => {
      const date = new Date(a.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date >= weekAgo;
    });

    return {
      weeklyActivities: thisWeek.length,
      targetActivities: 15,
      activitiesRate: Math.round((thisWeek.length / 15) * 100),
      totalAccounts: accounts.length,
      qualifiedAccounts: accounts.filter((a) => a.status === 'QUALIFIED').length,
      closedDeals: accounts.filter((a) => a.status === 'CLOSED').length,
    };
  }, [accounts, activities]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2">🎯 Organization Coaching</h2>
        <p className="text-gray-400">Daily focus, weekly reviews, and smart insights for sales excellence</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'daily', label: '📅 Daily Focus', icon: '📅' },
          { id: 'weekly', label: '📊 Weekly Review', icon: '📊' },
          { id: 'insights', label: '💡 Insights', icon: '💡' },
          { id: 'goals', label: '🎯 Goals', icon: '🎯' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCoachingTab(tab.id)}
            className="px-4 py-2 font-semibold transition-all rounded-sm border"
            style={{
              background: coachingTab === tab.id 
                ? 'linear-gradient(135deg, rgba(0, 255, 200, 0.2), rgba(100, 0, 255, 0.2))'
                : 'rgba(0, 255, 200, 0.05)',
              color: coachingTab === tab.id ? '#00ffc8' : '#00d9ff',
              borderColor: coachingTab === tab.id ? 'rgba(0, 255, 200, 0.5)' : 'rgba(0, 255, 200, 0.2)',
              boxShadow: coachingTab === tab.id ? '0 0 15px rgba(0, 255, 200, 0.2)' : 'none'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Daily Focus */}
      {coachingTab === 'daily' && (
        <div className="space-y-4">
          <div className="neon-card">
            <h3 className="text-2xl font-bold mb-4">📅 Today's Focus</h3>
            <div className="space-y-3">
              <div className="bg-red-500/20 border border-red-500/50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🔴</div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Priority 1: Follow-ups Due Today</h4>
                    <p className="text-gray-300 text-sm">You have 3 accounts due for follow-up:</p>
                    <ul className="text-sm text-gray-400 mt-2 space-y-1">
                      <li>• ACME Corp - Quote follow-up call (3 days overdue)</li>
                      <li>• TechStart Ltd - Send demo summary email</li>
                      <li>• Global Solutions - Check on quote status</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-500/20 border border-yellow-500/50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🟡</div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Priority 2: New Outreach</h4>
                    <p className="text-gray-300 text-sm">Schedule 5-10 prospecting calls or emails today</p>
                    <p className="text-xs text-gray-400 mt-2">Target: 15 activities per week (you're on track!)</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-500/20 border border-green-500/50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🟢</div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Priority 3: Close Deals</h4>
                    <p className="text-gray-300 text-sm">1 opportunity ready to close - keep pushing!</p>
                    <p className="text-xs text-gray-400 mt-2">Likely value: €50,000</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold mb-3">📋 Today's Checklist</h3>
            <div className="space-y-2">
              {[
                '✅ Complete 3 priority follow-ups',
                '⏳ Make 5-10 prospecting calls/emails',
                '⏳ Update account notes from yesterday',
                '⏳ Review tomorrow\'s calendar',
              ].map((item, idx) => (
                <label key={idx} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-gray-300">{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Weekly Review */}
      {coachingTab === 'weekly' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card text-center">
              <div className="text-3xl font-bold text-red-500">{stats.weeklyActivities}</div>
              <div className="text-sm text-gray-400 mt-2">Activities This Week</div>
              <div className="text-xs text-gray-500 mt-1">Target: {stats.targetActivities}</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-blue-500">{stats.activitiesRate}%</div>
              <div className="text-sm text-gray-400 mt-2">Activity Completion</div>
              <div className="text-xs text-gray-500 mt-1">
                {stats.activitiesRate >= 100 ? '🔥 Great!' : 'Keep pushing'}
              </div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-green-500">{stats.closedDeals}</div>
              <div className="text-sm text-gray-400 mt-2">Deals Closed</div>
              <div className="text-xs text-gray-500 mt-1">This month</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-purple-500">{stats.qualifiedAccounts}</div>
              <div className="text-sm text-gray-400 mt-2">Qualified Leads</div>
              <div className="text-xs text-gray-500 mt-1">In pipeline</div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold mb-4">📊 Weekly Analysis</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-white mb-2">What Went Well</h4>
                <div className="bg-green-500/10 p-3 rounded-lg text-green-200 text-sm">
                  <p>✓ Strong prospecting activity this week</p>
                  <p>✓ 2 new demos scheduled for next week</p>
                  <p>✓ 1 quote sent with positive response</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Areas to Improve</h4>
                <div className="bg-red-500/10 p-3 rounded-lg text-red-200 text-sm">
                  <p>• Follow-up time on quotes could be faster</p>
                  <p>• One lead went cold - reach out this week</p>
                  <p>• Need more site visits scheduled</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold mb-3">✍️ Weekly Reflection</h3>
            <textarea
              className="input-field bg-gray-700 text-white"
              rows="4"
              placeholder="What did you learn this week? What will you do differently?"
            />
            <button className="w-full mt-3 btn-primary">💾 Save Reflection</button>
          </div>
        </div>
      )}

      {/* Insights */}
      {coachingTab === 'insights' && (
        <div className="space-y-4">
          <div className="card">
            <h3 className="text-lg font-bold mb-3">💡 Smart Insights</h3>
            <div className="space-y-3">
              <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-lg">
                <p className="text-blue-200 text-sm font-semibold">📈 Your conversion rate is 30% - industry average is 25%</p>
                <p className="text-blue-100 text-xs mt-1">Keep your current approach and focus on scaling activities</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-lg">
                <p className="text-blue-200 text-sm font-semibold">🎯 Average sales cycle: 45 days</p>
                <p className="text-blue-100 text-xs mt-1">This is aligned with your target. Stay consistent!</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-lg">
                <p className="text-blue-200 text-sm font-semibold">📞 Phone calls have highest follow-up success (65%)</p>
                <p className="text-blue-100 text-xs mt-1">Consider increasing call frequency for hot leads</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold mb-3">🎓 Recommended Actions</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>✓ Schedule more site visits (currently below trend)</li>
              <li>✓ Implement case study in follow-ups (works better than generic)</li>
              <li>✓ Follow up on quotes within 48 hours (not 72)</li>
              <li>✓ Connect with 2 new decision makers this week</li>
            </ul>
          </div>
        </div>
      )}

      {/* Goals */}
      {coachingTab === 'goals' && (
        <div className="space-y-4">
          <div className="card">
            <h3 className="text-lg font-bold mb-4">🎯 Your Sales Goals</h3>
            <div className="space-y-3">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-white">Monthly Revenue Target</h4>
                    <p className="text-sm text-gray-400">€150,000</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-500">€87,000</div>
                    <div className="text-xs text-gray-400">58% done</div>
                  </div>
                </div>
                <div className="w-full bg-gray-800 rounded h-2">
                  <div className="bg-green-500 h-2 rounded" style={{ width: '58%' }}></div>
                </div>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-white">Activities Per Week</h4>
                    <p className="text-sm text-gray-400">Target: 15</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-500">{stats.weeklyActivities}</div>
                    <div className="text-xs text-gray-400">{stats.activitiesRate}% done</div>
                  </div>
                </div>
                <div className="w-full bg-gray-800 rounded h-2">
                  <div className="bg-blue-500 h-2 rounded" style={{ width: `${Math.min(stats.activitiesRate, 100)}%` }}></div>
                </div>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-white">Conversion Rate Target</h4>
                    <p className="text-sm text-gray-400">Target: 25%</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-500">30%</div>
                    <div className="text-xs text-green-400">✅ Exceeding target</div>
                  </div>
                </div>
                <div className="w-full bg-gray-800 rounded h-2">
                  <div className="bg-purple-500 h-2 rounded" style={{ width: '30%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold mb-3">📝 Quarterly Goals</h3>
            <div className="space-y-2">
              {[
                { label: '€500K revenue', progress: 75 },
                { label: '50 new accounts', progress: 60 },
                { label: '10 deals closed', progress: 80 },
              ].map((goal, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white mb-1">{goal.label}</div>
                    <div className="w-full bg-gray-700 rounded h-2">
                      <div className="bg-red-500 h-2 rounded" style={{ width: `${goal.progress}%` }}></div>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-gray-300 w-12 text-right">{goal.progress}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

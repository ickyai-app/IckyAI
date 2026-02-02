'use client';

import { useState, useMemo } from 'react';

export default function FollowUpReminders({ accounts, activities }) {
  const [followUps, setFollowUps] = useState([
    { id: '1', accountName: 'Kranjska Gora Facility', type: 'CALL', dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), notes: 'Follow up on demo', completed: false },
    { id: '2', accountName: 'Ljubljana Business Center', type: 'EMAIL', dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), notes: 'Send proposal', completed: false },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    accountName: '',
    type: 'CALL',
    notes: '',
    dateOption: 'tomorrow',
  });

  const getDateFromOption = (option, customDate = null) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (option) {
      case 'tomorrow':
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
      case 'nextweek':
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        return nextWeek;
      case 'nextmonth':
        const nextMonth = new Date(today);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        return nextMonth;
      case 'custom':
        return customDate ? new Date(customDate) : today;
      default:
        return today;
    }
  };

  const handleAddFollowUp = (e) => {
    e.preventDefault();
    if (!formData.accountName.trim()) return;

    const newFollowUp = {
      id: Date.now().toString(),
      accountName: formData.accountName,
      type: formData.type,
      notes: formData.notes,
      dueDate: getDateFromOption(formData.dateOption),
      completed: false,
    };

    setFollowUps([...followUps, newFollowUp]);
    setFormData({ accountName: '', type: 'CALL', notes: '', dateOption: 'tomorrow' });
    setShowForm(false);
  };

  const toggleComplete = (id) => {
    setFollowUps(followUps.map(fu => fu.id === id ? { ...fu, completed: !fu.completed } : fu));
  };

  const deleteFollowUp = (id) => {
    setFollowUps(followUps.filter(fu => fu.id !== id));
  };

  const sortedFollowUps = useMemo(() => {
    return [...followUps].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [followUps]);

  const overdue = sortedFollowUps.filter(fu => !fu.completed && new Date(fu.dueDate) < new Date());
  const today = sortedFollowUps.filter(fu => !fu.completed && new Date(fu.dueDate).toDateString() === new Date().toDateString());
  const upcoming = sortedFollowUps.filter(fu => !fu.completed && new Date(fu.dueDate) > new Date());
  const completed = sortedFollowUps.filter(fu => fu.completed);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">⏰ Follow-Up Reminders</h2>
          <p className="text-cyan-300">Manage and schedule your follow-ups</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-lg transition-all"
        >
          {showForm ? '✕ Cancel' : '+ Add Follow-Up'}
        </button>
      </div>

      {/* Add Follow-Up Form */}
      {showForm && (
        <div className="neon-card">
          <h3 className="text-xl font-bold mb-4">New Follow-Up</h3>
          <form onSubmit={handleAddFollowUp} className="space-y-4">
            <div>
              <label className="block text-cyan-300 text-sm font-semibold mb-2">Account</label>
              <select
                value={formData.accountName}
                onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-cyan-500/30 rounded-lg text-cyan-100 focus:outline-none focus:border-cyan-400"
              >
                <option value="">Select an account...</option>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.account_name}>{acc.account_name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-cyan-300 text-sm font-semibold mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-cyan-500/30 rounded-lg text-cyan-100 focus:outline-none focus:border-cyan-400"
                >
                  <option value="CALL">📞 Call</option>
                  <option value="EMAIL">📧 Email</option>
                  <option value="VISIT">🏢 Visit</option>
                  <option value="DEMO">🎥 Demo</option>
                </select>
              </div>

              <div>
                <label className="block text-cyan-300 text-sm font-semibold mb-2">When?</label>
                <select
                  value={formData.dateOption}
                  onChange={(e) => setFormData({ ...formData, dateOption: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-cyan-500/30 rounded-lg text-cyan-100 focus:outline-none focus:border-cyan-400"
                >
                  <option value="tomorrow">Tomorrow</option>
                  <option value="nextweek">Next Week</option>
                  <option value="nextmonth">Next Month</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-cyan-300 text-sm font-semibold mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="What's this follow-up about?"
                className="w-full px-4 py-2 bg-gray-700 border border-cyan-500/30 rounded-lg text-cyan-100 focus:outline-none focus:border-cyan-400 resize-none h-24"
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors"
            >
              ✓ Add Follow-Up
            </button>
          </form>
        </div>
      )}

      {/* Overdue Follow-ups */}
      {overdue.length > 0 && (
        <div className="neon-card border-red-500/50">
          <h3 className="text-xl font-bold mb-4 text-red-400">🔴 Overdue ({overdue.length})</h3>
          <div className="space-y-3">
            {overdue.map(fu => (
              <div key={fu.id} className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={fu.completed}
                        onChange={() => toggleComplete(fu.id)}
                        className="w-5 h-5 cursor-pointer"
                      />
                      <div>
                        <div className="font-semibold text-cyan-100">{fu.accountName}</div>
                        <div className="text-sm text-cyan-300">{fu.type === 'CALL' ? '📞' : fu.type === 'EMAIL' ? '📧' : fu.type === 'VISIT' ? '🏢' : '🎥'} {fu.type} • Due: {formatDate(fu.dueDate)}</div>
                        {fu.notes && <div className="text-xs text-gray-300 mt-1">{fu.notes}</div>}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteFollowUp(fu.id)}
                    className="text-red-400 hover:text-red-300 text-sm font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's Follow-ups */}
      {today.length > 0 && (
        <div className="neon-card border-orange-500/50">
          <h3 className="text-xl font-bold mb-4 text-orange-400">📅 Today ({today.length})</h3>
          <div className="space-y-3">
            {today.map(fu => (
              <div key={fu.id} className="bg-orange-900/20 border border-orange-500/30 p-4 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={fu.completed}
                        onChange={() => toggleComplete(fu.id)}
                        className="w-5 h-5 cursor-pointer"
                      />
                      <div>
                        <div className="font-semibold text-cyan-100">{fu.accountName}</div>
                        <div className="text-sm text-cyan-300">{fu.type === 'CALL' ? '📞' : fu.type === 'EMAIL' ? '📧' : fu.type === 'VISIT' ? '🏢' : '🎥'} {fu.type}</div>
                        {fu.notes && <div className="text-xs text-gray-300 mt-1">{fu.notes}</div>}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteFollowUp(fu.id)}
                    className="text-red-400 hover:text-red-300 text-sm font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Follow-ups */}
      {upcoming.length > 0 && (
        <div className="neon-card">
          <h3 className="text-xl font-bold mb-4">📋 Upcoming ({upcoming.length})</h3>
          <div className="space-y-3">
            {upcoming.map(fu => (
              <div key={fu.id} className="bg-gray-700/50 border border-cyan-500/30 p-4 rounded-lg hover:border-cyan-400/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={fu.completed}
                        onChange={() => toggleComplete(fu.id)}
                        className="w-5 h-5 cursor-pointer"
                      />
                      <div>
                        <div className="font-semibold text-cyan-100">{fu.accountName}</div>
                        <div className="text-sm text-cyan-300">{fu.type === 'CALL' ? '📞' : fu.type === 'EMAIL' ? '📧' : fu.type === 'VISIT' ? '🏢' : '🎥'} {fu.type} • Due: {formatDate(fu.dueDate)}</div>
                        {fu.notes && <div className="text-xs text-gray-300 mt-1">{fu.notes}</div>}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteFollowUp(fu.id)}
                    className="text-red-400 hover:text-red-300 text-sm font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Follow-ups */}
      {completed.length > 0 && (
        <div className="neon-card border-green-500/30">
          <h3 className="text-xl font-bold mb-4 text-green-400">✓ Completed ({completed.length})</h3>
          <div className="space-y-2">
            {completed.map(fu => (
              <div key={fu.id} className="bg-green-900/10 border border-green-500/20 p-3 rounded-lg line-through text-gray-400 text-sm">
                <div className="flex items-center justify-between">
                  <span>{fu.accountName} • {fu.type}</span>
                  <button
                    onClick={() => deleteFollowUp(fu.id)}
                    className="text-gray-400 hover:text-red-300 text-xs"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {followUps.length === 0 && (
        <div className="neon-card text-center py-12">
          <div className="text-4xl mb-3">✨</div>
          <h3 className="text-xl font-bold text-cyan-100 mb-2">No Follow-ups Yet</h3>
          <p className="text-cyan-300 mb-4">Create your first follow-up to get started</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors"
          >
            + Add Follow-Up
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="neon-card text-center">
          <div className="text-3xl font-bold text-red-500">{overdue.length}</div>
          <div className="text-sm text-cyan-300 mt-2">Overdue</div>
        </div>
        <div className="neon-card text-center">
          <div className="text-3xl font-bold text-orange-500">{today.length}</div>
          <div className="text-sm text-cyan-300 mt-2">Today</div>
        </div>
        <div className="neon-card text-center">
          <div className="text-3xl font-bold text-cyan-400">{upcoming.length}</div>
          <div className="text-sm text-cyan-300 mt-2">Upcoming</div>
        </div>
        <div className="neon-card text-center">
          <div className="text-3xl font-bold text-green-500">{completed.length}</div>
          <div className="text-sm text-cyan-300 mt-2">Completed</div>
        </div>
      </div>
    </div>
  );
}

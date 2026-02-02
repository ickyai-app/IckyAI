'use client';

import { useState } from 'react';
import { getSupabaseClient } from '@/lib/supabaseClient';
import { format } from 'date-fns';

const ACTIVITY_TYPES = ['Call', 'Email', 'Site Visit', 'Quote sent', 'Demo', 'Meeting', 'Initial contact'];

export default function ActivitiesForm({ accounts, onActivityAdded }) {
  const [formData, setFormData] = useState({
    account_id: '',
    activity_type: 'Call',
    notes: '',
    duration_minutes: '',
    outcome: '',
    next_step: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [recentActivities, setRecentActivities] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setMessage('Supabase not configured');
        return;
      }

      const selectedAccount = accounts.find((a) => a.id === formData.account_id);

      const { error } = await supabase.from('activities').insert([
        {
          account_id: formData.account_id,
          account_name: selectedAccount?.account_name,
          activity_type: formData.activity_type,
          notes: formData.notes,
          duration_minutes: parseInt(formData.duration_minutes) || 0,
          outcome: formData.outcome,
          next_step: formData.next_step,
        },
      ]);

      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage('✅ Activity logged successfully!');
        setFormData({
          account_id: '',
          activity_type: 'Call',
          notes: '',
          duration_minutes: '',
          outcome: '',
          next_step: '',
        });
        onActivityAdded();
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2">📝 Activity Logging</h2>
        <p className="text-cyan-300">Log calls, emails, visits, and other activities</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="neon-card">
            <h3 className="text-xl font-bold mb-4">Log Activity</h3>
            {message && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${message.includes('✅') ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Account *</label>
                <select
                  name="account_id"
                  value={formData.account_id}
                  onChange={handleChange}
                  className="input-field bg-gray-700 text-cyan-100"
                  required
                >
                  <option value="">Select account...</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.account_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Activity Type *</label>
                <select
                  name="activity_type"
                  value={formData.activity_type}
                  onChange={handleChange}
                  className="input-field bg-gray-700 text-cyan-100"
                  required
                >
                  {ACTIVITY_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  name="duration_minutes"
                  value={formData.duration_minutes}
                  onChange={handleChange}
                  className="input-field bg-gray-700 text-cyan-100"
                  placeholder="15"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Outcome</label>
                <input
                  type="text"
                  name="outcome"
                  value={formData.outcome}
                  onChange={handleChange}
                  className="input-field bg-gray-700 text-cyan-100"
                  placeholder="e.g., Positive, Scheduled Demo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Next Step</label>
                <input
                  type="text"
                  name="next_step"
                  value={formData.next_step}
                  onChange={handleChange}
                  className="input-field bg-gray-700 text-cyan-100"
                  placeholder="e.g., Send quote, Schedule follow-up"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="input-field bg-gray-700 text-cyan-100 resize-none"
                  placeholder="Details about the activity..."
                  rows="3"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging...' : '✅ Log Activity'}
              </button>
            </form>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="neon-card">
            <h3 className="text-xl font-bold mb-4">📋 Activity Summary (Last 7 Days)</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-700 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-500">📞</div>
                  <div className="text-cyan-300 text-sm">Calls This Week</div>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-500">📧</div>
                  <div className="text-cyan-300 text-sm">Emails This Week</div>
                </div>
              </div>

              <div className="text-center py-8 text-cyan-300">
                <p>Activities logged today will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


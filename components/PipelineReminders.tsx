'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

interface Reminder {
  id: number;
  account_id: number;
  account_name: string;
  reminder_text: string;
  reminder_date: string;
  completed: boolean;
}

interface Account {
  id: number;
  name: string;
}

interface PipelineRemindersProps {
  reminders: Reminder[];
  accounts: Account[];
  onReminderAdded: () => void;
}

export default function PipelineReminders({ reminders, accounts, onReminderAdded }: PipelineRemindersProps) {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    account_id: '',
    reminder_text: '',
    reminder_date: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.account_id) return;

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id.toString()
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to add reminder');
      }

      setMessage('✅ Reminder added successfully!');
      setFormData({
        account_id: '',
        reminder_text: '',
        reminder_date: ''
      });
      setShowForm(false);
      onReminderAdded();
    } catch (error) {
      setMessage(`❌ Error adding reminder`);
    } finally {
      setIsLoading(false);
    }
  };

  const upcomingReminders = reminders.filter(r => !r.completed).sort((a, b) => 
    new Date(a.reminder_date).getTime() - new Date(b.reminder_date).getTime()
  );

  return (
    <div className="bg-gradient-to-r from-blue-900 to-blue-800 border border-blue-700 rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">🔔 Pipeline Reminders</h3>
          <p className="text-blue-200 text-sm">{upcomingReminders.length} upcoming reminders</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-white hover:bg-blue-100 text-blue-600 font-semibold py-2 px-4 rounded-lg transition"
        >
          + Add Reminder
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-800 p-4 rounded-lg mb-6 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Account *</label>
                <select
                  name="account_id"
                  value={formData.account_id}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select an account</option>
                  {accounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Reminder Date *</label>
                <input
                  type="date"
                  name="reminder_date"
                  value={formData.reminder_date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Reminder Text *</label>
              <textarea
                name="reminder_text"
                value={formData.reminder_text}
                onChange={handleChange}
                required
                placeholder="e.g., Follow up with contract, Schedule demo, Send proposal"
                rows={2}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {message && (
              <div className={message.startsWith('✅') ? 'p-3 rounded text-sm border bg-green-900 text-green-300 border-green-700' : 'p-3 rounded text-sm border bg-red-900 text-red-300 border-red-700'}>
                {message}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                {isLoading ? '⏳ Adding...' : '✅ Add Reminder'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-2 px-4 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {upcomingReminders.length === 0 ? (
        <p className="text-blue-200 text-sm">No upcoming reminders. Add one to stay on track!</p>
      ) : (
        <div className="space-y-3">
          {upcomingReminders.map(reminder => (
            <div key={reminder.id} className="bg-blue-800 p-4 rounded-lg border border-blue-600 hover:border-blue-500 transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold text-white">{reminder.account_name}</p>
                  <p className="text-blue-200 text-sm mt-1">{reminder.reminder_text}</p>
                  <p className="text-blue-300 text-xs mt-2">
                    📅 {new Date(reminder.reminder_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-2xl">📌</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

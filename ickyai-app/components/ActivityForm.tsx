'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';

interface ActivityFormProps {
  onActivityAdded: () => void;
}

interface Account {
  id: number;
  name: string;
}

export default function ActivityForm({ onActivityAdded }: ActivityFormProps) {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [formData, setFormData] = useState({
    account_id: '',
    type: 'call',
    contact: '',
    notes: '',
    duration: '',
    outcome: 'interested',
    next_step: '',
    follow_up_date: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchAccounts = async () => {
      try {
        const response = await fetch('/api/accounts', {
          headers: { 'x-user-id': user.id.toString() }
        });
        if (response.ok) {
          const data = await response.json();
          setAccounts(data.accounts || []);
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    fetchAccounts();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id.toString()
        },
        body: JSON.stringify({
          ...formData,
          account_id: parseInt(formData.account_id),
          duration: formData.duration ? parseInt(formData.duration) : 0
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to log activity');
      }

      setMessage('✅ Activity logged successfully!');
      setFormData({
        account_id: '',
        type: 'call',
        contact: '',
        notes: '',
        duration: '',
        outcome: 'interested',
        next_step: '',
        follow_up_date: ''
      });
      onActivityAdded();
    } catch (error) {
      setMessage(`❌ ${error instanceof Error ? error.message : 'Error logging activity'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 max-w-2xl">
      <h2 className="text-3xl font-bold text-white mb-2">📝 Log Activity</h2>
      <p className="text-gray-400 mb-6">Takes just 30 seconds to log your interaction</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Account *
          </label>
          <select
            name="account_id"
            value={formData.account_id}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          >
            <option value="">Select an account</option>
            {accounts.map(account => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Activity Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            >
              <option value="call">☎️ Call</option>
              <option value="email">📧 Email</option>
              <option value="meeting">👥 Meeting</option>
              <option value="follow_up">🔄 Follow-up</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Contact/Person
            </label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="John Smith"
              className="w-full px-4 py-2.5 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="What was discussed?"
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="15"
              className="w-full px-4 py-2.5 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Outcome
            </label>
            <select
              name="outcome"
              value={formData.outcome}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            >
              <option value="interested">Interested</option>
              <option value="not_interested">Not Interested</option>
              <option value="need_follow_up">Need Follow-up</option>
              <option value="closed_won">Closed Won</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Next Step
          </label>
          <input
            type="text"
            name="next_step"
            value={formData.next_step}
            onChange={handleChange}
            placeholder="Send proposal, schedule demo, etc."
            className="w-full px-4 py-2.5 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Follow-up Date
          </label>
          <input
            type="date"
            name="follow_up_date"
            value={formData.follow_up_date}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>

        {message && (
          <div className={message.startsWith('✅') 
            ? 'p-4 rounded-lg text-sm border bg-green-900 text-green-300 border-green-700'
            : 'p-4 rounded-lg text-sm border bg-red-900 text-red-300 border-red-700'
          }>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !formData.account_id}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          {isLoading ? '⏳ Logging...' : '✅ Log Activity'}
        </button>
      </form>
    </div>
  );
}

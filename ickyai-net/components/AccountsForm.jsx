'use client';

import { useState } from 'react';
import { getSupabaseClient } from '@/lib/supabaseClient';

const ACCOUNT_STATUSES = [
  'NEW',
  'QUALIFIED',
  'DEMO',
  'QUOTE SENT',
  'AWAITING RESPONSE',
  'NEGOTIATING',
  'READY TO CLOSE',
  'CLOSED',
  'LOST',
  'STALLED',
  'ON HOLD',
  'NO RESPONSE',
];

export default function AccountsForm({ accounts, onAccountAdded }) {
  const [formData, setFormData] = useState({
    account_name: '',
    contact_name: '',
    email: '',
    phone: '',
    status: 'NEW',
    deal_size: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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

      const { error } = await supabase.from('accounts').insert([formData]);

      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage('✅ Account added successfully!');
        setFormData({
          account_name: '',
          contact_name: '',
          email: '',
          phone: '',
          status: 'NEW',
          deal_size: '',
          notes: '',
        });
        onAccountAdded();
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="neon-card">
            <h3 className="text-xl font-bold mb-4" style={{color: '#00ffc8', fontFamily: "'Orbitron', sans-serif"}}>➕ Add New Account</h3>
            {message && (
              <div className={`mb-4 p-3 rounded-sm text-sm border ${message.includes('✅') ? 'border-green-500/40' : 'border-red-500/40'}`}
                style={{background: message.includes('✅') ? 'rgba(0, 255, 150, 0.1)' : 'rgba(255, 0, 110, 0.1)', color: message.includes('✅') ? '#00ffc8' : '#ff0066'}}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{color: '#00d9ff', fontSize: '11px', letterSpacing: '0.5px', textTransform: 'uppercase'}}>Account Name *</label>
                <input
                  type="text"
                  name="account_name"
                  value={formData.account_name}
                  onChange={handleChange}
                  className="neon-input"
                  placeholder="Company name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{color: '#00d9ff', fontSize: '11px', letterSpacing: '0.5px', textTransform: 'uppercase'}}>Contact Name</label>
                <input
                  type="text"
                  name="contact_name"
                  value={formData.contact_name}
                  onChange={handleChange}
                  className="neon-input"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{color: '#00d9ff', fontSize: '11px', letterSpacing: '0.5px', textTransform: 'uppercase'}}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="neon-input"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{color: '#00d9ff', fontSize: '11px', letterSpacing: '0.5px', textTransform: 'uppercase'}}>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="neon-input"
                  placeholder="+43 123 456 7890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{color: '#00d9ff', fontSize: '11px', letterSpacing: '0.5px', textTransform: 'uppercase'}}>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="neon-input"
                  style={{appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%2300ffc8%22 stroke-width=%222%22%3e%3cpolyline points=%226 9 12 15 18 9%22%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem'}}
                >
                  {ACCOUNT_STATUSES.map((status) => (
                    <option key={status} value={status} style={{background: '#0a0e27', color: '#00ffc8'}}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{color: '#00d9ff', fontSize: '11px', letterSpacing: '0.5px', textTransform: 'uppercase'}}>Deal Size (€)</label>
                <input
                  type="number"
                  name="deal_size"
                  value={formData.deal_size}
                  onChange={handleChange}
                  className="neon-input"
                  placeholder="10000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{color: '#00d9ff', fontSize: '11px', letterSpacing: '0.5px', textTransform: 'uppercase'}}>Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="neon-input resize-none"
                  placeholder="Add any important notes..."
                  rows="3"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full neon-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '⏳ Adding...' : '➕ Add Account'}
              </button>
            </form>
          </div>
        </div>

        {/* Accounts List */}
        <div className="lg:col-span-2">
          <div className="neon-card">
            <h3 className="text-xl font-bold mb-4" style={{color: '#00ffc8', fontFamily: "'Orbitron', sans-serif"}}>👥 All Accounts ({accounts.length})</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {accounts.length === 0 ? (
                <div className="text-center py-8" style={{color: '#00d9ff'}}>
                  <p>No accounts yet. Add your first account to get started!</p>
                </div>
              ) : (
                accounts.map((account, idx) => (
                  <div key={idx} className="p-4 rounded-sm border border-cyan-400/30 hover:border-cyan-400/60 transition-all" style={{
                    background: 'linear-gradient(135deg, rgba(0, 255, 200, 0.05), rgba(100, 0, 255, 0.05))',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold" style={{color: '#00ffc8', textShadow: '0 0 10px rgba(0, 255, 200, 0.3)'}}>{account.account_name}</h4>
                        <p className="text-sm" style={{color: '#00d9ff'}}>{account.contact_name || 'No contact'}</p>
                      </div>
                      <span className="inline-block px-2 py-1 rounded-sm text-xs font-semibold border border-purple-500/60" style={{
                        background: 'rgba(100, 0, 255, 0.15)',
                        color: '#00ffc8'
                      }}>
                        {account.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mt-3" style={{color: '#00d9ff'}}>
                      <div>📧 {account.email || '-'}</div>
                      <div>📞 {account.phone || '-'}</div>
                      <div>💰 €{parseFloat(account.deal_size || 0).toLocaleString()}</div>
                      <div>📝 {account.notes?.substring(0, 20) || 'No notes'}...</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

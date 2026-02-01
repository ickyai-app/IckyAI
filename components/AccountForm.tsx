'use client';

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'

interface AccountFormProps {
  onAccountAdded: () => void;
}

export default function AccountForm({ onAccountAdded }: AccountFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    phone: '',
    email: '',
    status: 'prospect',
    deal_size: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id.toString()
        },
        body: JSON.stringify({
          ...formData,
          deal_size: formData.deal_size ? parseFloat(formData.deal_size) : 0
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create account');
      }

      setMessage('✅ Account added successfully!');
      setFormData({
        name: '',
        contact: '',
        phone: '',
        email: '',
        status: 'prospect',
        deal_size: ''
      });
      onAccountAdded();
    } catch (error) {
      setMessage(`❌ ${error instanceof Error ? error.message : 'Error adding account'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 max-w-2xl">
      <h2 className="text-3xl font-bold mb-2 text-white">➕ Add New Account</h2>
      <p className="text-gray-400 mb-6">Add a prospect to your sales pipeline</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Company Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Acme Corporation" className="w-full px-4 py-2.5 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Contact Name</label>
            <input type="text" name="contact" value={formData.contact} onChange={handleChange} placeholder="John Smith" className="w-full px-4 py-2.5 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 555-0101" className="w-full px-4 py-2.5 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@acme.com" className="w-full px-4 py-2.5 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition">
              <option value="prospect">Prospect</option>
              <option value="qualified">Qualified</option>
              <option value="negotiation">Negotiation</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Deal Size ($)</label>
            <input type="number" name="deal_size" value={formData.deal_size} onChange={handleChange} placeholder="50000" className="w-full px-4 py-2.5 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" />
          </div>
        </div>

        {message && (
          <div className={message.startsWith('✅') ? 'p-4 rounded-lg text-sm border bg-green-900 text-green-300 border-green-700' : 'p-4 rounded-lg text-sm border bg-red-900 text-red-300 border-red-700'}>
            {message}
          </div>
        )}

        <button type="submit" disabled={isLoading || !formData.name} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition shadow-lg hover:shadow-xl">
          {isLoading ? '⏳ Adding...' : '✅ Add Account'}
        </button>
      </form>
    </div>
  );
}

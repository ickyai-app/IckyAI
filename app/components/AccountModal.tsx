'use client'

import { useState } from 'react'

interface Account {
  id: string
  name: string
  industry: string
  contactPerson: string
  email: string
  phone: string
  status: 'active' | 'inactive' | 'prospect'
}

export default function AccountModal({
  account,
  onSave,
  onClose,
}: {
  account?: Account | null
  onSave: (data: Omit<Account, 'id'>) => void
  onClose: () => void
}) {
  const [name, setName] = useState(account?.name || '')
  const [industry, setIndustry] = useState(account?.industry || '')
  const [contactPerson, setContactPerson] = useState(account?.contactPerson || '')
  const [email, setEmail] = useState(account?.email || '')
  const [phone, setPhone] = useState(account?.phone || '')
  const [status, setStatus] = useState<Account['status']>(account?.status || 'prospect')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !industry.trim() || !contactPerson.trim() || !email.trim() || !phone.trim()) {
      alert('Please fill in all fields')
      return
    }

    onSave({
      name,
      industry,
      contactPerson,
      email,
      phone,
      status,
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          {account ? 'Edit Account' : 'Add New Account'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Account Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Account Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Company Name"
              className="w-full"
              autoFocus
            />
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Industry *
            </label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="Manufacturing, Retail, etc."
              className="w-full"
            />
          </div>

          {/* Contact Person */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Contact Person *
            </label>
            <input
              type="text"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              placeholder="John Smith"
              className="w-full"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contact@company.com"
              className="w-full"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Phone *
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="w-full"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Status
            </label>
            <select value={status} onChange={(e) => setStatus(e.target.value as Account['status'])} className="w-full">
              <option value="prospect">🎯 Prospect</option>
              <option value="active">✅ Active</option>
              <option value="inactive">⏸️ Inactive</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button type="submit" className="btn-primary flex-1">
              {account ? 'Update Account' : 'Add Account'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

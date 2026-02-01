'use client'

import { useState } from 'react'

interface Lead {
  id: string
  name: string
  company: string
  email: string
  phone: string
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost'
  createdAt: Date
}

export default function LeadModal({
  lead,
  onSave,
  onClose,
}: {
  lead?: Lead | null
  onSave: (data: Omit<Lead, 'id' | 'createdAt'>) => void
  onClose: () => void
}) {
  const [name, setName] = useState(lead?.name || '')
  const [company, setCompany] = useState(lead?.company || '')
  const [email, setEmail] = useState(lead?.email || '')
  const [phone, setPhone] = useState(lead?.phone || '')
  const [status, setStatus] = useState<Lead['status']>(lead?.status || 'new')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !company.trim() || !email.trim() || !phone.trim()) {
      alert('Please fill in all fields')
      return
    }

    onSave({
      name,
      company,
      email,
      phone,
      status,
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          {lead ? 'Edit Lead' : 'Add New Lead'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Lead Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full"
              autoFocus
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Company *
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="ABC Corporation"
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
              placeholder="john@example.com"
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
            <select value={status} onChange={(e) => setStatus(e.target.value as Lead['status'])} className="w-full">
              <option value="new">✨ New</option>
              <option value="contacted">📞 Contacted</option>
              <option value="qualified">✅ Qualified</option>
              <option value="proposal">📋 Proposal</option>
              <option value="won">🎉 Won</option>
              <option value="lost">❌ Lost</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button type="submit" className="btn-primary flex-1">
              {lead ? 'Update Lead' : 'Add Lead'}
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

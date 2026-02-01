'use client'

import { useState } from 'react'
import { format } from 'date-fns'

interface QuickActivityModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (activity: any) => void
  leads: Array<{ id: string; name: string }>
  accounts: Array<{ id: string; name: string }>
}

export default function QuickActivityModal({
  isOpen,
  onClose,
  onSave,
  leads,
  accounts,
}: QuickActivityModalProps) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState<'call' | 'email' | 'visit' | 'quote' | 'follow-up'>('follow-up')
  const [notes, setNotes] = useState('')
  const [leadId, setLeadId] = useState('')
  const [accountId, setAccountId] = useState('')
  const [dateTime, setDateTime] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      alert('Please enter an activity title')
      return
    }

    const activityDate = new Date(dateTime)

    onSave({
      title,
      type,
      notes,
      leadId: leadId || undefined,
      accountId: accountId || undefined,
      date: activityDate,
      completed: false,
    })

    // Reset form
    setTitle('')
    setType('follow-up')
    setNotes('')
    setLeadId('')
    setAccountId('')
    setDateTime(format(new Date(), "yyyy-MM-dd'T'HH:mm"))
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Quick Add Activity</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Activity Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Follow up with John"
              className="w-full"
              autoFocus
            />
          </div>

          {/* Type */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value as any)} className="w-full">
                <option value="call">☎️ Call</option>
                <option value="email">📧 Email</option>
                <option value="visit">👤 Visit</option>
                <option value="quote">📄 Quote</option>
                <option value="follow-up">🔔 Follow-up</option>
              </select>
            </div>

            {/* DateTime */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date & Time</label>
              <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Lead & Account */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Lead</label>
              <select value={leadId} onChange={(e) => setLeadId(e.target.value)} className="w-full">
                <option value="">Select lead...</option>
                {leads.map((lead) => (
                  <option key={lead.id} value={lead.id}>
                    {lead.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Account</label>
              <select value={accountId} onChange={(e) => setAccountId(e.target.value)} className="w-full">
                <option value="">Select account...</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Quick notes..."
              className="w-full resize-none"
              rows={2}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 mt-4">
            <button type="submit" className="btn-primary flex-1">
              Add Activity
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

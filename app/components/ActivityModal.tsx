'use client'

import { useState } from 'react'
import { format } from 'date-fns'

interface ActivityModalProps {
  date: Date
  onSave: (activity: any) => void
  onClose: () => void
  leads: Array<{ id: string; name: string }>
  accounts: Array<{ id: string; name: string }>
}

export default function ActivityModal({
  date,
  onSave,
  onClose,
  leads,
  accounts,
}: ActivityModalProps) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState<'call' | 'email' | 'visit' | 'quote' | 'follow-up'>('follow-up')
  const [notes, setNotes] = useState('')
  const [leadId, setLeadId] = useState('')
  const [accountId, setAccountId] = useState('')
  const [time, setTime] = useState(format(date, 'HH:mm'))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      alert('Please enter an activity title')
      return
    }

    const [hours, minutes] = time.split(':')
    const activityDate = new Date(date)
    activityDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)

    onSave({
      title,
      type,
      notes,
      leadId: leadId || undefined,
      accountId: accountId || undefined,
      date: activityDate,
      completed: false,
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Add New Activity</h2>
        <p className="text-slate-600 mb-6">{format(date, 'EEEE, MMMM d, yyyy')}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Activity Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Follow up with client"
              className="w-full"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value as any)} className="w-full">
              <option value="call">☎️ Call</option>
              <option value="email">📧 Email</option>
              <option value="visit">👤 Visit</option>
              <option value="quote">📄 Quote</option>
              <option value="follow-up">🔔 Follow-up</option>
            </select>
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Lead */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Lead (optional)</label>
            <select value={leadId} onChange={(e) => setLeadId(e.target.value)} className="w-full">
              <option value="">Select a lead...</option>
              {leads.map((lead) => (
                <option key={lead.id} value={lead.id}>
                  {lead.name}
                </option>
              ))}
            </select>
          </div>

          {/* Account */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Account (optional)
            </label>
            <select value={accountId} onChange={(e) => setAccountId(e.target.value)} className="w-full">
              <option value="">Select an account...</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this activity..."
              className="w-full resize-none"
              rows={3}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button type="submit" className="btn-primary flex-1">
              Save Activity
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

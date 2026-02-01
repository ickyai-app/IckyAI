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

interface QuickAccountsSidebarProps {
  accounts: Account[]
  onAddNew: () => void
  isOpen?: boolean
  onClose?: () => void
}

export default function QuickAccountsSidebar({
  accounts,
  onAddNew,
  isOpen: controlledOpen = false,
  onClose,
}: QuickAccountsSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const open = controlledOpen
  const handleClose = () => {
    onClose?.()
    setIsOpen(false)
  }

  const getStatusColor = (status: Account['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-slate-100 text-slate-800'
      case 'prospect':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-slate-100 text-slate-800'
    }
  }

  const getStatusEmoji = (status: Account['status']) => {
    switch (status) {
      case 'active':
        return '✅'
      case 'inactive':
        return '⏸️'
      case 'prospect':
        return '🎯'
      default:
        return '❓'
    }
  }

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 z-40 ${
          open ? 'translate-x-0' : 'translate-x-full'
        } overflow-y-auto`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">🏢 Your Accounts</h2>
            <button
              onClick={handleClose}
              className="text-2xl text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>

          {accounts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500 mb-4">No accounts yet</p>
              <button onClick={onAddNew} className="btn-primary">
                + Create Account
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="p-3 rounded-lg border border-slate-200 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-slate-900">{account.name}</h3>
                    <span className={`activity-badge px-2 py-1 ${getStatusColor(account.status)}`}>
                      {getStatusEmoji(account.status)} {account.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mb-2">{account.industry}</p>
                  <div className="text-xs space-y-1 text-slate-600">
                    <p>
                      <span className="font-medium">Contact:</span> {account.contactPerson}
                    </p>
                    <p>
                      <a href={`mailto:${account.email}`} className="text-blue-600 hover:underline">
                        📧 {account.email}
                      </a>
                    </p>
                    <p>
                      <a href={`tel:${account.phone}`} className="text-blue-600 hover:underline">
                        📞 {account.phone}
                      </a>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button onClick={onAddNew} className="btn-primary w-full mt-6">
            + New Account
          </button>
        </div>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
          onClick={handleClose}
        />
      )}
    </>
  )
}

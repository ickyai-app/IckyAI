'use client'

import { useState } from 'react'
import AccountModal from './AccountModal'

interface Account {
  id: string
  name: string
  industry: string
  contactPerson: string
  email: string
  phone: string
  status: 'active' | 'inactive' | 'prospect'
}

export default function AccountsSection({
  accounts,
  setAccounts,
}: {
  accounts: Account[]
  setAccounts: (accounts: Account[]) => void
}) {
  const [showModal, setShowModal] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [filter, setFilter] = useState<string>('all')

  const statuses: Account['status'][] = ['active', 'inactive', 'prospect']

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

  const filteredAccounts = accounts.filter((account) => {
    if (filter === 'all') return true
    return account.status === filter
  })

  const handleAddAccount = (accountData: Omit<Account, 'id'>) => {
    if (editingAccount) {
      setAccounts(accounts.map((a) => (a.id === editingAccount.id ? { ...a, ...accountData } : a)))
      setEditingAccount(null)
    } else {
      const newAccount: Account = {
        ...accountData,
        id: Date.now().toString(),
      }
      setAccounts([...accounts, newAccount])
    }
    setShowModal(false)
  }

  const handleDeleteAccount = (id: string) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      setAccounts(accounts.filter((a) => a.id !== id))
    }
  }

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account)
    setShowModal(true)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Manage Accounts</h2>
        <button
          onClick={() => {
            setEditingAccount(null)
            setShowModal(true)
          }}
          className="btn-primary"
        >
          + New Account
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 border-b border-slate-200">
        <div className="flex gap-4 overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              filter === 'all'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({accounts.length})
          </button>
          {statuses.map((status) => {
            const count = accounts.filter((a) => a.status === status).length
            return (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 font-medium border-b-2 transition ${
                  filter === status
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                {getStatusEmoji(status)} {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Accounts Table */}
      {filteredAccounts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500 text-lg">No accounts found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Account Name</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Contact Person</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Industry</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Phone</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((account) => (
                <tr
                  key={account.id}
                  className="border-b border-slate-200 hover:bg-slate-50 transition group"
                >
                  <td className="px-4 py-3 font-medium text-slate-900">{account.name}</td>
                  <td className="px-4 py-3 text-slate-600">{account.contactPerson}</td>
                  <td className="px-4 py-3 text-slate-600">{account.industry}</td>
                  <td className="px-4 py-3">
                    <a href={`mailto:${account.email}`} className="text-blue-600 hover:underline">
                      {account.email}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <a href={`tel:${account.phone}`} className="text-blue-600 hover:underline">
                      {account.phone}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`activity-badge px-3 py-1 ${getStatusColor(account.status)}`}>
                      {getStatusEmoji(account.status)} {account.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleEditAccount(account)}
                        className="btn-small bg-blue-100 text-blue-700 hover:bg-blue-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAccount(account.id)}
                        className="btn-small bg-red-100 text-red-700 hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Account Modal */}
      {showModal && (
        <AccountModal
          account={editingAccount}
          onSave={handleAddAccount}
          onClose={() => {
            setShowModal(false)
            setEditingAccount(null)
          }}
        />
      )}
    </div>
  )
}

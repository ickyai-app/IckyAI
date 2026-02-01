'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import LeadModal from './LeadModal'

interface Lead {
  id: string
  name: string
  company: string
  email: string
  phone: string
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost'
  createdAt: Date
}

export default function LeadsSection({
  leads,
  setLeads,
}: {
  leads: Lead[]
  setLeads: (leads: Lead[]) => void
}) {
  const [showModal, setShowModal] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [filter, setFilter] = useState<string>('all')

  const statuses: Lead['status'][] = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost']

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800'
      case 'contacted':
        return 'bg-purple-100 text-purple-800'
      case 'qualified':
        return 'bg-cyan-100 text-cyan-800'
      case 'proposal':
        return 'bg-yellow-100 text-yellow-800'
      case 'won':
        return 'bg-green-100 text-green-800'
      case 'lost':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-slate-100 text-slate-800'
    }
  }

  const getStatusEmoji = (status: Lead['status']) => {
    switch (status) {
      case 'new':
        return '✨'
      case 'contacted':
        return '📞'
      case 'qualified':
        return '✅'
      case 'proposal':
        return '📋'
      case 'won':
        return '🎉'
      case 'lost':
        return '❌'
      default:
        return '❓'
    }
  }

  const filteredLeads = leads.filter((lead) => {
    if (filter === 'all') return true
    return lead.status === filter
  })

  const handleAddLead = (leadData: Omit<Lead, 'id' | 'createdAt'>) => {
    if (editingLead) {
      setLeads(leads.map((l) => (l.id === editingLead.id ? { ...l, ...leadData } : l)))
      setEditingLead(null)
    } else {
      const newLead: Lead = {
        ...leadData,
        id: Date.now().toString(),
        createdAt: new Date(),
      }
      setLeads([...leads, newLead])
    }
    setShowModal(false)
  }

  const handleDeleteLead = (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      setLeads(leads.filter((l) => l.id !== id))
    }
  }

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead)
    setShowModal(true)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Manage Leads</h2>
        <button
          onClick={() => {
            setEditingLead(null)
            setShowModal(true)
          }}
          className="btn-primary"
        >
          + New Lead
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
            All ({leads.length})
          </button>
          {statuses.map((status) => {
            const count = leads.filter((l) => l.status === status).length
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

      {/* Leads Grid */}
      {filteredLeads.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500 text-lg">No leads found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeads.map((lead) => (
            <div key={lead.id} className="card group">
              <div className="flex justify-between items-start mb-3">
                <span className={`activity-badge px-3 py-1 ${getStatusColor(lead.status)}`}>
                  {getStatusEmoji(lead.status)} {lead.status}
                </span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => handleEditLead(lead)}
                    className="btn-small bg-blue-100 text-blue-700 hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteLead(lead.id)}
                    className="btn-small bg-red-100 text-red-700 hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <h3 className="card-header">{lead.name}</h3>
              <p className="card-subtext mb-3">{lead.company}</p>

              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="font-medium">📧</span>
                  <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline truncate">
                    {lead.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">📞</span>
                  <a href={`tel:${lead.phone}`} className="text-blue-600 hover:underline">
                    {lead.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">📅</span>
                  <span>{format(new Date(lead.createdAt), 'MMM d, yyyy')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lead Modal */}
      {showModal && (
        <LeadModal
          lead={editingLead}
          onSave={handleAddLead}
          onClose={() => {
            setShowModal(false)
            setEditingLead(null)
          }}
        />
      )}
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import LeadsSection from './LeadsSection'
import AccountsSection from './AccountsSection'
import Calendar from './Calendar'

interface Lead {
  id: string
  name: string
  company: string
  email: string
  phone: string
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost'
  createdAt: Date
}

interface Account {
  id: string
  name: string
  industry: string
  contactPerson: string
  email: string
  phone: string
  status: 'active' | 'inactive' | 'prospect'
}

interface Activity {
  id: string
  title: string
  type: 'call' | 'email' | 'visit' | 'quote' | 'follow-up'
  date: Date
  leadId?: string
  accountId?: string
  notes: string
  completed: boolean
}

export default function Dashboard({ setIsLoggedIn }: { setIsLoggedIn: (val: boolean) => void }) {
  const [activeTab, setActiveTab] = useState<'leads' | 'accounts' | 'calendar'>('calendar')
  const [leads, setLeads] = useState<Lead[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [activities, setActivities] = useState<Activity[]>([])

  // Load data from localStorage on mount
  useEffect(() => {
    const savedLeads = localStorage.getItem('ickyai_leads')
    const savedAccounts = localStorage.getItem('ickyai_accounts')
    const savedActivities = localStorage.getItem('ickyai_activities')

    if (savedLeads) setLeads(JSON.parse(savedLeads))
    if (savedAccounts) setAccounts(JSON.parse(savedAccounts))
    if (savedActivities) {
      const parsed = JSON.parse(savedActivities)
      setActivities(
        parsed.map((a: any) => ({
          ...a,
          date: new Date(a.date),
        }))
      )
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ickyai_leads', JSON.stringify(leads))
  }, [leads])

  useEffect(() => {
    localStorage.setItem('ickyai_accounts', JSON.stringify(accounts))
  }, [accounts])

  useEffect(() => {
    localStorage.setItem('ickyai_activities', JSON.stringify(activities))
  }, [activities])

  const handleLogout = () => {
    localStorage.removeItem('ickyai_user')
    localStorage.removeItem('ickyai_leads')
    localStorage.removeItem('ickyai_accounts')
    localStorage.removeItem('ickyai_activities')
    setIsLoggedIn(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">IckyAI Sales Dashboard</h1>
            <p className="text-sm text-slate-600 mt-1">Organize your sales pipeline and track follow-ups</p>
          </div>
          <button
            onClick={handleLogout}
            className="btn-danger"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="tabs">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`tab ${activeTab === 'calendar' ? 'active' : ''}`}
            >
              📅 Calendar & Activities
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`tab ${activeTab === 'leads' ? 'active' : ''}`}
            >
              👤 Leads
            </button>
            <button
              onClick={() => setActiveTab('accounts')}
              className={`tab ${activeTab === 'accounts' ? 'active' : ''}`}
            >
              🏢 Accounts
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'calendar' && (
          <Calendar activities={activities} setActivities={setActivities} leads={leads} accounts={accounts} />
        )}
        {activeTab === 'leads' && (
          <LeadsSection leads={leads} setLeads={setLeads} />
        )}
        {activeTab === 'accounts' && (
          <AccountsSection accounts={accounts} setAccounts={setAccounts} />
        )}
      </div>
    </div>
  )
}

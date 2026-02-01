'use client'

import { useState, useEffect } from 'react'
import LeadsSection from './LeadsSection'
import AccountsSection from './AccountsSection'
import Calendar from './Calendar'
import QuickActivityModal from './QuickActivityModal'
import QuickAccountsSidebar from './QuickAccountsSidebar'

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
  const [showQuickActivity, setShowQuickActivity] = useState(false)
  const [showAccountsSidebar, setShowAccountsSidebar] = useState(false)

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

  const handleQuickAddActivity = (activityData: Omit<Activity, 'id'>) => {
    const newActivity: Activity = {
      ...activityData,
      id: Date.now().toString(),
    }
    setActivities([...activities, newActivity])
    setShowQuickActivity(false)
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

        {/* Quick Stats */}
        <div className="border-t border-slate-200 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6 py-3 flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl">👤</span>
              <div>
                <p className="text-slate-600">Leads</p>
                <p className="text-xl font-bold text-slate-900">{leads.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏢</span>
              <div>
                <p className="text-slate-600">Accounts</p>
                <p className="text-xl font-bold text-slate-900">{accounts.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📅</span>
              <div>
                <p className="text-slate-600">Activities</p>
                <p className="text-xl font-bold text-slate-900">{activities.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setShowQuickActivity(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                + Quick Activity
              </button>
              <button
                onClick={() => setShowAccountsSidebar(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
              >
                View Accounts
              </button>
            </div>
          </div>
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

      {/* Quick Activity Modal */}
      <QuickActivityModal
        isOpen={showQuickActivity}
        onClose={() => setShowQuickActivity(false)}
        onSave={handleQuickAddActivity}
        leads={leads}
        accounts={accounts}
      />

      {/* Accounts Sidebar */}
      <QuickAccountsSidebar
        accounts={accounts}
        isOpen={showAccountsSidebar}
        onClose={() => setShowAccountsSidebar(false)}
        onAddNew={() => {
          setShowAccountsSidebar(false)
          setActiveTab('accounts')
        }}
      />
    </div>
  )
}

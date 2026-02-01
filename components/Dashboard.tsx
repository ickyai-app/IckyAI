'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import AccountForm from './AccountForm'
import ActivityForm from './ActivityForm'
import AccountsList from './AccountsList'
import AccountsOverview from './AccountsOverview'
import ActivityLog from './ActivityLog'
import ActivityCalendar from './ActivityCalendar'
import TemplatesLibrary from './TemplatesLibrary'
import AICoaching from './AICoaching'
import PipelineReminders from './PipelineReminders'

type TabType = 'dashboard' | 'accounts-overview' | 'accounts' | 'add-account' | 'activities' | 'activity-calendar' | 'templates' | 'coaching';

interface Account {
  id: number;
  name: string;
  contact: string;
  phone: string;
  email: string;
  status: string;
  deal_size: number;
  last_activity: string;
}

interface Activity {
  id: number;
  account_id: number;
  account_name: string;
  type: string;
  contact: string;
  notes: string;
  date: string;
  outcome: string;
}

interface Reminder {
  id: number;
  account_id: number;
  account_name: string;
  reminder_text: string;
  reminder_date: string;
  completed: boolean;
}

const tabConfig = [
  { id: 'dashboard', label: '📊 Dashboard' },
  { id: 'accounts-overview', label: '📋 Accounts Overview' },
  { id: 'accounts', label: '👥 Pipeline' },
  { id: 'add-account', label: '➕ New Account' },
  { id: 'activities', label: '📝 Activity Log' },
  { id: 'activity-calendar', label: '📅 Calendar' },
  { id: 'templates', label: '📧 Templates' },
  { id: 'coaching', label: '🤖 AI Coach' },
]

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [accounts, setAccounts] = useState<Account[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        const headers = { 'x-user-id': user.id.toString() }
        
        const [accountsRes, activitiesRes, remindersRes] = await Promise.all([
          fetch('/api/accounts', { headers }),
          fetch('/api/activities', { headers }),
          fetch('/api/reminders', { headers })
        ])

        if (accountsRes.ok) {
          const data = await accountsRes.json()
          setAccounts(data.accounts || [])
        }

        if (activitiesRes.ok) {
          const data = await activitiesRes.json()
          setActivities(data.activities || [])
        }

        if (remindersRes.ok) {
          const data = await remindersRes.json()
          setReminders(data.reminders || [])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const handleAccountAdded = async () => {
    if (!user) return
    try {
      const headers = { 'x-user-id': user.id.toString() }
      const response = await fetch('/api/accounts', { headers })
      if (response.ok) {
        const data = await response.json()
        setAccounts(data.accounts || [])
      }
    } catch (error) {
      console.error('Error refreshing accounts:', error)
    }
  }

  const handleActivityAdded = async () => {
    if (!user) return
    try {
      const headers = { 'x-user-id': user.id.toString() }
      const response = await fetch('/api/activities', { headers })
      if (response.ok) {
        const data = await response.json()
        setActivities(data.activities || [])
      }
    } catch (error) {
      console.error('Error refreshing activities:', error)
    }
  }

  const handleReminderAdded = async () => {
    if (!user) return
    try {
      const headers = { 'x-user-id': user.id.toString() }
      const response = await fetch('/api/reminders', { headers })
      if (response.ok) {
        const data = await response.json()
        setReminders(data.reminders || [])
      }
    } catch (error) {
      console.error('Error refreshing reminders:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const stats = {
    totalAccounts: accounts.length,
    activeAccounts: accounts.filter(a => a.status === 'active').length,
    totalValue: accounts.reduce((sum, a) => sum + (a.deal_size || 0), 0),
    recentActivities: activities.slice(0, 5).length,
    upcomingReminders: reminders.filter(r => !r.completed).length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-2xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white">💼 IckyAI</h1>
            <p className="text-blue-100 text-sm mt-1">Sales Pipeline Management</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-blue-100 text-sm">Logged in as</p>
              <p className="font-semibold text-white text-sm">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition shadow-md hover:shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b-2 border-blue-600 shadow-xl overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            {tabConfig.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={activeTab === tab.id
                  ? 'px-5 py-4 font-medium text-sm whitespace-nowrap transition-all duration-200 border-b-3 rounded-t-lg border-blue-400 text-blue-400 bg-gray-700 shadow-lg'
                  : 'px-5 py-4 font-medium text-sm whitespace-nowrap transition-all duration-200 border-b-3 rounded-t-lg border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                }
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Accounts</p>
                    <p className="text-4xl font-bold text-white mt-2">{stats.totalAccounts}</p>
                  </div>
                  <div className="text-5xl opacity-20">👥</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Active Deals</p>
                    <p className="text-4xl font-bold text-white mt-2">{stats.activeAccounts}</p>
                  </div>
                  <div className="text-5xl opacity-20">✓</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Pipeline Value</p>
                    <p className="text-4xl font-bold text-white mt-2">${(stats.totalValue / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="text-5xl opacity-20">💰</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Activities</p>
                    <p className="text-4xl font-bold text-white mt-2">{stats.recentActivities}</p>
                  </div>
                  <div className="text-5xl opacity-20">📊</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm font-medium">Reminders</p>
                    <p className="text-4xl font-bold text-white mt-2">{stats.upcomingReminders}</p>
                  </div>
                  <div className="text-5xl opacity-20">🔔</div>
                </div>
              </div>
            </div>

            {/* Upcoming Reminders Section */}
            <PipelineReminders reminders={reminders} onReminderAdded={handleReminderAdded} accounts={accounts} />

            {/* Quick Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">🔥</span>
                  <h3 className="font-bold text-lg text-white">Hot Leads</h3>
                </div>
                <div className="space-y-3">
                  {accounts
                    .filter(a => a.status === 'qualified')
                    .slice(0, 3)
                    .map(account => (
                      <div key={account.id} className="flex justify-between items-center pb-3 border-b border-gray-700 p-3 rounded hover:bg-gray-700">
                        <div>
                          <p className="font-semibold text-white">{account.name}</p>
                          <p className="text-sm text-gray-400">{account.contact}</p>
                        </div>
                        <span className="text-sm font-bold text-green-400">${account.deal_size.toLocaleString()}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">📝</span>
                  <h3 className="font-bold text-lg text-white">Recent Activities</h3>
                </div>
                <div className="space-y-3">
                  {activities.slice(0, 3).map(activity => (
                    <div key={activity.id} className="pb-3 border-b border-gray-700 p-3 rounded hover:bg-gray-700">
                      <p className="text-sm"><span className="font-semibold text-white">{activity.account_name}</span> <span className="text-gray-400">• {activity.type}</span></p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(activity.date).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'accounts-overview' && <AccountsOverview accounts={accounts} activities={activities} />}
        {activeTab === 'accounts' && <AccountsList accounts={accounts} />}
        {activeTab === 'add-account' && <AccountForm onAccountAdded={handleAccountAdded} />}
        {activeTab === 'activities' && <ActivityLog activities={activities} accounts={accounts} />}
        {activeTab === 'activity-calendar' && <ActivityCalendar activities={activities} accounts={accounts} onActivityAdded={handleActivityAdded} />}
        {activeTab === 'templates' && <TemplatesLibrary userId={user?.id} />}
        {activeTab === 'coaching' && <AICoaching accounts={accounts} activities={activities} />}
      </main>
    </div>
  )
}

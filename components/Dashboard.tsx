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
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-xl text-cyan-300 font-semibold">Initializing AI System...</p>
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
    <div className="min-h-screen relative">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b-2 border-cyan-400 backdrop-blur-md" style={{
        background: 'linear-gradient(135deg, rgba(0, 188, 212, 0.95), rgba(139, 69, 219, 0.95), rgba(59, 130, 246, 0.95))',
        boxShadow: '0 0 40px rgba(0, 188, 212, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-black text-white drop-shadow-lg" style={{
              textShadow: '0 0 20px rgba(0, 188, 212, 0.8), 0 0 40px rgba(139, 69, 219, 0.6)'
            }}>
              💼 ICKY AI
            </h1>
            <p className="text-cyan-100 text-sm mt-2 font-semibold tracking-widest">ENTERPRISE SALES COMMAND CENTER v2050</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-cyan-100 text-sm">USER SESSION</p>
              <p className="font-bold text-white text-sm">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition shadow-lg hover:shadow-xl border border-red-500"
              style={{ boxShadow: '0 0 15px rgba(220, 38, 38, 0.4)' }}
            >
              ⏻ LOGOUT
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-gradient-to-r from-gray-950 via-slate-900 to-gray-950 border-b border-cyan-500 backdrop-blur-sm" style={{
        boxShadow: 'inset 0 1px 0 rgba(0, 188, 212, 0.3), 0 4px 20px rgba(0, 0, 0, 0.7)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {tabConfig.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-5 py-4 font-semibold text-sm whitespace-nowrap transition-all duration-200 border-b-2 rounded-t-lg ${
                  activeTab === tab.id
                    ? 'border-cyan-400 text-cyan-300 bg-gradient-to-b from-cyan-950 to-transparent shadow-lg'
                    : 'border-transparent text-gray-400 hover:text-cyan-300 hover:bg-gradient-to-b hover:from-gray-900 hover:to-transparent'
                }`}
                style={activeTab === tab.id ? {
                  textShadow: '0 0 10px rgba(0, 188, 212, 0.6)'
                } : {}}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="p-6 rounded-xl border border-cyan-500 backdrop-blur-sm" style={{
                background: 'linear-gradient(135deg, rgba(0, 188, 212, 0.15), rgba(0, 188, 212, 0.05))',
                boxShadow: '0 0 30px rgba(0, 188, 212, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cyan-300 text-xs font-bold tracking-widest">TOTAL ACCOUNTS</p>
                    <p className="text-4xl font-black text-cyan-400 mt-2" style={{ textShadow: '0 0 10px rgba(0, 188, 212, 0.8)' }}>{stats.totalAccounts}</p>
                  </div>
                  <div className="text-5xl opacity-30">👥</div>
                </div>
              </div>

              <div className="p-6 rounded-xl border border-green-500 backdrop-blur-sm" style={{
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.05))',
                boxShadow: '0 0 30px rgba(34, 197, 94, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-300 text-xs font-bold tracking-widest">ACTIVE DEALS</p>
                    <p className="text-4xl font-black text-green-400 mt-2" style={{ textShadow: '0 0 10px rgba(34, 197, 94, 0.8)' }}>{stats.activeAccounts}</p>
                  </div>
                  <div className="text-5xl opacity-30">✓</div>
                </div>
              </div>

              <div className="p-6 rounded-xl border border-purple-500 backdrop-blur-sm" style={{
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(168, 85, 247, 0.05))',
                boxShadow: '0 0 30px rgba(168, 85, 247, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-300 text-xs font-bold tracking-widest">PIPELINE VALUE</p>
                    <p className="text-4xl font-black text-purple-400 mt-2" style={{ textShadow: '0 0 10px rgba(168, 85, 247, 0.8)' }}>${(stats.totalValue / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="text-5xl opacity-30">💰</div>
                </div>
              </div>

              <div className="p-6 rounded-xl border border-orange-500 backdrop-blur-sm" style={{
                background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(249, 115, 22, 0.05))',
                boxShadow: '0 0 30px rgba(249, 115, 22, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-300 text-xs font-bold tracking-widest">ACTIVITIES</p>
                    <p className="text-4xl font-black text-orange-400 mt-2" style={{ textShadow: '0 0 10px rgba(249, 115, 22, 0.8)' }}>{stats.recentActivities}</p>
                  </div>
                  <div className="text-5xl opacity-30">📊</div>
                </div>
              </div>

              <div className="p-6 rounded-xl border border-red-500 backdrop-blur-sm" style={{
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05))',
                boxShadow: '0 0 30px rgba(239, 68, 68, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-300 text-xs font-bold tracking-widest">REMINDERS</p>
                    <p className="text-4xl font-black text-red-400 mt-2" style={{ textShadow: '0 0 10px rgba(239, 68, 68, 0.8)' }}>{stats.upcomingReminders}</p>
                  </div>
                  <div className="text-5xl opacity-30">🔔</div>
                </div>
              </div>
            </div>

            {/* Upcoming Reminders Section */}
            <PipelineReminders reminders={reminders} onReminderAdded={handleReminderAdded} accounts={accounts} />

            {/* Quick Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-cyan-500 backdrop-blur-sm" style={{
                background: 'linear-gradient(135deg, rgba(0, 188, 212, 0.1), rgba(0, 188, 212, 0.02))',
                boxShadow: '0 0 30px rgba(0, 188, 212, 0.2)'
              }}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">🔥</span>
                  <h3 className="font-black text-lg text-cyan-300">HOT LEADS</h3>
                </div>
                <div className="space-y-3">
                  {accounts
                    .filter(a => a.status === 'qualified')
                    .slice(0, 3)
                    .map(account => (
                      <div key={account.id} className="flex justify-between items-center pb-3 border-b border-cyan-700 p-3 rounded hover:bg-cyan-950 transition">
                        <div>
                          <p className="font-bold text-cyan-300">{account.name}</p>
                          <p className="text-xs text-cyan-400">{account.contact}</p>
                        </div>
                        <span className="text-sm font-black text-green-400">${account.deal_size.toLocaleString()}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="p-6 rounded-xl border border-purple-500 backdrop-blur-sm" style={{
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(168, 85, 247, 0.02))',
                boxShadow: '0 0 30px rgba(168, 85, 247, 0.2)'
              }}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">📝</span>
                  <h3 className="font-black text-lg text-purple-300">RECENT ACTIVITIES</h3>
                </div>
                <div className="space-y-3">
                  {activities.slice(0, 3).map(activity => (
                    <div key={activity.id} className="pb-3 border-b border-purple-700 p-3 rounded hover:bg-purple-950 transition">
                      <p className="text-xs"><span className="font-bold text-purple-300">{activity.account_name}</span> <span className="text-purple-400">• {activity.type}</span></p>
                      <p className="text-xs text-purple-500 mt-1">{new Date(activity.date).toLocaleDateString()}</p>
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

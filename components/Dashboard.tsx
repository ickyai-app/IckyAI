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
      <div className="flex items-center justify-center h-screen" style={{ background: 'linear-gradient(-45deg, #0a0e27, #1a1535, #16213e, #0f3460)', backgroundSize: '400% 400%' }}>
        <div className="text-center">
          <style>{`
            @keyframes spin-glow {
              0% { transform: rotate(0deg); box-shadow: 0 0 20px rgba(0, 255, 200, 0.8); }
              100% { transform: rotate(360deg); box-shadow: 0 0 40px rgba(0, 255, 200, 1); }
            }
          `}</style>
          <div className="rounded-full h-16 w-16 border-4 border-transparent border-t-cyan-400 border-r-purple-500 mx-auto mb-4" style={{ animation: 'spin-glow 1s linear infinite' }}></div>
          <p className="text-xl text-cyan-300 font-bold tracking-widest" style={{ fontFamily: 'Orbitron, sans-serif', textShadow: '0 0 20px rgba(0, 255, 200, 0.8)' }}>INITIALIZING SYSTEM...</p>
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
    <div className="min-h-screen relative" style={{
      background: 'linear-gradient(-45deg, #0a0e27, #1a1535, #16213e, #0f3460)',
      backgroundSize: '400% 400%',
      animation: 'nebula-shift 15s ease infinite'
    }}>
      <style>{`
        @keyframes nebula-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes glow-pulse {
          0%, 100% { text-shadow: 0 0 10px rgba(0, 255, 200, 0.5); }
          50% { text-shadow: 0 0 20px rgba(0, 255, 200, 0.8), 0 0 30px rgba(100, 0, 255, 0.6); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .neon-card {
          background: linear-gradient(135deg, rgba(26, 21, 53, 0.6), rgba(15, 52, 96, 0.6));
          border: 1px solid rgba(0, 255, 200, 0.2);
          border-top: 2px solid #00ffc8;
          box-shadow: 0 0 20px rgba(0, 255, 200, 0.1), inset 0 0 10px rgba(100, 0, 255, 0.05);
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
          animation: slide-in 0.6s ease-out;
        }
        .neon-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #00ffc8, transparent);
          animation: float-pulse 3s ease-in-out infinite;
        }
        .neon-card:hover {
          border-color: rgba(0, 255, 200, 0.5);
          box-shadow: 0 0 30px rgba(0, 255, 200, 0.2), inset 0 0 15px rgba(100, 0, 255, 0.1);
          transform: translateY(-5px);
        }
        .neon-button {
          background: linear-gradient(135deg, rgba(26, 100, 150, 0.7), rgba(15, 52, 96, 0.7));
          border: 2px solid rgba(0, 255, 200, 0.3);
          box-shadow: 0 0 20px rgba(0, 255, 200, 0.1), inset 0 0 10px rgba(100, 0, 255, 0.05);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .neon-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #00ffc8, transparent);
          animation: float-pulse 3s ease-in-out infinite;
        }
        .neon-button:hover {
          border-color: rgba(0, 255, 200, 0.8);
          box-shadow: 0 0 40px rgba(0, 255, 200, 0.3), inset 0 0 20px rgba(100, 0, 255, 0.15);
          transform: translateY(-8px) scale(1.02);
          background: linear-gradient(135deg, rgba(0, 255, 200, 0.15), rgba(100, 0, 255, 0.1));
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b-2 border-cyan-500 backdrop-blur-md" style={{
        background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.9), rgba(26, 21, 53, 0.9))',
        boxShadow: '0 0 40px rgba(0, 255, 200, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-black text-white" style={{
              fontFamily: 'Orbitron, sans-serif',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              animation: 'glow-pulse 3s ease-in-out infinite',
              textShadow: '0 0 20px rgba(0, 255, 200, 0.8), 0 0 40px rgba(139, 69, 219, 0.6)'
            }}>
              ⚡ ICKY AI NEXUS
            </h1>
            <p className="text-cyan-100 text-sm mt-2 font-bold tracking-widest" style={{ fontFamily: 'Space Mono, monospace', letterSpacing: '2px', textTransform: 'uppercase' }}>▸ Advanced Sales Intelligence System 2050 ◂</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-cyan-100 text-xs font-bold tracking-widest" style={{ fontFamily: 'Space Mono, monospace', letterSpacing: '1px', textTransform: 'uppercase' }}>USER SESSION</p>
              <p className="font-bold text-white text-sm">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="px-6 py-2.5 rounded text-sm font-bold transition transform hover:-translate-y-1"
              style={{
                background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.5), rgba(159, 18, 57, 0.5))',
                border: '2px solid rgba(220, 38, 38, 0.7)',
                color: '#ff6b6b',
                boxShadow: '0 0 15px rgba(220, 38, 38, 0.4)',
                fontFamily: 'Orbitron, sans-serif',
                letterSpacing: '1px'
              }}
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
                className={`px-6 py-5 font-bold text-base whitespace-nowrap transition-all duration-300 border-b-2 rounded-t ${
                  activeTab === tab.id
                    ? 'border-cyan-400 text-cyan-300 bg-gradient-to-b from-cyan-950 to-transparent'
                    : 'border-transparent text-gray-400 hover:text-cyan-300'
                }`}
                style={activeTab === tab.id ? {
                  fontFamily: 'Orbitron, sans-serif',
                  textShadow: '0 0 15px rgba(0, 188, 212, 0.8)',
                  boxShadow: '0 0 20px rgba(0, 188, 212, 0.4), inset 0 2px 10px rgba(0, 188, 212, 0.2)',
                  letterSpacing: '1px',
                  textTransform: 'uppercase'
                } : { fontFamily: 'Space Mono, monospace' }}
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
            {/* Big Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6" style={{ animation: 'slide-in 0.6s ease-out 0.1s both' }}>
              {/* Total Accounts */}
              <div className="neon-card p-6 rounded text-center" style={{ borderTop: '3px solid #00ffc8' }}>
                <h2 className="text-xs font-bold text-cyan-300 tracking-widest mb-4" style={{ fontFamily: 'Orbitron, sans-serif', letterSpacing: '2px', textTransform: 'uppercase' }}>👥 Total Accounts</h2>
                <div className="text-5xl font-black text-white mb-2" style={{ fontFamily: 'Orbitron, sans-serif', textShadow: '0 0 20px rgba(0, 255, 200, 0.5)', letterSpacing: '1px' }}>{stats.totalAccounts}</div>
                <p className="text-xs text-cyan-400" style={{ fontFamily: 'Space Mono, monospace', letterSpacing: '0.5px' }}>Active prospects in pipeline</p>
              </div>

              {/* Active Deals */}
              <div className="neon-card p-6 rounded text-center" style={{ borderTop: '3px solid #00ff88' }}>
                <h2 className="text-xs font-bold text-cyan-300 tracking-widest mb-4" style={{ fontFamily: 'Orbitron, sans-serif', letterSpacing: '2px', textTransform: 'uppercase' }}>✓ Active Deals</h2>
                <div className="text-5xl font-black text-white mb-2" style={{ fontFamily: 'Orbitron, sans-serif', textShadow: '0 0 20px rgba(0, 255, 136, 0.5)', letterSpacing: '1px' }}>{stats.activeAccounts}</div>
                <p className="text-xs text-cyan-400" style={{ fontFamily: 'Space Mono, monospace', letterSpacing: '0.5px' }}>Actively negotiating</p>
              </div>

              {/* Pipeline Value */}
              <div className="neon-card p-6 rounded text-center" style={{ borderTop: '3px solid #ff006e' }}>
                <h2 className="text-xs font-bold text-cyan-300 tracking-widest mb-4" style={{ fontFamily: 'Orbitron, sans-serif', letterSpacing: '2px', textTransform: 'uppercase' }}>💰 Pipeline Value</h2>
                <div className="text-5xl font-black text-white mb-2" style={{ fontFamily: 'Orbitron, sans-serif', textShadow: '0 0 20px rgba(255, 0, 110, 0.5)', letterSpacing: '1px' }}>${(stats.totalValue / 1000).toFixed(0)}K</div>
                <p className="text-xs text-cyan-400" style={{ fontFamily: 'Space Mono, monospace', letterSpacing: '0.5px' }}>Total opportunity value</p>
              </div>

              {/* Activities */}
              <div className="neon-card p-6 rounded text-center" style={{ borderTop: '3px solid #00d9ff' }}>
                <h2 className="text-xs font-bold text-cyan-300 tracking-widest mb-4" style={{ fontFamily: 'Orbitron, sans-serif', letterSpacing: '2px', textTransform: 'uppercase' }}>📞 Activities</h2>
                <div className="text-5xl font-black text-white mb-2" style={{ fontFamily: 'Orbitron, sans-serif', textShadow: '0 0 20px rgba(0, 217, 255, 0.5)', letterSpacing: '1px' }}>{stats.recentActivities}</div>
                <p className="text-xs text-cyan-400" style={{ fontFamily: 'Space Mono, monospace', letterSpacing: '0.5px' }}>This week logged</p>
              </div>

              {/* Reminders */}
              <div className="neon-card p-6 rounded text-center" style={{ borderTop: '3px solid #ffbe0b' }}>
                <h2 className="text-xs font-bold text-cyan-300 tracking-widest mb-4" style={{ fontFamily: 'Orbitron, sans-serif', letterSpacing: '2px', textTransform: 'uppercase' }}>🔔 Reminders</h2>
                <div className="text-5xl font-black text-white mb-2" style={{ fontFamily: 'Orbitron, sans-serif', textShadow: '0 0 20px rgba(255, 190, 11, 0.5)', letterSpacing: '1px' }}>{stats.upcomingReminders}</div>
                <p className="text-xs text-cyan-400" style={{ fontFamily: 'Space Mono, monospace', letterSpacing: '0.5px' }}>Action items pending</p>
              </div>
            </div>

            {/* Big Action Buttons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={{ animation: 'slide-in 0.6s ease-out 0.2s both' }}>
              <button
                onClick={() => setActiveTab('activity-calendar')}
                className="neon-button p-8 rounded flex flex-col items-center text-center group transform transition hover:-translate-y-2"
              >
                <div className="text-6xl mb-4 group-hover:scale-125 transition-transform duration-300">📅</div>
                <h3 className="text-2xl font-black text-white mb-2" style={{ fontFamily: 'Orbitron, sans-serif', letterSpacing: '1px' }}>Calendar</h3>
                <p className="text-cyan-200 font-semibold" style={{ fontFamily: 'Space Mono, monospace' }}>View & manage activities</p>
              </button>

              <button
                onClick={() => setActiveTab('add-account')}
                className="neon-button p-8 rounded flex flex-col items-center text-center group transform transition hover:-translate-y-2"
              >
                <div className="text-6xl mb-4 group-hover:scale-125 transition-transform duration-300">➕</div>
                <h3 className="text-2xl font-black text-white mb-2" style={{ fontFamily: 'Orbitron, sans-serif', letterSpacing: '1px' }}>New Account</h3>
                <p className="text-cyan-200 font-semibold" style={{ fontFamily: 'Space Mono, monospace' }}>Add a new client</p>
              </button>

              <button
                onClick={() => setActiveTab('activities')}
                className="neon-button p-8 rounded flex flex-col items-center text-center group transform transition hover:-translate-y-2"
              >
                <div className="text-6xl mb-4 group-hover:scale-125 transition-transform duration-300">📝</div>
                <h3 className="text-2xl font-black text-white mb-2" style={{ fontFamily: 'Orbitron, sans-serif', letterSpacing: '1px' }}>Activities</h3>
                <p className="text-cyan-200 font-semibold" style={{ fontFamily: 'Space Mono, monospace' }}>View activity log</p>
              </button>

              <button
                onClick={() => setActiveTab('templates')}
                className="neon-button p-8 rounded flex flex-col items-center text-center group transform transition hover:-translate-y-2"
              >
                <div className="text-6xl mb-4 group-hover:scale-125 transition-transform duration-300">📧</div>
                <h3 className="text-2xl font-black text-white mb-2" style={{ fontFamily: 'Orbitron, sans-serif', letterSpacing: '1px' }}>Templates</h3>
                <p className="text-cyan-200 font-semibold" style={{ fontFamily: 'Space Mono, monospace' }}>Email templates</p>
              </button>
            </div>

            {/* Upcoming Reminders Section */}
            <div style={{ animation: 'slide-in 0.6s ease-out 0.3s both' }}>
              <PipelineReminders reminders={reminders} onReminderAdded={handleReminderAdded} accounts={accounts} />
            </div>

            {/* Quick Cards - Hot Leads & Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ animation: 'slide-in 0.6s ease-out 0.4s both' }}>
              <div className="neon-card p-6 rounded" style={{ borderTop: '3px solid #ff006e' }}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">🔥</span>
                  <h3 className="font-black text-lg text-white" style={{ fontFamily: 'Orbitron, sans-serif', letterSpacing: '1px', textTransform: 'uppercase' }}>Hot Leads</h3>
                </div>
                <div className="space-y-3">
                  {accounts
                    .filter(a => a.status === 'qualified')
                    .slice(0, 3)
                    .map(account => (
                      <div key={account.id} className="flex justify-between items-center pb-3 border-b border-cyan-800 p-3 rounded hover:bg-cyan-950 transition" style={{ borderLeft: '3px solid #00ffc8' }}>
                        <div>
                          <p className="font-bold text-cyan-300" style={{ fontFamily: 'Orbitron, sans-serif' }}>{account.name}</p>
                          <p className="text-xs text-cyan-500">{account.contact}</p>
                        </div>
                        <span className="text-sm font-black text-green-400">${account.deal_size.toLocaleString()}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="neon-card p-6 rounded" style={{ borderTop: '3px solid #00d9ff' }}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">📝</span>
                  <h3 className="font-black text-lg text-white" style={{ fontFamily: 'Orbitron, sans-serif', letterSpacing: '1px', textTransform: 'uppercase' }}>Recent Activities</h3>
                </div>
                <div className="space-y-3">
                  {activities.slice(0, 3).map(activity => (
                    <div key={activity.id} className="pb-3 border-b border-cyan-800 p-3 rounded hover:bg-cyan-950 transition" style={{ borderLeft: '3px solid #00d9ff' }}>
                      <p className="text-xs"><span className="font-bold text-cyan-300" style={{ fontFamily: 'Orbitron, sans-serif' }}>{activity.account_name}</span> <span className="text-cyan-500">• {activity.type}</span></p>
                      <p className="text-xs text-cyan-500 mt-1" style={{ fontFamily: 'Space Mono, monospace' }}>{new Date(activity.date).toLocaleDateString()}</p>
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

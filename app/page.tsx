'use client'

import { useAuth } from '@/lib/auth-context'
import LoginPage from '@/components/LoginPage'
import Dashboard from '@/components/Dashboard'

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-cyan-600/5 to-transparent pointer-events-none"></div>
        <div className="text-center relative z-10">
          <div className="inline-block mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-cyan-400 border-r-purple-500 shadow-lg shadow-cyan-500/50"></div>
          </div>
          <p className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">IckyAI</p>
          <p className="text-lg text-cyan-300/80 font-semibold tracking-widest">INITIALIZING...</p>
        </div>
      </div>
    )
  }

  return user ? <Dashboard /> : <LoginPage />
}

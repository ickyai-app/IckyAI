'use client'

import { useState } from 'react'

export default function Login({ setIsLoggedIn }: { setIsLoggedIn: (val: boolean) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Simple demo authentication (no backend)
    if (email.trim() && password.trim()) {
      localStorage.setItem('ickyai_user', JSON.stringify({ email, password }))
      setIsLoggedIn(true)
    } else {
      setError('Please fill in all fields')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">IckyAI</h1>
            <p className="text-slate-600">Sales Organization Dashboard</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full"
              />
            </div>

            <button type="submit" className="btn-primary w-full py-3 text-lg font-semibold">
              Sign In
            </button>
          </form>

          {/* Demo Hint */}
          <p className="text-center text-slate-500 text-sm mt-6">
            💡 Demo: Use any email and password to sign in
          </p>
        </div>
      </div>
    </div>
  )
}

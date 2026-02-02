'use client';

import { useState } from 'react';
import { getSupabaseClient } from '@/lib/supabaseClient';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('Klemen.witwicky@gmail.com');
  const [password, setPassword] = useState('Icky44ewa');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        // Auto-fallback to demo login if Supabase not configured
        handleDemoLogin();
        return;
      }

      let result;
      if (isSignup) {
        result = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: email.split('@')[0],
            },
          },
        });
      } else {
        result = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      }

      if (result.error) {
        setError(result.error.message);
      } else {
        onLogin(result.data.user);
      }
    } catch (err) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setLoading(true);
    // Mock user object
    const mockUser = {
      id: 'demo-user-123',
      email: 'demo@ickyai.com',
      user_metadata: {
        name: 'Demo User'
      }
    };
    setTimeout(() => {
      onLogin(mockUser);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-cyan-100 mb-2">
            <span className="gradient-text">IckyAI</span>
          </h1>
          <p className="text-cyan-300">Sales Organization & Pipeline Management</p>
        </div>

        {/* Card */}
        <div className="glass p-8">
          <h2 className="text-2xl font-bold text-cyan-100 mb-6">
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="your@email.com"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : isSignup ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-gray-600">
            <button
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : '🚀 Use Demo Login'}
            </button>
            <p className="text-xs text-gray-400 mt-2 text-center">Try the app without Supabase</p>
          </div>

          <div className="mt-6 text-center text-cyan-300 text-sm">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}
            <button
              onClick={() => {
                setIsSignup(!isSignup);
                setError('');
              }}
              className="ml-2 text-red-500 hover:text-red-400 font-semibold"
            >
              {isSignup ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </div>

        {/* Demo Info */}
        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-200 text-sm">
          <p className="font-semibold mb-2">Demo Credentials:</p>
          <p>Email: Klemen.witwicky@gmail.com</p>
          <p>Password: Icky44ewa</p>
        </div>
      </div>
    </div>
  );
}


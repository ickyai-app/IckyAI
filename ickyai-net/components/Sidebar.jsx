'use client';

import { useState } from 'react';
import { getSupabaseClient } from '@/lib/supabaseClient';

export default function Sidebar({ activeTab, setActiveTab, user }) {
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
  };

  const menuItems = [
    { id: 'pipeline', label: '📊 Pipeline', icon: '📊' },
    { id: 'accounts', label: '👥 Accounts', icon: '👥' },
    { id: 'activities', label: '📝 Activities', icon: '📝' },
    { id: 'followups', label: '⏰ Follow-ups', icon: '⏰' },
    { id: 'templates', label: '📧 Templates', icon: '📧' },
    { id: 'coaching', label: '🎯 Coaching', icon: '🎯' },
  ];

  return (
    <div className="w-full md:w-72 bg-gradient-to-b from-blue-950 via-purple-950 to-blue-950 border-r-2 border-cyan-400/30 flex flex-col h-screen overflow-y-auto" style={{boxShadow: '0 0 20px rgba(0, 255, 200, 0.1), inset 0 0 10px rgba(100, 0, 255, 0.05)'}}>
      {/* Header */}
      <div className="p-6 border-b-2 border-cyan-400/30" style={{background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.6), rgba(26, 21, 53, 0.6))', backdropFilter: 'blur(10px)'}}>
        <h1 className="text-2xl font-bold" style={{color: '#00ffc8', fontFamily: "'Orbitron', sans-serif", letterSpacing: '2px', textShadow: '0 0 15px rgba(0, 255, 200, 0.5)'}}>
          ⚡ ICKY
        </h1>
        <p className="text-sm mt-1" style={{color: '#00d9ff', letterSpacing: '1px', fontSize: '11px'}}>AI NEXUS • 2050</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full text-left px-4 py-3 font-medium transition-all rounded-sm border-l-4 ${
              activeTab === item.id
                ? 'text-cyan-300 border-cyan-400 bg-cyan-500/10'
                : 'text-cyan-200/70 border-purple-400/30 hover:border-cyan-400/60 hover:bg-purple-500/5 hover:text-cyan-300'
            }`}
            style={{
              boxShadow: activeTab === item.id ? '0 0 15px rgba(0, 255, 200, 0.2), inset 0 0 5px rgba(0, 255, 200, 0.1)' : 'none',
              fontFamily: "'Space Mono', monospace",
              letterSpacing: '0.5px'
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t-2 border-cyan-400/30" style={{background: 'linear-gradient(135deg, rgba(15, 52, 96, 0.4), rgba(26, 21, 53, 0.4))', backdropFilter: 'blur(10px)'}}>
        <div className="mb-4 p-3 rounded-sm border border-cyan-400/30" style={{background: 'rgba(0, 255, 200, 0.05)', backdropFilter: 'blur(10px)'}}>
          <p className="text-xs" style={{color: '#00d9ff', fontSize: '10px', letterSpacing: '0.5px', textTransform: 'uppercase'}}>LOGGED IN:</p>
          <p className="text-sm font-semibold truncate mt-1" style={{color: '#00ffc8', textShadow: '0 0 10px rgba(0, 255, 200, 0.3)'}}>{user?.email}</p>
        </div>
        <button
          onClick={() => setShowLogout(!showLogout)}
          className="w-full px-4 py-2 text-sm font-medium transition-all rounded-sm border border-cyan-400/30 hover:border-cyan-400/60"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 255, 200, 0.05), rgba(100, 0, 255, 0.05))',
            color: '#00d9ff',
            boxShadow: 'inset 0 0 10px rgba(0, 255, 200, 0.05)'
          }}
        >
          👤 Account
        </button>
        {showLogout && (
          <button
            onClick={handleLogout}
            className="w-full mt-2 px-4 py-2 text-sm font-medium transition-all rounded-sm border border-red-500/60 hover:border-red-400"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 0, 110, 0.15), rgba(255, 0, 110, 0.05))',
              color: '#ff0066',
              boxShadow: '0 0 10px rgba(255, 0, 110, 0.2)'
            }}
          >
            ⚠️ Sign Out
          </button>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import AICoach from './AICoach';

export default function Dashboard({ user }) {
  const [activeTab, setActiveTab] = useState('coaching');

  return (
    <div className="min-h-screen text-white bg-gradient-to-b from-gray-900 via-blue-900 to-black">
      <div className="flex gap-0">
        {/* Sidebar */}
        <div className="w-48 bg-gray-900/50 border-r border-cyan-500/20 p-4">
          <h2 className="text-cyan-400 font-bold mb-6">Menu</h2>
          <button
            onClick={() => setActiveTab('coaching')}
            className={`w-full text-left px-4 py-2 rounded mb-2 ${
              activeTab === 'coaching'
                ? 'bg-cyan-600 text-white'
                : 'text-gray-400 hover:text-cyan-400'
            }`}
          >
            🎯 Coaching
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {activeTab === 'coaching' && <AICoach accounts={[]} activities={[]} />}
        </div>
      </div>
    </div>
  );
}

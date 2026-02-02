'use client';

import { useState, useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabaseClient';
import Sidebar from './Sidebar';
import PipelineOverview from './PipelineOverview';
import AccountsForm from './AccountsForm';
import ActivitiesForm from './ActivitiesForm';
import FollowUpReminders from './FollowUpReminders';
import EmailTemplates from './EmailTemplates';
import CoachingTools from './CoachingTools';

export default function Dashboard({ user }) {
  const [activeTab, setActiveTab] = useState('pipeline');
  const [accounts, setAccounts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setLoading(false);
        return;
      }

      // Load accounts
      const { data: accountsData } = await supabase.from('accounts').select('*');
      setAccounts(accountsData || []);

      // Load activities
      const { data: activitiesData } = await supabase.from('activities').select('*');
      setActivities(activitiesData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'pipeline':
        return <PipelineOverview accounts={accounts} activities={activities} />;
      case 'accounts':
        return <AccountsForm accounts={accounts} onAccountAdded={loadData} />;
      case 'activities':
        return <ActivitiesForm accounts={accounts} onActivityAdded={loadData} />;
      case 'followups':
        return <FollowUpReminders accounts={accounts} activities={activities} />;
      case 'templates':
        return <EmailTemplates />;
      case 'coaching':
        return <CoachingTools accounts={accounts} activities={activities} />;
      default:
        return <PipelineOverview accounts={accounts} activities={activities} />;
    }
  };

  return (
    <div className="min-h-screen text-white" style={{
      background: 'linear-gradient(-45deg, #0a0e27, #1a1535, #16213e, #0f3460)',
      backgroundSize: '400% 400%',
      animation: 'nebula-shift 15s ease infinite'
    }}>
      <div className="flex gap-0">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />

        {/* Main Content */}
        <div className="flex-1 overflow-auto relative z-10">
          {/* Neon Header */}
          <div className="neon-header m-4 md:m-8 mb-6">
            <h1 className="neon-title">⚡ ICKY AI NEXUS ▸ Advanced Sales Intelligence System 2050 ◂</h1>
            <p className="neon-subtitle">Powered by Neural Sync | Real-time Intelligence Hub</p>
          </div>

          <div className="p-4 md:p-8 pt-0">
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400 mx-auto"></div>
                  <p className="mt-4" style={{color: '#00d9ff'}}>Loading your data...</p>
                </div>
              </div>
            ) : (
              renderContent()
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

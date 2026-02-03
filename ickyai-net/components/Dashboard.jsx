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
import AICoach from './AICoach';

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
      
      // Mock data for demo mode
      const mockAccounts = [
        { id: '1', account_name: 'Kranjska Gora Facility', contact_name: 'Marko Novak', email: 'marko@facility.si', phone: '+386 4 588 2600', status: 'WARM', deal_size: 15000, last_activity: '2025-02-01', next_action: 'Follow-up call' },
        { id: '2', account_name: 'Ljubljana Business Center', contact_name: 'Ana Horvat', email: 'ana@ljcenter.si', phone: '+386 1 200 3000', status: 'PROSPECT', deal_size: 25000, last_activity: '2025-01-30', next_action: 'Send proposal' },
        { id: '3', account_name: 'Maribor Industrial', contact_name: 'Jure Kokal', email: 'jure@maribor.si', phone: '+386 2 625 9999', status: 'ACTIVE', deal_size: 45000, last_activity: '2025-02-02', next_action: 'Negotiate contract' },
      ];

      const mockActivities = [
        { id: '1', account_name: 'Kranjska Gora Facility', activity_type: 'CALL', notes: 'Discussed cleaning equipment needs', duration_minutes: 30, outcome: 'Interested in demo', created_at: '2025-02-01' },
        { id: '2', account_name: 'Ljubljana Business Center', activity_type: 'EMAIL', notes: 'Sent initial proposal', duration_minutes: 5, outcome: 'Awaiting response', created_at: '2025-01-30' },
        { id: '3', account_name: 'Maribor Industrial', activity_type: 'VISIT', notes: 'On-site facility tour', duration_minutes: 120, outcome: 'Ready to sign', created_at: '2025-02-02' },
      ];

      if (!supabase) {
        setAccounts(mockAccounts);
        setActivities(mockActivities);
        setLoading(false);
        return;
      }

      // Load accounts
      const { data: accountsData } = await supabase.from('accounts').select('*');
      setAccounts(accountsData || mockAccounts);

      // Load activities
      const { data: activitiesData } = await supabase.from('activities').select('*');
      setActivities(activitiesData || mockActivities);
    } catch (error) {
      console.error('Error loading data:', error);
      // Use mock data on error
      setAccounts([
        { id: '1', account_name: 'Kranjska Gora Facility', contact_name: 'Marko Novak', email: 'marko@facility.si', phone: '+386 4 588 2600', status: 'WARM', deal_size: 15000, last_activity: '2025-02-01', next_action: 'Follow-up call' },
        { id: '2', account_name: 'Ljubljana Business Center', contact_name: 'Ana Horvat', email: 'ana@ljcenter.si', phone: '+386 1 200 3000', status: 'PROSPECT', deal_size: 25000, last_activity: '2025-01-30', next_action: 'Send proposal' },
      ]);
      setActivities([
        { id: '1', account_name: 'Kranjska Gora Facility', activity_type: 'CALL', notes: 'Discussed cleaning equipment needs', duration_minutes: 30, outcome: 'Interested in demo', created_at: '2025-02-01' },
      ]);
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
        return <AICoach accounts={accounts} activities={activities} />;
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
        <div className="flex-1 overflow-auto relative z-10 flex flex-col">
          {/* Neon Header - Hidden for Coaching */}
          {activeTab !== 'coaching' && (
            <div className="neon-header m-4 md:m-8 mb-6">
              <h1 className="neon-title">⚡ ICKY AI NEXUS ▸ Advanced Sales Intelligence System 2050 ◂</h1>
              <p className="neon-subtitle">Powered by Neural Sync | Real-time Intelligence Hub</p>
            </div>
          )}

          <div className={`${activeTab === 'coaching' ? 'flex-1 p-0 md:p-4' : 'p-4 md:p-8 pt-0'}`}>
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

'use client';

import { useMemo } from 'react';

export default function PipelineOverview({ accounts, activities }) {
  const stats = useMemo(() => {
    const statusGroups = {
      'NEW': 0,
      'QUALIFIED': 0,
      'DEMO': 0,
      'QUOTE SENT': 0,
      'AWAITING RESPONSE': 0,
      'NEGOTIATING': 0,
      'READY TO CLOSE': 0,
      'CLOSED': 0,
      'LOST': 0,
      'STALLED': 0,
      'ON HOLD': 0,
      'NO RESPONSE': 0,
    };

    let totalDealSize = 0;
    let closedDeals = 0;
    let closedValue = 0;

    accounts.forEach((account) => {
      if (statusGroups.hasOwnProperty(account.status || 'NEW')) {
        statusGroups[account.status] = (statusGroups[account.status] || 0) + 1;
      }
      totalDealSize += parseFloat(account.deal_size || 0);

      if (account.status === 'CLOSED') {
        closedDeals += 1;
        closedValue += parseFloat(account.deal_size || 0);
      }
    });

    const thisWeekActivities = activities.filter((activity) => {
      const actDate = new Date(activity.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return actDate >= weekAgo;
    });

    return {
      statusGroups,
      totalAccounts: accounts.length,
      totalDealSize,
      closedDeals,
      closedValue,
      thisWeekActivities: thisWeekActivities.length,
    };
  }, [accounts, activities]);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="neon-card">
          <div className="text-xs uppercase tracking-wider" style={{color: '#00d9ff', letterSpacing: '1px', fontWeight: 700}}>Total Accounts</div>
          <div className="text-4xl font-bold mt-3" style={{color: '#00ffc8', textShadow: '0 0 20px rgba(0, 255, 200, 0.5)', fontFamily: "'Orbitron', sans-serif"}}>{stats.totalAccounts}</div>
          <div className="text-xs mt-2" style={{color: '#00d9ff', fontSize: '11px', letterSpacing: '0.5px'}}>Active prospects in pipeline</div>
        </div>

        <div className="neon-card">
          <div className="text-xs uppercase tracking-wider" style={{color: '#00d9ff', letterSpacing: '1px', fontWeight: 700}}>Pipeline Value</div>
          <div className="text-4xl font-bold mt-3" style={{color: '#00ffc8', textShadow: '0 0 20px rgba(0, 255, 200, 0.5)', fontFamily: "'Orbitron', sans-serif"}}>€{stats.totalDealSize.toLocaleString()}</div>
          <div className="text-xs mt-2" style={{color: '#00d9ff', fontSize: '11px', letterSpacing: '0.5px'}}>Total opportunity value</div>
        </div>

        <div className="neon-card">
          <div className="text-xs uppercase tracking-wider" style={{color: '#00d9ff', letterSpacing: '1px', fontWeight: 700}}>Closed Deals</div>
          <div className="text-4xl font-bold mt-3" style={{color: '#00ffc8', textShadow: '0 0 20px rgba(0, 255, 200, 0.5)', fontFamily: "'Orbitron', sans-serif"}}>{stats.closedDeals}</div>
          <div className="text-xs mt-2" style={{color: '#00d9ff', fontSize: '11px', letterSpacing: '0.5px'}}>€{stats.closedValue.toLocaleString()}</div>
        </div>

        <div className="neon-card">
          <div className="text-xs uppercase tracking-wider" style={{color: '#00d9ff', letterSpacing: '1px', fontWeight: 700}}>This Week Activity</div>
          <div className="text-4xl font-bold mt-3" style={{color: '#00ffc8', textShadow: '0 0 20px rgba(0, 255, 200, 0.5)', fontFamily: "'Orbitron', sans-serif"}}>{stats.thisWeekActivities}</div>
          <div className="text-xs mt-2" style={{color: '#00d9ff', fontSize: '11px', letterSpacing: '0.5px'}}>Calls, emails, visits</div>
        </div>
      </div>

      {/* Pipeline by Status */}
      <div className="neon-card">
        <h3 className="text-xl font-bold mb-4" style={{color: '#00ffc8', fontFamily: "'Orbitron', sans-serif"}}>📈 Pipeline by Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(stats.statusGroups).map(([status, count]) => (
            count > 0 && (
              <div key={status} className="p-3 border border-cyan-400/30 rounded-sm" style={{
                background: 'linear-gradient(135deg, rgba(0, 255, 200, 0.05), rgba(100, 0, 255, 0.05))',
                backdropFilter: 'blur(10px)'
              }}>
                <div className="text-xs truncate" style={{color: '#00d9ff', letterSpacing: '0.5px'}}>{status}</div>
                <div className="text-2xl font-bold mt-1" style={{color: '#00ffc8', textShadow: '0 0 10px rgba(0, 255, 200, 0.5)', fontFamily: "'Orbitron', sans-serif"}}>{count}</div>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Recent Accounts */}
      <div className="neon-card">
        <h3 className="text-xl font-bold mb-4" style={{color: '#00ffc8', fontFamily: "'Orbitron', sans-serif"}}>📋 Recent Accounts</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cyan-400/30">
                <th className="text-left py-3 font-semibold" style={{color: '#00d9ff', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase'}}>Account</th>
                <th className="text-left py-3 font-semibold" style={{color: '#00d9ff', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase'}}>Contact</th>
                <th className="text-left py-3 font-semibold" style={{color: '#00d9ff', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase'}}>Status</th>
                <th className="text-right py-3 font-semibold" style={{color: '#00d9ff', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase'}}>Deal Size</th>
              </tr>
            </thead>
            <tbody>
              {accounts.slice(0, 10).map((account, idx) => (
                <tr key={idx} className="border-b border-cyan-400/20 hover:bg-cyan-500/5 transition-colors">
                  <td className="py-3 font-medium" style={{color: '#00ffc8'}}>{account.account_name}</td>
                  <td className="py-3" style={{color: '#00d9ff'}}>{account.contact_name || '-'}</td>
                  <td className="py-3">
                    <span className="inline-block px-2 py-1 rounded-sm text-xs font-semibold border border-cyan-400/40" style={{
                      background: 'rgba(0, 255, 200, 0.1)',
                      color: '#00ffc8'
                    }}>
                      {account.status || 'NEW'}
                    </span>
                  </td>
                  <td className="py-3 text-right" style={{color: '#00d9ff'}}>€{parseFloat(account.deal_size || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

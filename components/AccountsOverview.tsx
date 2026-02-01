'use client';

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

interface AccountsOverviewProps {
  accounts: Account[];
  activities: Activity[];
}

export default function AccountsOverview({ accounts, activities }: AccountsOverviewProps) {
  const getAccountActivities = (accountId: number) => {
    return activities.filter(a => a.account_id === accountId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white mb-8">📋 Accounts Overview</h2>

      {accounts.length === 0 ? (
        <div className="bg-gray-800 p-12 rounded-xl shadow-lg text-center border border-gray-700">
          <p className="text-gray-400 text-lg">No accounts yet. Add your first account to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {accounts.map(account => {
            const accountActivities = getAccountActivities(account.id);
            return (
              <div key={account.id} className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 hover:border-blue-500 transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{account.name}</h3>
                    <p className="text-gray-400 text-sm">Contact: {account.contact || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-green-400">${account.deal_size.toLocaleString()}</p>
                    <span className={'px-3 py-1 rounded-full border text-sm font-medium capitalize inline-block mt-2 ' +
                      (account.status === 'qualified' ? 'bg-yellow-900 text-yellow-300 border-yellow-700' :
                       account.status === 'active' ? 'bg-green-900 text-green-300 border-green-700' :
                       account.status === 'negotiation' ? 'bg-orange-900 text-orange-300 border-orange-700' :
                       account.status === 'closed' ? 'bg-gray-700 text-gray-300 border-gray-600' :
                       'bg-blue-900 text-blue-300 border-blue-700')}>
                      {account.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-700">
                  <div>
                    <p className="text-gray-500 text-sm">Phone</p>
                    <p className="text-white font-medium">{account.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Email</p>
                    <p className="text-white font-medium truncate">{account.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Last Activity</p>
                    <p className="text-white font-medium">{account.last_activity ? new Date(account.last_activity).toLocaleDateString() : 'Never'}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-lg text-white mb-4">💬 Conversation History ({accountActivities.length})</h4>
                  {accountActivities.length === 0 ? (
                    <p className="text-gray-400 text-sm">No activities yet</p>
                  ) : (
                    <div className="space-y-3">
                      {accountActivities.slice(0, 5).map(activity => (
                        <div key={activity.id} className="bg-gray-700 p-4 rounded-lg border-l-4 border-blue-500">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold text-white text-sm">
                                {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} with {activity.contact}
                              </p>
                              <p className="text-xs text-gray-400">{new Date(activity.date).toLocaleString()}</p>
                            </div>
                            <span className={'px-2 py-1 rounded text-xs font-medium ' +
                              (activity.outcome === 'interested' ? 'bg-green-900 text-green-300' :
                               activity.outcome === 'need_follow_up' ? 'bg-yellow-900 text-yellow-300' :
                               activity.outcome === 'not_interested' ? 'bg-red-900 text-red-300' :
                               'bg-gray-600 text-gray-300')}>
                              {activity.outcome}
                            </span>
                          </div>
                          {activity.notes && <p className="text-gray-300 text-sm">{activity.notes}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

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

interface AccountsListProps {
  accounts: Account[];
}

const statusColors: Record<string, string> = {
  prospect: 'bg-blue-900 text-blue-300 border-blue-700',
  qualified: 'bg-yellow-900 text-yellow-300 border-yellow-700',
  negotiation: 'bg-orange-900 text-orange-300 border-orange-700',
  active: 'bg-green-900 text-green-300 border-green-700',
  closed: 'bg-gray-700 text-gray-300 border-gray-600'
};

export default function AccountsList({ accounts }: AccountsListProps) {
  const groupedByStatus = accounts.reduce((acc, account) => {
    const status = account.status || 'prospect';
    if (!acc[status]) acc[status] = [];
    acc[status].push(account);
    return acc;
  }, {} as Record<string, Account[]>);

  const statusOrder = ['prospect', 'qualified', 'negotiation', 'active', 'closed'];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white mb-8">📊 Pipeline View</h2>

      {statusOrder.map(status => {
        const statusAccounts = groupedByStatus[status] || [];
        if (statusAccounts.length === 0) return null;

        return (
          <div key={status} className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition">
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4 border-b border-gray-700">
              <h3 className="font-bold text-lg capitalize text-white">
                {status} ({statusAccounts.length})
              </h3>
              <p className="text-sm text-gray-400">
                Total value: ${statusAccounts.reduce((sum, a) => sum + (a.deal_size || 0), 0).toLocaleString()}
              </p>
            </div>

            <div className="divide-y divide-gray-700">
              {statusAccounts.map(account => (
                <div key={account.id} className="p-5 hover:bg-gray-700 transition">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-bold text-white text-lg">{account.name}</h4>
                      <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-gray-400 mt-2">
                        {account.contact && <p>👤 {account.contact}</p>}
                        {account.phone && <p>📱 {account.phone}</p>}
                        {account.email && <p>📧 {account.email}</p>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={'px-3 py-1 rounded-full border text-sm font-medium capitalize ' + (statusColors[account.status] || 'bg-gray-700')}>
                        {account.status}
                      </span>
                      <p className="font-bold text-lg text-green-400">
                        ${(account.deal_size || 0).toLocaleString()}
                      </p>
                      {account.last_activity && (
                        <p className="text-xs text-gray-500">
                          Last activity: {new Date(account.last_activity).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {accounts.length === 0 && (
        <div className="bg-gray-800 p-12 rounded-xl shadow-lg text-center border border-gray-700">
          <p className="text-gray-400 text-lg">No accounts yet. Add your first account to get started!</p>
        </div>
      )}
    </div>
  );
}

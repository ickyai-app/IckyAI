'use client';

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

interface Account {
  id: number;
  name: string;
}

interface ActivityLogProps {
  activities: Activity[];
  accounts: Account[];
}

const typeIcons: Record<string, string> = {
  call: '☎️',
  email: '📧',
  meeting: '👥',
  follow_up: '🔄'
};

const outcomeColors: Record<string, string> = {
  interested: 'bg-green-900 text-green-300',
  not_interested: 'bg-red-900 text-red-300',
  need_follow_up: 'bg-yellow-900 text-yellow-300',
  closed_won: 'bg-green-800 text-green-200'
};

export default function ActivityLog({ activities, accounts }: ActivityLogProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold text-white mb-6">📝 Activity Log</h2>

      {activities.length === 0 ? (
        <div className="bg-gray-800 p-12 rounded-xl shadow-lg text-center border border-gray-700">
          <p className="text-gray-400 text-lg">No activities logged yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map(activity => (
            <div key={activity.id} className="bg-gray-800 p-5 rounded-lg shadow-md hover:shadow-lg transition border border-gray-700 hover:border-blue-500">
              <div className="flex gap-4">
                <div className="text-3xl flex-shrink-0">
                  {typeIcons[activity.type] || '📝'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <p className="font-bold text-white">
                        {activity.account_name}
                      </p>
                      <p className="text-sm text-gray-400">
                        Type: <span className="capitalize text-gray-300">{activity.type}</span>
                        {activity.contact && ` • ${activity.contact}`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {activity.outcome && (
                        <span className={'px-2 py-1 rounded text-xs font-medium capitalize whitespace-nowrap ' + (outcomeColors[activity.outcome] || 'bg-gray-700')}>
                          {activity.outcome}
                        </span>
                      )}
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {new Date(activity.date).toLocaleDateString()} {new Date(activity.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  </div>
                  {activity.notes && (
                    <p className="text-sm text-gray-300 mt-3 line-clamp-2">
                      {activity.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

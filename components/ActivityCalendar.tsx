'use client';

import { useState } from 'react';

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

interface ActivityCalendarProps {
  activities: Activity[];
}

export default function ActivityCalendar({ activities }: ActivityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getActivitiesForDate = (date: Date) => {
    return activities.filter(activity => {
      const actDate = new Date(activity.date);
      return actDate.getDate() === date.getDate() &&
             actDate.getMonth() === date.getMonth() &&
             actDate.getFullYear() === date.getFullYear();
    });
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
  }

  const typeIcons: Record<string, string> = {
    call: '☎️',
    email: '📧',
    meeting: '👥',
    follow_up: '🔄'
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const today = new Date();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">📅 Activity Calendar</h2>
        <div className="flex gap-2">
          <button onClick={() => setViewMode('month')} className={viewMode === 'month' ? 'px-4 py-2 bg-blue-600 text-white rounded-lg' : 'px-4 py-2 bg-gray-700 text-gray-300 rounded-lg'}>Month</button>
          <button onClick={() => setViewMode('week')} className={viewMode === 'week' ? 'px-4 py-2 bg-blue-600 text-white rounded-lg' : 'px-4 py-2 bg-gray-700 text-gray-300 rounded-lg'}>Week</button>
        </div>
      </div>

      {viewMode === 'month' && (
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <button onClick={prevMonth} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">← Prev</button>
            <h3 className="text-2xl font-bold text-white">{monthName}</h3>
            <button onClick={nextMonth} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Next →</button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-gray-400 font-bold text-sm py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((date, idx) => {
              const dateActivities = date ? getActivitiesForDate(date) : [];
              const isToday = date && date.toDateString() === today.toDateString();
              const isCurrentMonth = date && date.getMonth() === currentDate.getMonth();

              return (
                <div
                  key={idx}
                  className={`min-h-24 p-2 rounded-lg border ${
                    !date ? 'bg-gray-900' :
                    isToday ? 'border-blue-500 bg-blue-900' :
                    isCurrentMonth ? 'border-gray-600 bg-gray-700' :
                    'border-gray-700 bg-gray-800 opacity-50'
                  }`}
                >
                  {date && (
                    <>
                      <p className={`text-sm font-bold mb-1 ${isToday ? 'text-blue-200' : isCurrentMonth ? 'text-white' : 'text-gray-400'}`}>
                        {date.getDate()}
                      </p>
                      <div className="space-y-1">
                        {dateActivities.map(activity => (
                          <div key={activity.id} className="text-xs bg-blue-600 text-white px-2 py-1 rounded truncate hover:bg-blue-500">
                            {typeIcons[activity.type] || '📝'} {activity.account_name.split(' ')[0]}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === 'week' && (
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
          <p className="text-gray-400 text-center py-12">Week view coming soon! This will show your activities broken down by day of the week.</p>
        </div>
      )}

      {/* Activity Summary */}
      <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
        <h3 className="text-xl font-bold text-white mb-4">📊 This Month's Activity</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Total Activities</p>
            <p className="text-3xl font-bold text-blue-400">{activities.filter(a => {
              const aDate = new Date(a.date);
              return aDate.getMonth() === currentDate.getMonth();
            }).length}</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Calls</p>
            <p className="text-3xl font-bold text-blue-400">{activities.filter(a => a.type === 'call' && new Date(a.date).getMonth() === currentDate.getMonth()).length}</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Emails</p>
            <p className="text-3xl font-bold text-green-400">{activities.filter(a => a.type === 'email' && new Date(a.date).getMonth() === currentDate.getMonth()).length}</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Meetings</p>
            <p className="text-3xl font-bold text-purple-400">{activities.filter(a => a.type === 'meeting' && new Date(a.date).getMonth() === currentDate.getMonth()).length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

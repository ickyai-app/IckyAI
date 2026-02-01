'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';

interface Activity {
  id: number;
  account_id: number;
  account_name: string;
  type: string;
  contact: string;
  notes: string;
  date: string;
  start_time?: string;
  end_time?: string;
  outcome: string;
}

interface Account {
  id: number;
  name: string;
}

interface ActivityCalendarProps {
  activities: Activity[];
  accounts: Account[];
  onActivityAdded?: () => void;
}

export default function ActivityCalendar({ activities, accounts, onActivityAdded }: ActivityCalendarProps) {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('14:00');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [formData, setFormData] = useState({
    account_id: '',
    type: 'call',
    contact: '',
    notes: '',
    duration: '',
    outcome: 'interested',
    start_time: '14:00',
    end_time: '15:00',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const getCurrentTimePercentage = () => {
    const hours = currentTime.getHours();
    const mins = currentTime.getMinutes();
    const totalMins = hours * 60 + mins - 8 * 60;
    return (totalMins / (16 * 60)) * 100;
  };

  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

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

  const getActivitiesForDateAndTime = (date: Date) => {
    return getActivitiesForDate(date).sort((a, b) => {
      const timeA = a.start_time || '00:00';
      const timeB = b.start_time || '00:00';
      return timeA.localeCompare(timeB);
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuickAdd = (date: Date, time?: string) => {
    setSelectedDate(date);
    const timeToUse = time || '14:00';
    const [hour, min] = timeToUse.split(':');
    const endHour = (parseInt(hour) + 1).toString().padStart(2, '0');
    
    setFormData({
      account_id: '',
      type: 'call',
      contact: '',
      notes: '',
      duration: '60',
      outcome: 'interested',
      start_time: timeToUse,
      end_time: `${endHour}:${min}`,
    });
    setShowForm(true);
    setMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.account_id || !selectedDate) return;

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id.toString()
        },
        body: JSON.stringify({
          ...formData,
          account_id: parseInt(formData.account_id),
          duration: formData.duration ? parseInt(formData.duration) : 0,
          date: selectedDate.toISOString(),
          start_time: formData.start_time,
          end_time: formData.end_time,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add activity');
      }

      setMessage('✅ Activity added successfully!');
      setTimeout(() => {
        setShowForm(false);
        onActivityAdded?.(); // Refresh data in all views
      }, 1000);
      
      setFormData({
        account_id: '',
        type: 'call',
        contact: '',
        notes: '',
        duration: '60',
        outcome: 'interested',
        start_time: '14:00',
        end_time: '15:00',
      });
    } catch (error) {
      setMessage(`❌ Error adding activity`);
    } finally {
      setIsLoading(false);
    }
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

  const prevDay = () => {
    setCurrentDate(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000));
  };

  const nextDay = () => {
    setCurrentDate(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000));
  };

  const prevWeek = () => {
    setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000));
  };

  const nextWeek = () => {
    setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
  };

  const today = new Date();
  const isToday = currentDate.toDateString() === today.toDateString();
  const hours = Array.from({ length: 16 }, (_, i) => i + 8);

  // Week view dates
  const weekStart = getWeekStart(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => new Date(weekStart.getTime() + i * 24 * 60 * 60 * 1000));
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">📅 Activity Calendar</h2>
        <div className="flex gap-2">
          <button onClick={() => setViewMode('month')} className={viewMode === 'month' ? 'px-4 py-2 bg-blue-600 text-white rounded-lg' : 'px-4 py-2 bg-gray-700 text-gray-300 rounded-lg'}>Month</button>
          <button onClick={() => setViewMode('week')} className={viewMode === 'week' ? 'px-4 py-2 bg-blue-600 text-white rounded-lg' : 'px-4 py-2 bg-gray-700 text-gray-300 rounded-lg'}>Week</button>
          <button onClick={() => setViewMode('day')} className={viewMode === 'day' ? 'px-4 py-2 bg-blue-600 text-white rounded-lg' : 'px-4 py-2 bg-gray-700 text-gray-300 rounded-lg'}>Day</button>
        </div>
      </div>

      {showForm && (
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 mb-6 sticky top-20 z-50">
          <h3 className="text-xl font-bold text-white mb-4">
            ➕ Add Activity for {selectedDate?.toLocaleDateString()} at {formData.start_time}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Account *</label>
                <select
                  name="account_id"
                  value={formData.account_id}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select an account</option>
                  {accounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Activity Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="call">☎️ Call</option>
                  <option value="email">📧 Email</option>
                  <option value="meeting">👥 Meeting</option>
                  <option value="follow_up">🔄 Follow-up</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Contact/Person</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="John Smith"
                className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="What will you discuss?"
                rows={2}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Start Time *</label>
                <input
                  type="time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">End Time *</label>
                <input
                  type="time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Duration (min)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="60"
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Outcome</label>
                <select
                  name="outcome"
                  value={formData.outcome}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="interested">Interested</option>
                  <option value="not_interested">Not Interested</option>
                  <option value="need_follow_up">Need Follow-up</option>
                  <option value="closed_won">Closed Won</option>
                </select>
              </div>
            </div>

            {message && (
              <div className={message.startsWith('✅') ? 'p-3 rounded text-sm border bg-green-900 text-green-300 border-green-700' : 'p-3 rounded text-sm border bg-red-900 text-red-300 border-red-700'}>
                {message}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                {isLoading ? '⏳ Adding...' : '✅ Add Activity'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-2 px-4 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

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
              const dateActivities = date ? getActivitiesForDateAndTime(date) : [];
              const isToday = date && date.toDateString() === today.toDateString();
              const isCurrentMonth = date && date.getMonth() === currentDate.getMonth();

              return (
                <div
                  key={idx}
                  className={`min-h-32 p-2 rounded-lg border cursor-pointer transition hover:border-blue-400 ${
                    !date ? 'bg-gray-900' :
                    isToday ? 'border-blue-500 bg-blue-900' :
                    isCurrentMonth ? 'border-gray-600 bg-gray-700 hover:bg-gray-650' :
                    'border-gray-700 bg-gray-800 opacity-50'
                  }`}
                  onClick={() => date && handleQuickAdd(date)}
                >
                  {date && (
                    <>
                      <p className={`text-sm font-bold mb-1 ${isToday ? 'text-blue-200' : isCurrentMonth ? 'text-white' : 'text-gray-400'}`}>
                        {date.getDate()}
                      </p>
                      <div className="space-y-1 mb-2 text-xs">
                        {dateActivities.map(activity => (
                          <div key={activity.id} className="bg-blue-600 text-white px-1.5 py-0.5 rounded truncate hover:bg-blue-500">
                            {typeIcons[activity.type] || '📝'} {activity.start_time || ''}
                          </div>
                        ))}
                      </div>
                      <button
                        className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-0.5 rounded w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickAdd(date);
                        }}
                      >
                        + Add
                      </button>
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
          <div className="flex justify-between items-center mb-6">
            <button onClick={prevWeek} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">← Prev Week</button>
            <h3 className="text-2xl font-bold text-white">
              {weekStart.toLocaleDateString('default', { month: 'short', day: 'numeric' })} - {new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('default', { month: 'short', day: 'numeric' })}
            </h3>
            <button onClick={nextWeek} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Next Week →</button>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-full bg-gray-900 rounded-lg">
              {/* Day headers */}
              <div className="grid gap-0" style={{ gridTemplateColumns: '80px repeat(7, 1fr)' }}>
                <div className="bg-gray-900 p-2"></div>
                {weekDays.map((day, idx) => {
                  const isCurrentDay = day.toDateString() === today.toDateString();
                  return (
                    <div key={idx} className={`p-3 text-center border-b-2 ${isCurrentDay ? 'border-red-500 bg-red-900' : 'border-gray-600 bg-gray-700'}`}>
                      <p className={`font-bold ${isCurrentDay ? 'text-red-300' : 'text-white'}`}>{dayNames[day.getDay()]}</p>
                      <p className={`text-sm ${isCurrentDay ? 'text-red-200' : 'text-gray-300'}`}>{day.getDate()}</p>
                    </div>
                  );
                })}
              </div>

              {/* Hours and time slots */}
              <div className="relative">
                {hours.map(hour => (
                  <div key={`hour-${hour}`} className="grid gap-0" style={{ gridTemplateColumns: '80px repeat(7, 1fr)' }}>
                    <div className="bg-gray-900 p-2 border-b border-gray-700 text-gray-400 text-xs font-bold sticky left-0 z-10">
                      {String(hour).padStart(2, '0')}:00
                    </div>

                    {weekDays.map((day, dayIdx) => {
                      const dayActivities = getActivitiesForDateAndTime(day).filter(a => {
                        const aHour = parseInt(a.start_time?.split(':')[0] || '0');
                        return aHour === hour;
                      });

                      return (
                        <div
                          key={`${hour}-${dayIdx}`}
                          className="relative min-h-20 border-b border-r border-gray-700 bg-gray-750 hover:bg-gray-700 transition cursor-pointer"
                          onClick={() => handleQuickAdd(day, `${String(hour).padStart(2, '0')}:00`)}
                        >
                          {/* Current time indicator */}
                          {day.toDateString() === today.toDateString() && hour === today.getHours() && (
                            <div className="absolute top-0 left-0 right-0 h-1 bg-red-600 z-20"></div>
                          )}

                          {/* Activities for this hour */}
                          <div className="p-1 space-y-1">
                            {dayActivities.map(activity => (
                              <div
                                key={activity.id}
                                className="bg-gradient-to-r from-blue-600 to-blue-500 border border-blue-400 p-1 rounded text-xs text-white font-semibold truncate hover:shadow-lg transition"
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                {activity.start_time} {activity.account_name}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'day' && (
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <button onClick={prevDay} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">← Prev Day</button>
            <h3 className="text-2xl font-bold text-white">{currentDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })} {isToday && <span className="text-red-400 ml-2">● NOW</span>}</h3>
            <button onClick={nextDay} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Next Day →</button>
          </div>

          <button
            onClick={() => handleQuickAdd(currentDate)}
            className="mb-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg w-full"
          >
            + Add Activity for Today
          </button>

          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <div className="relative space-y-12">
              {hours.map(hour => (
                <div
                  key={hour}
                  className="relative cursor-pointer hover:bg-gray-800 rounded transition p-2 -m-2"
                  onClick={() => handleQuickAdd(currentDate, `${String(hour).padStart(2, '0')}:00`)}
                >
                  <div className="flex items-start">
                    <div className="w-12 text-gray-400 text-sm font-semibold">{String(hour).padStart(2, '0')}:00</div>
                    <div className="flex-1 ml-4 border-t border-gray-700"></div>
                  </div>

                  {/* Activities at this hour */}
                  <div className="ml-16 mt-1 space-y-1">
                    {getActivitiesForDateAndTime(currentDate)
                      .filter(a => parseInt(a.start_time?.split(':')[0] || '0') === hour)
                      .map(activity => (
                        <div
                          key={activity.id}
                          className="bg-gradient-to-r from-blue-600 to-blue-500 border-2 border-blue-400 p-3 rounded-lg shadow-lg hover:shadow-xl transition"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="text-xs text-white font-bold">{activity.start_time} - {activity.end_time}</div>
                          <div className="text-xs text-blue-100 font-semibold">{activity.account_name}</div>
                          <div className="text-xs text-blue-200">{activity.type}</div>
                          {activity.notes && <div className="text-xs text-blue-200 mt-1">{activity.notes}</div>}
                        </div>
                      ))}
                  </div>
                </div>
              ))}

              {/* Current time indicator for today */}
              {isToday && (
                <div
                  className="absolute top-0 left-0 w-full h-1 bg-red-600 shadow-lg z-20"
                  style={{
                    top: `${getCurrentTimePercentage()}%`
                  }}
                >
                  <div className="flex items-center ml-4 -mt-2">
                    <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                      NOW: {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {getActivitiesForDateAndTime(currentDate).length === 0 && (
            <p className="text-gray-400 text-center py-12">No activities scheduled for this day</p>
          )}
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

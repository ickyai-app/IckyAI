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
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
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
    setEditingActivity(null);
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

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setSelectedDate(new Date(activity.date));
    setFormData({
      account_id: activity.account_id.toString(),
      type: activity.type,
      contact: activity.contact,
      notes: activity.notes,
      duration: '60',
      outcome: activity.outcome,
      start_time: activity.start_time || '14:00',
      end_time: activity.end_time || '15:00',
    });
    setShowForm(true);
    setMessage('');
  };

  const handleDeleteActivity = async (activityId: number) => {
    if (!user) return;
    if (!confirm('Are you sure you want to delete this activity?')) return;

    try {
      const response = await fetch(`/api/activities?id=${activityId}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': user.id.toString()
        }
      });

      if (!response.ok) throw new Error('Failed to delete');

      onActivityAdded?.();
      setMessage('✅ Activity deleted!');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage('❌ Error deleting activity');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.account_id || !selectedDate) return;

    setIsLoading(true);
    setMessage('');

    try {
      const method = editingActivity ? 'PUT' : 'POST';
      const endpoint = editingActivity ? '/api/activities' : '/api/activities';
      
      const body: any = {
        ...formData,
        account_id: parseInt(formData.account_id),
        duration: formData.duration ? parseInt(formData.duration) : 0,
        date: selectedDate.toISOString(),
        start_time: formData.start_time,
        end_time: formData.end_time,
      };

      if (editingActivity) {
        body.id = editingActivity.id;
      }

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id.toString()
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editingActivity ? 'update' : 'add'} activity`);
      }

      setMessage(`✅ Activity ${editingActivity ? 'updated' : 'added'} successfully!`);
      setTimeout(() => {
        setShowForm(false);
        setEditingActivity(null);
        onActivityAdded?.();
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
      setMessage(`❌ Error ${editingActivity ? 'updating' : 'adding'} activity`);
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
    <div className="space-y-8 p-2">
      <div className="flex justify-between items-center mb-8 px-2">
        <h2 className="heading-secondary text-4xl">📅 Activity Calendar</h2>
        <div className="flex gap-4 bg-gradient-to-r from-gray-900/50 to-gray-800/30 p-2 rounded-xl border border-cyan-500/20">
          <button 
            onClick={() => setViewMode('month')} 
            className={`px-6 py-3 font-bold rounded-lg transition-all duration-300 ${
              viewMode === 'month' 
                ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-gray-900 shadow-lg shadow-cyan-500/50' 
                : 'text-gray-300 hover:text-cyan-300 hover:bg-gray-700/50'
            }`}
          >
            Month
          </button>
          <button 
            onClick={() => setViewMode('week')} 
            className={`px-6 py-3 font-bold rounded-lg transition-all duration-300 ${
              viewMode === 'week' 
                ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-gray-900 shadow-lg shadow-cyan-500/50' 
                : 'text-gray-300 hover:text-cyan-300 hover:bg-gray-700/50'
            }`}
          >
            Week
          </button>
          <button 
            onClick={() => setViewMode('day')} 
            className={`px-6 py-3 font-bold rounded-lg transition-all duration-300 ${
              viewMode === 'day' 
                ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-gray-900 shadow-lg shadow-cyan-500/50' 
                : 'text-gray-300 hover:text-cyan-300 hover:bg-gray-700/50'
            }`}
          >
            Day
          </button>
        </div>
      </div>

      {showForm && (
        <div className="futuristic-card p-8 mb-8 sticky top-20 z-50 border border-cyan-500/30 bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="heading-tertiary text-2xl mb-2">
                {editingActivity ? '✏️ Edit Activity' : '➕ Add Activity'}
              </h3>
              <p className="text-cyan-400/70 text-sm">{selectedDate?.toLocaleDateString()} at {formData.start_time}</p>
            </div>
            {editingActivity && (
              <button
                type="button"
                onClick={() => handleDeleteActivity(editingActivity.id)}
                className="btn-neon-purple px-6 py-3 text-sm bg-gradient-to-r from-red-600 to-red-500 shadow-lg shadow-red-500/40 hover:shadow-red-500/70"
              >
                🗑️ Delete Activity
              </button>
            )}
          </div>
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

            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 text-lg border border-cyan-400 shadow-lg hover:shadow-2xl"
                style={{
                  boxShadow: '0 0 20px rgba(0, 188, 212, 0.4), inset 0 0 10px rgba(0, 188, 212, 0.2)'
                }}
              >
                {isLoading ? '⏳ Saving...' : editingActivity ? '✅ Update Activity' : '✅ Add Activity'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingActivity(null);
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 text-lg border border-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {viewMode === 'month' && (
        <div className="futuristic-card p-8 border border-cyan-500/30">
          <div className="flex justify-between items-center mb-8">
            <button 
              onClick={prevMonth} 
              className="btn-neon-purple px-6 py-3 text-base font-bold transition-all"
            >
              ← Previous Month
            </button>
            <h3 className="heading-secondary text-3xl">{monthName}</h3>
            <button 
              onClick={nextMonth} 
              className="btn-neon-purple px-6 py-3 text-base font-bold transition-all"
            >
              Next Month →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-3 mb-6">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-cyan-300 font-bold text-base py-4 px-2 rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-4">
            {days.map((date, idx) => {
              const dateActivities = date ? getActivitiesForDateAndTime(date) : [];
              const isToday = date && date.toDateString() === today.toDateString();
              const isCurrentMonth = date && date.getMonth() === currentDate.getMonth();

              return (
                <div
                  key={idx}
                  className={`min-h-40 p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                    !date ? 'bg-transparent' :
                    isToday ? 'border-cyan-400 bg-gradient-to-br from-cyan-600/20 to-purple-600/10 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50' :
                    isCurrentMonth ? 'border-cyan-500/20 bg-gradient-to-br from-gray-800/60 to-gray-900/40 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20' :
                    'border-gray-700/30 bg-gray-900/30 opacity-40'
                  }`}
                  onClick={() => date && handleQuickAdd(date)}
                >
                  {date && (
                    <>
                      <p className={`text-base font-bold mb-3 ${isToday ? 'text-cyan-200' : isCurrentMonth ? 'text-white' : 'text-gray-400'}`}>
                        {date.getDate()}
                      </p>
                      <div className="space-y-2 mb-3 text-xs">
                        {dateActivities.map(activity => (
                          <div
                            key={activity.id}
                            className="bg-gradient-to-r from-cyan-600 to-cyan-500 text-white px-2 py-1.5 rounded-lg truncate hover:from-cyan-500 hover:to-cyan-400 cursor-pointer transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 font-bold"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditActivity(activity);
                            }}
                            title="Click to edit"
                          >
                            {typeIcons[activity.type] || '📝'} {activity.start_time || ''}
                          </div>
                        ))}
                      </div>
                      <button
                        className="text-sm bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-3 py-2 rounded-lg w-full font-bold transition-all shadow-lg shadow-green-500/20 hover:shadow-green-500/40"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickAdd(date);
                        }}
                      >
                        + Add Activity
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
        <div className="futuristic-card p-8 border border-cyan-500/30">
          <div className="flex justify-between items-center mb-8">
            <button 
              onClick={prevWeek} 
              className="btn-neon-purple px-6 py-3 text-base font-bold transition-all"
            >
              ← Previous Week
            </button>
            <h3 className="heading-secondary text-3xl">
              {weekStart.toLocaleDateString('default', { month: 'short', day: 'numeric' })} - {new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('default', { month: 'short', day: 'numeric' })}
            </h3>
            <button 
              onClick={nextWeek} 
              className="btn-neon-purple px-6 py-3 text-base font-bold transition-all"
            >
              Next Week →
            </button>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-full bg-gradient-to-b from-gray-900 to-gray-800/50 rounded-lg border border-cyan-500/20">
              {/* Day headers */}
              <div className="grid gap-0" style={{ gridTemplateColumns: '90px repeat(7, 1fr)' }}>
                <div className="bg-gradient-to-r from-gray-900 to-gray-800/50 p-4"></div>
                {weekDays.map((day, idx) => {
                  const isCurrentDay = day.toDateString() === today.toDateString();
                  return (
                    <div key={idx} className={`p-4 text-center border-b-2 ${isCurrentDay ? 'border-cyan-400 bg-gradient-to-b from-cyan-600/20 to-cyan-500/10' : 'border-cyan-500/20 bg-gradient-to-b from-gray-800/80 to-gray-900/50'}`}>
                      <p className={`font-bold text-base ${isCurrentDay ? 'text-cyan-300' : 'text-cyan-200'}`}>{dayNames[day.getDay()]}</p>
                      <p className={`text-sm font-semibold mt-1 ${isCurrentDay ? 'text-cyan-200' : 'text-gray-400'}`}>{day.getDate()}</p>
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
                                className="bg-gradient-to-r from-blue-600 to-blue-500 border border-blue-400 p-1 rounded text-xs text-white font-semibold truncate hover:shadow-lg transition cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditActivity(activity);
                                }}
                                title="Click to edit"
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
        <div className="futuristic-card p-8 border border-cyan-500/30">
          <div className="flex justify-between items-center mb-8">
            <button 
              onClick={prevDay} 
              className="btn-neon-purple px-6 py-3 text-base font-bold transition-all"
            >
              ← Previous Day
            </button>
            <div className="text-center">
              <h3 className="heading-secondary text-3xl mb-2">{currentDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
              {isToday && <span className="inline-block bg-gradient-to-r from-red-600 to-pink-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-red-500/40">● LIVE TODAY</span>}
            </div>
            <button 
              onClick={nextDay} 
              className="btn-neon-purple px-6 py-3 text-base font-bold transition-all"
            >
              Next Day →
            </button>
          </div>

          <button
            onClick={() => handleQuickAdd(currentDate)}
            className="mb-8 w-full btn-neon-cyan py-4 px-6 text-lg font-bold transition-all shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70"
          >
            + Add Activity for This Day
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
                          className="bg-gradient-to-r from-blue-600 to-blue-500 border-2 border-blue-400 p-3 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditActivity(activity);
                          }}
                          title="Click to edit"
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
      <div className="futuristic-card p-8 border border-cyan-500/30">
        <h3 className="heading-secondary text-3xl mb-8">📊 This Month's Activity</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-500/10 p-6 rounded-xl border border-cyan-500/30 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/30 transition-all">
            <p className="text-cyan-300/70 text-sm font-semibold mb-2">Total Activities</p>
            <p className="text-4xl font-black text-cyan-300">{activities.filter(a => {
              const aDate = new Date(a.date);
              return aDate.getMonth() === currentDate.getMonth();
            }).length}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-500/10 p-6 rounded-xl border border-blue-500/30 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/30 transition-all">
            <p className="text-blue-300/70 text-sm font-semibold mb-2">☎️ Calls</p>
            <p className="text-4xl font-black text-blue-300">{activities.filter(a => a.type === 'call' && new Date(a.date).getMonth() === currentDate.getMonth()).length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-600/20 to-green-500/10 p-6 rounded-xl border border-green-500/30 hover:border-green-400 hover:shadow-lg hover:shadow-green-500/30 transition-all">
            <p className="text-green-300/70 text-sm font-semibold mb-2">📧 Emails</p>
            <p className="text-4xl font-black text-green-300">{activities.filter(a => a.type === 'email' && new Date(a.date).getMonth() === currentDate.getMonth()).length}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-600/20 to-purple-500/10 p-6 rounded-xl border border-purple-500/30 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/30 transition-all">
            <p className="text-purple-300/70 text-sm font-semibold mb-2">👥 Meetings</p>
            <p className="text-4xl font-black text-purple-300">{activities.filter(a => a.type === 'meeting' && new Date(a.date).getMonth() === currentDate.getMonth()).length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

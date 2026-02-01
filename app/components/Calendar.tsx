'use client'

import { useState, useEffect } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  eachHourOfInterval,
  startOfDay,
  endOfDay,
  isSameDay,
  parse,
  addDays,
  subDays,
  startOfToday,
} from 'date-fns'
import ActivityModal from './ActivityModal'

interface Activity {
  id: string
  title: string
  type: 'call' | 'email' | 'visit' | 'quote' | 'follow-up'
  date: Date
  leadId?: string
  accountId?: string
  notes: string
  completed: boolean
}

interface Lead {
  id: string
  name: string
  company: string
}

interface Account {
  id: string
  name: string
}

export default function Calendar({
  activities,
  setActivities,
  leads,
  accounts,
}: {
  activities: Activity[]
  setActivities: (activities: Activity[]) => void
  leads: Lead[]
  accounts: Account[]
}) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'daily' | 'weekly' | 'monthly'>('monthly')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  const handleAddActivity = (date: Date) => {
    setSelectedDate(date)
    setShowModal(true)
  }

  const handleSaveActivity = (activity: Omit<Activity, 'id'>) => {
    const newActivity: Activity = {
      ...activity,
      id: Date.now().toString(),
    }
    setActivities([...activities, newActivity])
    setShowModal(false)
  }

  const handleDeleteActivity = (id: string) => {
    setActivities(activities.filter((a) => a.id !== id))
  }

  const handleToggleComplete = (id: string) => {
    setActivities(
      activities.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a))
    )
  }

  const getActivityBadgeColor = (type: string) => {
    switch (type) {
      case 'call':
        return 'activity-call'
      case 'email':
        return 'activity-email'
      case 'visit':
        return 'activity-visit'
      case 'quote':
        return 'activity-quote'
      default:
        return 'bg-slate-100 text-slate-800'
    }
  }

  const getLeadName = (id?: string) => {
    return leads.find((l) => l.id === id)?.name || 'Unknown'
  }

  const getAccountName = (id?: string) => {
    return accounts.find((a) => a.id === id)?.name || 'Unknown'
  }

  return (
    <div>
      {/* View Controls */}
      <div className="flex gap-4 mb-6 items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setView('daily')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              view === 'daily'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setView('weekly')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              view === 'weekly'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setView('monthly')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              view === 'monthly'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Monthly
          </button>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 items-center">
          <button
            onClick={() => {
              if (view === 'monthly') setCurrentDate(subMonths(currentDate, 1))
              else if (view === 'weekly') setCurrentDate(subDays(currentDate, 7))
              else setCurrentDate(subDays(currentDate, 1))
            }}
            className="px-3 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50"
          >
            ←
          </button>
          <span className="text-lg font-semibold min-w-48 text-center">
            {view === 'monthly'
              ? format(currentDate, 'MMMM yyyy')
              : view === 'weekly'
              ? `${format(startOfWeek(currentDate), 'MMM d')} - ${format(endOfWeek(currentDate), 'MMM d')}`
              : format(currentDate, 'EEEE, MMMM d, yyyy')}
          </span>
          <button
            onClick={() => {
              if (view === 'monthly') setCurrentDate(addMonths(currentDate, 1))
              else if (view === 'weekly') setCurrentDate(addDays(currentDate, 7))
              else setCurrentDate(addDays(currentDate, 1))
            }}
            className="px-3 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50"
          >
            →
          </button>
          <button
            onClick={() => setCurrentDate(startOfToday())}
            className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-medium hover:bg-blue-200"
          >
            Today
          </button>
        </div>
      </div>

      {/* Calendar Views */}
      <div className="calendar-container">
        {view === 'monthly' && (
          <MonthlyView
            currentDate={currentDate}
            activities={activities}
            onAddActivity={handleAddActivity}
            getActivityBadgeColor={getActivityBadgeColor}
            getLeadName={getLeadName}
            getAccountName={getAccountName}
            onDeleteActivity={handleDeleteActivity}
            onToggleComplete={handleToggleComplete}
          />
        )}

        {view === 'weekly' && (
          <WeeklyView
            currentDate={currentDate}
            activities={activities}
            onAddActivity={handleAddActivity}
            currentTime={currentTime}
            getActivityBadgeColor={getActivityBadgeColor}
            getLeadName={getLeadName}
            getAccountName={getAccountName}
            onDeleteActivity={handleDeleteActivity}
            onToggleComplete={handleToggleComplete}
          />
        )}

        {view === 'daily' && (
          <DailyView
            currentDate={currentDate}
            activities={activities}
            onAddActivity={handleAddActivity}
            currentTime={currentTime}
            getActivityBadgeColor={getActivityBadgeColor}
            getLeadName={getLeadName}
            getAccountName={getAccountName}
            onDeleteActivity={handleDeleteActivity}
            onToggleComplete={handleToggleComplete}
          />
        )}
      </div>

      {/* Activity Modal */}
      {showModal && (
        <ActivityModal
          date={selectedDate || new Date()}
          onSave={handleSaveActivity}
          onClose={() => setShowModal(false)}
          leads={leads}
          accounts={accounts}
        />
      )}

      {/* Activities List */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="card-header">Upcoming Activities</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {activities
              .filter((a) => a.date >= currentTime && !a.completed)
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .slice(0, 10)
              .map((activity) => (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                  getActivityBadgeColor={getActivityBadgeColor}
                  getLeadName={getLeadName}
                  getAccountName={getAccountName}
                  onDelete={handleDeleteActivity}
                  onToggleComplete={handleToggleComplete}
                />
              ))}
          </div>
        </div>

        <div className="card">
          <h3 className="card-header">Completed Activities</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {activities
              .filter((a) => a.completed)
              .sort((a, b) => b.date.getTime() - a.date.getTime())
              .slice(0, 10)
              .map((activity) => (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                  getActivityBadgeColor={getActivityBadgeColor}
                  getLeadName={getLeadName}
                  getAccountName={getAccountName}
                  onDelete={handleDeleteActivity}
                  onToggleComplete={handleToggleComplete}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function MonthlyView({
  currentDate,
  activities,
  onAddActivity,
  getActivityBadgeColor,
  getLeadName,
  getAccountName,
  onDeleteActivity,
  onToggleComplete,
}: any) {
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  const today = startOfToday()

  const getActivitiesForDay = (day: Date) => {
    return activities.filter((a: Activity) => isSameDay(new Date(a.date), day))
  }

  return (
    <div>
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center font-semibold text-slate-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const dayActivities = getActivitiesForDay(day)
          const isToday = isSameDay(day, today)
          const isCurrentMonth = day.getMonth() === currentDate.getMonth()

          return (
            <div
              key={day.toISOString()}
              className={`min-h-24 p-2 rounded-lg border cursor-pointer transition ${
                isToday
                  ? 'bg-blue-50 border-blue-300'
                  : dayActivities.length > 0
                  ? 'bg-amber-50 border-amber-300'
                  : 'bg-slate-50 border-slate-200'
              } ${!isCurrentMonth ? 'opacity-40' : ''} hover:shadow-md`}
              onClick={() => onAddActivity(day)}
            >
              <div className="text-sm font-semibold text-slate-700 mb-1">
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {dayActivities.slice(0, 2).map((activity: Activity) => (
                  <div
                    key={activity.id}
                    className="text-xs p-1 rounded truncate"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className={`activity-badge ${getActivityBadgeColor(activity.type)}`}>
                      {activity.title}
                    </span>
                  </div>
                ))}
                {dayActivities.length > 2 && (
                  <div className="text-xs text-slate-500">+{dayActivities.length - 2} more</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function WeeklyView({
  currentDate,
  activities,
  onAddActivity,
  currentTime,
  getActivityBadgeColor,
  getLeadName,
  getAccountName,
  onDeleteActivity,
  onToggleComplete,
}: any) {
  const weekStart = startOfWeek(currentDate)
  const weekEnd = endOfWeek(currentDate)
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd })
  const hours = eachHourOfInterval({
    start: startOfDay(weekStart),
    end: endOfDay(weekEnd),
  })

  const getActivitiesForDayHour = (day: Date, hour: number) => {
    return activities.filter((a: Activity) => {
      const aDate = new Date(a.date)
      return isSameDay(aDate, day) && aDate.getHours() === hour
    })
  }

  const currentHour = currentTime.getHours()
  const isCurrentWeek = isSameDay(currentTime, currentDate)

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="p-2 border border-slate-200 bg-slate-100 text-slate-700 font-semibold w-20">
              Time
            </th>
            {days.map((day) => (
              <th
                key={day.toISOString()}
                className={`p-2 border border-slate-200 font-semibold text-center ${
                  isSameDay(day, currentTime)
                    ? 'bg-blue-100 text-blue-900'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {format(day, 'EEE\nMMM d')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 24 }).map((_, idx) => {
            const hour = idx
            const isCurrentHourRow = isCurrentWeek && hour === currentHour

            return (
              <tr key={hour}>
                <td className="p-2 border border-slate-200 bg-slate-50 text-slate-600 font-medium">
                  {format(new Date().setHours(hour, 0, 0, 0), 'HH:mm')}
                </td>
                {days.map((day) => {
                  const dayActivities = getActivitiesForDayHour(day, hour)

                  return (
                    <td
                      key={`${day.toISOString()}-${hour}`}
                      className="p-1 border border-slate-200 relative min-h-12 hover:bg-blue-50 cursor-pointer transition"
                      onClick={() => {
                        const newDate = new Date(day)
                        newDate.setHours(hour, 0, 0, 0)
                        onAddActivity(newDate)
                      }}
                    >
                      {isCurrentHourRow && <div className="current-time-indicator" />}
                      <div className="space-y-1">
                        {dayActivities.map((activity: Activity) => (
                          <div
                            key={activity.id}
                            className={`text-xs p-1 rounded cursor-pointer ${
                              activity.completed ? 'opacity-60 line-through' : ''
                            }`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className={`activity-badge ${getActivityBadgeColor(activity.type)}`}>
                              {activity.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function DailyView({
  currentDate,
  activities,
  onAddActivity,
  currentTime,
  getActivityBadgeColor,
  getLeadName,
  getAccountName,
  onDeleteActivity,
  onToggleComplete,
}: any) {
  const dayActivities = activities.filter((a: Activity) =>
    isSameDay(new Date(a.date), currentDate)
  )
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const isToday = isSameDay(currentDate, currentTime)
  const currentHour = currentTime.getHours()
  const currentMinutes = currentTime.getMinutes()

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main calendar view */}
        <div className="lg:col-span-2">
          <div className="bg-slate-100 rounded-lg p-4 mb-4">
            <div className="space-y-2">
              {hours.map((hour) => {
                const hourActivities = dayActivities.filter((a: Activity) => {
                  const aDate = new Date(a.date)
                  return aDate.getHours() === hour
                })

                const isCurrentHourDisplay = isToday && hour === currentHour
                const timeStr = `${String(hour).padStart(2, '0')}:00`

                return (
                  <div
                    key={hour}
                    className={`hour-block relative p-3 rounded-lg transition cursor-pointer ${
                      isCurrentHourDisplay ? 'bg-red-100 border-l-4 border-red-500' : 'bg-white'
                    }`}
                    onClick={() => {
                      const newDate = new Date(currentDate)
                      newDate.setHours(hour, 0, 0, 0)
                      onAddActivity(newDate)
                    }}
                  >
                    {isCurrentHourDisplay && (
                      <div
                        className="current-time-indicator"
                        style={{ top: `${(currentMinutes / 60) * 100}%` }}
                      />
                    )}
                    <div className="font-semibold text-slate-600 mb-2">{timeStr}</div>
                    <div className="space-y-1">
                      {hourActivities.map((activity: Activity) => (
                        <ActivityItem
                          key={activity.id}
                          activity={activity}
                          getActivityBadgeColor={getActivityBadgeColor}
                          getLeadName={getLeadName}
                          getAccountName={getAccountName}
                          onDelete={onDeleteActivity}
                          onToggleComplete={onToggleComplete}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Activities sidebar */}
        <div className="card">
          <h3 className="card-header">Today's Activities</h3>
          <div className="space-y-2">
            {dayActivities.length === 0 ? (
              <p className="text-slate-500 text-sm">No activities scheduled</p>
            ) : (
              dayActivities
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((activity: Activity) => (
                  <ActivityItem
                    key={activity.id}
                    activity={activity}
                    getActivityBadgeColor={getActivityBadgeColor}
                    getLeadName={getLeadName}
                    getAccountName={getAccountName}
                    onDelete={onDeleteActivity}
                    onToggleComplete={onToggleComplete}
                  />
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ActivityItem({
  activity,
  getActivityBadgeColor,
  getLeadName,
  getAccountName,
  onDelete,
  onToggleComplete,
}: any) {
  return (
    <div
      className={`p-2 rounded-lg bg-slate-50 border border-slate-200 hover:shadow-md transition ${
        activity.completed ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={activity.completed}
              onChange={() => onToggleComplete(activity.id)}
              className="cursor-pointer"
            />
            <span className={`activity-badge ${getActivityBadgeColor(activity.type)}`}>
              {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
            </span>
          </div>
          <p className={`font-medium text-slate-900 mt-1 ${activity.completed ? 'line-through' : ''}`}>
            {activity.title}
          </p>
          {activity.leadId && (
            <p className="text-xs text-slate-600">Lead: {getLeadName(activity.leadId)}</p>
          )}
          {activity.accountId && (
            <p className="text-xs text-slate-600">Account: {getAccountName(activity.accountId)}</p>
          )}
          <p className="text-xs text-slate-500 mt-1">
            {format(new Date(activity.date), 'MMM d, HH:mm')}
          </p>
        </div>
        <button
          onClick={() => onDelete(activity.id)}
          className="btn-small text-red-600 hover:bg-red-50"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

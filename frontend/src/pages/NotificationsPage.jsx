import { useState, useEffect } from 'react'
import api from '../services/api'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const res = await api.get('/api/v1/notifications')
      setNotifications(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const markAllRead = async () => {
    try {
      await api.put('/api/v1/notifications/read-all')
      fetchNotifications()
    } catch (err) {
      console.error(err)
    }
  }

  const markOneRead = async (id) => {
    try {
      await api.put(`/api/v1/notifications/${id}/read`)
      fetchNotifications()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Notifications</h1>
          <p className="text-sm text-slate-500 mt-0.5">Alerts, task triggers, and security events.</p>
        </div>
        <button
          onClick={markAllRead}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
        >
          Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">No notifications to display.</div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => !n.isRead && markOneRead(n._id)}
                className={`p-4 flex items-start justify-between cursor-pointer transition ${
                  n.isRead ? 'bg-white hover:bg-slate-50' : 'bg-blue-50/40 hover:bg-blue-50/70'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 w-2 h-2 rounded-full ${n.isRead ? 'bg-slate-300' : 'bg-blue-600'}`}></div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">{n.message}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {n.createdAt ? new Date(n.createdAt).toLocaleString() : 'Just now'}
                    </span>
                  </div>
                </div>
                {!n.isRead && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-700">
                    New
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

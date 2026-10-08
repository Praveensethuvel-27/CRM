import { useState, useEffect } from 'react'
import api from '../services/api'

export default function TasksPage() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
  })

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const res = await api.get('/api/v1/tasks')
      setTasks(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/api/v1/tasks', formData)
      setShowModal(false)
      setFormData({ title: '', description: '', priority: 'medium', status: 'pending' })
      fetchTasks()
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to create task')
    }
  }

  const toggleStatus = async (task) => {
    try {
      const nextStatus = task.status === 'completed' ? 'pending' : 'completed'
      await api.put(`/api/v1/tasks/${task._id}`, { status: nextStatus })
      fetchTasks()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return
    try {
      await api.delete(`/api/v1/tasks/${id}`)
      fetchTasks()
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to delete task')
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tasks & Activities</h1>
          <p className="text-sm text-slate-500 mt-0.5">Assigned action items and customer follow-ups.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
        >
          + New Task
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">No pending tasks found.</div>
          ) : (
            tasks.map((t) => (
              <div key={t._id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={t.status === 'completed'}
                    onChange={() => toggleStatus(t)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <p className={`text-xs font-semibold ${t.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {t.title}
                    </p>
                    {t.description && <p className="text-[11px] text-slate-500">{t.description}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    t.priority === 'urgent' || t.priority === 'high'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : t.priority === 'medium'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {t.priority}
                  </span>
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="text-slate-400 hover:text-rose-600 text-xs p-1"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Create New Task</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Task Title</label>
                <input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Review client proposal terms"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Additional context or links..."
                  rows={2}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-2 rounded-xl text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-xs"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

export default function ChangePasswordPage() {
  const navigate = useNavigate()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    try {
      await api.put('/api/v1/auth/change-password', { oldPassword, newPassword })
      setMessage('Password changed successfully!')
      setTimeout(() => navigate('/'), 2000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update password')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
        <div className="text-center mb-6">
          <img src="/logo.png" alt="LeadDesk Logo" className="h-14 w-auto mx-auto object-contain mb-2" />
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Lead<span className="text-amber-500">Desk</span>
          </h1>
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">Change Password</h2>
        <p className="text-xs text-slate-500 mb-6">Choose a strong password to protect your CRM account.</p>

        {message && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Current Password
            </label>
            <input
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              New Password
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 text-sm shadow-sm transition"
          >
            Update Password
          </button>
          <div className="text-center pt-2">
            <Link to="/" className="text-xs text-slate-500 hover:text-slate-800 font-medium">
              Cancel & Return
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

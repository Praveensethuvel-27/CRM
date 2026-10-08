import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    department: user?.department || 'Sales',
    phone: user?.phone || '',
  })
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [profileMsg, setProfileMsg] = useState('')
  const [passwordMsg, setPasswordMsg] = useState('')
  const [passwordErr, setPasswordErr] = useState('')

  useEffect(() => {
    if (user) {
      setProfile({
        fullName: user.fullName || '',
        email: user.email || '',
        department: user.department || 'Sales',
        phone: user.phone || '',
      })
    }
  }, [user])

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileMsg('')
    try {
      await api.put('/api/v1/auth/profile', {
        fullName: profile.fullName,
        department: profile.department,
        phone: profile.phone,
      })
      setProfileMsg('Profile updated successfully!')
      setTimeout(() => setProfileMsg(''), 3000)
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update profile')
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPasswordMsg('')
    setPasswordErr('')
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordErr('New passwords do not match')
      return
    }
    try {
      await api.put('/api/v1/auth/change-password', {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      })
      setPasswordMsg('Password changed successfully!')
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => setPasswordMsg(''), 3000)
    } catch (err) {
      setPasswordErr(err.response?.data?.detail || 'Failed to change password')
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Account & Security</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage personal profile details and security credentials.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Personal Profile</h3>
          {profileMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold">
              {profileMsg}
            </div>
          )}
          <form onSubmit={handleProfileSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email (Read Only)</label>
              <input
                disabled
                value={profile.email}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
              <input
                value={profile.department}
                onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
              <input
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
              />
            </div>
            <button
              type="submit"
              className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
            >
              Update Profile
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Change Password</h3>
          {passwordMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold">
              {passwordMsg}
            </div>
          )}
          {passwordErr && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
              {passwordErr}
            </div>
          )}
          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current Password</label>
              <input
                type="password"
                required
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
              <input
                type="password"
                required
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
              />
            </div>
            <button
              type="submit"
              className="mt-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-xs transition"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import api from '../services/api'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    companyName: 'CRM Portal SaaS',
    companyAddress: '',
    companyPhone: '',
    companyEmail: '',
    currency: 'USD ($)',
    timezone: 'UTC',
  })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/api/v1/settings')
        if (res.data) setSettings(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.put('/api/v1/settings', settings)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update settings')
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage organization parameters and MongoDB Atlas database connection.</p>
      </div>

      {/* MongoDB Atlas Status Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Database Engine: MongoDB Atlas</h3>
            <p className="text-xs text-slate-500">Connected through Node.js Express server & Mongoose ODM.</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Atlas Active
          </span>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-mono text-slate-600">
          Status: Online • REST API: http://localhost:5000/api/v1
        </div>
      </div>

      {/* Company Profile Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Organization Profile</h3>

        {saved && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold">
            Settings updated successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
              <input
                value={settings.companyName || ''}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Support Email</label>
              <input
                value={settings.companyEmail || ''}
                onChange={(e) => setSettings({ ...settings, companyEmail: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                value={settings.companyPhone || ''}
                onChange={(e) => setSettings({ ...settings, companyPhone: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Default Currency</label>
              <input
                value={settings.currency || 'USD ($)'}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Company Address</label>
            <textarea
              value={settings.companyAddress || ''}
              onChange={(e) => setSettings({ ...settings, companyAddress: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

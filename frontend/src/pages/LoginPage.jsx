import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@crm.local')
  const [password, setPassword] = useState('Admin123!')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await auth.login(email, password)
      navigate('/')
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          'Unable to sign in. Please verify your MongoDB backend is running.'
      )
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail)
    setPassword(demoPass)
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        {/* Top Brand Pill */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white font-bold text-2xl shadow-md shadow-blue-500/20 mb-3">
            C
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">CRM Portal SaaS</h1>
          <p className="text-sm text-slate-500 mt-1">Node.js Express + MongoDB Atlas Backend</p>
        </div>

        {/* White Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Welcome Back</h2>
          <p className="text-xs text-slate-500 mb-6">Enter your credentials to access your CRM workspace.</p>

          {error && (
            <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-xs text-rose-700 flex items-start gap-2">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="name@company.com"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-xs focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <a href="/forgot-password" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                  Forgot?
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-xs focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 text-sm shadow-sm transition disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign in to Dashboard'}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 mb-2">Quick Demo Accounts:</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemo('admin@crm.local', 'Admin123!')}
                className="text-xs py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium transition"
              >
                👑 Admin
              </button>
              <button
                type="button"
                onClick={() => fillDemo('manager@crm.local', 'Manager123!')}
                className="text-xs py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium transition"
              >
                💼 Manager
              </button>
              <button
                type="button"
                onClick={() => fillDemo('employee@crm.local', 'Employee123!')}
                className="text-xs py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium transition"
              >
                👤 Employee
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Light UI Theme • Powered by Node.js Express & MongoDB Atlas
        </p>
      </div>
    </div>
  )
}

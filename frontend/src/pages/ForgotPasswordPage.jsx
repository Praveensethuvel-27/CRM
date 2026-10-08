import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
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
        <h2 className="text-lg font-bold text-slate-900 mb-1">Reset Password</h2>
        <p className="text-xs text-slate-500 mb-6">Enter your registered email address to receive password instructions.</p>

        {sent ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
            Password reset link has been dispatched to <strong>{email}</strong>.
            <div className="mt-4">
              <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                ← Return to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 text-sm shadow-sm transition"
            >
              Send Recovery Link
            </button>
            <div className="text-center pt-2">
              <Link to="/login" className="text-xs text-slate-500 hover:text-slate-800 font-medium">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

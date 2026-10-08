import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-10 text-center shadow-sm">
        <h1 className="text-6xl font-extrabold text-blue-600">404</h1>
        <h2 className="mt-4 text-xl font-bold text-slate-900">Page not found</h2>
        <p className="mt-2 text-xs text-slate-500">
          The requested route does not exist or has been relocated.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs transition"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  )
}

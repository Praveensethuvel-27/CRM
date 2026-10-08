import { useState, useEffect } from 'react'
import api from '../services/api'
import { Link } from 'react-router-dom'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total_customers: 0,
    total_leads: 0,
    active_deals: 0,
    revenue_overview: 0,
    recent_activities: [],
    recent_leads: [],
    recent_deals: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/api/v1/dashboard')
        setStats(res.data)
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  const statCards = [
    {
      label: 'Total Customers',
      value: stats.total_customers,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      path: '/customers',
    },
    {
      label: 'Total Leads',
      value: stats.total_leads,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      icon: (
        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      path: '/leads',
    },
    {
      label: 'Active Deals',
      value: stats.active_deals,
      color: 'text-violet-600 bg-violet-50 border-violet-100',
      icon: (
        <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      path: '/deals',
    },
    {
      label: 'Pipeline Revenue',
      value: `$${Number(stats.revenue_overview || 0).toLocaleString()}`,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      icon: (
        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      path: '/invoices',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time pipeline analytics powered by Node.js & MongoDB Atlas.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/leads"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
          >
            + Create Lead
          </Link>
          <Link
            to="/customers"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
          >
            + Add Customer
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            to={card.path}
            className="group block bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {card.label}
              </span>
              <div className={`p-2.5 rounded-xl border ${card.color}`}>
                {card.icon}
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-900">
              {loading ? '...' : card.value}
            </p>
            <span className="inline-block mt-2 text-xs font-medium text-blue-600 group-hover:translate-x-1 transition-transform">
              View details →
            </span>
          </Link>
        ))}
      </div>

      {/* Two Column Grid: Pipeline Highlights & Recent Activities */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Deals & Leads */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Deals Pipeline</h2>
              <p className="text-xs text-slate-500">Active opportunities in MongoDB Atlas</p>
            </div>
            <Link to="/deals" className="text-xs font-semibold text-blue-600 hover:underline">
              View All
            </Link>
          </div>

          {stats.recent_deals?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    <th className="py-2.5 font-semibold">Deal Title</th>
                    <th className="py-2.5 font-semibold">Customer</th>
                    <th className="py-2.5 font-semibold">Stage</th>
                    <th className="py-2.5 font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.recent_deals.map((deal) => (
                    <tr key={deal._id} className="hover:bg-slate-50">
                      <td className="py-3 font-medium text-slate-900">{deal.title}</td>
                      <td className="py-3 text-slate-600">{deal.customerName || 'N/A'}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          {deal.stage}
                        </span>
                      </td>
                      <td className="py-3 font-semibold text-emerald-600">
                        ${Number(deal.amount || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs">
              No recent deals found. Start by seeding the database or creating a deal.
            </div>
          )}
        </div>

        {/* Recent Activities Timeline */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900">Recent Activities</h2>
            <p className="text-xs text-slate-500">Live operational audit log</p>
          </div>

          <div className="space-y-3">
            {stats.recent_activities?.length > 0 ? (
              stats.recent_activities.map((act) => (
                <div key={act.id || act.subject} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-xs font-semibold text-slate-800">{act.subject}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{act.details}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    By {act.user} • {act.createdAt ? new Date(act.createdAt).toLocaleDateString() : 'Recent'}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 text-center text-xs text-slate-500">
                System initialized. MongoDB Atlas is ready for activities.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

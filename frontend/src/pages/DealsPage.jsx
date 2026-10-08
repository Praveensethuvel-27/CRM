import { useState, useEffect } from 'react'
import api from '../services/api'

export default function DealsPage() {
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    customerName: '',
    stage: 'Prospecting',
    amount: '',
    status: 'open',
  })

  const fetchDeals = async () => {
    try {
      setLoading(true)
      const res = await api.get('/api/v1/deals')
      setDeals(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDeals()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/api/v1/deals', {
        ...formData,
        amount: Number(formData.amount) || 0,
      })
      setShowModal(false)
      setFormData({ title: '', customerName: '', stage: 'Prospecting', amount: '', status: 'open' })
      fetchDeals()
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to create deal')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this deal?')) return
    try {
      await api.delete(`/api/v1/deals/${id}`)
      fetchDeals()
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to delete deal')
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Deals Pipeline</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage deals, sales pipeline stages, and projections in MongoDB Atlas.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
        >
          + New Deal
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-left text-xs">
            <thead className="bg-slate-50/70 text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Deal Title</th>
                <th className="px-5 py-3.5 font-semibold">Client / Account</th>
                <th className="px-5 py-3.5 font-semibold">Pipeline Stage</th>
                <th className="px-5 py-3.5 font-semibold">Amount</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-5 py-8 text-center text-slate-400">Loading pipeline...</td>
                </tr>
              ) : deals.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-8 text-center text-slate-400">No deals in pipeline.</td>
                </tr>
              ) : (
                deals.map((d) => (
                  <tr key={d._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4 font-semibold text-slate-900">{d.title}</td>
                    <td className="px-5 py-4 text-slate-600">{d.customerName || d.customerId?.companyName || '—'}</td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        {d.stage}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-emerald-600">
                      ${Number(d.amount || 0).toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                        d.status === 'won'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : d.status === 'lost'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleDelete(d._id)}
                        className="px-2.5 py-1 text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-medium transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add New Deal</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deal Title</label>
                <input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enterprise License Agreement"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Client Name</label>
                <input
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="Acme Global Inc"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Stage</label>
                  <select
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                  >
                    <option value="Prospecting">Prospecting</option>
                    <option value="Qualification">Qualification</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Closed Won">Closed Won</option>
                    <option value="Closed Lost">Closed Lost</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Amount ($)</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="50000"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>
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
                  Save Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

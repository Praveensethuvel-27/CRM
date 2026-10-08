import { useState, useEffect } from 'react'
import api from '../services/api'

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    companyName: '',
    industry: 'Technology',
    email: '',
    phone: '',
    address: '',
    status: 'active',
  })

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const res = await api.get('/api/v1/customers')
      setCustomers(res.data)
    } catch (err) {
      console.error('Error fetching customers:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/api/v1/customers', formData)
      setShowModal(false)
      setFormData({ companyName: '', industry: 'Technology', email: '', phone: '', address: '', status: 'active' })
      fetchCustomers()
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to create customer')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return
    try {
      await api.delete(`/api/v1/customers/${id}`)
      fetchCustomers()
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to delete customer')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">Maintain client profiles and enterprise contacts in MongoDB Atlas.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
        >
          + Add Customer
        </button>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-left text-xs">
            <thead className="bg-slate-50/70 text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Company Name</th>
                <th className="px-5 py-3.5 font-semibold">Industry</th>
                <th className="px-5 py-3.5 font-semibold">Contact Email</th>
                <th className="px-5 py-3.5 font-semibold">Phone</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-5 py-8 text-center text-slate-400">Loading customers...</td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-8 text-center text-slate-400">
                    No customers found. Click "+ Add Customer" to register one.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 font-bold flex items-center justify-center border border-blue-100">
                          {c.companyName[0]?.toUpperCase()}
                        </span>
                        <span>{c.companyName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{c.industry || 'General'}</td>
                    <td className="px-5 py-4 text-slate-600">{c.email || '—'}</td>
                    <td className="px-5 py-4 text-slate-600">{c.phone || '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                        c.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleDelete(c._id)}
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

      {/* Add Customer Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add New Customer</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
                <input
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="Acme Global Inc"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Industry</label>
                  <input
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    placeholder="Technology, Finance"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                  >
                    <option value="active">Active</option>
                    <option value="lead">Lead</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contact@company.com"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
                <input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 012-3456"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
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
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

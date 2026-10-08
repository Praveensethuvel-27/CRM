import express from 'express'
import Customer from '../models/Customer.js'
import Lead from '../models/Lead.js'
import Deal from '../models/Deal.js'
import Activity from '../models/Activity.js'
import Invoice from '../models/Invoice.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.get('/', protect, async (req, res) => {
  try {
    const total_customers = await Customer.countDocuments()
    const total_leads = await Lead.countDocuments()
    const active_deals = await Deal.countDocuments({ status: 'open' })

    const deals = await Deal.find({ status: { $in: ['open', 'won'] } })
    const revenue_overview = deals.reduce((acc, curr) => acc + (curr.amount || 0), 0)

    const recent_activities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .populate('userId', 'fullName email')

    const recent_leads = await Lead.find()
      .sort({ createdAt: -1 })
      .limit(5)

    const recent_deals = await Deal.find()
      .sort({ createdAt: -1 })
      .limit(5)

    return res.json({
      total_customers,
      total_leads,
      active_deals,
      revenue_overview,
      recent_activities: recent_activities.map((a) => ({
        id: a._id,
        subject: a.subject,
        details: a.details,
        createdAt: a.createdAt,
        user: a.userId?.fullName || 'System',
      })),
      recent_leads,
      recent_deals,
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return res.status(500).json({ detail: error.message })
  }
})

export default router

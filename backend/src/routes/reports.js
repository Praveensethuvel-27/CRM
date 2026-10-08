import express from 'express'
import Customer from '../models/Customer.js'
import Lead from '../models/Lead.js'
import Deal from '../models/Deal.js'
import Invoice from '../models/Invoice.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.get('/', protect, async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments()
    const leadsByStatus = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 }, totalValue: { $sum: '$value' } } },
    ])
    const dealsByStage = await Deal.aggregate([
      { $group: { _id: '$stage', count: { $sum: 1 }, totalAmount: { $sum: '$amount' } } },
    ])
    const invoicesByStatus = await Invoice.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 }, total: { $sum: '$total' } } },
    ])

    return res.json({
      summary: {
        totalCustomers,
        totalLeads: leadsByStatus.reduce((acc, l) => acc + l.count, 0),
        totalDeals: dealsByStage.reduce((acc, d) => acc + d.count, 0),
        totalInvoices: invoicesByStatus.reduce((acc, i) => acc + i.count, 0),
      },
      leadsByStatus,
      dealsByStage,
      invoicesByStatus,
    })
  } catch (error) {
    return res.status(500).json({ detail: error.message })
  }
})

export default router

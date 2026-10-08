import express from 'express'
import Lead from '../models/Lead.js'
import Activity from '../models/Activity.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

// GET /api/v1/leads
router.get('/', protect, async (req, res) => {
  try {
    const leads = await Lead.find()
      .populate('assignedTo', 'fullName email')
      .populate('customerId', 'companyName')
      .sort({ createdAt: -1 })
    return res.json(leads)
  } catch (error) {
    return res.status(500).json({ detail: error.message })
  }
})

// GET /api/v1/leads/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('assignedTo', 'fullName email')
      .populate('customerId', 'companyName')
    if (!lead) return res.status(404).json({ detail: 'Lead not found' })
    return res.json(lead)
  } catch (error) {
    return res.status(500).json({ detail: error.message })
  }
})

// POST /api/v1/leads
router.post('/', protect, async (req, res) => {
  try {
    const lead = await Lead.create({
      ...req.body,
      assignedTo: req.body.assignedTo || req.user._id,
    })

    await Activity.create({
      userId: req.user._id,
      subject: `New lead created: ${lead.title}`,
      details: `Lead created with value $${lead.value || 0}`,
    })

    return res.status(201).json(lead)
  } catch (error) {
    return res.status(400).json({ detail: error.message })
  }
})

// PUT /api/v1/leads/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!lead) return res.status(404).json({ detail: 'Lead not found' })

    await Activity.create({
      userId: req.user._id,
      subject: `Updated lead: ${lead.title}`,
      details: `Status set to ${lead.status}`,
    })

    return res.json(lead)
  } catch (error) {
    return res.status(400).json({ detail: error.message })
  }
})

// DELETE /api/v1/leads/:id
router.delete('/:id', protect, authorize('Admin', 'Manager'), async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id)
    if (!lead) return res.status(404).json({ detail: 'Lead not found' })
    return res.json({ detail: 'Lead deleted successfully' })
  } catch (error) {
    return res.status(500).json({ detail: error.message })
  }
})

export default router

import express from 'express'
import Deal from '../models/Deal.js'
import Activity from '../models/Activity.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.get('/', protect, async (req, res) => {
  try {
    const deals = await Deal.find()
      .populate('customerId', 'companyName')
      .populate('owner', 'fullName email')
      .sort({ createdAt: -1 })
    return res.json(deals)
  } catch (error) {
    return res.status(500).json({ detail: error.message })
  }
})

router.post('/', protect, async (req, res) => {
  try {
    const deal = await Deal.create({
      ...req.body,
      owner: req.body.owner || req.user._id,
    })

    await Activity.create({
      userId: req.user._id,
      subject: `New Deal: ${deal.title}`,
      details: `Value $${deal.amount || 0} - Stage: ${deal.stage}`,
    })

    return res.status(201).json(deal)
  } catch (error) {
    return res.status(400).json({ detail: error.message })
  }
})

router.put('/:id', protect, async (req, res) => {
  try {
    const deal = await Deal.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!deal) return res.status(404).json({ detail: 'Deal not found' })
    return res.json(deal)
  } catch (error) {
    return res.status(400).json({ detail: error.message })
  }
})

router.delete('/:id', protect, async (req, res) => {
  try {
    const deal = await Deal.findByIdAndDelete(req.params.id)
    if (!deal) return res.status(404).json({ detail: 'Deal not found' })
    return res.json({ detail: 'Deal deleted' })
  } catch (error) {
    return res.status(500).json({ detail: error.message })
  }
})

export default router

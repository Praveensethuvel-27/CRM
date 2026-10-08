import express from 'express'
import Invoice from '../models/Invoice.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.get('/', protect, async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 })
    return res.json(invoices)
  } catch (error) {
    return res.status(500).json({ detail: error.message })
  }
})

router.post('/', protect, async (req, res) => {
  try {
    const count = await Invoice.countDocuments()
    const reference = req.body.reference || `INV-${String(count + 1).padStart(4, '0')}`
    const invoice = await Invoice.create({ ...req.body, reference })
    return res.status(201).json(invoice)
  } catch (error) {
    return res.status(400).json({ detail: error.message })
  }
})

router.put('/:id', protect, async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!invoice) return res.status(404).json({ detail: 'Invoice not found' })
    return res.json(invoice)
  } catch (error) {
    return res.status(400).json({ detail: error.message })
  }
})

router.delete('/:id', protect, async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id)
    if (!invoice) return res.status(404).json({ detail: 'Invoice not found' })
    return res.json({ detail: 'Invoice deleted' })
  } catch (error) {
    return res.status(500).json({ detail: error.message })
  }
})

export default router

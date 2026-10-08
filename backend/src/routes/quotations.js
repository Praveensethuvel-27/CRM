import express from 'express'
import Quotation from '../models/Quotation.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.get('/', protect, async (req, res) => {
  try {
    const quotations = await Quotation.find().sort({ createdAt: -1 })
    return res.json(quotations)
  } catch (error) {
    return res.status(500).json({ detail: error.message })
  }
})

router.post('/', protect, async (req, res) => {
  try {
    const count = await Quotation.countDocuments()
    const reference = req.body.reference || `QUO-${String(count + 1).padStart(4, '0')}`
    const quotation = await Quotation.create({ ...req.body, reference })
    return res.status(201).json(quotation)
  } catch (error) {
    return res.status(400).json({ detail: error.message })
  }
})

router.put('/:id', protect, async (req, res) => {
  try {
    const quotation = await Quotation.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!quotation) return res.status(404).json({ detail: 'Quotation not found' })
    return res.json(quotation)
  } catch (error) {
    return res.status(400).json({ detail: error.message })
  }
})

router.delete('/:id', protect, async (req, res) => {
  try {
    const quotation = await Quotation.findByIdAndDelete(req.params.id)
    if (!quotation) return res.status(404).json({ detail: 'Quotation not found' })
    return res.json({ detail: 'Quotation deleted' })
  } catch (error) {
    return res.status(500).json({ detail: error.message })
  }
})

export default router

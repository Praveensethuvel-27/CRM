import express from 'express'
import Contact from '../models/Contact.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.get('/', protect, async (req, res) => {
  try {
    const contacts = await Contact.find().populate('customerId', 'companyName').sort({ createdAt: -1 })
    return res.json(contacts)
  } catch (error) {
    return res.status(500).json({ detail: error.message })
  }
})

router.post('/', protect, async (req, res) => {
  try {
    const contact = await Contact.create(req.body)
    return res.status(201).json(contact)
  } catch (error) {
    return res.status(400).json({ detail: error.message })
  }
})

router.put('/:id', protect, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!contact) return res.status(404).json({ detail: 'Contact not found' })
    return res.json(contact)
  } catch (error) {
    return res.status(400).json({ detail: error.message })
  }
})

router.delete('/:id', protect, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id)
    if (!contact) return res.status(404).json({ detail: 'Contact not found' })
    return res.json({ detail: 'Contact deleted' })
  } catch (error) {
    return res.status(500).json({ detail: error.message })
  }
})

export default router

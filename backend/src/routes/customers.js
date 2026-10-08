import express from 'express'
import Customer from '../models/Customer.js'
import Activity from '../models/Activity.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

// GET /api/v1/customers
router.get('/', protect, async (req, res) => {
  try {
    const customers = await Customer.find()
      .populate('owner', 'fullName email')
      .sort({ createdAt: -1 })
    return res.json(customers)
  } catch (error) {
    return res.status(500).json({ detail: error.message })
  }
})

// GET /api/v1/customers/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).populate('owner', 'fullName email')
    if (!customer) return res.status(404).json({ detail: 'Customer not found' })
    return res.json(customer)
  } catch (error) {
    return res.status(500).json({ detail: error.message })
  }
})

// POST /api/v1/customers
router.post('/', protect, async (req, res) => {
  try {
    const customer = await Customer.create({
      ...req.body,
      owner: req.body.owner || req.user._id,
    })

    await Activity.create({
      userId: req.user._id,
      subject: `Created customer: ${customer.companyName}`,
      details: `Customer registered under ${customer.industry || 'General'}`,
    })

    return res.status(201).json(customer)
  } catch (error) {
    return res.status(400).json({ detail: error.message })
  }
})

// PUT /api/v1/customers/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!customer) return res.status(404).json({ detail: 'Customer not found' })

    await Activity.create({
      userId: req.user._id,
      subject: `Updated customer: ${customer.companyName}`,
      details: 'Customer profile details updated',
    })

    return res.json(customer)
  } catch (error) {
    return res.status(400).json({ detail: error.message })
  }
})

// DELETE /api/v1/customers/:id
router.delete('/:id', protect, authorize('Admin', 'Manager'), async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id)
    if (!customer) return res.status(404).json({ detail: 'Customer not found' })
    return res.json({ detail: 'Customer deleted successfully' })
  } catch (error) {
    return res.status(500).json({ detail: error.message })
  }
})

export default router

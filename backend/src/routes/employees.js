import express from 'express'
import User from '../models/User.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

router.get('/', protect, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    return res.json(users)
  } catch (error) {
    return res.status(500).json({ detail: error.message })
  }
})

router.post('/', protect, authorize('Admin', 'Manager'), async (req, res) => {
  try {
    const { fullName, email, password, role, department, phone } = req.body
    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return res.status(400).json({ detail: 'User with this email already exists' })
    }

    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      password: password || 'Default123!',
      role: role || 'Employee',
      department: department || 'Sales',
      phone: phone || '',
    })

    const userResponse = user.toObject()
    delete userResponse.password
    return res.status(201).json(userResponse)
  } catch (error) {
    return res.status(400).json({ detail: error.message })
  }
})

router.put('/:id', protect, authorize('Admin', 'Manager'), async (req, res) => {
  try {
    const updateData = { ...req.body }
    delete updateData.password // Don't update password via this route

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password')
    if (!user) return res.status(404).json({ detail: 'Employee not found' })
    return res.json(user)
  } catch (error) {
    return res.status(400).json({ detail: error.message })
  }
})

router.delete('/:id', protect, authorize('Admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(404).json({ detail: 'Employee not found' })
    return res.json({ detail: 'Employee deleted' })
  } catch (error) {
    return res.status(500).json({ detail: error.message })
  }
})

export default router

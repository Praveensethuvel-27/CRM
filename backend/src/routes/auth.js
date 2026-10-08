import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'crm_secret_key_default', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  })
}

// POST /api/v1/auth/login
// Supports both JSON { email/username, password } and URL-encoded / OAuth2 password form
router.post('/login', async (req, res) => {
  try {
    const email = req.body.username || req.body.email
    const password = req.body.password

    if (!email || !password) {
      return res.status(400).json({ detail: 'Please provide email/username and password' })
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password')
    if (!user) {
      return res.status(401).json({ detail: 'Incorrect email or password' })
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ detail: 'Incorrect email or password' })
    }

    const token = generateToken(user._id)

    return res.json({
      access_token: token,
      token_type: 'bearer',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        department: user.department,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ detail: error.message || 'Server error during login' })
  }
})

// POST /api/v1/auth/register
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, role, department, phone } = req.body
    if (!email || !password || !fullName) {
      return res.status(400).json({ detail: 'Please provide full name, email, and password' })
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() })
    if (existingUser) {
      return res.status(400).json({ detail: 'User with this email already exists' })
    }

    const user = await User.create({
      fullName,
      email: email.toLowerCase().trim(),
      password,
      role: role || 'Employee',
      department: department || 'Sales',
      phone: phone || '',
    })

    const token = generateToken(user._id)

    return res.status(201).json({
      access_token: token,
      token_type: 'bearer',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        department: user.department,
      },
    })
  } catch (error) {
    return res.status(500).json({ detail: error.message || 'Registration failed' })
  }
})

// GET /api/v1/auth/me
router.get('/me', protect, async (req, res) => {
  return res.json({
    user: req.user,
  })
})

// PUT /api/v1/auth/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { fullName, phone, department } = req.body
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ detail: 'User not found' })

    if (fullName) user.fullName = fullName
    if (phone !== undefined) user.phone = phone
    if (department !== undefined) user.department = department

    await user.save()
    return res.json({ message: 'Profile updated successfully', user })
  } catch (error) {
    return res.status(500).json({ detail: error.message })
  }
})

// PUT /api/v1/auth/change-password
router.put('/change-password', protect, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body
    const user = await User.findById(req.user._id).select('+password')

    const isMatch = await user.matchPassword(oldPassword)
    if (!isMatch) {
      return res.status(400).json({ detail: 'Current password is incorrect' })
    }

    user.password = newPassword
    await user.save()
    return res.json({ message: 'Password changed successfully' })
  } catch (error) {
    return res.status(500).json({ detail: error.message })
  }
})

export default router

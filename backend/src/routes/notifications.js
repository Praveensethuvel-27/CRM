import express from 'express'
import Notification from '../models/Notification.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.get('/', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [{ userId: req.user._id }, { userId: null }],
    })
      .sort({ createdAt: -1 })
      .limit(20)
    return res.json(notifications)
  } catch (error) {
    return res.status(500).json({ detail: error.message })
  }
})

router.put('/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true })
    return res.json(notification)
  } catch (error) {
    return res.status(500).json({ detail: error.message })
  }
})

router.put('/read-all', protect, async (req, res) => {
  try {
    await Notification.updateMany({ $or: [{ userId: req.user._id }, { userId: null }] }, { isRead: true })
    return res.json({ message: 'All notifications marked as read' })
  } catch (error) {
    return res.status(500).json({ detail: error.message })
  }
})

export default router

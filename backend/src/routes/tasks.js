import express from 'express'
import Task from '../models/Task.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.get('/', protect, async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'fullName email')
      .sort({ createdAt: -1 })
    return res.json(tasks)
  } catch (error) {
    return res.status(500).json({ detail: error.message })
  }
})

router.post('/', protect, async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      assignedTo: req.body.assignedTo || req.user._id,
    })
    return res.status(201).json(task)
  } catch (error) {
    return res.status(400).json({ detail: error.message })
  }
})

router.put('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!task) return res.status(404).json({ detail: 'Task not found' })
    return res.json(task)
  } catch (error) {
    return res.status(400).json({ detail: error.message })
  }
})

router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)
    if (!task) return res.status(404).json({ detail: 'Task not found' })
    return res.json({ detail: 'Task deleted' })
  } catch (error) {
    return res.status(500).json({ detail: error.message })
  }
})

export default router

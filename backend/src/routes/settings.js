import express from 'express'
import Setting from '../models/Setting.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

router.get('/', protect, async (req, res) => {
  try {
    let setting = await Setting.findOne()
    if (!setting) {
      setting = await Setting.create({ companyName: 'CRM Portal SaaS' })
    }
    return res.json(setting)
  } catch (error) {
    return res.status(500).json({ detail: error.message })
  }
})

router.put('/', protect, authorize('Admin'), async (req, res) => {
  try {
    let setting = await Setting.findOne()
    if (!setting) {
      setting = await Setting.create(req.body)
    } else {
      setting = await Setting.findByIdAndUpdate(setting._id, req.body, { new: true })
    }
    return res.json(setting)
  } catch (error) {
    return res.status(400).json({ detail: error.message })
  }
})

export default router

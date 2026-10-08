import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'

import authRoutes from './routes/auth.js'
import dashboardRoutes from './routes/dashboard.js'
import customersRoutes from './routes/customers.js'
import leadsRoutes from './routes/leads.js'
import contactsRoutes from './routes/contacts.js'
import dealsRoutes from './routes/deals.js'
import tasksRoutes from './routes/tasks.js'
import invoicesRoutes from './routes/invoices.js'
import quotationsRoutes from './routes/quotations.js'
import employeesRoutes from './routes/employees.js'
import reportsRoutes from './routes/reports.js'
import notificationsRoutes from './routes/notifications.js'
import settingsRoutes from './routes/settings.js'

dotenv.config()

// Connect to MongoDB Atlas
connectDB()

const app = express()

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

// Root / health check
app.get('/', (req, res) => {
  res.json({
    message: 'CRM Portal Node.js & MongoDB Atlas Backend is running!',
    status: 'online',
    timestamp: new Date().toISOString(),
  })
})

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', service: 'CRM Portal API', engine: 'Node.js Express + MongoDB Atlas' })
})

// API Routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/dashboard', dashboardRoutes)
app.use('/api/v1/customers', customersRoutes)
app.use('/api/v1/leads', leadsRoutes)
app.use('/api/v1/contacts', contactsRoutes)
app.use('/api/v1/deals', dealsRoutes)
app.use('/api/v1/tasks', tasksRoutes)
app.use('/api/v1/invoices', invoicesRoutes)
app.use('/api/v1/quotations', quotationsRoutes)
app.use('/api/v1/employees', employeesRoutes)
app.use('/api/v1/reports', reportsRoutes)
app.use('/api/v1/notifications', notificationsRoutes)
app.use('/api/v1/settings', settingsRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ detail: `Route not found: ${req.method} ${req.originalUrl}` })
})

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err)
  res.status(err.status || 500).json({
    detail: err.message || 'Internal Server Error',
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`=======================================================`)
  console.log(` CRM Portal Node.js Server listening on port ${PORT} `)
  console.log(` MongoDB Atlas ready | URL: http://localhost:${PORT}`)
  console.log(`=======================================================`)
})

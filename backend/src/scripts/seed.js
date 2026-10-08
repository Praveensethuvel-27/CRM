import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User.js'
import Customer from '../models/Customer.js'
import Contact from '../models/Contact.js'
import Lead from '../models/Lead.js'
import Deal from '../models/Deal.js'
import Task from '../models/Task.js'
import Invoice from '../models/Invoice.js'
import Quotation from '../models/Quotation.js'
import Activity from '../models/Activity.js'
import Notification from '../models/Notification.js'
import Setting from '../models/Setting.js'

dotenv.config()

const seed = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/crm_portal'
    console.log(`[Seed] Connecting to MongoDB Atlas: ${mongoUri.split('@')[1] || mongoUri}`)
    await mongoose.connect(mongoUri)

    console.log('[Seed] Clearing existing collections...')
    await Promise.all([
      User.deleteMany({}),
      Customer.deleteMany({}),
      Contact.deleteMany({}),
      Lead.deleteMany({}),
      Deal.deleteMany({}),
      Task.deleteMany({}),
      Invoice.deleteMany({}),
      Quotation.deleteMany({}),
      Activity.deleteMany({}),
      Notification.deleteMany({}),
      Setting.deleteMany({}),
    ])

    console.log('[Seed] Seeding Users...')
    const admin = await User.create({
      fullName: 'Platform Admin',
      email: 'admin@crm.local',
      password: 'Admin123!',
      role: 'Admin',
      department: 'Management',
      phone: '+1 555-0100',
    })

    const manager = await User.create({
      fullName: 'Sarah Jenkins',
      email: 'manager@crm.local',
      password: 'Manager123!',
      role: 'Manager',
      department: 'Sales',
      phone: '+1 555-0101',
    })

    const employee = await User.create({
      fullName: 'Alex Morgan',
      email: 'employee@crm.local',
      password: 'Employee123!',
      role: 'Employee',
      department: 'Support',
      phone: '+1 555-0102',
    })

    console.log('[Seed] Seeding Customers...')
    const customers = await Customer.create([
      {
        companyName: 'Acme Corporation',
        industry: 'Technology & Cloud',
        address: '100 Silicon Way, San Francisco, CA',
        email: 'info@acme.com',
        phone: '+1 555-0199',
        owner: admin._id,
        status: 'active',
        annualRevenue: 1200000,
      },
      {
        companyName: 'Global Horizon Logistics',
        industry: 'Supply Chain',
        address: '450 Harbor Blvd, Chicago, IL',
        email: 'support@globalhorizon.com',
        phone: '+1 555-0240',
        owner: manager._id,
        status: 'active',
        annualRevenue: 850000,
      },
      {
        companyName: 'Nexus BioHealth',
        industry: 'Healthcare & Pharma',
        address: '88 Medical Plaza, Boston, MA',
        email: 'partners@nexusbio.com',
        phone: '+1 555-0388',
        owner: employee._id,
        status: 'lead',
        annualRevenue: 430000,
      },
    ])

    console.log('[Seed] Seeding Contacts...')
    await Contact.create([
      {
        customerId: customers[0]._id,
        firstName: 'Lina',
        lastName: 'Patel',
        email: 'lina@acme.com',
        phone: '+1 555-0199',
        jobTitle: 'VP of Technology',
        companyName: 'Acme Corporation',
      },
      {
        customerId: customers[1]._id,
        firstName: 'Marcus',
        lastName: 'Vance',
        email: 'marcus@globalhorizon.com',
        phone: '+1 555-0241',
        jobTitle: 'Operations Director',
        companyName: 'Global Horizon Logistics',
      },
    ])

    console.log('[Seed] Seeding Leads...')
    await Lead.create([
      {
        title: 'Enterprise Cloud Migration',
        description: 'Multi-region AWS to Hybrid cloud consultation contract',
        source: 'Inbound Website',
        status: 'Qualified',
        value: 48000,
        assignedTo: admin._id,
        customerId: customers[0]._id,
        email: 'tech@acme.com',
        phone: '+1 555-0199',
      },
      {
        title: 'Logistics Fleet Tracking Software',
        description: 'Real-time GPS dispatch & telemetry integration',
        source: 'Referral',
        status: 'Proposal',
        value: 32000,
        assignedTo: manager._id,
        customerId: customers[1]._id,
        email: 'fleet@globalhorizon.com',
        phone: '+1 555-0240',
      },
      {
        title: 'Hospital Telehealth CRM Suite',
        description: 'Patient appointment sync and automated follow-ups',
        source: 'LinkedIn Campaign',
        status: 'New',
        value: 19500,
        assignedTo: employee._id,
        customerId: customers[2]._id,
        email: 'partners@nexusbio.com',
        phone: '+1 555-0388',
      },
    ])

    console.log('[Seed] Seeding Deals...')
    await Deal.create([
      {
        title: 'Acme Corp Annual SaaS License',
        stage: 'Proposal',
        amount: 85000,
        customerId: customers[0]._id,
        customerName: 'Acme Corporation',
        owner: admin._id,
        closeDate: new Date(Date.now() + 15 * 86400000),
        status: 'open',
        probability: 75,
      },
      {
        title: 'Horizon Logistics API Integration',
        stage: 'Negotiation',
        amount: 45000,
        customerId: customers[1]._id,
        customerName: 'Global Horizon Logistics',
        owner: manager._id,
        closeDate: new Date(Date.now() + 20 * 86400000),
        status: 'open',
        probability: 60,
      },
      {
        title: 'Nexus Pilot Implementation',
        stage: 'Closed Won',
        amount: 28000,
        customerId: customers[2]._id,
        customerName: 'Nexus BioHealth',
        owner: employee._id,
        closeDate: new Date(),
        status: 'won',
        probability: 100,
      },
    ])

    console.log('[Seed] Seeding Tasks...')
    await Task.create([
      {
        title: 'Follow up with Acme Corp regarding enterprise contract',
        description: 'Send revision 2 of the security compliance addendum',
        assignedTo: admin._id,
        dueDate: new Date(Date.now() + 2 * 86400000),
        status: 'pending',
        priority: 'high',
        relatedType: 'Customer',
      },
      {
        title: 'Prepare demo for Nexus BioHealth team',
        description: 'Showcase patient intake and custom notification workflows',
        assignedTo: manager._id,
        dueDate: new Date(Date.now() + 4 * 86400000),
        status: 'in_progress',
        priority: 'medium',
        relatedType: 'Deal',
      },
      {
        title: 'Audit quarterly invoice reconciliation',
        description: 'Review pending payments for Q3',
        assignedTo: employee._id,
        dueDate: new Date(Date.now() + 7 * 86400000),
        status: 'pending',
        priority: 'low',
        relatedType: 'Billing',
      },
    ])

    console.log('[Seed] Seeding Invoices & Quotations...')
    await Invoice.create([
      {
        reference: 'INV-1001',
        customerName: 'Acme Corporation',
        customerId: customers[0]._id,
        total: 18500,
        status: 'paid',
        dueDate: new Date(Date.now() - 5 * 86400000),
      },
      {
        reference: 'INV-1002',
        customerName: 'Global Horizon Logistics',
        customerId: customers[1]._id,
        total: 24000,
        status: 'unpaid',
        dueDate: new Date(Date.now() + 14 * 86400000),
      },
    ])

    await Quotation.create([
      {
        reference: 'QUO-2001',
        customerName: 'Acme Corporation',
        customerId: customers[0]._id,
        total: 85000,
        status: 'accepted',
        validUntil: new Date(Date.now() + 20 * 86400000),
      },
      {
        reference: 'QUO-2002',
        customerName: 'Nexus BioHealth',
        customerId: customers[2]._id,
        total: 28000,
        status: 'sent',
        validUntil: new Date(Date.now() + 12 * 86400000),
      },
    ])

    console.log('[Seed] Seeding Activities & Notifications...')
    await Activity.create([
      {
        userId: admin._id,
        subject: 'Database migrated to MongoDB Atlas',
        details: 'Seamless backend transition to Node.js & Mongoose',
        type: 'system',
      },
      {
        userId: manager._id,
        subject: 'Enterprise deal proposal sent to Acme Corp',
        details: 'Quote #QUO-2001 delivered with 15% annual rebate',
        type: 'deal',
      },
      {
        userId: employee._id,
        subject: 'New contact Lina Patel registered',
        details: 'Acme Corp VP of Technology added to directory',
        type: 'contact',
      },
    ])

    await Notification.create([
      {
        userId: admin._id,
        title: 'Backend Migration Complete',
        message: 'Your CRM backend is now running on Node.js and MongoDB Atlas with a clean Light UI.',
        isRead: false,
      },
      {
        userId: admin._id,
        title: 'New Enterprise Deal Created',
        message: 'Acme Corp Annual SaaS License ($85,000) added to pipeline.',
        isRead: false,
      },
    ])

    await Setting.create({
      companyName: 'LeadDesk',
      companyAddress: '100 Innovation Blvd, Suite 400',
      companyPhone: '+1 (555) 019-2834',
      companyEmail: 'contact@leaddesk.io',
      logoUrl: '/logo.png',
      currency: 'USD ($)',
      timezone: 'UTC',
    })

    console.log('✅ [Seed Completed Successfully!]')
    console.log('----------------------------------------------------')
    console.log('Admin Login:    admin@crm.local    | Password: Admin123!')
    console.log('Manager Login:  manager@crm.local  | Password: Manager123!')
    console.log('Employee Login: employee@crm.local | Password: Employee123!')
    console.log('----------------------------------------------------')

    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

seed()

import mongoose from 'mongoose'

const settingSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      default: 'CRM Portal SaaS',
    },
    companyAddress: {
      type: String,
      default: '100 Innovation Blvd, Tech Park',
    },
    companyPhone: {
      type: String,
      default: '+1 (555) 019-2834',
    },
    companyEmail: {
      type: String,
      default: 'contact@crmportal.io',
    },
    currency: {
      type: String,
      default: 'USD ($)',
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    logoUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Setting', settingSchema)

import mongoose from 'mongoose'

const leadSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Lead title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    source: {
      type: String,
      default: 'Website',
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'],
      default: 'New',
    },
    value: {
      type: Number,
      default: 0,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      default: null,
    },
    email: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    convertedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Lead', leadSchema)

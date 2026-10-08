import mongoose from 'mongoose'

const dealSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Deal title is required'],
      trim: true,
    },
    stage: {
      type: String,
      enum: ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'],
      default: 'Prospecting',
    },
    amount: {
      type: Number,
      default: 0,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      default: null,
    },
    customerName: {
      type: String,
      default: '',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    closeDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['open', 'won', 'lost'],
      default: 'open',
    },
    probability: {
      type: Number,
      default: 50,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Deal', dealSchema)

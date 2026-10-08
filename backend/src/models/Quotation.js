import mongoose from 'mongoose'

const quotationSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      default: null,
    },
    total: {
      type: Number,
      required: true,
      default: 0,
    },
    validUntil: {
      type: Date,
      default: () => new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    },
    status: {
      type: String,
      enum: ['draft', 'sent', 'accepted', 'rejected'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Quotation', quotationSchema)

import mongoose from 'mongoose'

const invoiceSchema = new mongoose.Schema(
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
    dueDate: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    status: {
      type: String,
      enum: ['unpaid', 'paid', 'overdue', 'cancelled'],
      default: 'unpaid',
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Invoice', invoiceSchema)

import mongoose from 'mongoose'

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    subject: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'system',
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Activity', activitySchema)

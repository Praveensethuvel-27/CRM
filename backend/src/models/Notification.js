import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      default: '',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'info',
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Notification', notificationSchema)

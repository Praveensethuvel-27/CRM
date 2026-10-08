import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/crm_portal'
    const conn = await mongoose.connect(mongoUri)
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`)
  } catch (error) {
    console.error(`[MongoDB Connection Error] ${error.message}`)
    console.error('Please make sure your MONGODB_URI in backend/.env is set correctly with your MongoDB Atlas connection string.')
    // Don't exit process so server can keep running or retry if needed
  }
}

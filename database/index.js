// database/index.js
import mongoose from 'mongoose'

const URI = process.env.DB_URI || 'mongodb://127.0.0.1:27017/pixxxry-api'

export async function connectDB() {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('🗄️ Database connected')
  } catch (err) {
    console.error('❌ DB Error:', err.message)
  }
}
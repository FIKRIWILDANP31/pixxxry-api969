// database/models/users.js
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  plan: { type: String, default: 'free' },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('User', userSchema)
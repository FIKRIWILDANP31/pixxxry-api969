// database/models/request_logs.js
import mongoose from 'mongoose'

const logSchema = new mongoose.Schema({
  ip: String,
  endpoint: String,
  method: String,
  status: Number,
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('RequestLog', logSchema)
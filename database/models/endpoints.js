// database/models/endpoints.js
import mongoose from 'mongoose'

const endpointSchema = new mongoose.Schema({
  name: String,
  slug: String,
  category: String,
  method: String,
  path: String,
  params: Array,
  visibility: String,
  badge: String,
  status: String,
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('Endpoint', endpointSchema)
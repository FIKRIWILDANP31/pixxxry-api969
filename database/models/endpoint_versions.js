// database/models/endpoint_versions.js
import mongoose from 'mongoose'

const versionSchema = new mongoose.Schema({
  endpointId: mongoose.Schema.Types.ObjectId,
  version: String,
  data: Object,
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('EndpointVersion', versionSchema)
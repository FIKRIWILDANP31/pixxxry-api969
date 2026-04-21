// database/models/scrape_results.js
import mongoose from 'mongoose'

const scrapeSchema = new mongoose.Schema({
  source_name: String,
  raw_json: Object,
  mapped_endpoint: String,
  publish_status: { type: String, default: 'draft' },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('ScrapeResult', scrapeSchema)
// middleware/logger.js
import { logRequest } from '../services/logger.js'

export function logger(req, res, next) {
  logRequest(req)
  next()
}
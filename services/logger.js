// services/logger.js
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const logDir = path.join(__dirname, '../logs')

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

const logFile = path.join(logDir, 'access.log')
const errorFile = path.join(logDir, 'error.log')

export function logRequest(req) {
  const log = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${req.ip}\n`
  fs.appendFileSync(logFile, log)
}

export function logError(err) {
  const log = `[${new Date().toISOString()}] ERROR: ${err}\n`
  fs.appendFileSync(errorFile, log)
}
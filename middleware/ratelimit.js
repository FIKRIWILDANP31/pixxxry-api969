// middleware/rateLimit.js
const rateMap = new Map()

export function rateLimit(req, res, next) {
  const ip = req.ip
  const now = Date.now()
  const windowMs = Number(process.env.RATE_LIMIT_WINDOW || 60000)
  const max = Number(process.env.RATE_LIMIT_MAX || 60)

  if (!rateMap.has(ip)) {
    rateMap.set(ip, { count: 1, time: now })
    return next()
  }

  const data = rateMap.get(ip)

  if (now - data.time > windowMs) {
    rateMap.set(ip, { count: 1, time: now })
    return next()
  }

  data.count++

  if (data.count > max) {
    return res.status(429).json({
      status: false,
      code: 429,
      message: 'Terlalu banyak request'
    })
  }

  next()
}
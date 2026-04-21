// middleware/admin.js
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin_secret'

export function requireAdmin(req, res, next) {
  const token = req.headers['x-admin-token'] || req.query.admin_token

  if (!token) {
    return res.status(401).json({
      status: false,
      code: 401,
      message: 'Token admin diperlukan'
    })
  }

  if (token !== ADMIN_TOKEN) {
    return res.status(403).json({
      status: false,
      code: 403,
      message: 'Akses ditolak'
    })
  }

  next()
}
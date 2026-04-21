// middleware/auth.js
export function requireAuth(req, res, next) {
  if (!req.cookies?.session) {
    return res.status(401).json({
      status: false,
      code: 401,
      message: 'Unauthorized'
    })
  }
  next()
}
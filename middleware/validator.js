// middleware/validator.js
export function requireQuery(params = []) {
  return (req, res, next) => {
    for (const p of params) {
      if (!req.query[p]) {
        return res.status(400).json({
          status: false,
          code: 400,
          message: `${p} diperlukan`
        })
      }
    }
    next()
  }
}

export function requireBody(params = []) {
  return (req, res, next) => {
    for (const p of params) {
      if (!req.body[p]) {
        return res.status(400).json({
          status: false,
          code: 400,
          message: `${p} diperlukan`
        })
      }
    }
    next()
  }
}
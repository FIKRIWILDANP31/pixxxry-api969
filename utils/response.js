// utils/response.js
export const ok = (res, result = {}, code = 200) => {
  return res.status(code).json({
    status: true,
    code,
    result
  })
}

export const fail = (res, message = 'Bad request', code = 400) => {
  return res.status(code).json({
    status: false,
    code,
    message
  })
}
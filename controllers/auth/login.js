// controllers/auth/login.js
export default async function login(req, res) {
  const { username } = req.body

  if (!username) {
    return res.status(400).json({
      status: false,
      code: 400,
      message: 'username diperlukan'
    })
  }

  res.cookie('session', 'dummy_session_token')

  return res.json({
    status: true,
    code: 200,
    result: {
      message: 'Login berhasil',
      username
    }
  })
}
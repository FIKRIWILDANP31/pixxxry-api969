// controllers/auth/register.js
export default async function register(req, res) {
  const { username } = req.body

  if (!username) {
    return res.status(400).json({
      status: false,
      code: 400,
      message: 'username diperlukan'
    })
  }

  return res.json({
    status: true,
    code: 200,
    result: {
      message: 'Register berhasil',
      username
    }
  })
}
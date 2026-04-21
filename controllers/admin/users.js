// controllers/admin/users.js
export default async function users(req, res) {
  return res.json({
    status: true,
    code: 200,
    result: [
      { id: 1, username: 'user1' }
    ]
  })
}
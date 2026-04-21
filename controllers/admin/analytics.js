// controllers/admin/analytics.js
export default async function analytics(req, res) {
  return res.json({
    status: true,
    code: 200,
    result: {
      total_endpoint: 10,
      total_request: 100000
    }
  })
}
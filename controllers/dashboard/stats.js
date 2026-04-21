// controllers/dashboard/stats.js
export default async function stats(req, res) {
  return res.json({
    status: true,
    code: 200,
    result: {
      total_request: 12034,
      today_request: 534,
      user: {
        username: 'demo_user',
        plan: 'free'
      }
    }
  })
}
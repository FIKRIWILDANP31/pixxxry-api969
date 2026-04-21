// controllers/admin/scrape.js
export default async function scrape(req, res) {
  return res.json({
    status: true,
    code: 200,
    result: {
      message: 'Scrape dummy berhasil'
    }
  })
}
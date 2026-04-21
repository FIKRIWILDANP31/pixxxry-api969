// controllers/search/pinterest.js
export default async function pinterest(req, res) {
  const { q } = req.query
  if (!q) {
    return res.status(400).json({
      status: false,
      code: 400,
      message: 'query diperlukan'
    })
  }

  return res.json({
    status: true,
    code: 200,
    result: {
      title: 'Pinterest Search',
      data: [{ image: 'https://example.com/img.jpg' }]
    }
  })
}
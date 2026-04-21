// controllers/downloader/instagram.js
export default async function instagram(req, res) {
  const { url } = req.query
  if (!url) {
    return res.status(400).json({
      status: false,
      code: 400,
      message: 'url diperlukan'
    })
  }

  return res.json({
    status: true,
    code: 200,
    result: {
      title: 'Instagram Downloader',
      data: {
        url,
        media: 'https://example.com/media.jpg'
      }
    }
  })
}
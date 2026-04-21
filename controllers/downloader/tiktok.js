// controllers/downloader/tiktok.js
export default async function tiktok(req, res) {
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
      title: 'TikTok Video',
      data: {
        url,
        video: 'https://example.com/video.mp4'
      }
    }
  })
}
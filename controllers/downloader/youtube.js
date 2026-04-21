// controllers/downloader/youtube.js
export default async function youtube(req, res) {
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
      title: 'YouTube Downloader',
      data: {
        url,
        audio: 'https://example.com/audio.mp3'
      }
    }
  })
}
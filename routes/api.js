import express from 'express'

const router = express.Router()

// ===== RESPONSE FORMAT =====
const ok = (res, result = {}, code = 200) => {
  return res.status(code).json({
    status: true,
    code,
    result
  })
}

const fail = (res, message = 'Bad request', code = 400) => {
  return res.status(code).json({
    status: false,
    code,
    message
  })
}

// ===== BASIC =====
router.get('/health', (req, res) => {
  return ok(res, {
    message: 'API berjalan',
    time: Date.now()
  })
})

// ===== DOWNLOADER =====
router.get('/downloader/tiktok', (req, res) => {
  const { url } = req.query
  if (!url) return fail(res, 'url diperlukan')

  return ok(res, {
    title: 'TikTok Downloader',
    data: {
      url,
      video: 'https://example.com/video.mp4'
    }
  })
})

router.get('/downloader/youtube', (req, res) => {
  const { url } = req.query
  if (!url) return fail(res, 'url diperlukan')

  return ok(res, {
    title: 'YouTube Downloader',
    data: {
      url,
      audio: 'https://example.com/audio.mp3'
    }
  })
})

router.get('/downloader/instagram', (req, res) => {
  const { url } = req.query
  if (!url) return fail(res, 'url diperlukan')

  return ok(res, {
    title: 'Instagram Downloader',
    data: {
      url,
      media: 'https://example.com/media.jpg'
    }
  })
})

// ===== SEARCH =====
router.get('/search/pinterest', (req, res) => {
  const { q } = req.query
  if (!q) return fail(res, 'query diperlukan')

  return ok(res, {
    title: 'Pinterest Search',
    data: [{ image: 'https://example.com/img.jpg' }]
  })
})

router.get('/search/youtube', (req, res) => {
  const { q } = req.query
  if (!q) return fail(res, 'query diperlukan')

  return ok(res, {
    title: 'YouTube Search',
    data: [{ title: 'Video Example' }]
  })
})

// ===== AI =====
router.get('/ai/chat', (req, res) => {
  const { prompt } = req.query
  if (!prompt) return fail(res, 'prompt diperlukan')

  return ok(res, {
    title: 'AI Chat',
    data: {
      response: 'Ini adalah respon AI dummy'
    }
  })
})

router.get('/ai/image-prompt', (req, res) => {
  const { prompt } = req.query
  if (!prompt) return fail(res, 'prompt diperlukan')

  return ok(res, {
    title: 'AI Image',
    data: {
      image: 'https://example.com/image.png'
    }
  })
})

// ===== TOOLS =====
router.get('/tools/removebg', (req, res) => {
  return ok(res, {
    title: 'Remove Background',
    data: {
      image: 'https://example.com/no-bg.png'
    }
  })
})

router.get('/tools/ocr', (req, res) => {
  return ok(res, {
    title: 'OCR Result',
    data: {
      text: 'Detected text example'
    }
  })
})

// ===== ANIME =====
router.get('/anime/quote', (req, res) => {
  return ok(res, {
    title: 'Anime Quote',
    data: {
      quote: 'Believe in yourself!',
      character: 'Naruto'
    }
  })
})

// ===== STALKER =====
router.get('/stalker/ff', (req, res) => {
  return ok(res, {
    title: 'Free Fire Stalker',
    data: {
      username: 'Player123'
    }
  })
})

// ===== RANDOM =====
router.get('/random/wallpaper', (req, res) => {
  return ok(res, {
    title: 'Random Wallpaper',
    data: {
      image: 'https://example.com/wallpaper.jpg'
    }
  })
})

export default router
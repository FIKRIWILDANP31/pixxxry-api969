import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import session from 'express-session'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as GitHubStrategy } from 'passport-github2'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = Number(process.env.PORT || 3000)
const IS_PROD = process.env.NODE_ENV === 'production'

if (IS_PROD) {
  app.set('trust proxy', 1)
}

/* =======================
   DEBUG ENV
======================= */
console.log('='.repeat(50))
console.log('ENV CHECK')
console.log(`GOOGLE_CLIENT_ID     : ${process.env.GOOGLE_CLIENT_ID ? 'ADA' : 'KOSONG'}`)
console.log(`GOOGLE_CLIENT_SECRET : ${process.env.GOOGLE_CLIENT_SECRET ? 'ADA' : 'KOSONG'}`)
console.log(`GOOGLE_CALLBACK_URL  : ${process.env.GOOGLE_CALLBACK_URL || 'KOSONG'}`)
console.log(`GITHUB_CLIENT_ID     : ${process.env.GITHUB_CLIENT_ID ? 'ADA' : 'KOSONG'}`)
console.log(`GITHUB_CLIENT_SECRET : ${process.env.GITHUB_CLIENT_SECRET ? 'ADA' : 'KOSONG'}`)
console.log(`GITHUB_CALLBACK_URL  : ${process.env.GITHUB_CALLBACK_URL || 'KOSONG'}`)
console.log('='.repeat(50))

/* =======================
   GLOBAL CONFIG
======================= */
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan('dev'))

/* =======================
   SESSION
======================= */
app.use(session({
  name: 'pixxxry.sid',
  secret: process.env.SESSION_SECRET || 'pixxxry-secret-session',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}))

/* =======================
   PASSPORT
======================= */
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    'google',
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:
          process.env.GOOGLE_CALLBACK_URL ||
          'http://localhost:3000/auth/google/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = {
            provider: 'google',
            id: profile.id,
            displayName: profile.displayName,
            email: profile.emails?.[0]?.value || null,
            photo: profile.photos?.[0]?.value || null
          }
          return done(null, user)
        } catch (error) {
          return done(error, null)
        }
      }
    )
  )
  console.log('✅ Google strategy registered')
} else {
  console.log('⚠️ Google strategy skipped')
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    'github',
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL:
          process.env.GITHUB_CALLBACK_URL ||
          'http://localhost:3000/auth/github/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = {
            provider: 'github',
            id: profile.id,
            displayName: profile.displayName || profile.username,
            username: profile.username || null,
            email: profile.emails?.[0]?.value || null,
            photo: profile.photos?.[0]?.value || null
          }
          return done(null, user)
        } catch (error) {
          return done(error, null)
        }
      }
    )
  )
  console.log('✅ GitHub strategy registered')
} else {
  console.log('⚠️ GitHub strategy skipped')
}

/* =======================
   STATIC WEB
======================= */
app.use(express.static(path.join(__dirname, 'public')))

/* =======================
   HELPER RESPONSE
======================= */
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

/* =======================
   SIMPLE RATE LIMIT
======================= */
const rateMap = new Map()

function rateLimit(req, res, next) {
  const ip = req.ip
  const now = Date.now()
  const WINDOW = 60_000
  const MAX = 60

  if (!rateMap.has(ip)) {
    rateMap.set(ip, { count: 1, time: now })
    return next()
  }

  const data = rateMap.get(ip)

  if (now - data.time > WINDOW) {
    rateMap.set(ip, { count: 1, time: now })
    return next()
  }

  data.count += 1

  if (data.count > MAX) {
    return fail(res, 'Terlalu banyak request', 429)
  }

  next()
}

app.use('/api', rateLimit)

/* =======================
   AUTH HELPER
======================= */
function isLogin(req) {
  return typeof req.isAuthenticated === 'function' && req.isAuthenticated()
}

function requireLogin(req, res, next) {
  if (isLogin(req)) return next()
  return res.redirect('/login')
}

/* =======================
   WEB ROUTES
======================= */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get('/login', (req, res) => {
  if (isLogin(req)) return res.redirect('/dashboard')
  res.sendFile(path.join(__dirname, 'public', 'login.html'))
})

app.get('/register', (req, res) => {
  if (isLogin(req)) return res.redirect('/dashboard')
  res.sendFile(path.join(__dirname, 'public', 'register.html'))
})

app.get('/dashboard', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'))
})

app.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err)

    req.session.destroy(() => {
      res.clearCookie('pixxxry.sid')
      res.clearCookie('connect.sid')
      return res.redirect('/login')
    })
  })
})

/* =======================
   OAUTH ROUTES
======================= */
app.get('/auth/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return fail(res, 'OAuth Google belum dikonfigurasi', 500)
  }
  return next()
}, passport.authenticate('google', {
  scope: ['profile', 'email'],
  prompt: 'select_account'
}))

app.get(
  '/auth/google/callback',
  (req, res, next) => {
    if (!req.query.code) {
      return fail(res, 'Code callback Google tidak ada', 400)
    }
    return next()
  },
  passport.authenticate('google', {
    failureRedirect: '/login'
  }),
  (req, res) => {
    return res.redirect('/dashboard')
  }
)

app.get('/auth/github', (req, res, next) => {
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    return fail(res, 'OAuth GitHub belum dikonfigurasi', 500)
  }
  return next()
}, passport.authenticate('github', {
  scope: ['user:email']
}))

app.get(
  '/auth/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/login'
  }),
  (req, res) => {
    return res.redirect('/dashboard')
  }
)

/* =======================
   AUTH API
======================= */
app.post('/api/auth/register', (req, res) => {
  const { username, email, password, confirmPassword } = req.body

  if (!username || !email || !password || !confirmPassword) {
    return fail(res, 'Semua field wajib diisi', 400)
  }

  if (password.length < 8) {
    return fail(res, 'Password minimal 8 karakter', 400)
  }

  if (password !== confirmPassword) {
    return fail(res, 'Konfirmasi password tidak sama', 400)
  }

  return ok(res, {
    message: 'Register berhasil',
    user: {
      username,
      email
    }
  })
})

app.post('/api/auth/login', (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return fail(res, 'Email dan password wajib diisi', 400)
  }

  if (password.length < 6) {
    return fail(res, 'Email atau password salah', 400)
  }

  const user = {
    provider: 'local',
    id: Date.now().toString(),
    displayName: email.split('@')[0],
    email
  }

  req.login(user, (err) => {
    if (err) return next(err)

    return ok(res, {
      message: 'Login berhasil',
      user: req.user
    })
  })
})

app.get('/api/auth/me', (req, res) => {
  if (!isLogin(req)) {
    return fail(res, 'Unauthorized', 401)
  }

  return ok(res, {
    user: req.user
  })
})

/* =======================
   API ENDPOINTS
======================= */
app.get('/api/health', (req, res) => {
  return ok(res, {
    message: 'API berjalan normal',
    uptime: process.uptime(),
    timestamp: Date.now()
  })
})

/* ===== DOWNLOADER ===== */
app.get('/api/downloader/tiktok', (req, res) => {
  const { url } = req.query
  if (!url) return fail(res, 'url diperlukan')

  return ok(res, {
    title: 'TikTok Video',
    data: {
      url,
      video: 'https://example.com/video.mp4'
    }
  })
})

app.get('/api/downloader/youtube', (req, res) => {
  const { url } = req.query
  if (!url) return fail(res, 'url diperlukan')

  return ok(res, {
    title: 'YouTube Video',
    data: {
      url,
      audio: 'https://example.com/audio.mp3'
    }
  })
})

app.get('/api/downloader/instagram', (req, res) => {
  const { url } = req.query
  if (!url) return fail(res, 'url diperlukan')

  return ok(res, {
    title: 'Instagram Media',
    data: {
      url,
      media: 'https://example.com/media.jpg'
    }
  })
})

/* ===== SEARCH ===== */
app.get('/api/search/pinterest', (req, res) => {
  const { q } = req.query
  if (!q) return fail(res, 'query diperlukan')

  return ok(res, {
    title: 'Pinterest Search',
    data: [{ image: 'https://example.com/img.jpg' }]
  })
})

app.get('/api/search/youtube', (req, res) => {
  const { q } = req.query
  if (!q) return fail(res, 'query diperlukan')

  return ok(res, {
    title: 'YouTube Search',
    data: [{ title: 'Video Example' }]
  })
})

/* ===== AI ===== */
app.get('/api/ai/chat', (req, res) => {
  const { prompt } = req.query
  if (!prompt) return fail(res, 'prompt diperlukan')

  return ok(res, {
    title: 'AI Chat',
    data: {
      response: 'Ini adalah respon AI dummy'
    }
  })
})

app.get('/api/ai/image-prompt', (req, res) => {
  const { prompt } = req.query
  if (!prompt) return fail(res, 'prompt diperlukan')

  return ok(res, {
    title: 'AI Image',
    data: {
      image: 'https://example.com/image.png'
    }
  })
})

/* ===== TOOLS ===== */
app.get('/api/tools/removebg', (req, res) => {
  return ok(res, {
    title: 'Remove BG',
    data: {
      image: 'https://example.com/no-bg.png'
    }
  })
})

app.get('/api/tools/ocr', (req, res) => {
  return ok(res, {
    title: 'OCR Result',
    data: {
      text: 'Detected text example'
    }
  })
})

/* ===== ANIME ===== */
app.get('/api/anime/quote', (req, res) => {
  return ok(res, {
    title: 'Anime Quote',
    data: {
      quote: 'Believe in yourself!',
      character: 'Naruto'
    }
  })
})

/* ===== STALKER ===== */
app.get('/api/stalker/ff', (req, res) => {
  return ok(res, {
    title: 'Free Fire Stalker',
    data: {
      username: 'Player123'
    }
  })
})

/* ===== RANDOM ===== */
app.get('/api/random/wallpaper', (req, res) => {
  return ok(res, {
    title: 'Random Wallpaper',
    data: {
      image: 'https://example.com/wallpaper.jpg'
    }
  })
})

/* =======================
   404 & ERROR
======================= */
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'))
})

app.use((err, req, res, next) => {
  console.error('ERROR DETAIL:', err)
  return res.status(500).json({
    status: false,
    code: 500,
    message: err.message || 'Internal Server Error'
  })
})

/* =======================
   START SERVER
======================= */
app.listen(PORT, () => {
  console.log('='.repeat(50))
  console.log('🚀 PIXXXRY API PLATFORM')
  console.log(`🌐 http://localhost:${PORT}`)
  console.log(`📡 http://localhost:${PORT}/api`)
  console.log(`🔐 Google OAuth : ${process.env.GOOGLE_CLIENT_ID ? 'ON' : 'OFF'}`)
  console.log(`🐙 GitHub OAuth : ${process.env.GITHUB_CLIENT_ID ? 'ON' : 'OFF'}`)
  console.log('='.repeat(50))
})
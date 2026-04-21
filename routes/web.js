import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const router = express.Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PUBLIC = path.join(__dirname, '../public')

const send = (res, file) => res.sendFile(path.join(PUBLIC, file))

// basic auth check (cookie-based optional)
const isLogin = (req) => Boolean(req.cookies?.session)

// ===== PUBLIC PAGES =====
router.get('/', (req, res) => send(res, 'index.html'))

router.get('/login', (req, res) => {
  if (isLogin(req)) return res.redirect('/dashboard')
  send(res, 'login.html')
})

router.get('/register', (req, res) => {
  if (isLogin(req)) return res.redirect('/dashboard')
  send(res, 'register.html')
})

router.get('/pricing', (req, res) => send(res, 'pricing.html'))
router.get('/showcase', (req, res) => send(res, 'showcase.html'))
router.get('/feedback', (req, res) => send(res, 'feedback.html'))
router.get('/status', (req, res) => send(res, 'status.html'))
router.get('/changelog', (req, res) => send(res, 'changelog.html'))
router.get('/contact', (req, res) => send(res, 'contact.html'))
router.get('/privacy', (req, res) => send(res, 'privacy.html'))
router.get('/terms', (req, res) => send(res, 'terms.html'))

// ===== PROTECTED PAGES =====
router.get('/dashboard', (req, res) => {
  if (!isLogin(req)) return res.redirect('/login')
  send(res, 'dashboard.html')
})

router.get('/docs', (req, res) => {
  if (!isLogin(req)) return res.redirect('/login')
  send(res, 'docs.html')
})

// ===== SPECIAL PAGES =====
router.get('/banned', (req, res) => send(res, 'banned.html'))
router.get('/404', (req, res) => res.status(404).sendFile(path.join(PUBLIC, '404.html')))

// ===== HTML ALIAS (redirect .html → clean URL) =====
router.get('/:page.html', (req, res) => {
  const { page } = req.params
  return res.redirect(`/${page}`)
})

// ===== AUTO MAP (clean URL → file.html) =====
router.get('/:page', (req, res, next) => {
  const file = `${req.params.page}.html`
  const full = path.join(PUBLIC, file)

  if (require('fs').existsSync(full)) {
    return res.sendFile(full)
  }

  next()
})

export default router
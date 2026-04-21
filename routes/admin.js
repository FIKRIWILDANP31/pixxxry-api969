import express from 'express'

const router = express.Router()

// ===== RESPONSE =====
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

// ===== SIMPLE ADMIN AUTH =====
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin_secret'

function adminAuth(req, res, next) {
  const token = req.headers['x-admin-token'] || req.query.admin_token
  if (!token) return fail(res, 'Token admin diperlukan', 401)
  if (token !== ADMIN_TOKEN) return fail(res, 'Token admin tidak valid', 403)
  next()
}

router.use(adminAuth)

// ===== DUMMY STORAGE =====
let endpoints = []
let scrapeResults = []

// ===== ADD ENDPOINT =====
router.post('/endpoint/add', (req, res) => {
  const {
    name,
    slug,
    category,
    method,
    description,
    params,
    visibility,
    badge,
    status
  } = req.body

  if (!name || !slug) return fail(res, 'name & slug wajib')

  const endpoint = {
    id: Date.now(),
    name,
    slug,
    category,
    method: method || 'GET',
    description: description || '',
    params: params || [],
    visibility: visibility || 'free',
    badge: badge || null,
    status: status || 'active',
    path: `/api/${category}/${slug}`,
    created_at: new Date()
  }

  endpoints.push(endpoint)

  return ok(res, endpoint)
})

// ===== LIST ENDPOINT =====
router.get('/endpoint/list', (req, res) => {
  return ok(res, endpoints)
})

// ===== DELETE ENDPOINT =====
router.delete('/endpoint/:id', (req, res) => {
  const id = Number(req.params.id)
  endpoints = endpoints.filter(e => e.id !== id)
  return ok(res, { deleted: true })
})

// ===== IMPORT SCRAPE JSON =====
router.post('/scrape/import', (req, res) => {
  const { source_name, raw_json } = req.body

  if (!raw_json) return fail(res, 'raw_json wajib')

  const scrape = {
    id: Date.now(),
    source_name: source_name || 'unknown',
    raw_json,
    publish_status: 'draft',
    created_at: new Date()
  }

  scrapeResults.push(scrape)

  return ok(res, scrape)
})

// ===== LIST SCRAPE =====
router.get('/scrape/list', (req, res) => {
  return ok(res, scrapeResults)
})

// ===== PUBLISH SCRAPE → ENDPOINT =====
router.post('/scrape/publish/:id', (req, res) => {
  const id = Number(req.params.id)
  const scrape = scrapeResults.find(s => s.id === id)

  if (!scrape) return fail(res, 'scrape tidak ditemukan')

  scrape.publish_status = 'published'

  const endpoint = {
    id: Date.now(),
    name: scrape.source_name,
    slug: `auto-${id}`,
    category: 'auto',
    method: 'GET',
    path: `/api/auto/${id}`,
    visibility: 'free',
    badge: 'new',
    status: 'active',
    sample_response: scrape.raw_json
  }

  endpoints.push(endpoint)

  return ok(res, endpoint)
})

// ===== ANALYTICS (DUMMY) =====
router.get('/analytics', (req, res) => {
  return ok(res, {
    total_endpoint: endpoints.length,
    total_scrape: scrapeResults.length,
    total_request: Math.floor(Math.random() * 100000),
    active_users: Math.floor(Math.random() * 1000)
  })
})

// ===== USERS (DUMMY) =====
router.get('/users', (req, res) => {
  return ok(res, [
    { id: 1, username: 'user1', plan: 'free' },
    { id: 2, username: 'user2', plan: 'pro' }
  ])
})

export default router
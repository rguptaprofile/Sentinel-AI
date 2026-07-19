import { MongoClient } from 'mongodb'
import crypto from 'node:crypto'

const API_PREFIX = '/api/v1'
const USERS_COLLECTION = 'users'
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000
const ALLOWED_ROLES = new Set(['citizen', 'police', 'bank', 'admin'])

let cachedClient
let cachedDb

function normalizeBaseUrl(value) {
  if (!value) return ''
  const trimmed = value.replace(/\/$/, '')
  return trimmed.endsWith(API_PREFIX) ? trimmed : `${trimmed}${API_PREFIX}`
}

function resolveBackendBaseUrl() {
  const backendUrl = normalizeBaseUrl(process.env.BACKEND_API_BASE_URL)
  if (backendUrl && /^https?:\/\//i.test(backendUrl)) return backendUrl

  const viteUrl = normalizeBaseUrl(process.env.VITE_API_BASE_URL)
  if (viteUrl && /^https?:\/\//i.test(viteUrl) && !viteUrl.includes('sentinel-in.vercel.app')) return viteUrl

  return ''
}

function getMongoSettings() {
  const mongoUrl = process.env.MONGODB_URL
  const mongoDbName = process.env.MONGODB_DB_NAME || 'sentinel-ai'
  if (!mongoUrl) {
    throw new Error('MONGODB_URL is not configured.')
  }
  return { mongoUrl, mongoDbName }
}

async function getDatabase() {
  if (cachedDb) return cachedDb

  const { mongoUrl, mongoDbName } = getMongoSettings()
  cachedClient ||= new MongoClient(mongoUrl)
  await cachedClient.connect()
  cachedDb = cachedClient.db(mongoDbName)
  return cachedDb
}

function getSessionSecret() {
  const secret = process.env.AUTH_SESSION_SECRET
  if (!secret) {
    throw new Error('AUTH_SESSION_SECRET is not configured.')
  }
  return secret
}

function base64UrlEncode(value) {
  return Buffer.from(value).toString('base64url')
}

function base64UrlDecode(value) {
  return Buffer.from(value, 'base64url')
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16)
  const digest = crypto.pbkdf2Sync(password, salt, 120000, 32, 'sha256')
  return `pbkdf2_sha256$120000$${salt.toString('hex')}$${digest.toString('hex')}`
}

function verifyPassword(password, storedHash) {
  try {
    const [algorithm, iterations, saltHex, digestHex] = storedHash.split('$')
    if (algorithm !== 'pbkdf2_sha256') return false
    const digest = crypto.pbkdf2Sync(password, Buffer.from(saltHex, 'hex'), Number(iterations), 32, 'sha256')
    return crypto.timingSafeEqual(digest, Buffer.from(digestHex, 'hex'))
  } catch {
    return false
  }
}

function signSession(payload) {
  const body = JSON.stringify(payload, Object.keys(payload).sort())
  const bodyB64 = base64UrlEncode(body)
  const signature = crypto.createHmac('sha256', getSessionSecret()).update(bodyB64).digest()
  return `${bodyB64}.${base64UrlEncode(signature)}`
}

function verifySession(token) {
  try {
    const [bodyB64, signatureB64] = token.split('.')
    const expected = crypto.createHmac('sha256', getSessionSecret()).update(bodyB64).digest()
    const provided = base64UrlDecode(signatureB64)
    if (expected.length !== provided.length || !crypto.timingSafeEqual(expected, provided)) return null

    const payload = JSON.parse(base64UrlDecode(bodyB64).toString('utf8'))
    if (Number(payload.exp || 0) < Date.now()) return null
    return payload
  } catch {
    return null
  }
}

function issueSession(user) {
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS)
  const token = signSession({ sub: user.id, email: user.email, role: user.role, exp: expiresAt.getTime() })
  return { token, expiresAt: expiresAt.toISOString() }
}

function serializeUser(user) {
  const joinedValue = user.joinedAt || user.joined_at || user.created_at || new Date()
  const lastLoginValue = user.lastLogin || user.last_login || null
  return {
    id: user.id ? String(user.id) : user._id ? String(user._id) : '',
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status || 'active',
    avatar: user.avatar ?? null,
    reportsCount: user.reportsCount ?? user.reports_count ?? 0,
    joinedAt: new Date(joinedValue).toISOString().slice(0, 10),
    lastLogin: lastLoginValue ? new Date(lastLoginValue).toISOString() : null,
  }
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string') return req.body ? JSON.parse(req.body) : {}

  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8')
      resolve(raw ? JSON.parse(raw) : {})
    })
    req.on('error', reject)
  })
}

async function handleAuthRoute(path, req, res) {
  if (path.startsWith('auth/') && req.method === 'OPTIONS') {
    res.setHeader('Allow', 'GET,POST,OPTIONS')
    res.status(204).end()
    return true
  }

  if (!['auth/signup', 'auth/signin', 'auth/me'].includes(path)) {
    return false
  }

  const db = await getDatabase()
  const users = db.collection(USERS_COLLECTION)

  if (path === 'auth/signup') {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST,OPTIONS')
      res.status(405).json({ detail: 'Use POST for signup.' })
      return true
    }

    const payload = await readJsonBody(req)
    const email = String(payload?.email || '').trim().toLowerCase()
    const password = String(payload?.password || '')
    const name = String(payload?.name || '').trim()
    const role = ALLOWED_ROLES.has(payload?.role) ? payload.role : 'citizen'

    if (!/^([^@\s]+)@([^@\s]+)\.([^@\s]+)$/.test(email)) {
      res.status(400).json({ detail: 'Invalid email address.' })
      return true
    }
    if (name.length < 2 || password.length < 8) {
      res.status(400).json({ detail: 'Name and password do not meet the minimum requirements.' })
      return true
    }

    const existingUser = await users.findOne({ email })
    if (existingUser) {
      res.status(409).json({ detail: 'Email is already registered.' })
      return true
    }

    const now = new Date()
    const user = {
      id: crypto.randomUUID(),
      name,
      email,
      role,
      password_hash: hashPassword(password),
      status: 'active',
      avatar: null,
      reports_count: 0,
      joined_at: now,
      last_login: now,
      created_at: now,
    }

    await users.insertOne(user)
    res.status(201).json({ user: serializeUser(user), ...issueSession(user) })
    return true
  }

  if (path === 'auth/signin') {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST,OPTIONS')
      res.status(405).json({ detail: 'Use POST for signin.' })
      return true
    }

    const payload = await readJsonBody(req)
    const email = String(payload?.email || '').trim().toLowerCase()
    const password = String(payload?.password || '')
    const role = payload?.role ? String(payload.role) : null

    const user = await users.findOne({ email })
    if (!user || !user.password_hash || !verifyPassword(password, user.password_hash)) {
      res.status(401).json({ detail: 'Invalid email or password.' })
      return true
    }
    if (role && user.role !== role) {
      res.status(403).json({ detail: 'This account does not have the selected role.' })
      return true
    }

    const lastLogin = new Date()
    await users.updateOne({ _id: user._id }, { $set: { last_login: lastLogin } })
    const normalizedUser = { ...user, id: user.id || String(user._id), last_login: lastLogin }
    res.status(200).json({ user: serializeUser(normalizedUser), ...issueSession(normalizedUser) })
    return true
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET,OPTIONS')
    res.status(405).json({ detail: 'Use GET for current user.' })
    return true
  }

  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''
  const payload = verifySession(token)
  if (!payload) {
    res.status(401).json({ detail: 'Invalid or expired session token.' })
    return true
  }

  const user = await users.findOne({ id: payload.sub })
  if (!user) {
    res.status(401).json({ detail: 'Session user not found.' })
    return true
  }

  res.status(200).json({ user: serializeUser(user) })
  return true
}

function readRequestBody(req) {
  if (req.method === 'GET' || req.method === 'HEAD') return Promise.resolve(undefined)

  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
    req.on('end', () => resolve(chunks.length ? Buffer.concat(chunks) : undefined))
    req.on('error', reject)
  })
}

function collectHeaders(headers) {
  const forwarded = {}
  for (const [key, value] of Object.entries(headers)) {
    const normalizedKey = key.toLowerCase()
    if (['host', 'content-length', 'connection'].includes(normalizedKey)) continue
    if (typeof value === 'undefined') continue
    forwarded[key] = Array.isArray(value) ? value.join(', ') : value
  }
  return forwarded
}

async function proxyToBackend(path, req, res, backendBaseUrl) {
  const requestUrl = new URL(req.url, 'http://localhost')
  const targetUrl = new URL(`${path}${requestUrl.search}`, backendBaseUrl.endsWith('/') ? backendBaseUrl : `${backendBaseUrl}/`)
  const upstream = await fetch(targetUrl, {
    method: req.method,
    headers: collectHeaders(req.headers),
    body: await readRequestBody(req),
  })

  res.status(upstream.status)
  upstream.headers.forEach((value, key) => {
    if (key.toLowerCase() !== 'transfer-encoding') res.setHeader(key, value)
  })
  res.send(Buffer.from(await upstream.arrayBuffer()))
}

export default async function handler(req, res) {
  const rawPath = req.query.path
  const path = Array.isArray(rawPath) ? rawPath.join('/') : rawPath || ''

  try {
    if (await handleAuthRoute(path, req, res)) return

    const backendBaseUrl = resolveBackendBaseUrl()
    if (!backendBaseUrl) {
      res.status(503).json({ detail: 'Backend API URL is not configured. Set BACKEND_API_BASE_URL for non-auth API routes.' })
      return
    }

    await proxyToBackend(path, req, res, backendBaseUrl)
  } catch (error) {
    res.status(500).json({ detail: error.message || 'API request failed.' })
  }
}

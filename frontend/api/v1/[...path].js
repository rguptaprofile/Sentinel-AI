const DEFAULT_API_PREFIX = '/api/v1'

function normalizeBaseUrl(value) {
  if (!value) return ''
  const trimmed = value.replace(/\/$/, '')
  return trimmed.endsWith(DEFAULT_API_PREFIX) ? trimmed : `${trimmed}${DEFAULT_API_PREFIX}`
}

function resolveBackendBaseUrl() {
  const directBackend = normalizeBaseUrl(process.env.BACKEND_API_BASE_URL)
  if (directBackend) return directBackend

  const fallbackBackend = normalizeBaseUrl(process.env.VITE_API_BASE_URL)
  if (fallbackBackend && /^https?:\/\//i.test(fallbackBackend)) {
    return fallbackBackend
  }

  return ''
}

function readRequestBody(req) {
  if (req.method === 'GET' || req.method === 'HEAD') {
    return Promise.resolve(undefined)
  }

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

export default async function handler(req, res) {
  const backendBaseUrl = resolveBackendBaseUrl()
  if (!backendBaseUrl) {
    res.status(500).json({ detail: 'Backend API URL is not configured. Set BACKEND_API_BASE_URL in Vercel runtime env.' })
    return
  }

  const rawPath = req.query.path
  const path = Array.isArray(rawPath) ? rawPath.join('/') : rawPath || ''
  const requestUrl = new URL(req.url, 'http://localhost')
  const targetUrl = new URL(`${path}${requestUrl.search}`, backendBaseUrl.endsWith('/') ? backendBaseUrl : `${backendBaseUrl}/`)

  const body = await readRequestBody(req)
  const upstream = await fetch(targetUrl, {
    method: req.method,
    headers: collectHeaders(req.headers),
    body,
  })

  res.status(upstream.status)
  upstream.headers.forEach((value, key) => {
    if (key.toLowerCase() !== 'transfer-encoding') {
      res.setHeader(key, value)
    }
  })

  const responseBody = Buffer.from(await upstream.arrayBuffer())
  res.send(responseBody)
}
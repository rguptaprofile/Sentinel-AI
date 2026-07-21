function resolveApiBase() {
  const configuredBase = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/$/, '')

  // Production auth is handled by the Vercel function at the same origin.
  // A browser running on Vercel must never use localhost/127.0.0.1:8000:
  // that address refers to the visitor's own computer, not this API.
  if (import.meta.env.PROD) {
    if (!configuredBase || configuredBase === '/api/v1') {
      return { baseUrl: '/api/v1', error: '' }
    }

    const isLoopback = /(^|:\/\/)(localhost|127\.0\.0\.1)(:|\/|$)/i.test(configuredBase)
    if (isLoopback) {
      return { baseUrl: '/api/v1', error: '' }
    }

    if (!/^https:\/\//i.test(configuredBase)) {
      return {
        baseUrl: '',
        error: 'VITE_API_BASE_URL must be /api/v1 or a public HTTPS API URL.',
      }
    }

    return {
      baseUrl: configuredBase.endsWith('/api/v1') ? configuredBase : `${configuredBase}/api/v1`,
      error: '',
    }
  }

  if (configuredBase) {
    return {
      baseUrl: configuredBase.endsWith('/api/v1') ? configuredBase : `${configuredBase}/api/v1`,
      error: '',
    }
  }

  return {
    baseUrl: 'http://127.0.0.1:8000/api/v1',
    error: '',
  }
}

const API_CONFIG = resolveApiBase()

function getAuthToken() {
  return localStorage.getItem('sentinelai_token')
}

async function fetchJson(path, options = {}) {
  if (API_CONFIG.error) {
    throw new Error(API_CONFIG.error)
  }

  const token = getAuthToken()
  const url = `${API_CONFIG.baseUrl}${path}`
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: `API ${response.status}` }))
    if (response.status === 404 && path.startsWith('/auth/')) {
      throw new Error(`Auth API route was not found at ${url}. Redeploy Vercel with the api/v1 function included.`)
    }
    throw new Error(error.detail || `API ${response.status}`)
  }
  return response.json()
}

export const api = {
  async getFraudReports() {
    return fetchJson('/dashboard/reports')
  },

  async getAlerts() {
    return fetchJson('/dashboard/alerts')
  },

  async getTransactions() {
    return fetchJson('/dashboard/transactions')
  },

  async getHeatmapData() {
    return fetchJson('/dashboard/heatmap')
  },

  async getChartData() {
    return fetchJson('/dashboard/charts')
  },

  async getNetworkGraph() {
    return fetchJson('/dashboard/network-graph')
  },

  async getUsers() {
    return fetchJson('/users/')
  },

  async getDashboardStats(role) {
    return fetchJson(`/dashboard/stats/${role}`)
  },

  async getCurrentUser() {
    return fetchJson('/auth/me')
  },

  async signIn(payload) {
    return fetchJson('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  async signUp(payload) {
    return fetchJson('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  async submitCitizenReport(payload) {
    return fetchJson('/reports/', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  async analyzeThreat(payload) {
    return fetchJson('/intelligence/fusion/analyze', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  async scanCurrency(payload) {
    return fetchJson('/counterfeit/scan', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  async classifyScam(payload) {
    return fetchJson('/scam-detection/classify', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
}

export default api

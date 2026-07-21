const DEPLOYED_API_BASE_URL = 'https://sentinel-ai-backend-qw3h.onrender.com/api/v1'

function resolveApiBase() {
  const configuredBase = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/$/, '')

  // Auth and application APIs are served by FastAPI on Render. This avoids a
  // Vercel serverless-function dependency (and its corresponding 404s).
  if (import.meta.env.PROD) {
    if (!configuredBase || configuredBase === '/api/v1') {
      return { baseUrl: DEPLOYED_API_BASE_URL, error: '' }
    }

    const isLoopback = /(^|:\/\/)(localhost|127\.0\.0\.1)(:|\/|$)/i.test(configuredBase)
    const isFrontendUrl = /sentinel-in\.vercel\.app/i.test(configuredBase)
    if (isLoopback || isFrontendUrl) {
      return { baseUrl: DEPLOYED_API_BASE_URL, error: '' }
    }

    if (!/^https:\/\//i.test(configuredBase)) {
      return { baseUrl: DEPLOYED_API_BASE_URL, error: '' }
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
      demoMode: true,
    }
  }

  return {
    baseUrl: DEPLOYED_API_BASE_URL,
    error: '',
    demoMode: false,
  }
}

const API_CONFIG = resolveApiBase()
const DEMO_ACCOUNTS_KEY = 'sentinelai_demo_accounts'
const DEMO_SESSION_KEY = 'sentinelai_demo_session'

const demoStats = {
  police: { activeThreats: 47, todayReports: 142, riskScore: 78, counterfeitCases: 23 },
  citizen: { nearbyScams: 12, verifiedToday: 8, safetyScore: 85, activeAlerts: 3 },
  bank: { suspiciousTransactions: 156, fraudScore: 72, blockedAccounts: 34, highRiskAccounts: 89 },
  admin: { totalUsers: 12847, totalReports: 1140000, aiModels: 12, systemHealth: 98.7 },
}

function readDemoAccounts() {
  return JSON.parse(localStorage.getItem(DEMO_ACCOUNTS_KEY) || '[]')
}

function createDemoSession(user) {
  const token = `demo-${Date.now()}`
  localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify({ token, user }))
  return { token, user, expiresAt: null }
}

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
    if (API_CONFIG.demoMode) return demoStats[role] || demoStats.citizen
    return fetchJson(`/dashboard/stats/${role}`)
  },

  async getCapabilityStatus() {
    return fetchJson('/capabilities/status')
  },

  async createFraudGraphNode(payload) {
    return fetchJson('/fraud-graph/nodes', { method: 'POST', body: JSON.stringify(payload) })
  },

  async createGeoIncident(payload) {
    return fetchJson('/geo/incidents', { method: 'POST', body: JSON.stringify(payload) })
  },

  async getCurrentUser() {
    if (API_CONFIG.demoMode) {
      const session = JSON.parse(localStorage.getItem(DEMO_SESSION_KEY) || 'null')
      if (!session?.user) throw new Error('Demo session not found.')
      return { user: session.user }
    }
    return fetchJson('/auth/me')
  },

  async signIn(payload) {
    if (API_CONFIG.demoMode) {
      const account = readDemoAccounts().find((user) => user.email === payload.email.toLowerCase())
      if (!account || account.password !== payload.password) throw new Error('Invalid email or password.')
      if (account.role !== payload.role) throw new Error('This account does not have the selected role.')
      const { password, ...user } = account
      return createDemoSession(user)
    }
    return fetchJson('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  async signUp(payload) {
    if (API_CONFIG.demoMode) {
      const accounts = readDemoAccounts()
      const email = payload.email.toLowerCase()
      if (accounts.some((user) => user.email === email)) throw new Error('Email is already registered.')
      const user = { id: `demo-${Date.now()}`, name: payload.name, email, role: payload.role, status: 'active' }
      localStorage.setItem(DEMO_ACCOUNTS_KEY, JSON.stringify([...accounts, { ...user, password: payload.password }]))
      return createDemoSession(user)
    }
    return fetchJson('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  async submitCitizenReport(payload) {
    if (API_CONFIG.demoMode) return { id: `report-${Date.now()}`, ...payload }
    return fetchJson('/reports/', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  async analyzeThreat(payload) {
    if (API_CONFIG.demoMode) return { status: 'analyzed', ...payload }
    return fetchJson('/intelligence/fusion/analyze', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  async scanCurrency(payload) {
    if (API_CONFIG.demoMode) return { verdict: 'analysis_complete', ...payload }
    return fetchJson('/counterfeit/scan', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  async classifyScam(payload) {
    if (API_CONFIG.demoMode) return { classification: 'suspicious', ...payload }
    return fetchJson('/scam-detection/classify', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
}

export default api

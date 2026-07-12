function resolveApiBase() {
  const configuredBase = import.meta.env.VITE_API_BASE_URL
  if (configuredBase) {
    return configuredBase.replace(/\/$/, '')
  }

  if (import.meta.env.PROD && typeof window !== 'undefined') {
    return `${window.location.origin}/api/v1`
  }

  return 'http://127.0.0.1:8000/api/v1'
}

const API_BASE = resolveApiBase()

function getAuthToken() {
  return localStorage.getItem('sentinelai_token')
}

async function fetchJson(path, options = {}) {
  const token = getAuthToken()
  const response = await fetch(`${API_BASE}${path}`, {
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

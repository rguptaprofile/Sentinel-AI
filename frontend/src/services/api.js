const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1'

const emptyData = {
  '/dashboard/reports': [],
  '/dashboard/alerts': [],
  '/dashboard/transactions': [],
  '/dashboard/heatmap': [],
  '/dashboard/charts': {},
  '/dashboard/network-graph': { nodes: [], edges: [] },
  '/users/': [],
}

async function fetchJson(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: `API ${response.status}` }))
    throw new Error(error.detail || `API ${response.status}`)
  }
  return response.json()
}

async function fetchOrEmpty(path) {
  try {
    return await fetchJson(path)
  } catch (error) {
    console.warn(`API unavailable for ${path}:`, error.message)
    return emptyData[path] ?? null
  }
}

export const api = {
  async getFraudReports() {
    return fetchOrEmpty('/dashboard/reports')
  },

  async getAlerts() {
    return fetchOrEmpty('/dashboard/alerts')
  },

  async getTransactions() {
    return fetchOrEmpty('/dashboard/transactions')
  },

  async getHeatmapData() {
    return fetchOrEmpty('/dashboard/heatmap')
  },

  async getChartData() {
    return fetchOrEmpty('/dashboard/charts')
  },

  async getNetworkGraph() {
    return fetchOrEmpty('/dashboard/network-graph')
  },

  async getUsers() {
    return fetchOrEmpty('/users/')
  },

  async getDashboardStats(role) {
    return fetchOrEmpty(`/dashboard/stats/${role}`)
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

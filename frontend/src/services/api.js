function resolveApiBase() {
  const configuredBase = import.meta.env.VITE_API_BASE_URL
  if (configuredBase) {
    const normalizedBase = configuredBase.replace(/\/$/, '')
    if (import.meta.env.PROD && !/^https?:\/\//i.test(normalizedBase)) {
      return {
        baseUrl: '',
        error: 'VITE_API_BASE_URL must be the deployed backend URL, not a relative path like /api/v1.',
      }
    }
    return {
      baseUrl: normalizedBase.endsWith('/api/v1') ? normalizedBase : `${normalizedBase}/api/v1`,
      error: '',
    }
  }

  if (import.meta.env.PROD) {
    return {
      baseUrl: '',
      error: 'VITE_API_BASE_URL must be set to the deployed backend URL, for example https://your-backend.example.com/api/v1.',
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
      throw new Error(`Auth API route was not found at ${url}. Check VITE_API_BASE_URL and backend deployment.`)
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

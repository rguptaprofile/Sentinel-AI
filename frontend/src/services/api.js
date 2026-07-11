import fraudReports from './data/fraudReports.json'
import alerts from './data/alerts.json'
import transactions from './data/transactions.json'
import heatmapData from './data/heatmapData.json'
import chartData from './data/chartData.json'
import networkGraph from './data/networkGraph.json'
import users from './data/users.json'

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1'

async function fetchJson(path, fallback, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    })
    if (!response.ok) throw new Error(`API ${response.status}`)
    return await response.json()
  } catch (error) {
    console.warn(`Using local fallback for ${path}:`, error.message)
    await delay(150)
    return fallback
  }
}

export const api = {
  async getFraudReports() {
    return fetchJson('/dashboard/reports', fraudReports)
  },

  async getAlerts() {
    return fetchJson('/dashboard/alerts', alerts)
  },

  async getTransactions() {
    return fetchJson('/dashboard/transactions', transactions)
  },

  async getHeatmapData() {
    return fetchJson('/dashboard/heatmap', heatmapData)
  },

  async getChartData() {
    return fetchJson('/dashboard/charts', chartData)
  },

  async getNetworkGraph() {
    return fetchJson('/dashboard/network-graph', networkGraph)
  },

  async getUsers() {
    return fetchJson('/users/', users)
  },

  async getDashboardStats(role) {
    const stats = {
      police: {
        activeThreats: 47,
        todayReports: 142,
        riskScore: 78,
        counterfeitCases: 23,
      },
      citizen: {
        nearbyScams: 12,
        verifiedToday: 8,
        safetyScore: 85,
        activeAlerts: 3,
      },
      bank: {
        suspiciousTransactions: 156,
        fraudScore: 72,
        blockedAccounts: 34,
        highRiskAccounts: 89,
      },
      admin: {
        totalUsers: 12847,
        totalReports: 1140000,
        aiModels: 12,
        systemHealth: 98.7,
      },
    }
    return fetchJson(`/dashboard/stats/${role}`, stats[role] || stats.police)
  },

  async submitCitizenReport(payload) {
    return fetchJson('/reports/', null, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  async analyzeThreat(payload) {
    return fetchJson('/intelligence/fusion/analyze', null, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  async scanCurrency(payload) {
    return fetchJson('/counterfeit/scan', null, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  async classifyScam(payload) {
    return fetchJson('/scam-detection/classify', null, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
}

export default api

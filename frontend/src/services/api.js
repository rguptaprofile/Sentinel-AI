import fraudReports from './data/fraudReports.json'
import alerts from './data/alerts.json'
import transactions from './data/transactions.json'
import heatmapData from './data/heatmapData.json'
import chartData from './data/chartData.json'
import networkGraph from './data/networkGraph.json'
import users from './data/users.json'

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

export const api = {
  async getFraudReports() {
    await delay()
    return fraudReports
  },

  async getAlerts() {
    await delay(200)
    return alerts
  },

  async getTransactions() {
    await delay()
    return transactions
  },

  async getHeatmapData() {
    await delay(200)
    return heatmapData
  },

  async getChartData() {
    await delay(100)
    return chartData
  },

  async getNetworkGraph() {
    await delay()
    return networkGraph
  },

  async getUsers() {
    await delay()
    return users
  },

  async getDashboardStats(role) {
    await delay(200)
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
    return stats[role] || stats.police
  },
}

export default api

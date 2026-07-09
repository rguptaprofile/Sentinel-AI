import { useState, useEffect } from 'react'
import api from '@/services/api'

export function useDashboardData(role) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    api.getDashboardStats(role).then((data) => {
      if (mounted) {
        setStats(data)
        setLoading(false)
      }
    })
    return () => { mounted = false }
  }, [role])

  return { stats, loading }
}

export function useAlerts() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getAlerts().then((data) => {
      setAlerts(data)
      setLoading(false)
    })
  }, [])

  return { alerts, loading }
}

export function useChartData() {
  const [chartData, setChartData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getChartData().then((data) => {
      setChartData(data)
      setLoading(false)
    })
  }, [])

  return { chartData, loading }
}

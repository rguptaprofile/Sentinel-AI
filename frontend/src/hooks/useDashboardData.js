import { useState, useEffect } from 'react'
import api from '@/services/api'

export function useDashboardData(role) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError('')
    api.getDashboardStats(role)
      .then((data) => {
        if (mounted) {
          setStats(data)
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message)
          setStats(null)
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false)
        }
      })
    return () => { mounted = false }
  }, [role])

  return { stats, loading, error }
}

export function useAlerts() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    setError('')
    api.getAlerts()
      .then((data) => {
        if (mounted) {
          setAlerts(data)
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message)
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false)
        }
      })
    return () => { mounted = false }
  }, [])

  return { alerts, loading, error }
}

export function useChartData() {
  const [chartData, setChartData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    setError('')
    api.getChartData()
      .then((data) => {
        if (mounted) {
          setChartData(data)
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message)
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false)
        }
      })
    return () => { mounted = false }
  }, [])

  return { chartData, loading, error }
}

import { createContext, useContext, useEffect, useState } from 'react'
import api from '@/services/api'

const ReportContext = createContext(null)
const seedReports = [
  { id: 'SA-1042', type: 'Digital Arrest Scam', title: 'Caller claiming to be Cyber Crime Police', channel: 'Phone call', amount: '₹45,000', location: 'New Delhi', status: 'New', bankRelated: true, createdAt: 'Today, 10:42 AM' },
  { id: 'SA-1041', type: 'Counterfeit Currency', title: 'Suspected ₹500 note received at shop', channel: 'Currency scan', amount: '—', location: 'Mumbai', status: 'Under review', bankRelated: true, createdAt: 'Today, 9:15 AM' },
]

const bankRelated = (type = '') => !/geo|map|location|hotspot/i.test(type)
const mapReport = (report) => ({
  id: report.id,
  type: report.incident_type || report.channel || 'Citizen report',
  title: report.description,
  channel: report.channel,
  amount: report.amount ? `₹${report.amount}` : 'Not specified',
  location: report.location || 'Location not shared',
  status: report.status || 'New',
  bankRelated: bankRelated(report.incident_type || report.channel),
  createdAt: report.created_at ? new Date(report.created_at).toLocaleString() : 'Just now',
})

export function ReportProvider({ children }) {
  const [reports, setReports] = useState(() => JSON.parse(localStorage.getItem('sentinelai_reports') || 'null') || seedReports)
  const [backendOnline, setBackendOnline] = useState(false)

  const refreshReports = async () => {
    try {
      const data = await api.getCitizenReports()
      const mapped = data.map(mapReport)
      setReports(mapped.length ? mapped : seedReports)
      setBackendOnline(true)
      return mapped
    } catch {
      setBackendOnline(false)
      return reports
    }
  }

  useEffect(() => { refreshReports() }, [])
  useEffect(() => { localStorage.setItem('sentinelai_reports', JSON.stringify(reports)) }, [reports])

  const addReport = (report) => {
    const item = { id: `SA-${Math.floor(1000 + Math.random() * 8999)}`, status: 'New', createdAt: 'Just now', ...report }
    setReports((current) => [item, ...current])
    return item
  }

  return <ReportContext.Provider value={{ reports, addReport, refreshReports, backendOnline }}>{children}</ReportContext.Provider>
}

export function useReports() {
  const context = useContext(ReportContext)
  if (!context) throw new Error('useReports must be used within ReportProvider')
  return context
}

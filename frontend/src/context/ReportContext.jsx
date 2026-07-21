import { createContext, useContext, useState } from 'react'

const ReportContext = createContext(null)
const seedReports = [
  { id: 'SA-1042', type: 'Digital Arrest Scam', title: 'Caller claiming to be Cyber Crime Police', channel: 'Phone call', amount: '₹45,000', location: 'New Delhi', status: 'New', bankRelated: true, createdAt: 'Today, 10:42 AM' },
  { id: 'SA-1041', type: 'Counterfeit Currency', title: 'Suspected ₹500 note received at shop', channel: 'Currency scan', amount: '—', location: 'Mumbai', status: 'Under review', bankRelated: true, createdAt: 'Today, 9:15 AM' },
  { id: 'SA-1040', type: 'Citizen Fraud Shield', title: 'WhatsApp investment scam', channel: 'WhatsApp', amount: '₹12,500', location: 'Bengaluru', status: 'Assigned', bankRelated: true, createdAt: 'Yesterday' },
]

export function ReportProvider({ children }) {
  const [reports, setReports] = useState(() => JSON.parse(localStorage.getItem('sentinelai_reports') || 'null') || seedReports)
  const addReport = (report) => {
    const item = { id: `SA-${Math.floor(1000 + Math.random() * 8999)}`, status: 'New', createdAt: 'Just now', ...report }
    setReports((current) => { const updated = [item, ...current]; localStorage.setItem('sentinelai_reports', JSON.stringify(updated)); return updated })
    return item
  }
  return <ReportContext.Provider value={{ reports, addReport }}>{children}</ReportContext.Provider>
}
export function useReports() { const context = useContext(ReportContext); if (!context) throw new Error('useReports must be used within ReportProvider'); return context }

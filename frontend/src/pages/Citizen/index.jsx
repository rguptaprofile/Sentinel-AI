import { useState } from 'react'
import { AlertTriangle, Banknote, Bot, MapPinned, Network, PhoneCall, ShieldCheck, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import api from '@/services/api'
import { useReports } from '@/context/ReportContext'

const tools = [
  { id: 'digital-arrest', title: 'Digital Arrest Alert', icon: PhoneCall, description: 'Analyse a threatening call, spoofed number, or suspicious video call.', hint: 'Phone number, call script, or video-call details', bankRelated: true },
  { id: 'counterfeit', title: 'Counterfeit Currency', icon: Banknote, description: 'Check note patterns and create a counterfeit-currency case.', hint: 'Note serial number (or describe the note)', bankRelated: true },
  { id: 'fraud-network', title: 'Fraud Network Intelligence', icon: Network, description: 'Link suspicious accounts, UPI IDs, devices, or mule activity.', hint: 'UPI ID, account, device, or link', bankRelated: true },
  { id: 'geospatial', title: 'Crime Pattern Map', icon: MapPinned, description: 'Add a fraud hotspot or counterfeit seizure point to the map.', hint: 'Incident or hotspot details', bankRelated: false },
  { id: 'citizen-shield', title: 'Citizen Fraud Shield', icon: Bot, description: 'Assess a suspicious WhatsApp, IVR, or mobile-app message.', hint: 'Message, link, sender number, or payment request', bankRelated: true },
]

const coordinatesFor = (location = '') => {
  const value = location.toLowerCase()
  if (value.includes('mumbai')) return [19.076, 72.8777]
  if (value.includes('bengaluru') || value.includes('bangalore')) return [12.9716, 77.5946]
  if (value.includes('delhi')) return [28.6139, 77.209]
  return [28.6139, 77.209]
}

export default function CitizenDashboard() {
  const [activeTool, setActiveTool] = useState(null)
  const [details, setDetails] = useState('')
  const [location, setLocation] = useState('')
  const [submitted, setSubmitted] = useState(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { reports, addReport, refreshReports, backendOnline } = useReports()

  const submit = async (event) => {
    event.preventDefault()
    setSubmitting(true); setError('')
    const payload = { channel: activeTool.id, description: details, location: location || null, incident_type: activeTool.title, language: 'en' }
    try {
      const saved = await api.submitCitizenReport(payload)
      let analysis = null
      if (activeTool.id === 'counterfeit') analysis = await api.scanCurrency({ denomination: 500, serial_number: details })
      if (activeTool.id === 'fraud-network') await api.createFraudGraphNode({ node_type: 'citizen_indicator', label: details, risk_score: 0.8 })
      if (activeTool.id === 'geospatial') { const [latitude, longitude] = coordinatesFor(location); await api.createGeoIncident({ incident_type: 'fraud_report', latitude, longitude, district: location || 'Unspecified', risk_score: 0.7 }) }
      if (activeTool.id === 'digital-arrest' || activeTool.id === 'citizen-shield') analysis = await api.classifyScam({ report_id: saved.id, suspected_number: details.match(/(?:\+91[- ]?)?\d{10}/)?.[0] || null, transcript: details, indicators: [activeTool.id] })
      if (activeTool.id !== 'geospatial') await api.analyzeThreat({ report_id: saved.id, transcript: details, location: location || null, indicators: [activeTool.id] })
      addReport({ id: saved.id, type: activeTool.title, title: details, channel: activeTool.id, amount: 'Not specified', location: location || 'Location not shared', bankRelated: activeTool.bankRelated })
      setSubmitted({ id: saved.id, message: analysis?.verdict ? `AI result: ${analysis.verdict.replaceAll('_', ' ')}` : 'Report submitted and shared with response teams.' })
      refreshReports()
    } catch (requestError) {
      const local = addReport({ type: activeTool.title, title: details, channel: activeTool.id, amount: 'Not specified', location: location || 'Location not shared', bankRelated: activeTool.bankRelated })
      setSubmitted({ id: local.id, message: 'Saved locally. Backend is unavailable, so AI analysis could not run.' })
      setError(requestError.message || 'Backend connection failed.')
    } finally { setSubmitting(false); setActiveTool(null); setDetails(''); setLocation('') }
  }

  return <div className="space-y-6">
    <div className="rounded-2xl gradient-dark p-6 text-white shadow-xl"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm text-white/65">SentinelAI · Citizen Safety</p><h1 className="mt-1 text-2xl font-bold">Report a scam. Protect your community.</h1><p className="mt-2 max-w-2xl text-sm text-white/70">Each report is saved to the case API and sent through the relevant AI analysis workflow.</p></div><ShieldCheck className="h-10 w-10 text-cyan-300" /></div><p className="mt-4 text-xs text-white/65">Backend: {backendOnline ? 'connected' : 'offline — local demo fallback active'}</p></div>
    {submitted && <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"><span><b>{submitted.id}</b> · {submitted.message}</span><button onClick={() => setSubmitted(null)}><X className="h-4 w-4" /></button></div>}
    {error && <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{error}</div>}
    <div><h2 className="text-lg font-semibold">Five AI-assisted reporting channels</h2><p className="text-sm text-muted-foreground">Choose a service to submit a case and trigger the matching analysis workflow.</p></div>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{tools.map((tool) => <Card key={tool.id} className="group border-primary/10 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"><CardContent className="p-5"><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><tool.icon className="h-5 w-5" /></div><h3 className="font-semibold">{tool.title}</h3><p className="mt-2 min-h-10 text-sm text-muted-foreground">{tool.description}</p><Button className="mt-5" variant="outline" size="sm" onClick={() => setActiveTool(tool)}>Start analysis</Button></CardContent></Card>)}</div>
    <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><AlertTriangle className="h-4 w-4 text-amber-500" />Recent cases</CardTitle><CardDescription>{backendOnline ? 'Loaded from the backend case queue.' : 'Showing local fallback cases.'}</CardDescription></CardHeader><CardContent><div className="space-y-3">{reports.slice(0, 3).map((report) => <div key={report.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/60 px-4 py-3 text-sm"><div><b>{report.type}</b><span className="ml-2 text-muted-foreground">{report.id} · {report.createdAt}</span></div><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">{report.status}</span></div>)}</div></CardContent></Card>
    {activeTool && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4"><Card className="w-full max-w-lg shadow-2xl"><CardHeader><div className="flex justify-between gap-4"><div><CardTitle>{activeTool.title}</CardTitle><CardDescription>{activeTool.description}</CardDescription></div><button onClick={() => setActiveTool(null)}><X className="h-5 w-5" /></button></div></CardHeader><CardContent><form className="space-y-4" onSubmit={submit}><div className="space-y-2"><Label>Case details</Label><Input value={details} onChange={(e) => setDetails(e.target.value)} placeholder={activeTool.hint} required /></div><div className="space-y-2"><Label>Location (optional)</Label><Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City or locality" /></div><Button type="submit" variant="gradient" className="w-full" disabled={submitting}>{submitting ? 'Running AI workflow…' : 'Submit and analyse'}</Button></form></CardContent></Card></div>}
  </div>
}

import { useState } from 'react'
import { AlertTriangle, Banknote, Bot, MapPinned, Network, PhoneCall, ShieldCheck, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useReports } from '@/context/ReportContext'

const tools = [
  { title: 'Digital Arrest Alert', icon: PhoneCall, description: 'Report a threatening call, spoofed number, or suspicious video call.', hint: 'Phone number or call details', bankRelated: true },
  { title: 'Counterfeit Currency', icon: Banknote, description: 'Submit a suspected note for security-feature and serial pattern checks.', hint: 'Note denomination or serial number', bankRelated: true },
  { title: 'Fraud Network Intelligence', icon: Network, description: 'Report connected accounts, UPI IDs, devices, or mule activity.', hint: 'UPI ID, account, or link', bankRelated: true },
  { title: 'Crime Pattern Map', icon: MapPinned, description: 'Pin a fraud hotspot or counterfeit seizure point for local action.', hint: 'Area or landmark', bankRelated: false },
  { title: 'Citizen Fraud Shield', icon: Bot, description: 'Get guidance for a suspicious WhatsApp, IVR, or mobile-app message.', hint: 'Message, link, or sender number', bankRelated: true },
]

export default function CitizenDashboard() {
  const [activeTool, setActiveTool] = useState(null)
  const [details, setDetails] = useState('')
  const [location, setLocation] = useState('')
  const [submitted, setSubmitted] = useState(null)
  const { reports, addReport } = useReports()

  const submit = (event) => {
    event.preventDefault()
    const report = addReport({ type: activeTool.title, title: details || `Citizen report: ${activeTool.title}`, channel: activeTool.title, amount: 'Not specified', location: location || 'Location not shared', bankRelated: activeTool.bankRelated })
    setSubmitted(report)
    setActiveTool(null)
    setDetails('')
    setLocation('')
  }

  return <div className="space-y-6">
    <div className="rounded-2xl gradient-dark p-6 text-white shadow-xl"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm text-white/65">SentinelAI · Citizen Safety</p><h1 className="mt-1 text-2xl font-bold">Report a scam. Protect your community.</h1><p className="mt-2 max-w-2xl text-sm text-white/70">Choose the right AI-assisted reporting channel. Your report is shared instantly with the relevant response teams.</p></div><ShieldCheck className="h-10 w-10 text-cyan-300" /></div></div>
    {submitted && <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"><span><b>{submitted.id}</b> has been submitted to the response queue.</span><button onClick={() => setSubmitted(null)}><X className="h-4 w-4" /></button></div>}
    <div><h2 className="text-lg font-semibold">Five ways to report and check fraud</h2><p className="text-sm text-muted-foreground">Pick a service to begin a guided report.</p></div>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{tools.map((tool) => <Card key={tool.title} className="group border-primary/10 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"><CardContent className="p-5"><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><tool.icon className="h-5 w-5" /></div><h3 className="font-semibold">{tool.title}</h3><p className="mt-2 min-h-10 text-sm text-muted-foreground">{tool.description}</p><Button className="mt-5" variant="outline" size="sm" onClick={() => setActiveTool(tool)}>Start report</Button></CardContent></Card>)}</div>
    <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><AlertTriangle className="h-4 w-4 text-amber-500" />Your recent reports</CardTitle><CardDescription>Frontend demo data is stored only in this browser.</CardDescription></CardHeader><CardContent><div className="space-y-3">{reports.slice(0, 3).map((report) => <div key={report.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/60 px-4 py-3 text-sm"><div><b>{report.type}</b><span className="ml-2 text-muted-foreground">{report.id} · {report.createdAt}</span></div><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">{report.status}</span></div>)}</div></CardContent></Card>
    {activeTool && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4"><Card className="w-full max-w-lg shadow-2xl"><CardHeader><div className="flex justify-between gap-4"><div><CardTitle>{activeTool.title}</CardTitle><CardDescription>Share only the details needed for this report.</CardDescription></div><button onClick={() => setActiveTool(null)}><X className="h-5 w-5" /></button></div></CardHeader><CardContent><form className="space-y-4" onSubmit={submit}><div className="space-y-2"><Label>What happened?</Label><Input value={details} onChange={(e) => setDetails(e.target.value)} placeholder={activeTool.hint} required /></div><div className="space-y-2"><Label>Location (optional)</Label><Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City or locality" /></div><Button type="submit" variant="gradient" className="w-full">Submit protected report</Button></form></CardContent></Card></div>}
  </div>
}

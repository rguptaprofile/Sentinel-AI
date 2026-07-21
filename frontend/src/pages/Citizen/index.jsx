<<<<<<< HEAD
import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  AlertOctagon,
  CreditCard,
  Phone,
  QrCode,
  Banknote,
  Siren,
  MapPin,
  MessageCircle,
  Lightbulb,
  Shield,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import StatCard from '@/components/cards/StatCard'
import MapCard from '@/components/cards/MapCard'
import IndiaHeatMap from '@/components/maps/IndiaHeatMap'
import { useDashboardData } from '@/hooks/useDashboardData'
import api from '@/services/api'
=======
import { useState } from 'react'
import { AlertTriangle, Banknote, Bot, MapPinned, Network, PhoneCall, ShieldCheck, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useReports } from '@/context/ReportContext'
>>>>>>> f901ae4 (Add role-based citizen, police, and bank dashboards)

const tools = [
  { title: 'Digital Arrest Alert', icon: PhoneCall, description: 'Report a threatening call, spoofed number, or suspicious video call.', hint: 'Phone number or call details', bankRelated: true },
  { title: 'Counterfeit Currency', icon: Banknote, description: 'Submit a suspected note for security-feature and serial pattern checks.', hint: 'Note denomination or serial number', bankRelated: true },
  { title: 'Fraud Network Intelligence', icon: Network, description: 'Report connected accounts, UPI IDs, devices, or mule activity.', hint: 'UPI ID, account, or link', bankRelated: true },
  { title: 'Crime Pattern Map', icon: MapPinned, description: 'Pin a fraud hotspot or counterfeit seizure point for local action.', hint: 'Area or landmark', bankRelated: false },
  { title: 'Citizen Fraud Shield', icon: Bot, description: 'Get guidance for a suspicious WhatsApp, IVR, or mobile-app message.', hint: 'Message, link, or sender number', bankRelated: true },
]

function CitizenToolModal({ action, onClose }) {
  const [value, setValue] = useState('')
  const [details, setDetails] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const config = {
    'Report Scam': { label: 'Describe what happened', placeholder: 'Include the number, UPI ID, link, or message involved.' },
    'Verify UPI': { label: 'UPI ID', placeholder: 'name@bank' },
    'Verify Phone': { label: 'Phone number', placeholder: '+91 98XXXXXX10' },
    'Verify QR': { label: 'QR code content', placeholder: 'Paste the text or payment URL encoded in the QR code' },
    'Upload Currency': { label: 'Note serial number', placeholder: 'Optional serial number from the currency note' },
    'Emergency Alert': { label: 'Your emergency details', placeholder: 'Describe the immediate danger and your location.' },
  }[action.title]

  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)
    try {
      if (action.title === 'Upload Currency') {
        const response = await api.scanCurrency({ denomination: Number(amount), serial_number: value || null })
        setResult(`${response.verdict} — authenticity score: ${Math.round(response.authenticity_score * 100)}%`)
      } else if (action.title === 'Report Scam' || action.title === 'Emergency Alert') {
        const response = await api.submitCitizenReport({
          channel: action.title === 'Emergency Alert' ? 'emergency_alert' : 'citizen_portal',
          description: value,
          location: details || null,
          amount: amount ? Number(amount) : null,
          incident_type: action.title === 'Emergency Alert' ? 'emergency' : 'scam_report',
        })
        setResult(`${action.title === 'Emergency Alert' ? 'Emergency alert sent' : 'Report submitted'} successfully. Reference: ${response.id}`)
      } else {
        const indicator = action.title === 'Verify UPI' ? 'upi_id' : action.title === 'Verify Phone' ? 'phone_number' : 'qr_code'
        const response = await api.classifyScam({
          suspected_number: action.title === 'Verify Phone' ? value : null,
          transcript: action.title === 'Verify QR' ? value : details || null,
          indicators: [indicator, value],
        })
        setResult(`${response.verdict} — risk score: ${Math.round(response.risk_score * 100)}%`)
      }
    } catch (err) {
      setError(err.message || 'Unable to complete the request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onMouseDown={onClose}>
      <Card className="w-full max-w-lg shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><action.icon className="h-5 w-5 text-primary" />{action.title}</CardTitle>
          <CardDescription>{action.desc}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={submit}>
            {action.title === 'Upload Currency' && <div><label className="text-sm font-medium">Denomination</label><Input required type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 500" className="mt-1" /></div>}
            <div><label className="text-sm font-medium">{config.label}</label>{action.title === 'Report Scam' || action.title === 'Emergency Alert' ? <textarea required value={value} onChange={(e) => setValue(e.target.value)} placeholder={config.placeholder} className="mt-1 min-h-28 w-full rounded-lg border bg-background px-3 py-2 text-sm" /> : <Input required={action.title !== 'Upload Currency'} value={value} onChange={(e) => setValue(e.target.value)} placeholder={config.placeholder} className="mt-1" />}</div>
            {action.title !== 'Upload Currency' && <div><label className="text-sm font-medium">Location or additional details <span className="text-muted-foreground">(optional)</span></label><Input value={details} onChange={(e) => setDetails(e.target.value)} placeholder="City, state, or useful context" className="mt-1" /></div>}
            {action.title === 'Report Scam' && <div><label className="text-sm font-medium">Loss amount <span className="text-muted-foreground">(optional)</span></label><Input type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" className="mt-1" /></div>}
            {error && <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
            {result && <p className="rounded-lg bg-primary/10 p-3 text-sm text-primary">{result}</p>}
            <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={onClose}>Close</Button><Button type="submit" disabled={loading}>{loading ? 'Processing...' : action.title === 'Emergency Alert' ? 'Send alert' : 'Submit'}</Button></div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function CitizenDashboard() {
<<<<<<< HEAD
  const { stats, loading, error } = useDashboardData('citizen')
  const [activeAction, setActiveAction] = useState(null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Citizen Safety Portal</h1>
        <p className="text-muted-foreground">Protect yourself with AI-powered verification and reporting tools</p>
      </div>

      {error && <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">{error}</div>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Nearby Scams" value={stats?.nearbyScams ?? '—'} change="Within 5km" icon={MapPin} loading={loading} />
        <StatCard title="Verified Today" value={stats?.verifiedToday ?? '—'} change="Checks passed" icon={Shield} loading={loading} />
        <StatCard title="Safety Score" value={`${stats?.safetyScore ?? '—'}%`} change="Good" icon={Shield} loading={loading} />
        <StatCard title="Active Alerts" value={stats?.activeAlerts ?? '—'} change="In your area" icon={AlertOctagon} loading={loading} />
      </div>

      {/* Action cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action, i) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="shadow-lg hover:shadow-xl transition-all cursor-pointer group hover:border-primary/30" onClick={() => setActiveAction(action)}>
              <CardContent className="p-6">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${action.color} mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg">{action.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{action.desc}</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={(event) => { event.stopPropagation(); setActiveAction(action) }}>Open Tool</Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <MapCard title="Nearby Scam Heatmap" description="Reported fraud activity in your region" height="h-[350px]">
          <IndiaHeatMap height="350px" />
        </MapCard>

        <div className="space-y-6">
          {/* AI Chat preview */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                AI Chat Assistant
              </CardTitle>
              <CardDescription>Get instant help with fraud prevention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl bg-muted/50 p-4 space-y-3">
                <div className="bg-card rounded-2xl rounded-bl-md p-3 text-sm shadow-sm max-w-[85%]">
                  Hello! I'm SentinelAI Assistant. How can I help you stay safe today?
                </div>
                <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md p-3 text-sm shadow-sm max-w-[85%] ml-auto">
                  Is this UPI ID safe to pay? rajesh.pay@oksbi
                </div>
                <div className="bg-card rounded-2xl rounded-bl-md p-3 text-sm shadow-sm max-w-[85%]">
                  ⚠️ This UPI ID has 3 fraud reports. We recommend NOT proceeding with payment.
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">Click the chat button at bottom-right to continue</p>
            </CardContent>
          </Card>

          {/* Safety tips */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-[#F59E0B]" />
                Safety Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {safetyTips.map((tip, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                      {i + 1}
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      {activeAction && <CitizenToolModal action={activeAction} onClose={() => setActiveAction(null)} />}
=======
  const [activeTool, setActiveTool] = useState(null)
  const [details, setDetails] = useState('')
  const [location, setLocation] = useState('')
  const [submitted, setSubmitted] = useState(null)
  const { reports, addReport } = useReports()
  const submit = (event) => {
    event.preventDefault()
    const report = addReport({ type: activeTool.title, title: details || `Citizen report: ${activeTool.title}`, channel: activeTool.title, amount: 'Not specified', location: location || 'Location not shared', bankRelated: activeTool.bankRelated })
    setSubmitted(report); setActiveTool(null); setDetails(''); setLocation('')
  }
  return <div className="space-y-6">
    <div className="rounded-2xl gradient-dark p-6 text-white shadow-xl">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm text-white/65">SentinelAI · Citizen Safety</p><h1 className="mt-1 text-2xl font-bold">Report a scam. Protect your community.</h1><p className="mt-2 max-w-2xl text-sm text-white/70">Choose the right AI-assisted reporting channel. Your report is shared instantly with the relevant response teams.</p></div><ShieldCheck className="h-10 w-10 text-cyan-300" /></div>
>>>>>>> f901ae4 (Add role-based citizen, police, and bank dashboards)
    </div>
    {submitted && <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"><span><b>{submitted.id}</b> has been submitted to the response queue.</span><button onClick={() => setSubmitted(null)}><X className="h-4 w-4" /></button></div>}
    <div><h2 className="text-lg font-semibold">Five ways to report and check fraud</h2><p className="text-sm text-muted-foreground">Pick a service to begin a guided report.</p></div>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{tools.map((tool) => <Card key={tool.title} className="group border-primary/10 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"><CardContent className="p-5"><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><tool.icon className="h-5 w-5" /></div><h3 className="font-semibold">{tool.title}</h3><p className="mt-2 min-h-10 text-sm text-muted-foreground">{tool.description}</p><Button className="mt-5" variant="outline" size="sm" onClick={() => setActiveTool(tool)}>Start report</Button></CardContent></Card>)}</div>
    <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><AlertTriangle className="h-4 w-4 text-amber-500" />Your recent reports</CardTitle><CardDescription>Frontend demo data is stored only in this browser.</CardDescription></CardHeader><CardContent><div className="space-y-3">{reports.slice(0, 3).map((report) => <div key={report.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/60 px-4 py-3 text-sm"><div><b>{report.type}</b><span className="ml-2 text-muted-foreground">{report.id} · {report.createdAt}</span></div><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">{report.status}</span></div>)}</div></CardContent></Card>
    {activeTool && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4"><Card className="w-full max-w-lg shadow-2xl"><CardHeader><div className="flex justify-between gap-4"><div><CardTitle>{activeTool.title}</CardTitle><CardDescription>Share only the details needed for this report.</CardDescription></div><button onClick={() => setActiveTool(null)}><X className="h-5 w-5" /></button></div></CardHeader><CardContent><form className="space-y-4" onSubmit={submit}><div className="space-y-2"><Label>What happened?</Label><Input value={details} onChange={(e) => setDetails(e.target.value)} placeholder={activeTool.hint} required /></div><div className="space-y-2"><Label>Location (optional)</Label><Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City or locality" /></div><Button type="submit" variant="gradient" className="w-full">Submit protected report</Button></form></CardContent></Card></div>}
  </div>
}

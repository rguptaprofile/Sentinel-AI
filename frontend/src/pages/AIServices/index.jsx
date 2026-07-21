import { useState } from 'react'
import { Banknote, MapPinned, Network, ShieldAlert, Smartphone } from 'lucide-react'
import CapabilityOverview from '@/components/dashboard/CapabilityOverview'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import api from '@/services/api'

const services = [
  { id: 'digital-arrest', name: 'Digital Arrest Detection', icon: ShieldAlert, help: 'Analyze a suspicious call, script, or number and create an alert when risk is high.', fields: [['suspected_number', 'Suspicious phone number'], ['transcript', 'Call script or message'], ['location', 'Location']] },
  { id: 'counterfeit', name: 'Counterfeit Currency Agent', icon: Banknote, help: 'Store a denomination and serial-number scan for counterfeit analysis.', fields: [['denomination', 'Denomination (₹)'], ['serial_number', 'Serial number']] },
  { id: 'fraud-graph', name: 'Fraud Network Graph', icon: Network, help: 'Add a suspect, account, device, or case node to the MongoDB investigation graph.', fields: [['label', 'Account, number, device, or case ID'], ['node_type', 'Node type (suspect/account/device/case)'], ['risk_score', 'Risk score (0–1)']] },
  { id: 'geospatial', name: 'Geospatial Crime Intelligence', icon: MapPinned, help: 'Add a verified incident to the live hotspot dataset.', fields: [['incident_type', 'Incident type'], ['latitude', 'Latitude'], ['longitude', 'Longitude'], ['district', 'District'], ['state', 'State']] },
  { id: 'citizen-shield', name: 'Citizen Fraud Shield', icon: Smartphone, help: 'Assess suspicious calls, payment requests, or messages using the citizen risk workflow.', fields: [['suspected_number', 'Phone or UPI ID'], ['transcript', 'Message or payment request']] },
]

export default function AIServicesPage() {
  const [selected, setSelected] = useState(services[0])
  const [values, setValues] = useState({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  const choose = (service) => { setSelected(service); setValues({}); setResult(''); setError('') }
  const submit = async (event) => {
    event.preventDefault(); setLoading(true); setResult(''); setError('')
    try {
      let response
      if (selected.id === 'digital-arrest') response = await api.analyzeThreat({ ...values, indicators: ['digital_arrest', 'call_flow', 'spoofing_signature'] })
      if (selected.id === 'counterfeit') response = await api.scanCurrency({ denomination: Number(values.denomination), serial_number: values.serial_number || null })
      if (selected.id === 'fraud-graph') response = await api.createFraudGraphNode({ label: values.label, node_type: values.node_type, risk_score: Number(values.risk_score) })
      if (selected.id === 'geospatial') response = await api.createGeoIncident({ ...values, latitude: Number(values.latitude), longitude: Number(values.longitude), risk_score: 0.7 })
      if (selected.id === 'citizen-shield') response = await api.classifyScam({ suspected_number: values.suspected_number, transcript: values.transcript, indicators: ['citizen_shield'] })
      const score = response.risk_score ?? response.authenticity_score
      setResult(`Request stored successfully${score !== undefined ? ` — score: ${Math.round(score * 100)}%` : ''}${response.verdict ? ` — ${response.verdict}` : ''}.`)
    } catch (err) { setError(err.message || 'Request could not be completed.') } finally { setLoading(false) }
  }

  return <div className="space-y-6"><div><h1 className="text-2xl font-bold">AI Services</h1><p className="text-muted-foreground">Operational workspace for SentinelAI’s five connected safety capabilities.</p></div><CapabilityOverview /><div className="grid gap-6 lg:grid-cols-3"><Card className="lg:col-span-1"><CardHeader><CardTitle>Choose a service</CardTitle><CardDescription>Each request is processed by the backend and stored in MongoDB.</CardDescription></CardHeader><CardContent className="space-y-2">{services.map((service) => <Button key={service.id} variant={selected.id === service.id ? 'default' : 'outline'} className="h-auto w-full justify-start gap-3 whitespace-normal py-3 text-left" onClick={() => choose(service)}><service.icon className="h-5 w-5 shrink-0" />{service.name}</Button>)}</CardContent></Card><Card className="lg:col-span-2"><CardHeader><CardTitle className="flex items-center gap-2"><selected.icon className="h-5 w-5 text-primary" />{selected.name}</CardTitle><CardDescription>{selected.help}</CardDescription></CardHeader><CardContent><form className="space-y-4" onSubmit={submit}>{selected.fields.map(([key, label]) => <div key={key}><label className="text-sm font-medium">{label}</label><Input required value={values[key] || ''} onChange={(event) => setValues((current) => ({ ...current, [key]: event.target.value }))} className="mt-1" /></div>)}{error && <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}{result && <p className="rounded-lg bg-primary/10 p-3 text-sm text-primary">{result}</p>}<Button type="submit" disabled={loading}>{loading ? 'Processing…' : 'Run analysis'}</Button></form></CardContent></Card></div></div>
}

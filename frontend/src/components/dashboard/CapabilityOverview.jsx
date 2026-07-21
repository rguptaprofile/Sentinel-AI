import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Banknote, MapPinned, Network, ShieldAlert, Smartphone, ArrowRight, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import api from '@/services/api'

const presentation = {
  'digital-arrest': { icon: ShieldAlert, route: '/dashboard/citizen', action: 'Assess a scam' },
  counterfeit: { icon: Banknote, route: '/dashboard/citizen', action: 'Scan currency' },
  'fraud-graph': { icon: Network, route: '/dashboard/police', action: 'View network' },
  geospatial: { icon: MapPinned, route: '/dashboard/police', action: 'Open heat map' },
  'citizen-shield': { icon: Smartphone, route: '/dashboard/citizen', action: 'Open shield' },
}

export default function CapabilityOverview() {
  const [features, setFeatures] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const response = await api.getCapabilityStatus()
      setFeatures(response.features || [])
      setError('')
    } catch (err) {
      setError(err.message || 'Capability status is currently unavailable.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const interval = window.setInterval(load, 30000)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h2 className="text-xl font-bold">SentinelAI Capability Hub</h2><p className="text-sm text-muted-foreground">Five connected AI safety services, refreshed every 30 seconds.</p></div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading} className="gap-2"><RefreshCw className={loading ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />Refresh</Button>
      </div>
      {error && <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">{error}</div>}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {features.map((feature) => {
          const item = presentation[feature.id]
          const Icon = item?.icon || ShieldAlert
          const operational = feature.status === 'configured'
          return <Card key={feature.id} className="flex flex-col shadow-sm"><CardHeader className="pb-3"><div className="flex items-start justify-between gap-2"><span className="rounded-lg bg-primary/10 p-2 text-primary"><Icon className="h-5 w-5" /></span><Badge variant={operational ? 'success' : 'warning'}>{operational ? 'Configured' : 'Setup needed'}</Badge></div><CardTitle className="pt-3 text-base leading-snug">{feature.title}</CardTitle><CardDescription className="text-xs leading-relaxed">{feature.description}</CardDescription></CardHeader><CardContent className="mt-auto space-y-3"><p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">{feature.data_count.toLocaleString()}</span> MongoDB records</p><Link to={item.route}><Button variant="outline" size="sm" className="w-full gap-1">{item.action}<ArrowRight className="h-3.5 w-3.5" /></Button></Link></CardContent></Card>
        })}
        {loading && !features.length && <div className="col-span-full rounded-lg border p-6 text-center text-sm text-muted-foreground">Loading live capability status…</div>}
      </div>
    </section>
  )
}

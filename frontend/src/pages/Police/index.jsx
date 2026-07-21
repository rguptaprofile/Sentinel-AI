import { AlertTriangle, FileText, MapPinned, ShieldAlert } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useReports } from '@/context/ReportContext'

export default function PoliceDashboard() {
  const { reports } = useReports()
  return <div className="space-y-6">
    <div><p className="text-sm font-medium text-primary">Law enforcement workspace</p><h1 className="text-2xl font-bold">Citizen complaints</h1><p className="text-muted-foreground">Prioritised reports from SentinelAI citizens, ready for triage and investigation.</p></div>
    <div className="grid gap-4 sm:grid-cols-3"><Metric icon={FileText} value={reports.length} label="Reports awaiting review" /><Metric icon={AlertTriangle} value={reports.filter((r) => r.status === 'New').length} label="New priority alerts" /><Metric icon={MapPinned} value="12" label="Active hotspot signals" /></div>
    <Card className="shadow-lg"><CardHeader><CardTitle>Incoming citizen reports</CardTitle><CardDescription>All citizen reports are visible to police response teams.</CardDescription></CardHeader><CardContent><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b text-xs uppercase text-muted-foreground"><tr><th className="p-3">Case</th><th className="p-3">Channel</th><th className="p-3">Location</th><th className="p-3">Received</th><th className="p-3">Status</th><th /></tr></thead><tbody>{reports.map((r) => <tr className="border-b last:border-0" key={r.id}><td className="p-3"><b>{r.type}</b><div className="text-xs text-muted-foreground">{r.id} · {r.title}</div></td><td className="p-3">{r.channel}</td><td className="p-3">{r.location}</td><td className="p-3">{r.createdAt}</td><td className="p-3"><span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">{r.status}</span></td><td className="p-3"><Button size="sm" variant="outline">Review</Button></td></tr>)}</tbody></table></div></CardContent></Card>
    <Card className="border-primary/20 bg-primary/5"><CardContent className="flex gap-3 p-5"><ShieldAlert className="h-5 w-5 shrink-0 text-primary" /><div><b className="text-sm">AI triage is ready</b><p className="mt-1 text-sm text-muted-foreground">Digital arrest, linked-account, and hotspot signals can be correlated when connected to live services.</p></div></CardContent></Card>
  </div>
}
function Metric({ icon: Icon, value, label }) { return <Card><CardContent className="flex items-center gap-4 p-5"><Icon className="h-8 w-8 text-primary" /><div><p className="text-2xl font-bold">{value}</p><p className="text-sm text-muted-foreground">{label}</p></div></CardContent></Card> }

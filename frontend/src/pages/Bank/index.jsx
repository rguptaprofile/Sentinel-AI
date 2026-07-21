import { Banknote, CircleAlert, Landmark, LockKeyhole } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useReports } from '@/context/ReportContext'

export default function BankDashboard() {
  const { reports } = useReports()
  const bankReports = reports.filter((report) => report.bankRelated)
  return <div className="space-y-6">
    <div><p className="text-sm font-medium text-primary">Financial institution workspace</p><h1 className="text-2xl font-bold">Bank-related scam alerts</h1><p className="text-muted-foreground">Citizen reports involving payments, accounts, UPI IDs, or counterfeit currency.</p></div>
    <div className="grid gap-4 sm:grid-cols-3"><Metric icon={CircleAlert} value={bankReports.length} label="Citizen alerts shared" /><Metric icon={Landmark} value={bankReports.filter((r) => r.type !== 'Counterfeit Currency').length} label="Payment & account cases" /><Metric icon={Banknote} value={bankReports.filter((r) => r.type === 'Counterfeit Currency').length} label="Currency verification cases" /></div>
    <Card className="shadow-lg"><CardHeader><CardTitle>Cases requiring bank response</CardTitle><CardDescription>Front-end demo queue for reports relevant to banking teams.</CardDescription></CardHeader><CardContent><div className="space-y-3">{bankReports.map((r) => <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card p-4" key={r.id}><div><div className="flex items-center gap-2"><b>{r.type}</b><span className="text-xs text-muted-foreground">{r.id}</span></div><p className="mt-1 text-sm text-muted-foreground">{r.title} · {r.location}</p><p className="mt-1 text-xs text-muted-foreground">Reported {r.createdAt}</p></div><Button size="sm" variant="outline">Open case</Button></div>)}</div></CardContent></Card>
    <Card className="border-emerald-200 bg-emerald-50"><CardContent className="flex gap-3 p-5"><LockKeyhole className="h-5 w-5 shrink-0 text-emerald-700"/><p className="text-sm text-emerald-900"><b>Response workflow:</b> validate the account or note, apply a hold where authorised, and share the case reference with police.</p></CardContent></Card>
  </div>
}
function Metric({ icon: Icon, value, label }) { return <Card><CardContent className="flex items-center gap-4 p-5"><Icon className="h-8 w-8 text-primary" /><div><p className="text-2xl font-bold">{value}</p><p className="text-sm text-muted-foreground">{label}</p></div></CardContent></Card> }

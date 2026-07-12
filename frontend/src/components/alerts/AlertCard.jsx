import { AlertTriangle, Info, ShieldAlert } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn, formatDate } from '@/lib/utils'
import { useAlerts } from '@/hooks/useDashboardData'
import LoadingSpinner from '@/components/common/LoadingSpinner'

const severityConfig = {
  critical: { icon: ShieldAlert, color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10 border-[#EF4444]/20' },
  high: { icon: AlertTriangle, color: 'text-[#F97316]', bg: 'bg-[#F97316]/10 border-[#F97316]/20' },
  warning: { icon: AlertTriangle, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10 border-[#F59E0B]/20' },
  info: { icon: Info, color: 'text-[#2563EB]', bg: 'bg-[#2563EB]/10 border-[#2563EB]/20' },
}

export default function AlertCard({ alert, className }) {
  const config = severityConfig[alert.severity] || severityConfig.info
  const Icon = config.icon

  return (
    <Card className={cn('border shadow-sm', config.bg, className)}>
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Icon className={cn('h-5 w-5 shrink-0 mt-0.5', config.color)} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-sm truncate">{alert.title}</h4>
              {!alert.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
            <p className="text-xs text-muted-foreground mt-2">{formatDate(alert.timestamp)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function LiveAlerts({ compact = false }) {
  const { alerts, loading, error } = useAlerts()

  if (loading) return <LoadingSpinner size="sm" />

  if (error) {
    return <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">{error}</div>
  }

  if (!alerts.length) {
    return <div className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">No live alerts available.</div>
  }

  return (
    <div className={cn('space-y-3', compact && 'space-y-2')}>
      {alerts.slice(0, compact ? 3 : 5).map((alert) => (
        <AlertCard key={alert.id} alert={alert} />
      ))}
    </div>
  )
}

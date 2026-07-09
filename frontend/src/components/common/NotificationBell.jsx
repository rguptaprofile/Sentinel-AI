import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAlerts } from '@/hooks/useDashboardData'
import { formatDate } from '@/lib/utils'
import { RiskBadgeFromSeverity } from '@/components/common/RiskBadge'

export default function NotificationBell() {
  const { alerts } = useAlerts()
  const unreadCount = alerts.filter((a) => !a.read).length

  const severityIcon = {
    critical: '🔴',
    high: '🟠',
    warning: '🟡',
    info: '🔵',
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          Notifications
          {unreadCount > 0 && <RiskBadgeFromSeverity severity="high" className="text-xs" />}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px]">
          {alerts.map((alert) => (
            <DropdownMenuItem key={alert.id} className="flex flex-col items-start gap-1 p-3 cursor-default">
              <div className="flex items-center gap-2 w-full">
                <span>{severityIcon[alert.severity] || '🔵'}</span>
                <span className="font-medium text-sm flex-1">{alert.title}</span>
                {!alert.read && <span className="h-2 w-2 rounded-full bg-primary" />}
              </div>
              <p className="text-xs text-muted-foreground pl-6">{alert.message}</p>
              <p className="text-xs text-muted-foreground pl-6">{formatDate(alert.timestamp)}</p>
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

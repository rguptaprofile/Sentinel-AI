import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const statusConfig = {
  active: { label: 'Active', variant: 'danger' },
  investigating: { label: 'Investigating', variant: 'warning' },
  resolved: { label: 'Resolved', variant: 'success' },
  flagged: { label: 'Flagged', variant: 'warning' },
  blocked: { label: 'Blocked', variant: 'danger' },
  under_review: { label: 'Under Review', variant: 'warning' },
  cleared: { label: 'Cleared', variant: 'success' },
  pending: { label: 'Pending', variant: 'secondary' },
}

export default function StatusChip({ status, className }) {
  const config = statusConfig[status] || { label: status, variant: 'secondary' }
  return (
    <Badge variant={config.variant} className={cn('capitalize', className)}>
      {config.label}
    </Badge>
  )
}

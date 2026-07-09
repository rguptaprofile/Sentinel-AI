import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const riskConfig = {
  low: { label: 'Low', className: 'bg-[#22C55E]/15 text-[#16A34A] border-[#22C55E]/30' },
  medium: { label: 'Medium', className: 'bg-[#F59E0B]/15 text-[#D97706] border-[#F59E0B]/30' },
  high: { label: 'High', className: 'bg-[#F97316]/15 text-[#EA580C] border-[#F97316]/30' },
  critical: { label: 'Critical', className: 'bg-[#EF4444]/15 text-[#DC2626] border-[#EF4444]/30' },
}

export default function RiskBadge({ score, className }) {
  let level = 'low'
  if (score >= 80) level = 'critical'
  else if (score >= 60) level = 'high'
  else if (score >= 40) level = 'medium'

  const config = riskConfig[level]
  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {score}% · {config.label}
    </Badge>
  )
}

export function RiskBadgeFromSeverity({ severity, className }) {
  const config = riskConfig[severity] || riskConfig.medium
  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}

import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatCard({ title, value, change, changeType = 'up', icon: Icon, className, loading }) {
  if (loading) {
    return (
      <div className={cn('rounded-xl border bg-card p-6 shadow-lg animate-pulse', className)}>
        <div className="h-4 w-24 bg-muted rounded mb-4" />
        <div className="h-8 w-16 bg-muted rounded mb-2" />
        <div className="h-3 w-20 bg-muted rounded" />
      </div>
    )
  }

  return (
    <div className={cn('rounded-xl border bg-card p-6 shadow-lg hover:shadow-xl transition-shadow', className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
      {change && (
        <div className="mt-2 flex items-center gap-1 text-sm">
          {changeType === 'up' ? (
            <TrendingUp className="h-4 w-4 text-[#22C55E]" />
          ) : (
            <TrendingDown className="h-4 w-4 text-[#EF4444]" />
          )}
          <span className={changeType === 'up' ? 'text-[#22C55E]' : 'text-[#EF4444]'}>{change}</span>
          <span className="text-muted-foreground">vs last period</span>
        </div>
      )}
    </div>
  )
}

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useChartData } from '@/hooks/useDashboardData'

export default function RiskDistributionChart() {
  const { chartData, error } = useChartData()
  const data = chartData?.riskDistribution?.length ? chartData.riskDistribution : []

  if (error) {
    return <div className="flex h-[280px] items-center justify-center rounded-xl border bg-card text-sm text-muted-foreground">{error}</div>
  }

  if (!data.length) {
    return <div className="flex h-[280px] items-center justify-center rounded-xl border bg-card text-sm text-muted-foreground">No live risk data yet.</div>
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="range" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
        <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '0.75rem',
          }}
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

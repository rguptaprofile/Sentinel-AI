import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useChartData } from '@/hooks/useDashboardData'

export default function ReportsByStateChart() {
  const { chartData, error } = useChartData()
  const data = chartData?.reportsByState?.length ? chartData.reportsByState : []

  if (error) {
    return <div className="flex h-[280px] items-center justify-center rounded-xl border bg-card text-sm text-muted-foreground">{error}</div>
  }

  if (!data.length) {
    return <div className="flex h-[280px] items-center justify-center rounded-xl border bg-card text-sm text-muted-foreground">No live state data yet.</div>
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
        <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
        <YAxis dataKey="state" type="category" width={100} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '0.75rem',
          }}
        />
        <Bar dataKey="reports" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

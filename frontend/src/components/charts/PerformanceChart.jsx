import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useChartData } from '@/hooks/useDashboardData'

export default function PerformanceChart() {
  const { chartData, error } = useChartData()
  const data = chartData?.systemPerformance?.length ? chartData.systemPerformance : []

  if (error) {
    return <div className="flex h-[280px] items-center justify-center rounded-xl border bg-card text-sm text-muted-foreground">{error}</div>
  }

  if (!data.length) {
    return <div className="flex h-[280px] items-center justify-center rounded-xl border bg-card text-sm text-muted-foreground">No live performance data yet.</div>
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="time" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
        <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '0.75rem',
          }}
        />
        <Legend />
        <Line type="monotone" dataKey="cpu" stroke="#2563EB" strokeWidth={2} dot={false} name="CPU %" />
        <Line type="monotone" dataKey="memory" stroke="#38BDF8" strokeWidth={2} dot={false} name="Memory %" />
        <Line type="monotone" dataKey="requests" stroke="#22C55E" strokeWidth={2} dot={false} name="Requests/min" />
      </LineChart>
    </ResponsiveContainer>
  )
}

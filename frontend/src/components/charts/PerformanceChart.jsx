import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import fallbackChartData from '@/services/data/chartData.json'
import { useChartData } from '@/hooks/useDashboardData'

export default function PerformanceChart() {
  const { chartData } = useChartData()
  const data = chartData?.systemPerformance?.length ? chartData.systemPerformance : fallbackChartData.systemPerformance

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

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import fallbackChartData from '@/services/data/chartData.json'
import { useChartData } from '@/hooks/useDashboardData'

export default function TransactionVolumeChart() {
  const { chartData } = useChartData()
  const data = chartData?.transactionVolume?.length ? chartData.transactionVolume : fallbackChartData.transactionVolume

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="day" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
        <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '0.75rem',
          }}
        />
        <Legend />
        <Bar dataKey="volume" fill="#2563EB" radius={[4, 4, 0, 0]} name="Volume" />
        <Bar dataKey="flagged" fill="#EF4444" radius={[4, 4, 0, 0]} name="Flagged" />
      </BarChart>
    </ResponsiveContainer>
  )
}

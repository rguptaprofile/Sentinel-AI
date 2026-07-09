import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import chartData from '@/services/data/chartData.json'

export default function FraudTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={chartData.fraudTrend}>
        <defs>
          <linearGradient id="fraudGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
        <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '0.75rem',
          }}
        />
        <Area type="monotone" dataKey="reports" stroke="#2563EB" fill="url(#fraudGradient)" strokeWidth={2} name="Reports" />
        <Area type="monotone" dataKey="losses" stroke="#38BDF8" fill="none" strokeWidth={2} name="Losses (Cr)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

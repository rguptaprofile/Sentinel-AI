import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useChartData } from '@/hooks/useDashboardData'

export default function ScamCategoriesChart() {
  const { chartData, error } = useChartData()
  const data = chartData?.scamCategories?.length ? chartData.scamCategories : []

  if (error) {
    return <div className="flex h-[280px] items-center justify-center rounded-xl border bg-card text-sm text-muted-foreground">{error}</div>
  }

  if (!data.length) {
    return <div className="flex h-[280px] items-center justify-center rounded-xl border bg-card text-sm text-muted-foreground">No live scam category data yet.</div>
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
          nameKey="name"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '0.75rem',
          }}
          formatter={(value) => [`${value}%`, 'Share']}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import fallbackChartData from '@/services/data/chartData.json'
import { useChartData } from '@/hooks/useDashboardData'

export default function ScamCategoriesChart() {
  const { chartData } = useChartData()
  const data = chartData?.scamCategories?.length ? chartData.scamCategories : fallbackChartData.scamCategories

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

import { Activity, BarChart3, ShieldAlert } from 'lucide-react'
import ChartCard from '@/components/cards/ChartCard'
import FraudTrendChart from '@/components/charts/FraudTrendChart'
import RiskDistributionChart from '@/components/charts/RiskDistributionChart'
import StatCard from '@/components/cards/StatCard'

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Platform-wide fraud trends and risk insights</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Reports analyzed" value="1.14M" change="+12%" icon={Activity} />
        <StatCard title="High-risk signals" value="4,281" change="-8%" changeType="down" icon={ShieldAlert} />
        <StatCard title="Detection rate" value="99.2%" change="+0.4%" icon={BarChart3} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Fraud trend" description="Reported fraud over time"><FraudTrendChart /></ChartCard>
        <ChartCard title="Risk distribution" description="Cases by risk level"><RiskDistributionChart /></ChartCard>
      </div>
    </div>
  )
}

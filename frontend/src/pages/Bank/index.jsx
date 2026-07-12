import {
  AlertTriangle,
  Gauge,
  Ban,
  UserX,
} from 'lucide-react'
import StatCard from '@/components/cards/StatCard'
import ChartCard from '@/components/cards/ChartCard'
import TransactionVolumeChart from '@/components/charts/TransactionVolumeChart'
import FraudTrendChart from '@/components/charts/FraudTrendChart'
import RiskDistributionChart from '@/components/charts/RiskDistributionChart'
import { TransactionsTable } from '@/components/common/DataTable'
import { useDashboardData } from '@/hooks/useDashboardData'

export default function BankDashboard() {
  const { stats, loading, error } = useDashboardData('bank')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bank Fraud Monitoring Center</h1>
        <p className="text-muted-foreground">Real-time transaction analysis and fraud prevention</p>
      </div>

      {error && <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">{error}</div>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Suspicious Transactions" value={stats?.suspiciousTransactions ?? '—'} change="+12 today" icon={AlertTriangle} loading={loading} />
        <StatCard title="Fraud Score" value={stats?.fraudScore ?? '—'} change="Moderate" icon={Gauge} loading={loading} />
        <StatCard title="Blocked Accounts" value={stats?.blockedAccounts ?? '—'} change="+2" icon={Ban} loading={loading} />
        <StatCard title="High Risk Accounts" value={stats?.highRiskAccounts ?? '—'} change="+7" changeType="down" icon={UserX} loading={loading} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <ChartCard title="Transaction Volume" description="Daily volume vs flagged transactions">
          <TransactionVolumeChart />
        </ChartCard>
        <ChartCard title="Fraud Trend" description="Monthly fraud report correlation">
          <FraudTrendChart />
        </ChartCard>
        <ChartCard title="Risk Distribution" description="Account risk score breakdown">
          <RiskDistributionChart />
        </ChartCard>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Recent Transactions</h3>
        <TransactionsTable />
      </div>
    </div>
  )
}

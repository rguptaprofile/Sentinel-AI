import {
  AlertTriangle,
  FileText,
  Gauge,
  Banknote,
  Sparkles,
} from 'lucide-react'
import StatCard from '@/components/cards/StatCard'
import ChartCard from '@/components/cards/ChartCard'
import MapCard from '@/components/cards/MapCard'
import FraudTrendChart from '@/components/charts/FraudTrendChart'
import ReportsByStateChart from '@/components/charts/ReportsByStateChart'
import ScamCategoriesChart from '@/components/charts/ScamCategoriesChart'
import IndiaHeatMap from '@/components/maps/IndiaHeatMap'
import FraudNetworkGraph from '@/components/maps/FraudNetworkGraph'
import { FraudReportsTable } from '@/components/common/DataTable'
import { LiveAlerts } from '@/components/alerts/AlertCard'
import { useDashboardData } from '@/hooks/useDashboardData'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

const recommendations = [
  'Deploy enhanced voice scam detection to Delhi NCR — 47 new cases detected in 2 hours',
  'Investigate fraud ring connecting UPI mule accounts ACC-78234 and ACC-45123',
  'Increase counterfeit monitoring in Chennai retail markets — cluster detected',
  'Issue citizen advisory for new OTP social engineering pattern in Gujarat',
  'Coordinate with HDFC Bank on blocked transaction TXN-002 investigation',
]

export default function PoliceDashboard() {
  const { stats, loading, error } = useDashboardData('police')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Police Intelligence Dashboard</h1>
        <p className="text-muted-foreground">Real-time threat monitoring and fraud investigation center</p>
      </div>

      {error && <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">{error}</div>}

      {/* Top stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Threats" value={stats?.activeThreats ?? '—'} change="+8 today" icon={AlertTriangle} loading={loading} />
        <StatCard title="Today's Reports" value={stats?.todayReports ?? '—'} change="+23%" icon={FileText} loading={loading} />
        <StatCard title="Risk Score" value={stats?.riskScore ?? '—'} change="Elevated" changeType="down" icon={Gauge} loading={loading} />
        <StatCard title="Counterfeit Cases" value={stats?.counterfeitCases ?? '—'} change="+5" icon={Banknote} loading={loading} />
      </div>

      {/* Maps section */}
      <div className="grid lg:grid-cols-2 gap-6">
        <MapCard title="India Fraud Heat Map" description="Geospatial distribution of reported cybercrime">
          <IndiaHeatMap height="380px" />
        </MapCard>
        <ChartCard title="Fraud Network Graph" description="AI-detected connections between suspects, accounts, and victims">
          <FraudNetworkGraph />
        </ChartCard>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <ChartCard title="Fraud Trend" description="Monthly report volume and losses">
          <FraudTrendChart />
        </ChartCard>
        <ChartCard title="Reports by State" description="Top reporting regions">
          <ReportsByStateChart />
        </ChartCard>
        <ChartCard title="Scam Categories" description="Distribution by fraud type">
          <ScamCategoriesChart />
        </ChartCard>
      </div>

      {/* Table + AI panel + Alerts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h3 className="font-semibold mb-4">Recent Reports</h3>
          <FraudReportsTable />
        </div>
        <div className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[240px]">
                <ul className="space-y-3">
                  {recommendations.map((rec, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-primary font-bold shrink-0">{i + 1}.</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>
          <div>
            <h3 className="font-semibold mb-4">Live Alerts</h3>
            <LiveAlerts />
          </div>
        </div>
      </div>
    </div>
  )
}

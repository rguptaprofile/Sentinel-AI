import { Link } from 'react-router-dom'
import { Shield, Users, Landmark, Building2, ArrowRight, Activity } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import StatCard from '@/components/cards/StatCard'
import { LiveAlerts } from '@/components/alerts/AlertCard'
import FraudTrendChart from '@/components/charts/FraudTrendChart'
import ChartCard from '@/components/cards/ChartCard'

const portals = [
  { title: 'Citizen Portal', desc: 'Report scams, verify transactions, get safety tips', icon: Shield, path: '/dashboard/citizen', color: 'from-[#22C55E] to-[#16A34A]' },
  { title: 'Police Intelligence', desc: 'Threat monitoring, fraud graphs, investigation tools', icon: Users, path: '/dashboard/police', color: 'from-primary to-accent' },
  { title: 'Bank Fraud Center', desc: 'Transaction monitoring, risk scoring, compliance', icon: Landmark, path: '/dashboard/bank', color: 'from-[#F59E0B] to-[#D97706]' },
  { title: 'Admin Console', desc: 'System health, user management, AI model control', icon: Building2, path: '/dashboard/admin', color: 'from-[#8B5CF6] to-[#7C3AED]' },
]

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Command Center</h1>
        <p className="text-muted-foreground">Unified overview of SentinelAI platform activity</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Reports" value="1.14M" change="+12%" icon={Activity} />
        <StatCard title="Active Threats" value="47" change="+8" changeType="down" icon={Shield} />
        <StatCard title="Agencies Online" value="512" change="+3" icon={Users} />
        <StatCard title="System Health" value="98.7%" change="Stable" icon={Activity} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {portals.map((portal) => (
          <Card key={portal.title} className="shadow-lg hover:shadow-xl transition-all overflow-hidden group">
            <CardHeader className="pb-2">
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${portal.color} text-white shadow-lg mb-2`}>
                <portal.icon className="h-6 w-6" />
              </div>
              <CardTitle>{portal.title}</CardTitle>
              <CardDescription>{portal.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to={portal.path}>
                <Button variant="outline" className="gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  Open Portal <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <ChartCard title="Platform Activity" description="Fraud reports trend" className="lg:col-span-2">
          <FraudTrendChart />
        </ChartCard>
        <div>
          <h3 className="font-semibold mb-4">Live Alerts</h3>
          <LiveAlerts />
        </div>
      </div>
    </div>
  )
}

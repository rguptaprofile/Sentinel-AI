import {
  Users,
  FileText,
  Brain,
  HeartPulse,
  Database,
  Server,
} from 'lucide-react'
import StatCard from '@/components/cards/StatCard'
import ChartCard from '@/components/cards/ChartCard'
import PerformanceChart from '@/components/charts/PerformanceChart'
import { useDashboardData } from '@/hooks/useDashboardData'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

const systemLogs = [
  { time: '09:00:12', level: 'info', message: 'Scam detection model v3.2 inference completed — 1,247 predictions' },
  { time: '09:00:08', level: 'info', message: 'Database replication sync completed successfully' },
  { time: '08:59:45', level: 'warning', message: 'High CPU usage detected on inference-node-03 (85%)' },
  { time: '08:59:30', level: 'info', message: 'New fraud report ingested from Maharashtra portal' },
  { time: '08:58:12', level: 'error', message: 'Failed webhook delivery to partner bank — retry scheduled' },
  { time: '08:57:00', level: 'info', message: 'Scheduled backup completed — 2.4TB archived' },
  { time: '08:55:22', level: 'info', message: 'Voice scam model retrained — accuracy improved to 97.8%' },
  { time: '08:54:10', level: 'warning', message: 'API rate limit approaching for /verify/upi endpoint' },
]

const aiModels = [
  { name: 'Scam Detection v3.2', status: 'active', accuracy: '99.2%' },
  { name: 'Voice Analysis v2.1', status: 'active', accuracy: '97.8%' },
  { name: 'Counterfeit CV v1.8', status: 'active', accuracy: '99.5%' },
  { name: 'Fraud Graph GNN v2.0', status: 'training', accuracy: '94.1%' },
  { name: 'LLM Assistant v1.5', status: 'active', accuracy: '96.3%' },
]

const dbStatus = [
  { name: 'Primary MongoDB', status: 'healthy', latency: '2ms', connections: 'sentinelai database' },
  { name: 'Redis Cache Cluster', status: 'healthy', latency: '0.3ms', connections: '12/16 nodes' },
  { name: 'Elasticsearch', status: 'healthy', latency: '15ms', connections: '2.1M docs' },
  { name: 'Graph Database (Neo4j)', status: 'degraded', latency: '45ms', connections: '12.4M nodes' },
]

const levelColors = {
  info: 'bg-primary/10 text-primary',
  warning: 'bg-[#F59E0B]/10 text-[#D97706]',
  error: 'bg-[#EF4444]/10 text-[#DC2626]',
}

export default function AdminDashboard() {
  const { stats, loading } = useDashboardData('admin')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Console</h1>
        <p className="text-muted-foreground">System management, monitoring, and AI model administration</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={stats?.totalUsers?.toLocaleString() ?? '—'} change="+234 this week" icon={Users} loading={loading} />
        <StatCard title="Total Reports" value={stats?.totalReports?.toLocaleString() ?? '—'} change="+1.2K today" icon={FileText} loading={loading} />
        <StatCard title="AI Models" value={stats?.aiModels ?? '—'} change="All operational" icon={Brain} loading={loading} />
        <StatCard title="System Health" value={`${stats?.systemHealth ?? '—'}%`} change="Stable" icon={HeartPulse} loading={loading} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* System Logs */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Server className="h-4 w-4" />
              System Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[320px]">
              <div className="space-y-2 font-mono text-xs">
                {systemLogs.map((log, i) => (
                  <div key={i} className="flex gap-2 items-start py-1.5 border-b border-border/50 last:border-0">
                    <span className="text-muted-foreground shrink-0">{log.time}</span>
                    <Badge variant="outline" className={`shrink-0 text-[10px] ${levelColors[log.level]}`}>
                      {log.level}
                    </Badge>
                    <span className="text-muted-foreground">{log.message}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Performance */}
        <ChartCard title="System Performance" description="CPU, memory, and request metrics">
          <PerformanceChart />
        </ChartCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* AI Models */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Models
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {aiModels.map((model) => (
                <div key={model.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium text-sm">{model.name}</p>
                    <p className="text-xs text-muted-foreground">Accuracy: {model.accuracy}</p>
                  </div>
                  <Badge variant={model.status === 'active' ? 'success' : 'warning'}>
                    {model.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Database Status */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="h-4 w-4" />
              Database Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dbStatus.map((db) => (
                <div key={db.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium text-sm">{db.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Latency: {db.latency} · {db.connections}
                    </p>
                  </div>
                  <Badge variant={db.status === 'healthy' ? 'success' : 'warning'}>
                    {db.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

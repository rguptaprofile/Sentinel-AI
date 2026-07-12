import { motion } from 'framer-motion'
import {
  AlertOctagon,
  CreditCard,
  Phone,
  QrCode,
  Banknote,
  Siren,
  MapPin,
  MessageCircle,
  Lightbulb,
  Shield,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import StatCard from '@/components/cards/StatCard'
import MapCard from '@/components/cards/MapCard'
import IndiaHeatMap from '@/components/maps/IndiaHeatMap'
import { useDashboardData } from '@/hooks/useDashboardData'

const actions = [
  { icon: AlertOctagon, title: 'Report Scam', desc: 'File a cybercrime report instantly', color: 'bg-[#EF4444]/10 text-[#EF4444]' },
  { icon: CreditCard, title: 'Verify UPI', desc: 'Check if a UPI ID is legitimate', color: 'bg-primary/10 text-primary' },
  { icon: Phone, title: 'Verify Phone', desc: 'Look up suspicious phone numbers', color: 'bg-[#F59E0B]/10 text-[#F59E0B]' },
  { icon: QrCode, title: 'Verify QR', desc: 'Scan and validate QR codes', color: 'bg-accent/10 text-accent' },
  { icon: Banknote, title: 'Upload Currency', desc: 'Check notes for counterfeits', color: 'bg-[#22C55E]/10 text-[#22C55E]' },
  { icon: Siren, title: 'Emergency Alert', desc: 'Send immediate distress signal', color: 'bg-[#EF4444]/10 text-[#EF4444]' },
]

const safetyTips = [
  'Never share OTP with anyone — banks never ask for OTP over phone',
  'Verify UPI collect requests before approving payments',
  'Check URLs carefully — look for HTTPS and official domains',
  'Be wary of investment schemes promising unrealistic returns',
  'Report suspicious calls claiming to be from government agencies',
  'Use SentinelAI to verify QR codes before scanning in public places',
]

export default function CitizenDashboard() {
  const { stats, loading, error } = useDashboardData('citizen')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Citizen Safety Portal</h1>
        <p className="text-muted-foreground">Protect yourself with AI-powered verification and reporting tools</p>
      </div>

      {error && <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">{error}</div>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Nearby Scams" value={stats?.nearbyScams ?? '—'} change="Within 5km" icon={MapPin} loading={loading} />
        <StatCard title="Verified Today" value={stats?.verifiedToday ?? '—'} change="Checks passed" icon={Shield} loading={loading} />
        <StatCard title="Safety Score" value={`${stats?.safetyScore ?? '—'}%`} change="Good" icon={Shield} loading={loading} />
        <StatCard title="Active Alerts" value={stats?.activeAlerts ?? '—'} change="In your area" icon={AlertOctagon} loading={loading} />
      </div>

      {/* Action cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action, i) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="shadow-lg hover:shadow-xl transition-all cursor-pointer group hover:border-primary/30">
              <CardContent className="p-6">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${action.color} mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg">{action.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{action.desc}</p>
                <Button variant="outline" size="sm" className="mt-4">Open Tool</Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <MapCard title="Nearby Scam Heatmap" description="Reported fraud activity in your region" height="h-[350px]">
          <IndiaHeatMap height="350px" />
        </MapCard>

        <div className="space-y-6">
          {/* AI Chat preview */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                AI Chat Assistant
              </CardTitle>
              <CardDescription>Get instant help with fraud prevention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl bg-muted/50 p-4 space-y-3">
                <div className="bg-card rounded-2xl rounded-bl-md p-3 text-sm shadow-sm max-w-[85%]">
                  Hello! I'm SentinelAI Assistant. How can I help you stay safe today?
                </div>
                <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md p-3 text-sm shadow-sm max-w-[85%] ml-auto">
                  Is this UPI ID safe to pay? rajesh.pay@oksbi
                </div>
                <div className="bg-card rounded-2xl rounded-bl-md p-3 text-sm shadow-sm max-w-[85%]">
                  ⚠️ This UPI ID has 3 fraud reports. We recommend NOT proceeding with payment.
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">Click the chat button at bottom-right to continue</p>
            </CardContent>
          </Card>

          {/* Safety tips */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-[#F59E0B]" />
                Safety Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {safetyTips.map((tip, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                      {i + 1}
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

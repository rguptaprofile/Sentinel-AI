import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Shield,
  ArrowRight,
  Play,
  ShieldCheck,
  Scan,
  Mic,
  Network,
  Map,
  Bot,
  CheckCircle2,
  Building2,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Timeline from '@/components/common/Timeline'

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
}

const aiModules = [
  { icon: ShieldCheck, title: 'Scam Detection', desc: 'Real-time AI detection of phishing, UPI fraud, and social engineering attacks' },
  { icon: Scan, title: 'Counterfeit Detection', desc: 'Computer vision analysis of currency notes with 99.2% accuracy' },
  { icon: Mic, title: 'Voice Scam Detection', desc: 'Deep learning models to identify AI-generated voice impersonation' },
  { icon: Network, title: 'Fraud Graph Intelligence', desc: 'Graph neural networks mapping fraud rings and mule accounts' },
  { icon: Map, title: 'Heat Maps', desc: 'Geospatial visualization of crime hotspots across India' },
  { icon: Bot, title: 'LLM Assistant', desc: 'Conversational AI for citizen guidance and investigator support' },
]

const features = [
  { title: 'Real-time Threat Intelligence', desc: 'Continuous monitoring with sub-second alert generation across all channels' },
  { title: 'Multi-agency Collaboration', desc: 'Secure data sharing between police, banks, and government agencies' },
  { title: 'Citizen Empowerment', desc: 'Self-service verification tools and instant scam reporting' },
  { title: 'Predictive Analytics', desc: 'ML models forecasting fraud trends and emerging attack patterns' },
]

const timelineSteps = [
  { title: 'Report & Detect', description: 'Citizens report scams or AI automatically detects suspicious activity through integrated channels.' },
  { title: 'Analyze & Correlate', description: 'AI engines analyze patterns, correlate across databases, and build fraud network graphs.' },
  { title: 'Alert & Investigate', description: 'Law enforcement receives prioritized alerts with actionable intelligence and evidence packages.' },
  { title: 'Prevent & Protect', description: 'Proactive measures deployed — account blocks, citizen warnings, and policy recommendations.' },
]

const landingStats = [
  { icon: 'shield', value: '5', label: 'Core AI Capability Areas', change: 'Configured for real data sources' },
  { icon: 'trending', value: 'MongoDB', label: 'Live Persistence Layer', change: 'Connected through backend APIs' },
  { icon: 'building', value: 'API', label: 'Agency Integration Ready', change: 'Keys loaded from secure env' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">SentinelAI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#modules" className="hover:text-foreground transition-colors">AI Modules</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button variant="gradient">Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm shadow-sm mb-6">
                <span className="h-2 w-2 rounded-full bg-[#22C55E] animate-pulse" />
                Trusted by 500+ agencies nationwide
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight leading-tight">
                AI-Powered Digital{' '}
                <span className="text-gradient">Public Safety</span>{' '}
                Intelligence Platform
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-lg">
                Protect citizens, empower law enforcement, and secure financial institutions with
                next-generation AI threat detection and fraud intelligence.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/signup">
                  <Button variant="gradient" size="lg" className="gap-2">
                    Sign Up <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="gap-2">
                  <Play className="h-4 w-4" /> Watch Demo
                </Button>
              </div>
            </motion.div>

            {/* Hero Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl gradient-dark p-8 shadow-2xl">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50 rounded-2xl" />
                <div className="relative grid grid-cols-2 gap-4">
                  <div className="glass-dark rounded-xl p-4 col-span-2">
                    <div className="flex items-center gap-3 mb-3">
                      <Shield className="h-6 w-6 text-accent" />
                      <span className="text-white font-semibold">Threat Dashboard</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-primary to-accent rounded-full" />
                    </div>
                  </div>
                  {[
                    { label: 'Active Threats', value: '47', color: 'text-[#EF4444]' },
                    { label: 'Reports Today', value: '1,247', color: 'text-accent' },
                    { label: 'AI Accuracy', value: '99.2%', color: 'text-[#22C55E]' },
                    { label: 'Agencies', value: '500+', color: 'text-primary' },
                  ].map((stat) => (
                    <div key={stat.label} className="glass-dark rounded-xl p-4">
                      <p className="text-xs text-slate-400">{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-card border-y">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {landingStats.map((stat, i) => (
              <motion.div key={stat.label} {...fadeUp} transition={{ delay: i * 0.1 }}>
                <Card className="text-center shadow-lg hover:shadow-xl transition-shadow border-0 bg-gradient-to-br from-card to-muted/30">
                  <CardContent className="pt-8 pb-8">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                      {stat.icon === 'shield' && <Shield className="h-7 w-7 text-primary" />}
                      {stat.icon === 'trending' && <TrendingUp className="h-7 w-7 text-primary" />}
                      {stat.icon === 'building' && <Building2 className="h-7 w-7 text-primary" />}
                    </div>
                    <p className="text-4xl font-bold text-gradient">{stat.value}</p>
                    <p className="mt-2 text-muted-foreground">{stat.label}</p>
                    <p className="mt-1 text-sm font-medium text-[#22C55E]">{stat.change}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Modules */}
      <section id="modules" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">AI Intelligence Modules</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Six specialized AI engines working together to detect, analyze, and prevent digital fraud at scale.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiModules.map((mod, i) => (
              <motion.div key={mod.title} {...fadeUp} transition={{ delay: i * 0.1 }}>
                <Card className="h-full shadow-lg hover:shadow-xl hover:border-primary/30 transition-all group">
                  <CardContent className="p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors mb-4">
                      <mod.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">{mod.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{mod.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 lg:py-28 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">Enterprise-Grade Features</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Built for the scale and security requirements of national public safety infrastructure.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feat, i) => (
              <motion.div key={feat.title} {...fadeUp} transition={{ delay: i * 0.1 }}>
                <Card className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 flex gap-4">
                    <CheckCircle2 className="h-6 w-6 text-[#22C55E] shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg">{feat.title}</h3>
                      <p className="mt-2 text-muted-foreground">{feat.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">How It Works</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              From detection to prevention — a seamless intelligence pipeline.
            </p>
          </motion.div>
          <div className="max-w-2xl mx-auto">
            <Timeline steps={timelineSteps} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="rounded-2xl gradient-primary p-12 text-center text-white shadow-2xl">
            <h2 className="text-3xl font-bold">Ready to Secure Your Community?</h2>
            <p className="mt-4 text-white/80 max-w-xl mx-auto">
              Join 500+ agencies using SentinelAI to protect citizens from digital fraud.
            </p>
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="mt-8 gap-2">
                Sign Up Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold">SentinelAI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-Powered Digital Public Safety Intelligence Platform for India.
              </p>
            </div>
            {[
              { title: 'Platform', links: ['Features', 'AI Modules', 'Pricing', 'Documentation'] },
              { title: 'Resources', links: ['Blog', 'Case Studies', 'API Docs', 'Support'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Compliance', 'Security'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold mb-4">{col.title}</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {col.links.map((link) => (
                    <li key={link}><a href="#" className="hover:text-foreground transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2024 SentinelAI. All rights reserved. Government of India Initiative.
          </div>
        </div>
      </footer>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, UserCircle, Users, Landmark, Building2, Mail, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

const roles = [
  { id: 'citizen', label: 'Citizen', icon: UserCircle, desc: 'Report scams & verify transactions', color: 'hover:border-[#22C55E] hover:bg-[#22C55E]/5' },
  { id: 'police', label: 'Police', icon: Users, desc: 'Intelligence & investigation tools', color: 'hover:border-primary hover:bg-primary/5' },
  { id: 'bank', label: 'Bank', icon: Landmark, desc: 'Fraud monitoring & compliance', color: 'hover:border-[#F59E0B] hover:bg-[#F59E0B]/5' },
  { id: 'admin', label: 'Admin', icon: Building2, desc: 'System management & analytics', color: 'hover:border-[#8B5CF6] hover:bg-[#8B5CF6]/5' },
]

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState('citizen')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const route = await login(selectedRole, email, password)
      navigate(route)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-dark relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative text-white max-w-md"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur mb-8">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold">SentinelAI</h1>
          <p className="mt-4 text-lg text-white/70">
            Secure access to India's AI-powered digital public safety intelligence platform.
          </p>
          <div className="mt-8 space-y-4">
            {['End-to-end encrypted sessions', 'Multi-factor authentication ready', 'Role-based access control'].map((item) => (
              <div key={item} className="flex items-center gap-3 text-white/80">
                <div className="h-2 w-2 rounded-full bg-accent" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-lg"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">SentinelAI</span>
          </div>

          <Card className="shadow-2xl border-0">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription>Select your role and sign in to continue</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Role selector */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={cn(
                      'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all text-center',
                      role.color,
                      selectedRole === role.id
                        ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20'
                        : 'border-border'
                    )}
                  >
                    <role.icon className={cn('h-6 w-6', selectedRole === role.id ? 'text-primary' : 'text-muted-foreground')} />
                    <span className="font-medium text-sm">{role.label}</span>
                    <span className="text-[10px] text-muted-foreground leading-tight">{role.desc}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" placeholder="you@example.com" autoComplete="email" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9" placeholder="Enter your password" autoComplete="current-password" required />
                  </div>
                </div>
                {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
                <Button type="submit" variant="gradient" className="w-full" size="lg">
                  {submitting ? 'Signing in...' : `Sign in as ${roles.find((r) => r.id === selectedRole)?.label}`}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                New to SentinelAI?{' '}
                <Link to="/signup" className="text-primary font-medium hover:underline">Create an account</Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

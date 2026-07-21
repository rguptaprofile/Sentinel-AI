import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Landmark, Lock, Mail, Shield, User, UserCircle, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

const roles = [
  { id: 'citizen', label: 'Citizen', icon: UserCircle },
  { id: 'police', label: 'Police', icon: Users },
  { id: 'bank', label: 'Bank', icon: Landmark },
]

export default function SignUpPage() {
  const [selectedRole, setSelectedRole] = useState('citizen')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const updateField = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }))
  const handleSubmit = async (event) => {
    event.preventDefault()
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const route = await signup(selectedRole, form.name, form.email, form.password)
      navigate(route)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary"><Shield className="h-5 w-5 text-white" /></span>
          <span className="text-xl font-bold">SentinelAI</span>
        </Link>
        <Card className="border-0 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>Enter your details to get started with SentinelAI.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <div className="relative"><User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input id="name" value={form.name} onChange={updateField('name')} className="pl-9" placeholder="Your full name" autoComplete="name" required /></div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative"><Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input id="email" type="email" value={form.email} onChange={updateField('email')} className="pl-9" placeholder="you@example.com" autoComplete="email" required /></div>
              </div>
              <div className="space-y-2">
                <Label>Account type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map((role) => <button key={role.id} type="button" onClick={() => setSelectedRole(role.id)} className={cn('flex items-center gap-2 rounded-lg border-2 p-3 text-sm transition-colors', selectedRole === role.id ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/40')}><role.icon className="h-4 w-4" />{role.label}</button>)}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="password">Password</Label><div className="relative"><Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input id="password" type="password" value={form.password} onChange={updateField('password')} className="pl-9" placeholder="At least 8 characters" minLength="8" autoComplete="new-password" required /></div></div>
                <div className="space-y-2"><Label htmlFor="confirm-password">Confirm password</Label><Input id="confirm-password" type="password" value={form.confirmPassword} onChange={updateField('confirmPassword')} placeholder="Repeat password" minLength="8" autoComplete="new-password" required /></div>
              </div>
              {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
              <Button type="submit" variant="gradient" className="w-full" size="lg">{submitting ? 'Creating account...' : 'Create account'}</Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">Already have an account? <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link></p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

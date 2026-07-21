import { useEffect, useState } from 'react'
import { Bell, Save, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

export default function SettingsPage() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('sentinelai_settings')
    return saved ? JSON.parse(saved) : { notifications: true, emergencyAlerts: true, compactMode: false, displayName: '' }
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!settings.displayName) {
      const user = JSON.parse(localStorage.getItem('sentinelai_user') || '{}')
      if (user.name) setSettings((current) => ({ ...current, displayName: user.name }))
    }
  }, [])

  const update = (key, value) => setSettings((current) => ({ ...current, [key]: value }))
  const save = () => {
    localStorage.setItem('sentinelai_settings', JSON.stringify(settings))
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your SentinelAI workspace preferences</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Workspace settings</CardTitle>
          <CardDescription>Changes are saved locally for your current SentinelAI session.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="max-w-md"><label className="text-sm font-medium">Display name</label><Input value={settings.displayName} onChange={(event) => update('displayName', event.target.value)} className="mt-1" placeholder="Your name" /></div>
          <div className="space-y-4">
            {[['notifications', 'Notifications', 'Receive non-critical activity updates'], ['emergencyAlerts', 'Emergency alerts', 'Show priority safety alerts immediately'], ['compactMode', 'Compact dashboard', 'Use denser spacing in dashboard views']].map(([key, title, description]) => <div key={key} className="flex items-center justify-between rounded-lg border p-4"><div className="flex gap-3"><span className="rounded-lg bg-primary/10 p-2 text-primary">{key === 'emergencyAlerts' ? <ShieldCheck className="h-4 w-4" /> : <Bell className="h-4 w-4" />}</span><div><p className="font-medium text-sm">{title}</p><p className="text-sm text-muted-foreground">{description}</p></div></div><Switch checked={settings[key]} onCheckedChange={(checked) => update(key, checked)} /></div>)}
          </div>
          <div className="flex items-center gap-3"><Button onClick={save} className="gap-2"><Save className="h-4 w-4" />Save preferences</Button>{saved && <span className="text-sm text-primary">Preferences saved.</span>}</div>
        </CardContent>
      </Card>
    </div>
  )
}

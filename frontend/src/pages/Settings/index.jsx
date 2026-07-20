import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your SentinelAI workspace preferences</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Workspace settings</CardTitle>
          <CardDescription>Account, notification, and security preferences will appear here.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">Settings are managed by your organization administrator.</CardContent>
      </Card>
    </div>
  )
}

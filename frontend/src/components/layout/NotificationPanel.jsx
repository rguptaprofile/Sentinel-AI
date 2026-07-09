import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { LiveAlerts } from '@/components/alerts/AlertCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'

const recommendations = [
  'Deploy voice scam detection to Delhi NCR — 47 new cases in 2 hours',
  'Investigate connected fraud ring linking 3 UPI mule accounts',
  'Increase monitoring in Chennai markets for counterfeit ₹500 notes',
  'Update citizen alert for new OTP social engineering pattern',
]

export default function NotificationPanel({ onClose }) {
  return (
    <aside className="hidden xl:block w-80 border-l bg-card/50 backdrop-blur-sm p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Live Feed</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <LiveAlerts compact />

      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            <ul className="space-y-3">
              {recommendations.map((rec, i) => (
                <li key={i} className="text-xs text-muted-foreground flex gap-2">
                  <span className="text-primary font-bold shrink-0">{i + 1}.</span>
                  {rec}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>
    </aside>
  )
}

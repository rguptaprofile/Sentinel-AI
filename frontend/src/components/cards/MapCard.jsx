import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default function MapCard({ title, description, children, className, height = 'h-[400px]' }) {
  return (
    <Card className={cn('shadow-lg overflow-hidden', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className={cn('w-full rounded-xl overflow-hidden', height)}>{children}</div>
      </CardContent>
    </Card>
  )
}

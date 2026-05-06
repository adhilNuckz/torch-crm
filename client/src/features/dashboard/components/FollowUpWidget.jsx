import { Card, CardContent } from '../../../components/ui/card.jsx'

export default function FollowUpWidget({ count }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <div className="text-xs text-muted-foreground">Leads due today</div>
          <div className="text-2xl font-semibold">{count}</div>
        </div>
        <div className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-600">
          Action Needed
        </div>
      </CardContent>
    </Card>
  )
}

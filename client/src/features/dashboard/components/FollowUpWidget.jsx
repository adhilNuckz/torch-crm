import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../../../components/ui/card.jsx'
import { CalendarClock } from 'lucide-react'

export default function FollowUpWidget({ count }) {
  const navigate = useNavigate()

  return (
    <Card 
      className="cursor-pointer transition-all hover:ring-2 hover:ring-primary/20 hover:shadow-md"
      onClick={() => navigate('/leads?filter=dueToday')}
    >
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
            <CalendarClock className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <div className="text-xs font-medium text-muted-foreground">Leads due today</div>
            <div className="text-2xl font-bold tracking-tight">{count}</div>
          </div>
        </div>
        <div className="rounded-full bg-orange-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-600">
          Action Needed
        </div>
      </CardContent>
    </Card>
  )
}

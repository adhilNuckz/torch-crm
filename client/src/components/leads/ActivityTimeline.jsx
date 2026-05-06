import { formatDistanceToNow, parseISO } from 'date-fns'
import { Badge } from '../ui/badge.jsx'

export default function ActivityTimeline({ activities = [] }) {
  if (!activities.length) {
    return <div className="text-sm text-muted-foreground">No activity logged yet.</div>
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity._id} className="flex items-start gap-3">
          <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
          <div className="space-y-1">
            <div className="text-sm font-medium">{activity.message}</div>
            <div className="text-xs text-muted-foreground">
              {activity.createdBy?.name ? (
                <>
                  <Badge variant="secondary" className="mr-2">
                    {activity.createdBy.name}
                  </Badge>
                </>
              ) : null}
              {formatDistanceToNow(parseISO(activity.createdAt), { addSuffix: true })}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

import { Badge } from '../ui/badge.jsx'
import { cn } from '@/lib/utils.js'

const priorityStyles = {
  Low: 'bg-gray-500/10 text-gray-600 border-gray-200 dark:text-gray-300',
  Medium: 'bg-blue-500/10 text-blue-600 border-blue-200 dark:text-blue-300',
  High: 'bg-red-500/10 text-red-600 border-red-200 dark:text-red-300',
}

export default function PriorityBadge({ priority }) {
  return (
    <Badge variant="outline" className={cn('border px-2 py-1', priorityStyles[priority] || '')}>
      {priority}
    </Badge>
  )
}

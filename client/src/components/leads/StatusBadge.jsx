import { Badge } from '../ui/badge.jsx'
import { cn } from '@/lib/utils.js'

const statusStyles = {
  New: 'bg-blue-500/10 text-blue-600 border-blue-200 dark:text-blue-300',
  Contacted: 'bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:text-yellow-300',
  Qualified: 'bg-purple-500/10 text-purple-600 border-purple-200 dark:text-purple-300',
  'Proposal Sent': 'bg-orange-500/10 text-orange-600 border-orange-200 dark:text-orange-300',
  Won: 'bg-green-500/10 text-green-600 border-green-200 dark:text-green-300',
  Lost: 'bg-red-500/10 text-red-600 border-red-200 dark:text-red-300',
}

export default function StatusBadge({ status }) {
  return (
    <Badge variant="outline" className={cn('border px-2 py-1', statusStyles[status] || '')}>
      {status}
    </Badge>
  )
}

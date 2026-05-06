import { useMemo } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Building2, DollarSign } from 'lucide-react'
import { formatCurrency } from '../../../utils/formatters.js'
import { cn } from '@/lib/utils.js'

export default function LeadCard({ lead }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: lead._id,
    data: { status: lead.status },
  })

  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition,
    }),
    [transform, transition],
  )

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'rounded-lg border bg-background p-4 shadow-sm transition-shadow hover:shadow-md',
        isDragging && 'opacity-60',
      )}
    >
      <div className="mb-2 text-sm font-semibold">{lead.leadName}</div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Building2 className="h-3 w-3" />
        <span>{lead.companyName || 'No company'}</span>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <DollarSign className="h-3 w-3" />
        <span>{formatCurrency(lead.dealValue)}</span>
      </div>
    </div>
  )
}

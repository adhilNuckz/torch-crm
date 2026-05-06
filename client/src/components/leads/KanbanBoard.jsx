import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import LeadCard from './LeadCard.jsx'
import { cn } from '@/lib/utils.js'

const STATUSES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost']

function KanbanColumn({ status, leads }) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { status },
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex min-h-[400px] flex-col gap-3 rounded-xl border bg-muted/30 p-3',
        isOver && 'ring-2 ring-primary',
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{status}</h3>
        <span className="text-xs text-muted-foreground">{leads.length}</span>
      </div>
      <SortableContext items={leads.map((lead) => lead._id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-1 flex-col gap-3">
          {leads.map((lead) => (
            <LeadCard key={lead._id} lead={lead} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

export default function KanbanBoard({ leads, onStatusChange }) {
  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over) return
    if (active.id === over.id) return

    const activeLead = leads.find((lead) => lead._id === active.id)
    if (!activeLead) return

    const nextStatus = STATUSES.includes(over.id)
      ? over.id
      : leads.find((lead) => lead._id === over.id)?.status

    if (nextStatus && nextStatus !== activeLead.status) {
      onStatusChange(activeLead._id, nextStatus)
    }
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid gap-4 lg:grid-cols-3">
        {STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            leads={leads.filter((lead) => lead.status === status)}
          />
        ))}
      </div>
    </DndContext>
  )
}

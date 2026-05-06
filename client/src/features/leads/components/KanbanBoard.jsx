import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import LeadCard from './LeadCard.jsx'
import { cn } from '@/lib/utils.js'

const STATUSES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost']

const STATUS_COLORS = {
  'New': 'border-blue-500/50 bg-blue-500/5',
  'Contacted': 'border-purple-500/50 bg-purple-500/5',
  'Qualified': 'border-amber-500/50 bg-amber-500/5',
  'Proposal Sent': 'border-indigo-500/50 bg-indigo-500/5',
  'Won': 'border-emerald-500 bg-emerald-500/5',
  'Lost': 'border-rose-500 bg-rose-500/5'
}

function KanbanColumn({ status, leads }) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { status },
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex min-h-[450px] flex-col gap-4 rounded-2xl border-2 p-4 transition-all duration-200',
        STATUS_COLORS[status] || 'border-muted bg-muted/30',
        isOver && 'ring-4 ring-primary/20 scale-[1.01]'
      )}
    >
      <div className="flex flex-col items-center justify-center gap-1 border-b pb-3 mb-1">
        <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">{status}</h3>
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground/10 text-[10px] font-bold">
          {leads.length}
        </span>
      </div>
      <SortableContext items={leads.map((lead) => lead._id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-1 flex-col gap-3 relative">
          {isOver && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl border-2 border-dashed border-primary bg-primary/5 animate-in fade-in zoom-in duration-200">
              <p className="text-xs font-bold uppercase tracking-tighter text-primary">Drop here</p>
            </div>
          )}
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
      <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar">
        {STATUSES.map((status) => (
          <div key={status} className="w-[320px] shrink-0">
            <KanbanColumn
              status={status}
              leads={leads.filter((lead) => lead.status === status)}
            />
          </div>
        ))}
      </div>
    </DndContext>
  )
}

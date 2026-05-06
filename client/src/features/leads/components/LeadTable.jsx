import { useState } from 'react'
import { Clock, Eye, Pencil, Trash2, Calendar } from 'lucide-react'
import { format, isAfter, isBefore, isSameDay, parseISO, addDays } from 'date-fns'
import { Button } from '../../../components/ui/button.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table.jsx'
import { Input } from '../../../components/ui/input.jsx'
import StatusBadge from './StatusBadge.jsx'
import PriorityBadge from './PriorityBadge.jsx'
import { formatCurrency } from '../../../utils/formatters.js'
import { cn } from '@/lib/utils.js'

const isDueTodayOrPast = (dateValue) => {
  if (!dateValue) return false
  const date = parseISO(dateValue)
  return isSameDay(date, new Date()) || isBefore(date, new Date())
}

const isDueSoon = (dateValue) => {
  if (!dateValue) return false
  const date = parseISO(dateValue)
  return isAfter(date, new Date()) && isBefore(date, addDays(new Date(), 3))
}

function InlineDatePicker({ date, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(date ? date.slice(0, 10) : '')

  if (isEditing) {
    return (
      <Input
        type="date"
        autoFocus
        className="h-8 w-[140px] text-xs"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => {
          setIsEditing(false)
          if (value !== (date ? date.slice(0, 10) : '')) {
            onUpdate(value ? new Date(value).toISOString() : null)
          }
        }}
        onClick={(e) => e.stopPropagation()}
      />
    )
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className={cn(
        "flex items-center gap-2 rounded-md px-2 py-1 transition-all hover:bg-primary/5 group border border-transparent hover:border-primary/20",
        !date && "text-muted-foreground italic text-xs"
      )}
    >
      <Calendar className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
      <span className="text-sm font-medium group-hover:text-primary">
        {date ? format(parseISO(date), 'MMM dd, yyyy') : 'Set Date'}
      </span>
      {isDueTodayOrPast(date) && (
        <Clock className="h-3.5 w-3.5 text-red-500 animate-pulse" />
      )}
      {!isDueTodayOrPast(date) && isDueSoon(date) && (
        <Clock className="h-3.5 w-3.5 text-orange-500" />
      )}
    </button>
  )
}

export default function LeadTable({ leads, onView, onEdit, onDelete, onUpdateLead }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Lead Name</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Source</TableHead>
          <TableHead>Assigned To</TableHead>
          <TableHead>Deal Value</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Next Follow-up</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map((lead) => (
          <TableRow key={lead._id}>
            <TableCell className="font-medium">{lead.leadName}</TableCell>
            <TableCell>{lead.companyName || '—'}</TableCell>
            <TableCell>
              <StatusBadge status={lead.status} />
            </TableCell>
            <TableCell>{lead.leadSource || '—'}</TableCell>
            <TableCell>{lead.assignedTo?.name || 'Unassigned'}</TableCell>
            <TableCell>{formatCurrency(lead.dealValue)}</TableCell>
            <TableCell>
              <PriorityBadge priority={lead.priority} />
            </TableCell>
            <TableCell>
              <InlineDatePicker 
                date={lead.nextFollowUp} 
                onUpdate={(newDate) => onUpdateLead(lead._id, { ...lead, nextFollowUp: newDate })} 
              />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => onView(lead._id)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onEdit(lead)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(lead._id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

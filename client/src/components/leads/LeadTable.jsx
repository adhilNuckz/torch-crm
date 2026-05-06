import { Clock, Eye, Pencil, Trash2 } from 'lucide-react'
import { format, isAfter, isBefore, isSameDay, parseISO, addDays } from 'date-fns'
import { Button } from '../ui/button.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table.jsx'
import StatusBadge from './StatusBadge.jsx'
import PriorityBadge from './PriorityBadge.jsx'
import { formatCurrency } from '../../utils/formatters.js'

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

export default function LeadTable({ leads, onView, onEdit, onDelete }) {
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
              <div className="flex items-center gap-2">
                {lead.nextFollowUp ? format(parseISO(lead.nextFollowUp), 'MMM dd, yyyy') : '—'}
                {isDueTodayOrPast(lead.nextFollowUp) && (
                  <Clock className="h-4 w-4 text-red-500" />
                )}
                {!isDueTodayOrPast(lead.nextFollowUp) && isDueSoon(lead.nextFollowUp) && (
                  <Clock className="h-4 w-4 text-green-500" />
                )}
              </div>
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

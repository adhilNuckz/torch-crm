import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table.jsx'
import StatusBadge from '../leads/StatusBadge.jsx'
import { formatDate } from '../../utils/formatters.js'

export default function RecentLeadsTable({ leads, onSelect }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Lead</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map((lead) => (
          <TableRow key={lead._id} className="cursor-pointer" onClick={() => onSelect(lead._id)}>
            <TableCell className="font-medium">{lead.leadName}</TableCell>
            <TableCell>{lead.companyName || '—'}</TableCell>
            <TableCell>
              <StatusBadge status={lead.status} />
            </TableCell>
            <TableCell>{formatDate(lead.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

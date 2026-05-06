import { Input } from '../../../components/ui/input.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select.jsx'

const statusOptions = ['All', 'New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost']
const sourceOptions = ['All', 'Website', 'LinkedIn', 'Referral', 'Cold Email', 'Event', 'Other']
const priorityOptions = ['All', 'Low', 'Medium', 'High']

export default function LeadFilters({
  filters,
  assignedOptions,
  onFilterChange,
  onSearchChange,
}) {
  return (
    <div className="grid gap-3 md:grid-cols-5">
      <Select value={filters.status} onValueChange={(value) => onFilterChange('status', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={filters.source} onValueChange={(value) => onFilterChange('source', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Source" />
        </SelectTrigger>
        <SelectContent>
          {sourceOptions.map((source) => (
            <SelectItem key={source} value={source}>
              {source}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={filters.priority} onValueChange={(value) => onFilterChange('priority', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          {priorityOptions.map((priority) => (
            <SelectItem key={priority} value={priority}>
              {priority}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={filters.assignedTo} onValueChange={(value) => onFilterChange('assignedTo', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Assigned To" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All</SelectItem>
          {assignedOptions.map((user) => (
            <SelectItem key={user._id} value={user._id}>
              {user.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        placeholder="Search leads..."
        value={filters.search}
        onChange={(event) => onSearchChange(event.target.value)}
      />
    </div>
  )
}

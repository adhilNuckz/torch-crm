import { useMemo, useState } from 'react'
import { Calendar } from 'lucide-react'
import { Button } from '../../../components/ui/button.jsx'
import { Input } from '../../../components/ui/input.jsx'
import { Label } from '../../../components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select.jsx'
import { Textarea } from '../../../components/ui/textarea.jsx'
import { cn } from '@/lib/utils.js'

const sources = ['Website', 'LinkedIn', 'Referral', 'Cold Email', 'Event', 'Other']
const statuses = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost']
const priorities = ['Low', 'Medium', 'High']

const emptyLead = {
  leadName: '',
  companyName: '',
  email: '',
  phone: '',
  leadSource: 'Website',
  status: 'New',
  priority: 'Medium',
  dealValue: 0,
  tags: '',
  nextFollowUp: '',
  notes: '',
}

const getInitialForm = (initialData) => {
  if (!initialData) return emptyLead
  return {
    ...emptyLead,
    ...initialData,
    tags: (initialData.tags || []).join(', '),
    nextFollowUp: initialData.nextFollowUp ? initialData.nextFollowUp.slice(0, 10) : '',
  }
}

export default function LeadForm({ initialData, onSubmit, onCancel, submitLabel = 'Save Lead' }) {
  const [form, setForm] = useState(() => getInitialForm(initialData))

  const isValid = useMemo(() => form.leadName.trim().length > 0, [form.leadName])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!isValid) return
    const payload = {
      ...form,
      dealValue: Number(form.dealValue || 0),
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      nextFollowUp: form.nextFollowUp ? new Date(form.nextFollowUp).toISOString() : null,
    }
    onSubmit(payload)
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Lead Name *</Label>
          <Input value={form.leadName} onChange={(event) => handleChange('leadName', event.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Company</Label>
          <Input value={form.companyName} onChange={(event) => handleChange('companyName', event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" value={form.email} onChange={(event) => handleChange('email', event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Phone</Label>
          <Input value={form.phone} onChange={(event) => handleChange('phone', event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Source</Label>
          <Select value={form.leadSource} onValueChange={(value) => handleChange('leadSource', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              {sources.map((source) => (
                <SelectItem key={source} value={source}>
                  {source}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={form.status} onValueChange={(value) => handleChange('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Priority</Label>
          <Select value={form.priority} onValueChange={(value) => handleChange('priority', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              {priorities.map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Deal Value</Label>
          <Input
            type="number"
            value={form.dealValue}
            onChange={(event) => handleChange('dealValue', event.target.value)}
            min="0"
          />
        </div>
        <div className="space-y-2">
          <Label>Next Follow-up</Label>
          <div className="relative">
            <Input
              type="date"
              className="pl-10 cursor-pointer"
              value={form.nextFollowUp}
              onChange={(event) => handleChange('nextFollowUp', event.target.value)}
              onClick={(e) => e.target.showPicker?.()}
            />
            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Tags</Label>
          <Input
            value={form.tags}
            onChange={(event) => handleChange('tags', event.target.value)}
            placeholder="enterprise, urgent, vip"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Notes</Label>
          <Textarea
            value={form.notes}
            onChange={(event) => handleChange('notes', event.target.value)}
            placeholder="Optional internal notes for this lead"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!isValid}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

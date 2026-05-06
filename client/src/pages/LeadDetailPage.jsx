import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { createNote, deleteNote, fetchNotes } from '../api/notes.js'
import { fetchLead, updateLead, updateLeadStatus } from '../api/leads.js'
import { Button } from '../components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog.jsx'
import { Label } from '../components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select.jsx'
import { Textarea } from '../components/ui/textarea.jsx'
import { Badge } from '../components/ui/badge.jsx'
import { Skeleton } from '../components/ui/skeleton.jsx'
import LeadForm from '../components/leads/LeadForm.jsx'
import StatusBadge from '../components/leads/StatusBadge.jsx'
import PriorityBadge from '../components/leads/PriorityBadge.jsx'
import ActivityTimeline from '../components/leads/ActivityTimeline.jsx'
import { Calendar, Mail, PhoneCall, StickyNote } from 'lucide-react'
import { formatCurrency, formatDate } from '../utils/formatters.js'

const statusOptions = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost']
const noteTypes = ['Call', 'Email', 'Meeting', 'General']
const noteIcons = {
  Call: PhoneCall,
  Email: Mail,
  Meeting: Calendar,
  General: StickyNote,
}

export default function LeadDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [lead, setLead] = useState(null)
  const [notes, setNotes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [noteForm, setNoteForm] = useState({ content: '', noteType: 'General' })

  const refreshNotes = async () => {
    try {
      const response = await fetchNotes(id)
      if (response?.success) {
        setNotes(response.data)
      } else {
        toast.error(response?.message || 'Failed to load notes.')
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to load notes.')
    }
  }

  useEffect(() => {
    let isMounted = true
    const loadLeadData = async () => {
      setIsLoading(true)
      try {
        const response = await fetchLead(id)
        if (!isMounted) return
        if (response?.success) {
          setLead(response.data)
        } else {
          toast.error(response?.message || 'Failed to load lead.')
        }
      } catch (err) {
        if (isMounted) {
          toast.error(err?.response?.data?.message || 'Failed to load lead.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    const loadNotesData = async () => {
      try {
        const response = await fetchNotes(id)
        if (!isMounted) return
        if (response?.success) {
          setNotes(response.data)
        } else {
          toast.error(response?.message || 'Failed to load notes.')
        }
      } catch (err) {
        if (isMounted) {
          toast.error(err?.response?.data?.message || 'Failed to load notes.')
        }
      }
    }

    loadLeadData()
    loadNotesData()

    return () => {
      isMounted = false
    }
  }, [id])

  const handleUpdateLead = async (payload) => {
    try {
      const response = await updateLead(id, payload)
      if (response?.success) {
        toast.success('Lead updated.')
        setLead(response.data)
        setIsDialogOpen(false)
      } else {
        toast.error(response?.message || 'Failed to update lead.')
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update lead.')
    }
  }

  const handleStatusChange = async (status) => {
    try {
      const response = await updateLeadStatus(id, status)
      if (response?.success) {
        setLead(response.data)
        toast.success('Status updated.')
      } else {
        toast.error(response?.message || 'Failed to update status.')
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update status.')
    }
  }

  const handleAddNote = async (event) => {
    event.preventDefault()
    if (!noteForm.content.trim()) {
      toast.error('Note content is required.')
      return
    }
    try {
      const response = await createNote({ leadId: id, ...noteForm })
      if (response?.success) {
        toast.success('Note added.')
        setNoteForm({ content: '', noteType: 'General' })
        refreshNotes()
      } else {
        toast.error(response?.message || 'Failed to add note.')
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add note.')
    }
  }

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Delete this note?')) return
    try {
      const response = await deleteNote(noteId)
      if (response?.success) {
        toast.success('Note deleted.')
        refreshNotes()
      } else {
        toast.error(response?.message || 'Failed to delete note.')
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete note.')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32" />
        <Skeleton className="h-48" />
        <Skeleton className="h-64" />
      </div>
    )
  }

  if (!lead) {
    return <div className="text-sm text-muted-foreground">Lead not found.</div>
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate('/leads')}>
        ← Back to Leads
      </Button>

      <Card>
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>{lead.leadName}</CardTitle>
            <div className="text-sm text-muted-foreground">{lead.companyName || 'No company set'}</div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={lead.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Update status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
              Edit Lead
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Status</div>
            <StatusBadge status={lead.status} />
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Priority</div>
            <PriorityBadge priority={lead.priority} />
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Deal Value</div>
            <div className="text-sm font-semibold">{formatCurrency(lead.dealValue)}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Lead Source</div>
            <div className="text-sm">{lead.leadSource || '—'}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Assigned To</div>
            <div className="text-sm">{lead.assignedTo?.name || 'Unassigned'}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Next Follow-up</div>
            <div className="text-sm">{formatDate(lead.nextFollowUp)}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Email</div>
            <div className="text-sm">{lead.email || '—'}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Phone</div>
            <div className="text-sm">{lead.phone || '—'}</div>
          </div>
          <div className="space-y-1 md:col-span-3">
            <div className="text-xs text-muted-foreground">Tags</div>
            <div className="flex flex-wrap gap-2">
              {lead.tags?.length ? (
                lead.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No tags</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityTimeline activities={lead.activities || []} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-3" onSubmit={handleAddNote}>
            <div className="grid gap-3 md:grid-cols-4">
              <div className="md:col-span-3">
                <Label>Note</Label>
                <Textarea
                  value={noteForm.content}
                  onChange={(event) => setNoteForm((prev) => ({ ...prev, content: event.target.value }))}
                  placeholder="Add a note about this lead..."
                />
              </div>
              <div>
                <Label>Type</Label>
                <Select
                  value={noteForm.noteType}
                  onValueChange={(value) => setNoteForm((prev) => ({ ...prev, noteType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {noteTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit">Add Note</Button>
          </form>
          <div className="space-y-3">
            {notes.map((note) => {
              const NoteIcon = noteIcons[note.noteType] || StickyNote
              return (
                <Card key={note._id}>
                  <CardContent className="space-y-2 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <NoteIcon className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="secondary">{note.noteType}</Badge>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteNote(note._id)}>
                        Delete
                      </Button>
                    </div>
                    <div className="text-sm">{note.content}</div>
                    <div className="text-xs text-muted-foreground">
                      {note.createdBy?.name || 'Unknown'} · {formatDate(note.createdAt, 'MMM dd, yyyy p')}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
            {!notes.length && (
              <div className="text-sm text-muted-foreground">No notes yet.</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Lead</DialogTitle>
          </DialogHeader>
          <LeadForm
            key={lead?._id || 'lead'}
            initialData={lead}
            onSubmit={handleUpdateLead}
            onCancel={() => setIsDialogOpen(false)}
            submitLabel="Update Lead"
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

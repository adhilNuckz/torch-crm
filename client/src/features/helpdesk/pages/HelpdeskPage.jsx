import { useEffect, useState } from 'react'
import {
  Headphones,
  MessageSquare,
  Bug,
  Lightbulb,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Globe,
  Mail,
  Send,
  Plus,
  RefreshCw,
  ExternalLink,
} from 'lucide-react'
import { Button } from '../../../components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card.jsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/dialog.jsx'
import { Input } from '../../../components/ui/input.jsx'
import { Label } from '../../../components/ui/label.jsx'
import { Textarea } from '../../../components/ui/textarea.jsx'
import {
  fetchTickets,
  replyToTicket,
  updateTicketStatus,
  createPublicTicket,
} from '../../../api/helpdesk.js'
import { cn } from '@/lib/utils.js'
import toast from 'react-hot-toast'

const categories = [
  { id: 'bug', icon: Bug, label: 'Bug Report', color: 'text-rose-500', bg: 'bg-rose-500/10' },
  { id: 'feature', icon: Lightbulb, label: 'Feature Request', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { id: 'question', icon: MessageSquare, label: 'Question', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'other', icon: Headphones, label: 'Other', color: 'text-violet-500', bg: 'bg-violet-500/10' },
]

export default function HelpdeskPage() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [isTestModalOpen, setIsTestModalOpen] = useState(false)
  const [testEmail, setTestEmail] = useState('')
  const [isPublicTicketOpen, setIsPublicTicketOpen] = useState(false)
  const [publicTicket, setPublicTicket] = useState({ subject: '', description: '', category: 'question', clientEmail: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isReplying, setIsReplying] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    loadTickets()
  }, [])

  const loadTickets = async () => {
    setLoading(true)
    try {
      const data = await fetchTickets()
      setTickets(data)
    } catch (error) {
      toast.error('Failed to load tickets')
    } finally {
      setLoading(false)
    }
  }

  const handleReply = async (e) => {
    e.preventDefault()
    if (!replyText.trim()) return
    setIsReplying(true)
    try {
      const updated = await replyToTicket(selectedTicket._id, { message: replyText, sender: 'Agent' })
      setSelectedTicket(updated)
      setReplyText('')
      toast.success('Reply sent successfully')
      loadTickets()
    } catch (error) {
      toast.error('Failed to send reply')
    } finally {
      setIsReplying(false)
    }
  }

  const handlePublicSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const data = await createPublicTicket(publicTicket)
      toast.success('Ticket submitted successfully!')
      setIsPublicTicketOpen(false)
      setPublicTicket({ subject: '', description: '', category: 'question', clientEmail: '' })
      loadTickets()
      setSelectedTicket(data)
    } catch (error) {
      toast.error('Failed to submit ticket')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Email Support Hub</h2>
          <p className="text-sm text-muted-foreground">Manage client support tickets via email correspondence.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={() => setIsTestModalOpen(true)}>
            <Mail className="h-4 w-4" />
            Test Email Flow
          </Button>
          <Button className="gap-2" onClick={loadTickets}>
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Tickets List */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="h-full max-h-[700px] overflow-hidden flex flex-col shadow-sm">
            <CardHeader className="border-b bg-muted/20 py-3">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Inbox</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-0">
              {tickets.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">No support emails found.</div>
              ) : (
                <div className="divide-y">
                  {tickets.map((ticket) => (
                    <button
                      key={ticket._id}
                      onClick={() => setSelectedTicket(ticket)}
                      className={cn(
                        "w-full p-4 text-left transition-all hover:bg-muted/50 relative",
                        selectedTicket?._id === ticket._id && "bg-primary/5 shadow-[inset_4px_0_0_0_#3b82f6]"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-bold text-primary uppercase">#{ticket._id.slice(-6)}</span>
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-tight",
                          ticket.status === 'open' ? "bg-amber-100 text-amber-700" : 
                          ticket.status === 'resolved' ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                        )}>
                          {ticket.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold truncate text-foreground">{ticket.subject}</h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <p className="text-[11px] text-muted-foreground truncate">{ticket.clientEmail}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Ticket Detail & Email Thread */}
        <div className="lg:col-span-2">
          {selectedTicket ? (
            <Card className="h-full flex flex-col shadow-sm border-primary/10">
              <CardHeader className="border-b bg-muted/5 py-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold tracking-tight">{selectedTicket.subject}</h3>
                      <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono">ID: {selectedTicket._id}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{selectedTicket.clientEmail}</span>
                      <span>•</span>
                      <span>{new Date(selectedTicket.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {selectedTicket.status !== 'resolved' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 text-xs font-bold gap-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50" 
                        disabled={isClosing}
                        onClick={async () => {
                          setIsClosing(true)
                          try {
                            await updateTicketStatus(selectedTicket._id, 'resolved')
                            setSelectedTicket(null)
                            loadTickets()
                            toast.success('Support ticket closed successfully')
                          } catch (err) {
                            toast.error('Failed to close ticket')
                          } finally {
                            setIsClosing(false)
                          }
                        }}
                      >
                        <CheckCircle2 className={cn("h-3.5 w-3.5", isClosing && "animate-spin")} />
                        {isClosing ? 'Closing...' : 'Close Ticket'}
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-0 bg-muted/10">
                <div className="p-6 space-y-6">
                  {/* Original Message */}
                  <div className="bg-background rounded-xl border p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3 border-b pb-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Original Inquiry</span>
                      <span className="text-[10px] text-muted-foreground">{new Date(selectedTicket.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="text-sm leading-relaxed whitespace-pre-line text-foreground/90">
                      {selectedTicket.description}
                    </div>
                  </div>

                  {/* Replies Thread */}
                  <div className="space-y-4 relative before:absolute before:left-4 before:top-0 before:bottom-0 before:w-0.5 before:bg-muted/50">
                    {selectedTicket.replies.map((reply, idx) => (
                      <div key={idx} className="relative pl-10">
                        <div className={cn(
                          "absolute left-2.5 top-5 w-3 h-3 rounded-full border-2 border-background",
                          reply.sender === 'Agent' ? "bg-primary" : "bg-muted-foreground"
                        )} />
                        <div className={cn(
                          "rounded-xl border p-4 shadow-sm",
                          reply.sender === 'Agent' ? "bg-primary/5 border-primary/20" : "bg-background"
                        )}>
                          <div className="flex items-center justify-between mb-2">
                            <span className={cn(
                              "text-xs font-bold uppercase tracking-tight",
                              reply.sender === 'Agent' ? "text-primary" : "text-muted-foreground"
                            )}>
                              {reply.sender === 'Agent' ? 'Support Representative' : 'Client Response'}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(reply.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <div className="text-sm leading-relaxed whitespace-pre-line">
                            {reply.message}
                          </div>
                          {reply.sender === 'Agent' && (
                            <div className="mt-3 flex items-center gap-1.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-0.5 rounded uppercase">
                              <CheckCircle2 className="h-3 w-3" />
                              Delivered via Email
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <div className="p-4 border-t bg-background">
                <form onSubmit={handleReply} className="space-y-3">
                  <Textarea 
                    placeholder="Compose your reply... (This will be sent as an email to the client)" 
                    className="min-h-[100px] resize-none border-none focus-visible:ring-0 p-0 shadow-none text-sm"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <div className="flex justify-between items-center pt-2 border-t">
                    <p className="text-[10px] text-muted-foreground italic">
                      Client will receive this reply at {selectedTicket.clientEmail}
                    </p>
                    <Button type="submit" size="sm" className="gap-2 px-4" disabled={isReplying || !replyText.trim()}>
                      <Send className={cn("h-3.5 w-3.5", isReplying && "animate-pulse")} />
                      {isReplying ? 'Sending...' : 'Send Email'}
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          ) : (
            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-muted/5 text-muted-foreground p-12 text-center">
              <Mail className="h-12 w-12 mb-4 opacity-20" />
              <h3 className="text-lg font-semibold text-foreground/70">No Ticket Selected</h3>
              <p className="text-sm max-w-[250px]">Choose a conversation from the sidebar to view the full email history and reply to the client.</p>
            </div>
          )}
        </div>
      </div>

      {/* Test Client Modal */}
      <Dialog open={isTestModalOpen} onOpenChange={setIsTestModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Client Support Flow</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">This simulates a client-facing view where they can submit a support ticket to your CRM.</p>
            <div className="space-y-2">
              <Label>Client Email Address</Label>
              <Input 
                placeholder="client@example.com" 
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
            </div>
            <Button className="w-full gap-2" disabled={!testEmail.includes('@')} onClick={() => {
              setPublicTicket({...publicTicket, clientEmail: testEmail})
              setIsPublicTicketOpen(true)
              setIsTestModalOpen(false)
            }}>
              <Plus className="h-4 w-4" />
              Create Support Ticket
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Public Ticket Form Dialog */}
      <Dialog open={isPublicTicketOpen} onOpenChange={setIsPublicTicketOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Submit a Support Ticket</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePublicSubmit} className="space-y-4 pt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Your Email</Label>
                <Input value={publicTicket.clientEmail} readOnly className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <select 
                  className="w-full h-10 rounded-md border bg-background px-3 py-2 text-sm"
                  value={publicTicket.category}
                  onChange={(e) => setPublicTicket({...publicTicket, category: e.target.value})}
                >
                  {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input 
                placeholder="What can we help you with?" 
                value={publicTicket.subject}
                onChange={(e) => setPublicTicket({...publicTicket, subject: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                placeholder="Provide details about your issue..." 
                className="min-h-[150px]"
                value={publicTicket.description}
                onChange={(e) => setPublicTicket({...publicTicket, description: e.target.value})}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsPublicTicketOpen(false)} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Support Request'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

import { useState } from 'react'
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
  BookOpen,
} from 'lucide-react'
import { Button } from '../../../components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card.jsx'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils.js'
import toast from 'react-hot-toast'

const categories = [
  {
    id: 'bug',
    icon: Bug,
    label: 'Report a Bug',
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    description: 'Something is broken or behaving unexpectedly.',
  },
  {
    id: 'feature',
    icon: Lightbulb,
    label: 'Feature Request',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    description: 'Suggest an improvement or new capability.',
  },
  {
    id: 'question',
    icon: MessageSquare,
    label: 'General Question',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    description: 'Need help understanding how something works?',
  },
  {
    id: 'other',
    icon: Headphones,
    label: 'Other',
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/30',
    description: 'Anything else we can help you with.',
  },
]

const faqItems = [
  {
    question: 'How do I reset my password?',
    answer:
      'Password reset is managed by your admin. Contact your system administrator to have your password updated in the database, or use the seed script to reset credentials.',
  },
  {
    question: 'Can I import leads from a CSV file?',
    answer:
      'CSV import is on our roadmap. Currently you can export leads as CSV. For bulk imports, contact your admin to use the seed script or insert data directly via the API.',
  },
  {
    question: 'Why is the Kanban drag-and-drop not working?',
    answer:
      'Ensure you are in Kanban View (toggle the tab on the Leads page). Drag the lead card by its body and release it over the target column. If the issue persists, try refreshing the page.',
  },
  {
    question: 'How is the conversion rate calculated?',
    answer:
      'Conversion Rate = (Won Leads / Total Leads) × 100. It is displayed on the Dashboard header and updates in real time as leads are moved to "Won" status.',
  },
  {
    question: 'What does "Follow-Ups Due Today" mean?',
    answer:
      'Leads whose "Next Follow-Up" date is today or in the past are counted in the Follow-Ups Due Today widget on the Dashboard. Update the follow-up date on each lead to keep the count accurate.',
  },
  {
    question: 'Can multiple users see the same leads?',
    answer:
      'Yes. All authenticated users share the same lead database. Use the "Assigned To" field and filters to manage who works on which leads.',
  },
]

const statusConfig = {
  open: { icon: AlertCircle, label: 'Open', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  'in-progress': { icon: Clock, label: 'In Progress', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  resolved: { icon: CheckCircle2, label: 'Resolved', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
}

// Simulated local tickets stored in component state
const INITIAL_TICKETS = [
  {
    id: 'TKT-001',
    subject: 'Kanban drag not saving status on first drop',
    category: 'bug',
    status: 'resolved',
    date: '2025-04-28',
  },
  {
    id: 'TKT-002',
    subject: 'Add CSV import functionality',
    category: 'feature',
    status: 'in-progress',
    date: '2025-05-01',
  },
]

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border transition-all duration-200',
        open && 'border-primary/30 bg-primary/5',
      )}
    >
      <button
        className="flex w-full items-center justify-between px-5 py-4 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-sm font-medium">{question}</span>
        <ChevronRight
          className={cn(
            'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
            open && 'rotate-90',
          )}
        />
      </button>
      {open && (
        <div className="border-t px-5 pb-4 pt-3">
          <p className="text-sm leading-relaxed text-muted-foreground">{answer}</p>
        </div>
      )}
    </div>
  )
}

export default function HelpdeskPage() {
  const navigate = useNavigate()
  const [tickets, setTickets] = useState(INITIAL_TICKETS)
  const [form, setForm] = useState({ subject: '', category: 'bug', description: '', email: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.subject.trim() || !form.description.trim()) {
      toast.error('Please fill in Subject and Description.')
      return
    }
    const newTicket = {
      id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
      subject: form.subject,
      category: form.category,
      status: 'open',
      date: new Date().toISOString().slice(0, 10),
    }
    setTickets((prev) => [newTicket, ...prev])
    setForm({ subject: '', category: 'bug', description: '', email: '' })
    setSubmitted(true)
    toast.success('Ticket submitted! We will get back to you soon.')
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold">Helpdesk</h2>
        <p className="text-sm text-muted-foreground">
          Get support, report bugs, and track your tickets.
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card
          className="group cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md"
          onClick={() => navigate('/docs')}
        >
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
              <BookOpen className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <div className="text-sm font-semibold">Documentation</div>
              <div className="text-xs text-muted-foreground">Read the full docs</div>
            </div>
            <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card
          className="group cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md"
          onClick={() =>
            window.open('https://github.com/adhilNuckz/torch-crm/issues', '_blank')
          }
        >
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10">
              <Globe className="h-5 w-5 text-violet-500" />
            </div>
            <div>
              <div className="text-sm font-semibold">GitHub Issues</div>
              <div className="text-xs text-muted-foreground">Open source tracker</div>
            </div>
            <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card className="group cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
              <Mail className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <div className="text-sm font-semibold">Email Support</div>
              <div className="text-xs text-muted-foreground">support@torchcrm.io</div>
            </div>
            <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      {/* Ticket Form + My Tickets — side by side on large screens */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Submit Ticket */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Submit a Support Ticket</CardTitle>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
                  <CheckCircle2 className="h-7 w-7 text-emerald-500" />
                </div>
                <p className="font-semibold">Ticket Submitted!</p>
                <p className="text-sm text-muted-foreground">
                  We'll review your request and get back to you soon.
                </p>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Category */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {categories.map((cat) => {
                      const Icon = cat.icon
                      const isSelected = form.category === cat.id
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setForm((p) => ({ ...p, category: cat.id }))}
                          className={cn(
                            'flex items-center gap-2.5 rounded-lg border p-3 text-left text-sm transition-all',
                            isSelected
                              ? `${cat.border} ${cat.bg} font-medium`
                              : 'hover:bg-accent',
                          )}
                        >
                          <Icon className={cn('h-4 w-4', isSelected ? cat.color : 'text-muted-foreground')} />
                          <span>{cat.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Subject</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                    placeholder="Brief description of your issue…"
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Please provide as much detail as possible — steps to reproduce, expected vs actual behaviour, etc."
                    className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">
                    Your Email{' '}
                    <span className="font-normal text-muted-foreground">(optional)</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <Button type="submit" className="w-full">
                  Submit Ticket
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* My Tickets */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Tickets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tickets.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tickets yet.</p>
              ) : (
                tickets.map((ticket) => {
                  const s = statusConfig[ticket.status]
                  const StatusIcon = s.icon
                  const cat = categories.find((c) => c.id === ticket.category)
                  const CatIcon = cat?.icon || Headphones
                  return (
                    <div
                      key={ticket.id}
                      className="flex items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-accent/50"
                    >
                      <div className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full', cat?.bg)}>
                        <CatIcon className={cn('h-4 w-4', cat?.color)} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <span className="text-xs font-mono text-muted-foreground">
                            {ticket.id}
                          </span>
                          <div
                            className={cn(
                              'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                              s.bg,
                              s.color,
                            )}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {s.label}
                          </div>
                        </div>
                        <p className="mt-1 truncate text-sm font-medium">{ticket.subject}</p>
                        <p className="text-xs text-muted-foreground">{ticket.date}</p>
                      </div>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
          <p className="text-sm text-muted-foreground">Quick answers to common questions.</p>
        </div>
        <div className="space-y-2">
          {faqItems.map((item) => (
            <FaqItem key={item.question} {...item} />
          ))}
        </div>
      </div>
    </div>
  )
}

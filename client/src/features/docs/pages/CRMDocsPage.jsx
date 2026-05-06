import { useState } from 'react'
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Users,
  Kanban,
  BarChart3,
  FileDown,
  ShieldCheck,
  StickyNote,
  Activity,
  Search,
  Filter,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card.jsx'
import { cn } from '@/lib/utils.js'

const sections = [
  {
    id: 'getting-started',
    icon: BookOpen,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    title: 'Getting Started',
    content: [
      {
        heading: 'Overview',
        body: `Torch CRM is a full-stack Lead Management System built with React, Node.js, Express, and MongoDB.
It is designed to help sales teams capture, track, and convert leads efficiently through an intuitive interface.`,
      },
      {
        heading: 'Logging In',
        body: `Navigate to the login page and enter your email and password.
Default seed credentials: admin@example.com / password123
After login you will be redirected to the Dashboard.`,
      },
      {
        heading: 'Dark Mode',
        body: `Toggle dark mode using the sun/moon switch in the top navigation bar. Your preference is saved to localStorage and persists across sessions.`,
      },
    ],
  },
  {
    id: 'leads',
    icon: Users,
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
    title: 'Managing Leads',
    content: [
      {
        heading: 'Creating a Lead',
        body: `Click the "Add Lead" button on the Leads page. Fill in the required fields (Lead Name, Email) and any optional fields such as Company, Phone, Deal Value, Lead Source, Priority, Assigned To, Next Follow-up date, and Tags.
Press "Create Lead" to save.`,
      },
      {
        heading: 'Editing a Lead',
        body: `On the Leads table, click the edit icon (pencil) to open the edit modal.
On the Lead Detail page, click "Edit Lead" to update any field.
All changes are persisted immediately to the database.`,
      },
      {
        heading: 'Deleting a Lead',
        body: `Click the trash icon on any row in the Leads table. A confirmation prompt will appear before deletion.`,
      },
      {
        heading: 'Lead Status',
        body: `Leads progress through the following statuses:
• New → Contacted → Qualified → Proposal Sent → Won → Lost
You can update the status from the Lead Detail page using the dropdown, or by dragging the lead card on the Kanban board.`,
      },
      {
        heading: 'Lead Priority',
        body: `Priorities are: Low, Medium, High.
Priority helps your team triage and focus on the most valuable opportunities.`,
      },
      {
        heading: 'Tags',
        body: `Tags are free-form labels (comma-separated) you can attach to leads for custom categorisation. Use the Tags field in the lead form.`,
      },
    ],
  },
  {
    id: 'kanban',
    icon: Kanban,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    title: 'Kanban Board',
    content: [
      {
        heading: 'Overview',
        body: `The Kanban board provides a visual pipeline view of all your leads grouped by status. Switch to Kanban view using the "Kanban View" tab on the Leads page.`,
      },
      {
        heading: 'Drag and Drop',
        body: `Drag any lead card and drop it into another column to instantly update its status. The change is saved to the server in real time. If the drag is cancelled or the card is dropped in the same column, no update is made.`,
      },
      {
        heading: 'Columns',
        body: `Columns correspond to all available statuses: New, Contacted, Qualified, Proposal Sent, Won, Lost. Each column shows a count of leads in that stage.`,
      },
    ],
  },
  {
    id: 'filters',
    icon: Filter,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    title: 'Filters & Search',
    content: [
      {
        heading: 'Search',
        body: `Use the search bar on the Leads page to search leads by name, email, company, or phone number. Search is debounced (400ms) to avoid unnecessary API calls.`,
      },
      {
        heading: 'Filter by Status',
        body: `Select a status from the Status dropdown to narrow the list to leads in a specific stage.`,
      },
      {
        heading: 'Filter by Source',
        body: `Lead sources include: Website, Referral, Cold Call, Social Media, Email Campaign, Event, Other. Filter leads by their origin.`,
      },
      {
        heading: 'Filter by Priority',
        body: `Narrow the list to Low, Medium, or High priority leads.`,
      },
      {
        heading: 'Filter by Assigned To',
        body: `Filter by the sales rep or team member assigned to leads. The dropdown is dynamically populated from the current page of leads.`,
      },
    ],
  },
  {
    id: 'dashboard',
    icon: BarChart3,
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
    title: 'Dashboard & Analytics',
    content: [
      {
        heading: 'Stat Cards',
        body: `The top row displays: Total Leads, New leads, Qualified leads, Won leads, Lost leads, Total Deal Value, Won Deal Value, and Follow-Ups Due Today.`,
      },
      {
        heading: 'Leads by Status Chart',
        body: `A Recharts bar chart showing the distribution of leads across all statuses. Useful for pipeline health monitoring.`,
      },
      {
        heading: 'Leads by Source Chart',
        body: `A pie chart breaking down lead volume by acquisition channel (Website, Referral, Cold Call, etc.).`,
      },
      {
        heading: 'Recent Leads Table',
        body: `Displays the 5 most recently created leads with quick-access links to their detail pages.`,
      },
      {
        heading: 'Conversion Rate',
        body: `Displayed in the dashboard header. Calculated as Won / Total Leads × 100.`,
      },
    ],
  },
  {
    id: 'notes',
    icon: StickyNote,
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
    title: 'Notes & Activity',
    content: [
      {
        heading: 'Adding Notes',
        body: `Navigate to any Lead Detail page. In the Notes section, type your note, select a type (Call, Email, Meeting, General), and click "Add Note".`,
      },
      {
        heading: 'Note Types',
        body: `• Call — logged when you speak with a lead by phone\n• Email — record email correspondence\n• Meeting — document in-person or virtual meetings\n• General — any free-form note`,
      },
      {
        heading: 'Deleting Notes',
        body: `Click the "Delete" button next to any note. A confirmation prompt will appear. Deleted notes cannot be recovered.`,
      },
      {
        heading: 'Activity Timeline',
        body: `Below the lead details, an Activity Timeline automatically records status changes and other key events. This provides an audit trail for each lead.`,
      },
    ],
  },
  {
    id: 'export',
    icon: FileDown,
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
    title: 'CSV Export',
    content: [
      {
        heading: 'Exporting Leads',
        body: `On the Leads page, click "Export CSV". The current filtered list of leads will be downloaded as a CSV file named leads-export-YYYY-MM-DD.csv.`,
      },
      {
        heading: 'Fields Exported',
        body: `LeadName, Company, Email, Phone, Status, Source, Priority, DealValue, NextFollowUp, AssignedTo.`,
      },
    ],
  },
  {
    id: 'auth',
    icon: ShieldCheck,
    color: 'text-teal-500',
    bg: 'bg-teal-500/10',
    title: 'Authentication & Security',
    content: [
      {
        heading: 'JWT Authentication',
        body: `Torch CRM uses JSON Web Tokens (JWT). After login, a token is stored in localStorage and sent with every API request via the Authorization header.`,
      },
      {
        heading: 'Protected Routes',
        body: `All pages except /login require a valid JWT. Unauthenticated users are automatically redirected to the login page.`,
      },
      {
        heading: 'Roles',
        body: `User roles include: admin and salesperson. Role information is displayed in the Navbar. Role-based permissions can be extended in the backend middleware.`,
      },
      {
        heading: 'Logging Out',
        body: `Click the "Logout" button in the top navigation bar. This clears the token from localStorage and redirects you to the login page.`,
      },
    ],
  },
  {
    id: 'api',
    icon: Activity,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    title: 'API Reference',
    content: [
      {
        heading: 'Base URL',
        body: `All API endpoints are served at: http://localhost:5000/api`,
      },
      {
        heading: 'Auth Endpoints',
        body: `POST /api/auth/login — Log in with email + password. Returns a JWT token.\nGET /api/auth/me — Returns the authenticated user's profile.`,
      },
      {
        heading: 'Lead Endpoints',
        body: `GET /api/leads — List leads (supports ?page, ?limit, ?status, ?source, ?priority, ?assignedTo, ?search)\nPOST /api/leads — Create a lead\nGET /api/leads/:id — Get a single lead\nPUT /api/leads/:id — Update a lead\nPATCH /api/leads/:id/status — Update lead status only\nDELETE /api/leads/:id — Delete a lead`,
      },
      {
        heading: 'Note Endpoints',
        body: `GET /api/leads/:leadId/notes — Get notes for a lead\nPOST /api/notes — Create a note\nDELETE /api/notes/:id — Delete a note`,
      },
      {
        heading: 'Dashboard Endpoint',
        body: `GET /api/dashboard/stats — Returns aggregated stats: totalLeads, byStatus, leadsBySource, totalDealValue, wonDealValue, conversionRate, recentLeads, followUpsDueToday.`,
      },
    ],
  },
]

function DocSection({ section, isOpen, onToggle }) {
  const Icon = section.icon
  return (
    <Card id={section.id} className="overflow-hidden transition-all duration-200">
      <button
        className="flex w-full items-center justify-between p-5 text-left"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${section.bg}`}>
            <Icon className={`h-4 w-4 ${section.color}`} />
          </div>
          <span className="font-semibold">{section.title}</span>
        </div>
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      {isOpen && (
        <CardContent className="border-t px-5 pb-5 pt-4">
          <div className="space-y-5">
            {section.content.map(({ heading, body }) => (
              <div key={heading} className="space-y-1.5">
                <h3 className="text-sm font-semibold text-foreground">{heading}</h3>
                <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

export default function CRMDocsPage() {
  const [openSections, setOpenSections] = useState(new Set(['getting-started']))
  const [search, setSearch] = useState('')

  const toggleSection = (id) => {
    setOpenSections((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const expandAll = () => setOpenSections(new Set(sections.map((s) => s.id)))
  const collapseAll = () => setOpenSections(new Set())

  const filteredSections = search.trim()
    ? sections.filter(
        (s) =>
          s.title.toLowerCase().includes(search.toLowerCase()) ||
          s.content.some(
            (c) =>
              c.heading.toLowerCase().includes(search.toLowerCase()) ||
              c.body.toLowerCase().includes(search.toLowerCase()),
          ),
      )
    : sections

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Documentation</h2>
          <p className="text-sm text-muted-foreground">
            Everything you need to know about using Torch CRM.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={expandAll}
            className="text-sm font-medium text-primary hover:underline"
          >
            Expand All
          </button>
          <span className="text-muted-foreground">·</span>
          <button
            onClick={collapseAll}
            className="text-sm font-medium text-muted-foreground hover:underline"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search documentation…"
          className={cn(
            'w-full rounded-lg border bg-background py-2.5 pl-9 pr-4 text-sm outline-none',
            'focus:ring-2 focus:ring-primary/40 focus:border-primary/60',
            'placeholder:text-muted-foreground',
          )}
        />
      </div>

      {/* Quick Nav */}
      <div className="flex flex-wrap gap-2">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              if (!openSections.has(s.id)) toggleSection(s.id)
              document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
              'hover:bg-accent hover:text-foreground',
              'text-muted-foreground',
            )}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {filteredSections.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No results found for "{search}"
          </div>
        ) : (
          filteredSections.map((section) => (
            <DocSection
              key={section.id}
              section={section}
              isOpen={openSections.has(section.id)}
              onToggle={() => toggleSection(section.id)}
            />
          ))
        )}
      </div>

      {/* Footer note */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Need more help?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Can't find what you're looking for? Visit the{' '}
            <a href="/helpdesk" className="font-medium text-primary hover:underline">
              Helpdesk
            </a>{' '}
            to submit a support request, or check the{' '}
            <a
              href="https://github.com/adhilNuckz/torch-crm"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              GitHub repository
            </a>{' '}
            for the latest updates and issue tracker.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

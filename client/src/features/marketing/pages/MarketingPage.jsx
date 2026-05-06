import { useNavigate } from 'react-router-dom'
import {
  BarChart3,
  Users,
  Kanban,
  FileDown,
  Bell,
  ShieldCheck,
  Zap,
  Globe,
  ChevronRight,
  Star,
  TrendingUp,
  Target,
} from 'lucide-react'
import { Button } from '../../../components/ui/button.jsx'
import { Card, CardContent } from '../../../components/ui/card.jsx'

const features = [
  {
    icon: Users,
    title: 'Lead Management',
    description:
      'Capture, organise and track every lead from first contact to closed deal with a clean, intuitive interface.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Kanban,
    title: 'Kanban Pipeline',
    description:
      'Visualise your sales pipeline with drag-and-drop Kanban boards. Move leads across stages in seconds.',
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description:
      'Real-time charts for lead status, sources, deal values and conversion rates — all in one place.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Bell,
    title: 'Follow-up Reminders',
    description:
      'Never miss a follow-up. Get instant visibility into leads due for contact today.',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: FileDown,
    title: 'CSV Export',
    description:
      'Export your entire lead list as a CSV with one click. Bring your data anywhere, anytime.',
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
  },
  {
    icon: ShieldCheck,
    title: 'Role-Based Access',
    description:
      'Secure, role-based authentication ensures only authorised team members access sensitive data.',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
  },
]

const stats = [
  { value: '10,000+', label: 'Leads Managed', icon: Target },
  { value: '98%', label: 'Uptime SLA', icon: Zap },
  { value: '150+', label: 'Sales Teams', icon: Globe },
  { value: '4.9★', label: 'Average Rating', icon: Star },
]

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'VP of Sales, Nexora',
    text: 'Torch CRM transformed how our team tracks leads. The Kanban view alone saved us hours every week.',
    avatar: 'SM',
    accent: 'from-blue-500 to-violet-500',
  },
  {
    name: 'James Okonkwo',
    role: 'Founder, GrowthStack',
    text: 'The analytics dashboard gives us instant clarity on conversion rates and deal values. Indispensable.',
    avatar: 'JO',
    accent: 'from-emerald-500 to-cyan-500',
  },
  {
    name: 'Priya Nair',
    role: 'Sales Lead, BrightPath',
    text: 'Clean design, fast performance, and a CSV export that actually works. Exactly what we needed.',
    avatar: 'PN',
    accent: 'from-rose-500 to-amber-500',
  },
]

export default function MarketingPage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-20 pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-background px-8 py-20 text-center">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />

        <div className="relative space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <TrendingUp className="h-3.5 w-3.5" />
            Supercharge your sales pipeline
          </div>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            Close More Deals with{' '}
            <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
              Torch CRM
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            A full-featured Lead Management System built for modern sales teams. Track leads,
            visualise pipelines, and hit your targets — faster than ever.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="gap-2" onClick={() => navigate('/')}>
              Go to Dashboard
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/leads')}>
              View Leads
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ value, label, icon: Icon }) => (
          <Card key={label} className="overflow-hidden">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-extrabold">{value}</div>
                <div className="text-sm text-muted-foreground">{label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Features */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Everything you need to sell smarter</h2>
          <p className="mt-2 text-muted-foreground">
            Torch CRM packs enterprise-grade features into an elegant, easy-to-use interface.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description, color, bg }) => (
            <Card
              key={title}
              className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <CardContent className="space-y-4 p-6">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg}`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Loved by sales teams worldwide</h2>
          <p className="mt-2 text-muted-foreground">
            Real results from real people who closed more deals with Torch CRM.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map(({ name, role, text, avatar, accent }) => (
            <Card
              key={name}
              className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`}
              />
              <CardContent className="space-y-4 p-6 pt-8">
                <p className="text-sm leading-relaxed text-muted-foreground">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${accent} text-sm font-bold text-white`}
                  >
                    {avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{name}</div>
                    <div className="text-xs text-muted-foreground">{role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl bg-gradient-to-br from-primary to-violet-600 px-8 py-16 text-center text-white">
        <h2 className="text-3xl font-extrabold">Ready to grow your pipeline?</h2>
        <p className="mx-auto mt-3 max-w-xl text-white/80">
          Start managing your leads with clarity, speed, and style. Your next big deal is one
          click away.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button
            size="lg"
            variant="secondary"
            className="gap-2 font-semibold"
            onClick={() => navigate('/')}
          >
            Open Dashboard
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/40 text-white hover:bg-white/10"
            onClick={() => navigate('/docs')}
          >
            Read the Docs
          </Button>
        </div>
      </section>
    </div>
  )
}

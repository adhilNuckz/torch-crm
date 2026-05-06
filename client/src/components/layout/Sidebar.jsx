import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Megaphone, BookOpen, Headphones, Flame } from 'lucide-react'
import { cn } from '@/lib/utils.js'

const primaryNav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/leads', label: 'Leads', icon: Users },
  { to: '/marketing', label: 'Marketing', icon: Megaphone },
  { to: '/helpdesk', label: 'Helpdesk', icon: Headphones },
]

const secondaryNav = [
  { to: '/docs', label: 'Documentation', icon: BookOpen },
]

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
        role="button"
        tabIndex={-1}
      />
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r bg-background p-6 transition-transform md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="mb-10 flex items-center gap-3 text-xl font-bold tracking-tight">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-500/20">
            <Flame className="h-6 w-6 fill-current" />
          </div>
          <span className="bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
            Torch CRM
          </span>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {primaryNav.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground',
                    isActive && 'bg-accent text-foreground',
                  )
                }
                onClick={onClose}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            )
          })}

          <div className="my-3 border-t" />
          <div className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            Resources
          </div>

          {secondaryNav.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground',
                    isActive && 'bg-accent text-foreground',
                  )
                }
                onClick={onClose}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
        <div className="text-xs text-muted-foreground">CRM Lead Management v1</div>
      </aside>
    </>
  )
}

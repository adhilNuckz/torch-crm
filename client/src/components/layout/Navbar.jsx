import { useEffect, useMemo, useState } from 'react'
import { Menu, Moon, Sun } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar.jsx'
import { Button } from '../ui/button.jsx'
import { Switch } from '../ui/switch.jsx'
import { useAuth } from '../../hooks/useAuth.js'

export default function Navbar({ title, onOpenSidebar }) {
  const { user, logout } = useAuth()
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('crm_theme') === 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', isDark)
    localStorage.setItem('crm_theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const initials = useMemo(() => {
    if (!user?.name) return 'U'
    return user.name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }, [user])

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-background px-6 py-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onOpenSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          <Switch checked={isDark} onCheckedChange={setIsDark} />
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            {user?.avatarUrl ? (
              <AvatarImage src={user.avatarUrl} alt={user.name} />
            ) : (
              <AvatarFallback>{initials}</AvatarFallback>
            )}
          </Avatar>
          <div className="hidden text-sm md:block">
            <div className="font-medium">{user?.name || 'User'}</div>
            <div className="text-xs text-muted-foreground">{user?.role || 'salesperson'}</div>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  )
}

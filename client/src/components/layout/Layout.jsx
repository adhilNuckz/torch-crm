import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Navbar from './Navbar.jsx'

const titleMap = {
  '/': 'Dashboard',
  '/leads': 'Leads',
  '/marketing': 'Marketing',
  '/docs': 'Documentation',
  '/helpdesk': 'Helpdesk',
}

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()
  const pageTitle = titleMap[location.pathname] || 'Lead Detail'

  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="md:pl-64">
        <Navbar
          title={pageTitle}
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />
        <main className="px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

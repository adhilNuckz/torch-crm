import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import DashboardPage from './features/dashboard/pages/DashboardPage.jsx'
import LeadsPage from './features/leads/pages/LeadsPage.jsx'
import LeadDetailPage from './features/leads/pages/LeadDetailPage.jsx'
import MarketingPage from './features/marketing/pages/MarketingPage.jsx'
import CRMDocsPage from './features/docs/pages/CRMDocsPage.jsx'
import HelpdeskPage from './features/helpdesk/pages/HelpdeskPage.jsx'
import LoginPage from './features/auth/pages/LoginPage.jsx'
import NotFoundPage from './features/not-found/pages/NotFoundPage.jsx'
import { useAuth } from './hooks/useAuth.js'

function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="leads" element={<LeadsPage />} />
        <Route path="leads/:id" element={<LeadDetailPage />} />
        <Route path="marketing" element={<MarketingPage />} />
        <Route path="docs" element={<CRMDocsPage />} />
        <Route path="helpdesk" element={<HelpdeskPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

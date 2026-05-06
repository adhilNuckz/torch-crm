import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { fetchDashboardStats } from '../api/dashboard.js'
import StatCard from '../components/dashboard/StatCard.jsx'
import LeadsByStatusChart from '../components/dashboard/LeadsByStatusChart.jsx'
import LeadsBySourceChart from '../components/dashboard/LeadsBySourceChart.jsx'
import RecentLeadsTable from '../components/dashboard/RecentLeadsTable.jsx'
import FollowUpWidget from '../components/dashboard/FollowUpWidget.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx'
import { Skeleton } from '../components/ui/skeleton.jsx'
import { formatCurrency } from '../utils/formatters.js'
import { useAuth } from '../hooks/useAuth.js'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true)
      try {
        const response = await fetchDashboardStats()
        if (response?.success) {
          setStats(response.data)
        } else {
          toast.error(response?.message || 'Failed to load dashboard stats.')
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Failed to load dashboard stats.')
      } finally {
        setIsLoading(false)
      }
    }
    loadStats()
  }, [])

  const statusData = useMemo(() => {
    if (!stats?.byStatus) return []
    return Object.entries(stats.byStatus).map(([status, count]) => ({ status, count }))
  }, [stats])

  const sourceData = useMemo(() => {
    if (!stats?.leadsBySource) return []
    return Object.entries(stats.leadsBySource).map(([source, count]) => ({ source, count }))
  }, [stats])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-24" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
        <Skeleton className="h-64" />
      </div>
    )
  }

  if (!stats) {
    return <div className="text-sm text-muted-foreground">No dashboard data yet.</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">Welcome back, {user?.name || 'User'}</h2>
          <p className="text-sm text-muted-foreground">Here is your CRM overview for today.</p>
        </div>
        <div className="text-sm text-muted-foreground">
          Conversion Rate: <span className="font-semibold text-foreground">{stats.conversionRate}%</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total Leads" value={stats.totalLeads} />
        <StatCard label="New" value={stats.byStatus.New} />
        <StatCard label="Qualified" value={stats.byStatus.Qualified} />
        <StatCard label="Won" value={stats.byStatus.Won} />
        <StatCard label="Lost" value={stats.byStatus.Lost} />
        <StatCard label="Total Deal Value" value={formatCurrency(stats.totalDealValue)} />
        <StatCard label="Won Deal Value" value={formatCurrency(stats.wonDealValue)} />
        <FollowUpWidget count={stats.followUpsDueToday || 0} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <LeadsByStatusChart data={statusData} />
        <LeadsBySourceChart data={sourceData} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Leads</CardTitle>
          <button
            className="text-sm font-medium text-primary"
            onClick={() => navigate('/leads')}
          >
            View all
          </button>
        </CardHeader>
        <CardContent>
          <RecentLeadsTable
            leads={stats.recentLeads}
            onSelect={(id) => navigate(`/leads/${id}`)}
          />
        </CardContent>
      </Card>
    </div>
  )
}

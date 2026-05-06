import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Papa from 'papaparse'
import { createLead, deleteLead, updateLead, updateLeadStatus } from '../../../api/leads.js'
import { useLeads } from '../../../hooks/useLeads.js'
import { Button } from '../../../components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card.jsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs.jsx'
import { Skeleton } from '../../../components/ui/skeleton.jsx'
import LeadTable from '../components/LeadTable.jsx'
import LeadForm from '../components/LeadForm.jsx'
import LeadFilters from '../components/LeadFilters.jsx'
import KanbanBoard from '../components/KanbanBoard.jsx'

const DEFAULT_FILTERS = {
  status: 'All',
  source: 'All',
  priority: 'All',
  assignedTo: 'All',
  search: '',
}

export default function LeadsPage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLead, setEditingLead] = useState(null)
  const [searchValue, setSearchValue] = useState('')
  const [activeView, setActiveView] = useState('table')

  const [page, setPage] = useState(1)
  const baseLimit = 10
  const kanbanLimit = 200
  const effectiveLimit = activeView === 'kanban' ? kanbanLimit : baseLimit
  const { data, isLoading, setParams, refetch } = useLeads({ page: 1, limit: baseLimit })

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchValue }))
    }, 400)
    return () => clearTimeout(handler)
  }, [searchValue])

  const handleViewChange = (value) => {
    setActiveView(value)
    setPage(1)
  }

  useEffect(() => {
    const params = {
      page,
      limit: effectiveLimit,
    }
    if (filters.status !== 'All') params.status = filters.status
    if (filters.source !== 'All') params.source = filters.source
    if (filters.priority !== 'All') params.priority = filters.priority
    if (filters.assignedTo !== 'All') params.assignedTo = filters.assignedTo
    if (filters.search) params.search = filters.search
    setParams(params)
  }, [filters, page, effectiveLimit, setParams])

  const assignedOptions = useMemo(() => {
    const seen = new Map()
    data.items.forEach((lead) => {
      if (lead.assignedTo?._id && !seen.has(lead.assignedTo._id)) {
        seen.set(lead.assignedTo._id, lead.assignedTo)
      }
    })
    return Array.from(seen.values())
  }, [data.items])

  const openCreateModal = () => {
    setEditingLead(null)
    setIsDialogOpen(true)
  }

  const openEditModal = (lead) => {
    setEditingLead(lead)
    setIsDialogOpen(true)
  }

  const handleSaveLead = async (payload) => {
    try {
      const response = editingLead
        ? await updateLead(editingLead._id, payload)
        : await createLead(payload)
      if (response?.success) {
        toast.success(editingLead ? 'Lead updated successfully.' : 'Lead created successfully.')
        setIsDialogOpen(false)
        setEditingLead(null)
        refetch()
      } else {
        toast.error(response?.message || 'Failed to save lead.')
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save lead.')
    }
  }

  const handleDeleteLead = async (leadId) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return
    try {
      const response = await deleteLead(leadId)
      if (response?.success) {
        toast.success('Lead deleted successfully.')
        refetch()
      } else {
        toast.error(response?.message || 'Failed to delete lead.')
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete lead.')
    }
  }

  const handleStatusChange = async (leadId, status) => {
    try {
      const response = await updateLeadStatus(leadId, status)
      if (response?.success) {
        toast.success('Status updated successfully.')
        refetch()
      } else {
        toast.error(response?.message || 'Failed to update status.')
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update status.')
    }
  }

  const handleExportCsv = () => {
    const csv = Papa.unparse(
      data.items.map((lead) => ({
        LeadName: lead.leadName,
        Company: lead.companyName,
        Email: lead.email,
        Phone: lead.phone,
        Status: lead.status,
        Source: lead.leadSource,
        Priority: lead.priority,
        DealValue: lead.dealValue,
        NextFollowUp: lead.nextFollowUp,
        AssignedTo: lead.assignedTo?.name || '',
      })),
    )
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `leads-export-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handlePageChange = (nextPage) => {
    setPage(nextPage)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">Leads</h2>
          <p className="text-sm text-muted-foreground">Manage your pipeline and track opportunities.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCsv}>
            Export CSV
          </Button>
          <Button onClick={openCreateModal}>Add Lead</Button>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-4 p-6">
          <LeadFilters
            filters={filters}
            assignedOptions={assignedOptions}
            onFilterChange={(field, value) => setFilters((prev) => ({ ...prev, [field]: value }))}
            onSearchChange={setSearchValue}
          />
        </CardContent>
      </Card>

      <Tabs value={activeView} onValueChange={handleViewChange}>
        <TabsList>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="kanban">Kanban View</TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Leads</CardTitle>
              <div className="text-sm text-muted-foreground">
                Page {data.page} of {Math.ceil(data.total / data.limit) || 1}
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="h-10" />
                  ))}
                </div>
              ) : (
                <LeadTable
                  leads={data.items}
                  onView={(id) => navigate(`/leads/${id}`)}
                  onEdit={openEditModal}
                  onDelete={handleDeleteLead}
                />
              )}
              <div className="mt-4 flex items-center justify-between">
                <Button
                  variant="outline"
                  disabled={data.page <= 1}
                  onClick={() => handlePageChange(Math.max(1, data.page - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  disabled={data.page >= Math.ceil(data.total / data.limit)}
                  onClick={() => handlePageChange(data.page + 1)}
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="kanban">
          <Card>
            <CardHeader>
              <CardTitle>Kanban Board</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="grid gap-4 lg:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-96" />
                  ))}
                </div>
              ) : (
                <KanbanBoard leads={data.items} onStatusChange={handleStatusChange} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingLead ? 'Edit Lead' : 'Add Lead'}</DialogTitle>
          </DialogHeader>
          <LeadForm
            key={editingLead?._id || 'new'}
            initialData={editingLead}
            onSubmit={handleSaveLead}
            onCancel={() => setIsDialogOpen(false)}
            submitLabel={editingLead ? 'Update Lead' : 'Create Lead'}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

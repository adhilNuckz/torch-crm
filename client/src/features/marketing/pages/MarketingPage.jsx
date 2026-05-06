import { useEffect, useState } from 'react'
import {
  BarChart3,
  Users,
  Mail,
  Plus,
  Settings,
  Send,
  Eye,
  MousePointer2,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  TrendingUp,
  Target,
  Sparkles,
  Image as ImageIcon,
  Wand2,
} from 'lucide-react'
import { Button } from '../../../components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card.jsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/dialog.jsx'
import { Input } from '../../../components/ui/input.jsx'
import { Label } from '../../../components/ui/label.jsx'
import { Textarea } from '../../../components/ui/textarea.jsx'
import {
  fetchCampaigns,
  createCampaign,
  sendCampaign,
  fetchEmailConfig,
  saveEmailConfig,
  generateAIContent,
  generateAIImage,
} from '../../../api/marketing.js'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils.js'

export default function MarketingPage() {
  const [campaigns, setCampaigns] = useState([])
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false)
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGeneratingImg, setIsGeneratingImg] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isBroadcasting, setIsBroadcasting] = useState(null)
  const [isSendConfirmOpen, setIsSendConfirmOpen] = useState(false)
  const [targetStatus, setTargetStatus] = useState('All')
  const [campaignToBroadcast, setCampaignToBroadcast] = useState(null)
  
  const [newCampaign, setNewCampaign] = useState({ name: '', subject: '', content: '' })
  const [emailConfig, setEmailConfig] = useState({
    smtpHost: '',
    smtpPort: 587,
    username: '',
    password: '',
    fromEmail: '',
    fromName: '',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [campaignData, configData] = await Promise.all([
        fetchCampaigns(),
        fetchEmailConfig(),
      ])
      setCampaigns(campaignData)
      setConfig(configData)
      if (configData) setEmailConfig(configData)
    } catch (error) {
      toast.error('Failed to load marketing data')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCampaign = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await createCampaign(newCampaign)
      toast.success('Campaign created')
      setIsNewCampaignOpen(false)
      setNewCampaign({ name: '', subject: '', content: '' })
      loadData()
    } catch (error) {
      toast.error('Failed to create campaign')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveConfig = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await saveEmailConfig(emailConfig)
      toast.success('Configuration saved')
      setIsConfigOpen(false)
      loadData()
    } catch (error) {
      toast.error('Failed to save configuration')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSendCampaign = async () => {
    if (!campaignToBroadcast) return
    const id = campaignToBroadcast._id
    setIsBroadcasting(id)
    setIsSendConfirmOpen(false)
    try {
      toast.loading(`Sending to ${targetStatus} leads...`, { id: 'send' })
      await sendCampaign(id, targetStatus)
      toast.success('Campaign broadcasted successfully', { id: 'send' })
      loadData()
      setIsDetailOpen(false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send campaign', { id: 'send' })
    } finally {
      setIsBroadcasting(null)
      setCampaignToBroadcast(null)
    }
  }

  const handleGenerateContent = async () => {
    if (!newCampaign.name || !newCampaign.subject) {
      toast.error('Please enter campaign name and subject first')
      return
    }
    setIsGenerating(true)
    try {
      const { content } = await generateAIContent({ name: newCampaign.name, subject: newCampaign.subject })
      setNewCampaign(prev => ({ ...prev, content }))
      
      if (content.includes('<!-- FALLBACK_MARKER -->')) {
        toast('Using premium template fallback (AI Quota Limit)', {
          icon: 'ℹ️',
          duration: 4000
        })
      } else {
        toast.success('Email content generated with AI!')
      }
    } catch (error) {
      toast.error('Failed to generate AI content')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateImage = async () => {
    if (!newCampaign.name) {
      toast.error('Please enter campaign name first')
      return
    }
    setIsGeneratingImg(true)
    try {
      const { imageUrl } = await generateAIImage({ name: newCampaign.name })
      const imgTag = `<div style="margin-bottom: 20px;"><img src="${imageUrl}" alt="Header" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 8px;" /></div>`
      setNewCampaign(prev => ({ ...prev, content: imgTag + prev.content }))
      toast.success('Header image generated!')
    } catch (error) {
      toast.error('Failed to generate AI image')
    } finally {
      setIsGeneratingImg(false)
    }
  }

  const totalSent = campaigns.reduce((acc, c) => acc + (c.metrics?.totalSent || 0), 0)
  const totalOpens = campaigns.reduce((acc, c) => acc + (c.metrics?.opens || 0), 0)
  const totalClicks = campaigns.reduce((acc, c) => acc + (c.metrics?.clicks || 0), 0)
  const avgOpenRate = totalSent ? ((totalOpens / totalSent) * 100).toFixed(1) : 0
  const avgClickRate = totalSent ? ((totalClicks / totalSent) * 100).toFixed(1) : 0

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Email Marketing</h2>
          <p className="text-sm text-muted-foreground">Manage campaigns and broadcast messages to leads.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={() => setIsConfigOpen(true)}>
            <Settings className="h-4 w-4" />
            Gateway Config
          </Button>
          <Button className="gap-2" onClick={() => setIsNewCampaignOpen(true)}>
            <Plus className="h-4 w-4" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Global Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Send className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Emails Sent</p>
                <p className="text-2xl font-bold">{totalSent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <Eye className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg. Open Rate</p>
                <p className="text-2xl font-bold">{avgOpenRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <MousePointer2 className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg. Click Rate</p>
                <p className="text-2xl font-bold">{avgClickRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
                <Target className="h-5 w-5 text-violet-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Campaigns</p>
                <p className="text-2xl font-bold">{campaigns.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No campaigns found. Create your first one to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div 
                  key={campaign._id} 
                  className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/30 cursor-pointer"
                  onClick={() => {
                    setSelectedCampaign(campaign)
                    setIsDetailOpen(true)
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className={campaign.status === 'Sent' ? 'text-emerald-500' : 'text-amber-500'}>
                      {campaign.status === 'Sent' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                    </div>
                    <div>
                      <h4 className="font-semibold">{campaign.name}</h4>
                      <p className="text-xs text-muted-foreground">{campaign.subject}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground font-medium uppercase">Sent</p>
                      <p className="text-sm font-bold">{campaign.metrics?.totalSent || 0}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground font-medium uppercase">Opens</p>
                      <p className="text-sm font-bold">{campaign.metrics?.opens || 0}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground font-medium uppercase">Clicks</p>
                      <p className="text-sm font-bold">{campaign.metrics?.clicks || 0}</p>
                    </div>
                    {campaign.status !== 'Sent' && (
                      <Button 
                        size="sm" 
                        className="gap-2" 
                        disabled={isBroadcasting === campaign._id}
                        onClick={(e) => {
                          e.stopPropagation()
                          setCampaignToBroadcast(campaign)
                          setIsSendConfirmOpen(true)
                        }}
                      >
                        <Send className={cn("h-3.5 w-3.5", isBroadcasting === campaign._id && "animate-pulse")} />
                        {isBroadcasting === campaign._id ? 'Sending...' : 'Broadcast'}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Campaign Dialog */}
      <Dialog open={isNewCampaignOpen} onOpenChange={setIsNewCampaignOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateCampaign} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Campaign Name</Label>
              <Input 
                placeholder="e.g., Summer Sale 2025" 
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Email Subject</Label>
              <Input 
                placeholder="Exclusive Offer Just For You!" 
                value={newCampaign.subject}
                onChange={(e) => setNewCampaign({...newCampaign, subject: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Email Content (HTML supported)</Label>
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-[10px] gap-1 px-2 border-primary/30 text-primary hover:bg-primary/5"
                    onClick={handleGenerateImage}
                    disabled={isGeneratingImg}
                  >
                    <ImageIcon className={cn("h-3 w-3", isGeneratingImg && "animate-pulse")} />
                    {isGeneratingImg ? 'Generating...' : 'Add AI Image'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-[10px] gap-1 px-2 border-violet-500/30 text-violet-500 hover:bg-violet-500/5"
                    onClick={handleGenerateContent}
                    disabled={isGenerating}
                  >
                    <Wand2 className={cn("h-3 w-3", isGenerating && "animate-pulse")} />
                    {isGenerating ? 'Generating...' : 'Generate with AI'}
                  </Button>
                </div>
              </div>
              <Textarea 
                placeholder="<h1>Hello!</h1><p>Check out our latest offers...</p>" 
                className="min-h-[250px] font-mono text-sm"
                value={newCampaign.content}
                onChange={(e) => setNewCampaign({...newCampaign, content: e.target.value})}
                required
              />
              <p className="text-[10px] text-muted-foreground">Tip: You can use the AI buttons above to generate a professional layout.</p>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsNewCampaignOpen(false)} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Campaign'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Gateway Config Dialog */}
      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email Gateway Configuration</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveConfig} className="space-y-4 pt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>SMTP Host</Label>
                <Input 
                  placeholder="smtp.gmail.com" 
                  value={emailConfig.smtpHost}
                  onChange={(e) => setEmailConfig({...emailConfig, smtpHost: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>SMTP Port</Label>
                <Input 
                  type="number" 
                  placeholder="587" 
                  value={emailConfig.smtpPort}
                  onChange={(e) => setEmailConfig({...emailConfig, smtpPort: parseInt(e.target.value)})}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Username</Label>
              <Input 
                placeholder="your-email@gmail.com" 
                value={emailConfig.username}
                onChange={(e) => setEmailConfig({...emailConfig, username: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>App Password</Label>
              <Input 
                type="password" 
                placeholder="••••••••••••••••" 
                value={emailConfig.password}
                onChange={(e) => setEmailConfig({...emailConfig, password: e.target.value})}
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>From Name</Label>
                <Input 
                  placeholder="Torch CRM" 
                  value={emailConfig.fromName}
                  onChange={(e) => setEmailConfig({...emailConfig, fromName: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>From Email</Label>
                <Input 
                  placeholder="noreply@torchcrm.io" 
                  value={emailConfig.fromEmail}
                  onChange={(e) => setEmailConfig({...emailConfig, fromEmail: e.target.value})}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsConfigOpen(false)} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Configuration'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Campaign Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Campaign Details: {selectedCampaign?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedCampaign && (
            <div className="space-y-6 pt-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Status</p>
                  <p className={cn(
                    "text-sm font-semibold",
                    selectedCampaign.status === 'Sent' ? "text-emerald-500" : "text-amber-500"
                  )}>{selectedCampaign.status}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Sent Date</p>
                  <p className="text-sm font-semibold">
                    {selectedCampaign.sentAt ? new Date(selectedCampaign.sentAt).toLocaleDateString() : 'Not sent'}
                  </p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Tracking</p>
                  <p className="text-sm font-semibold">Enabled</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Subject Line</Label>
                <div className="rounded-md border p-3 font-medium">{selectedCampaign.subject}</div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Email Content Preview</Label>
                <div 
                  className="rounded-md border p-4 bg-white text-black min-h-[200px] prose prose-sm max-w-none overflow-x-auto"
                  dangerouslySetInnerHTML={{ __html: selectedCampaign.content }}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsDetailOpen(false)} disabled={isBroadcasting === selectedCampaign._id}>Close</Button>
                {selectedCampaign.status !== 'Sent' && (
                  <Button 
                    disabled={isBroadcasting === selectedCampaign._id}
                    onClick={() => {
                      setCampaignToBroadcast(selectedCampaign)
                      setIsSendConfirmOpen(true)
                    }}
                  >
                    {isBroadcasting === selectedCampaign._id ? 'Sending...' : 'Broadcast Now'}
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Send Confirmation Dialog */}
      <Dialog open={isSendConfirmOpen} onOpenChange={setIsSendConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Broadcast Confirmation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Select which leads should receive the <strong>"{campaignToBroadcast?.name}"</strong> campaign.
            </p>
            <div className="space-y-2">
              <Label>Target Audience (by Status)</Label>
              <select 
                className="w-full h-10 rounded-md border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                value={targetStatus}
                onChange={(e) => setTargetStatus(e.target.value)}
              >
                <option value="All">All Leads (Broadcast to Everyone)</option>
                <option value="New">New Leads Only</option>
                <option value="Contacted">Contacted Leads Only</option>
                <option value="Qualified">Qualified Leads Only</option>
                <option value="Proposal Sent">Proposal Sent Only</option>
              </select>
            </div>
            <div className="rounded-lg bg-amber-50 p-3 border border-amber-200">
              <p className="text-[11px] text-amber-800 font-medium">
                <strong>Note:</strong> Only leads with valid email addresses will be included in the broadcast.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsSendConfirmOpen(false)}>Cancel</Button>
            <Button onClick={handleSendCampaign} className="gap-2">
              <Send className="h-4 w-4" />
              Confirm & Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

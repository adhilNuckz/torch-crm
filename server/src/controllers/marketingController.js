const Campaign = require('../models/Campaign')
const EmailConfig = require('../models/EmailConfig')
const Lead = require('../models/Lead')
const nodemailer = require('nodemailer')

// Create Campaign
exports.createCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.create({
      ...req.body,
      createdBy: req.user.id,
    })
    res.status(201).json(campaign)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Get All Campaigns
exports.getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 })
    res.json(campaigns)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Save Email Config
exports.saveConfig = async (req, res) => {
  try {
    let config = await EmailConfig.findOne({ createdBy: req.user.id })
    if (config) {
      config = await EmailConfig.findByIdAndUpdate(config._id, req.body, { new: true })
    } else {
      config = await EmailConfig.create({ ...req.body, createdBy: req.user.id })
    }
    res.json(config)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Get Email Config
exports.getConfig = async (req, res) => {
  try {
    const config = await EmailConfig.findOne({ createdBy: req.user.id })
    res.json(config)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Send Campaign
exports.sendCampaign = async (req, res) => {
  try {
    const { id } = req.params
    const campaign = await Campaign.findById(id)
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' })

    const config = await EmailConfig.findOne({ createdBy: req.user.id })
    if (!config) return res.status(400).json({ message: 'Email configuration missing' })

    const leads = await Lead.find({ email: { $exists: true, $ne: '' } })
    if (leads.length === 0) return res.status(400).json({ message: 'No leads found to send to' })

    const transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpPort === 465,
      auth: {
        user: config.username,
        pass: config.password,
      },
    })

    let sentCount = 0
    for (const lead of leads) {
      const openTrackingUrl = `${process.env.BACKEND_URL}/api/marketing/track/open/${campaign._id}/${lead._id}`
      const trackingPixel = `<img src="${openTrackingUrl}" width="1" height="1" style="display:none" />`
      
      const mailOptions = {
        from: `"${config.fromName}" <${config.fromEmail}>`,
        to: lead.email,
        subject: campaign.subject,
        html: `${campaign.content}${trackingPixel}`,
      }

      try {
        await transporter.sendMail(mailOptions)
        sentCount++
      } catch (err) {
        console.error(`Failed to send to ${lead.email}:`, err.message)
      }
    }

    campaign.status = 'Sent'
    campaign.metrics.totalSent = sentCount
    await campaign.save()

    res.json({ message: `Campaign sent to ${sentCount} leads`, campaign })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Track Open
exports.trackOpen = async (req, res) => {
  try {
    const { campaignId, leadId } = req.params
    await Campaign.findByIdAndUpdate(campaignId, { $inc: { 'metrics.opens': 1 } })
    
    // Return a 1x1 transparent GIF
    const img = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64')
    res.writeHead(200, {
      'Content-Type': 'image/gif',
      'Content-Length': img.length,
    })
    res.end(img)
  } catch (error) {
    res.status(500).end()
  }
}

// Track Click (Optional for now, but implemented for completeness)
exports.trackClick = async (req, res) => {
  try {
    const { campaignId, leadId } = req.params
    const { url } = req.query
    await Campaign.findByIdAndUpdate(campaignId, { $inc: { 'metrics.clicks': 1 } })
    res.redirect(url || '/')
  } catch (error) {
    res.status(500).end()
  }
}

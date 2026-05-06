const Lead = require('../models/Lead.js')
const Note = require('../models/Note.js')

const buildFilters = (query) => {
  const filters = {}
  if (query.status) filters.status = query.status
  if (query.source) filters.leadSource = query.source
  if (query.assignedTo) filters.assignedTo = query.assignedTo
  if (query.priority) filters.priority = query.priority
  
  if (query.filter === 'dueToday') {
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    const end = new Date()
    end.setHours(23, 59, 59, 999)
    filters.nextFollowUp = { $gte: start, $lte: end }
  }

  if (query.search) {
    filters.$or = [
      { leadName: { $regex: query.search, $options: 'i' } },
      { companyName: { $regex: query.search, $options: 'i' } },
      { email: { $regex: query.search, $options: 'i' } },
    ]
  }
  return filters
}

const getLeads = async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1)
    const limit = Number(req.query.limit || 10)
    const skip = (page - 1) * limit
    const filters = buildFilters(req.query)

    const [items, total] = await Promise.all([
      Lead.find(filters)
        .populate('assignedTo', 'name email role avatarUrl')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Lead.countDocuments(filters),
    ])

    return res.json({
      success: true,
      data: {
        items,
        total,
        page,
        limit,
      },
    })
  } catch (err) {
    return next(err)
  }
}

const createLead = async (req, res, next) => {
  try {
    const {
      leadName,
      companyName,
      email,
      phone,
      leadSource,
      assignedTo,
      status,
      dealValue,
      priority,
      tags,
      nextFollowUp,
      notes,
    } = req.body

    if (!leadName) {
      return res.status(400).json({ success: false, message: 'Lead name is required.' })
    }

    const lead = await Lead.create({
      leadName,
      companyName,
      email,
      phone,
      leadSource,
      assignedTo: assignedTo || req.user.id,
      status,
      dealValue,
      priority,
      tags,
      nextFollowUp,
      activities: [
        {
          message: `Status set to ${status || 'New'}`,
          createdBy: req.user.id,
        },
      ],
    })

    if (notes) {
      await Note.create({
        leadId: lead._id,
        createdBy: req.user.id,
        content: notes,
        noteType: 'General',
      })
    }

    const createdLead = await Lead.findById(lead._id)
      .populate('assignedTo', 'name email role avatarUrl')
      .populate('activities.createdBy', 'name email role avatarUrl')
      .lean()

    return res.status(201).json({ success: true, data: createdLead })
  } catch (err) {
    return next(err)
  }
}

const getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('assignedTo', 'name email role avatarUrl')
      .populate('activities.createdBy', 'name email role avatarUrl')
      .lean()

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found.' })
    }

    const notes = await Note.find({ leadId: lead._id })
      .populate('createdBy', 'name email role avatarUrl')
      .sort({ createdAt: -1 })
      .lean()

    return res.json({ success: true, data: { ...lead, notes } })
  } catch (err) {
    return next(err)
  }
}

const updateLead = async (req, res, next) => {
  try {
    const existingLead = await Lead.findById(req.params.id)
    if (!existingLead) {
      return res.status(404).json({ success: false, message: 'Lead not found.' })
    }

    const prevStatus = existingLead.status
    Object.assign(existingLead, req.body)

    if (req.body.status && req.body.status !== prevStatus) {
      existingLead.activities.push({
        message: `Status changed: ${prevStatus} → ${req.body.status}`,
        createdBy: req.user.id,
      })
    }

    await existingLead.save()

    const updatedLead = await Lead.findById(existingLead._id)
      .populate('assignedTo', 'name email role avatarUrl')
      .populate('activities.createdBy', 'name email role avatarUrl')
      .lean()

    return res.json({ success: true, data: updatedLead })
  } catch (err) {
    return next(err)
  }
}

const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id)
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found.' })
    }
    await Note.deleteMany({ leadId: lead._id })
    await lead.deleteOne()
    return res.json({ success: true, data: { id: req.params.id } })
  } catch (err) {
    return next(err)
  }
}

const updateLeadStatus = async (req, res, next) => {
  try {
    const { status } = req.body
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required.' })
    }

    const lead = await Lead.findById(req.params.id)
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found.' })
    }

    const prevStatus = lead.status
    const validStatuses = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` })
    }

    lead.status = status
    lead.activities.push({
      message: `Status changed: ${prevStatus} → ${status}`,
      createdBy: req.user.id,
    })
    await lead.save()

    const updatedLead = await Lead.findById(lead._id)
      .populate('assignedTo', 'name email role avatarUrl')
      .populate('activities.createdBy', 'name email role avatarUrl')
      .lean()

    return res.json({ success: true, data: updatedLead })
  } catch (err) {
    return next(err)
  }
}

module.exports = {
  getLeads,
  createLead,
  getLeadById,
  updateLead,
  deleteLead,
  updateLeadStatus,
}

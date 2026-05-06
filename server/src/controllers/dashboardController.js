const Lead = require('../models/Lead.js')

const getStats = async (req, res, next) => {
  try {
    const totalLeads = await Lead.countDocuments()

    const [byStatusRaw, bySourceRaw, totalDealValueRaw, wonDealValueRaw, recentLeads] =
      await Promise.all([
        Lead.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
        Lead.aggregate([
          { $group: { _id: { $ifNull: ['$leadSource', 'Other'] }, count: { $sum: 1 } } },
        ]),
        Lead.aggregate([{ $group: { _id: null, total: { $sum: '$dealValue' } } }]),
        Lead.aggregate([
          { $match: { status: 'Won' } },
          { $group: { _id: null, total: { $sum: '$dealValue' } } },
        ]),
        Lead.find()
          .populate('assignedTo', 'name email role avatarUrl')
          .sort({ createdAt: -1 })
          .limit(5)
          .lean(),
      ])

    const byStatus = {
      New: 0,
      Contacted: 0,
      Qualified: 0,
      'Proposal Sent': 0,
      Won: 0,
      Lost: 0,
    }
    byStatusRaw.forEach((item) => {
      byStatus[item._id] = item.count
    })

    const leadsBySource = {}
    bySourceRaw.forEach((item) => {
      leadsBySource[item._id] = item.count
    })

    const totalDealValue = totalDealValueRaw[0]?.total || 0
    const wonDealValue = wonDealValueRaw[0]?.total || 0

    const conversionRate = totalLeads ? Math.round((byStatus.Won / totalLeads) * 100) : 0

    const start = new Date()
    start.setHours(0, 0, 0, 0)
    const end = new Date()
    end.setHours(23, 59, 59, 999)

    const followUpsDueToday = await Lead.countDocuments({
      nextFollowUp: { $gte: start, $lte: end },
    })

    return res.json({
      success: true,
      data: {
        totalLeads,
        byStatus,
        totalDealValue,
        wonDealValue,
        leadsBySource,
        recentLeads,
        conversionRate,
        followUpsDueToday,
      },
    })
  } catch (err) {
    return next(err)
  }
}

module.exports = { getStats }

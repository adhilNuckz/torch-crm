const mongoose = require('mongoose')

const activitySchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true },
)

const leadSchema = new mongoose.Schema(
  {
    leadName: { type: String, required: true },
    companyName: { type: String },
    email: { type: String },
    phone: { type: String },
    leadSource: {
      type: String,
      enum: ['Website', 'LinkedIn', 'Referral', 'Cold Email', 'Event', 'Other'],
      default: 'Website',
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'],
      default: 'New',
    },
    dealValue: { type: Number, default: 0 },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    tags: [{ type: String }],
    nextFollowUp: { type: Date },
    activities: [activitySchema],
  },
  { timestamps: true },
)

module.exports = mongoose.model('Lead', leadSchema)

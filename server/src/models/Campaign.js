const mongoose = require('mongoose')

const campaignSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subject: { type: String, required: true },
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ['Draft', 'Sent', 'Scheduled'],
      default: 'Draft',
    },
    metrics: {
      opens: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 },
      totalSent: { type: Number, default: 0 },
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Campaign', campaignSchema)

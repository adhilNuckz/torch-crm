const mongoose = require('mongoose')

const emailConfigSchema = new mongoose.Schema(
  {
    smtpHost: { type: String, required: true },
    smtpPort: { type: Number, default: 587 },
    username: { type: String, required: true },
    password: { type: String, required: true }, // Should be encrypted in a real app
    fromEmail: { type: String, required: true },
    fromName: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

module.exports = mongoose.model('EmailConfig', emailConfigSchema)

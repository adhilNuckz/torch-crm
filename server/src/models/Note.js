const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema(
  {
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    noteType: {
      type: String,
      enum: ['Call', 'Email', 'Meeting', 'General'],
      default: 'General',
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Note', noteSchema)

const mongoose = require('mongoose')

const replySchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    sender: { type: String, enum: ['Client', 'Agent'], required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
  }
)

const ticketSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['bug', 'feature', 'question', 'other'],
      default: 'question',
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved', 'closed'],
      default: 'open',
    },
    clientEmail: { type: String, required: true },
    replies: [replySchema],
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Ticket', ticketSchema)

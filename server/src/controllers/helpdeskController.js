const Ticket = require('../models/Ticket')

// Create Ticket (Public)
exports.createPublicTicket = async (req, res) => {
  try {
    const ticket = await Ticket.create(req.body)
    res.status(201).json(ticket)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Get All Tickets (Agent)
exports.getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 })
    res.json(tickets)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get Single Ticket
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' })
    res.json(ticket)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Reply to Ticket
exports.replyToTicket = async (req, res) => {
  try {
    const { id } = req.params
    const { message, sender } = req.body
    
    const ticket = await Ticket.findById(id)
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' })

    const reply = {
      message,
      sender, // 'Agent' or 'Client'
      senderId: sender === 'Agent' ? req.user.id : null,
      createdAt: new Date()
    }

    ticket.replies.push(reply)
    if (sender === 'Agent') {
      ticket.status = 'in-progress'
    }
    await ticket.save()

    res.status(201).json(ticket)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Update Ticket Status
exports.updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const ticket = await Ticket.findByIdAndUpdate(id, { status }, { new: true })
    res.json(ticket)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

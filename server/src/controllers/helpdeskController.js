const Ticket = require('../models/Ticket')
const EmailConfig = require('../models/EmailConfig')
const nodemailer = require('nodemailer')

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
      
      // Send Email Notification to Client
      try {
        const config = await EmailConfig.findOne().sort({ createdAt: -1 }) // Get the latest config
        if (config) {
          const transporter = nodemailer.createTransport({
            host: config.smtpHost,
            port: config.smtpPort,
            secure: config.smtpPort === 465,
            auth: {
              user: config.username,
              pass: config.password,
            },
          })

          const mailOptions = {
            from: `"${config.fromName}" <${config.fromEmail}>`,
            to: ticket.clientEmail,
            subject: `Re: [Ticket #${String(ticket._id).slice(-6)}] ${ticket.subject}`,
            html: `
              <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
                <p>Hello,</p>
                <p>An agent has replied to your support ticket:</p>
                <div style="background: #f4f4f4; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0;">
                  ${message.replace(/\n/g, '<br>')}
                </div>
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
                <p style="font-size: 12px; color: #777;">
                  <strong>Ticket Details:</strong><br>
                  ID: ${ticket._id}<br>
                  Subject: ${ticket.subject}
                </p>
              </div>
            `,
          }

          await transporter.sendMail(mailOptions)
        }
      } catch (emailErr) {
        console.error('Failed to send support email:', emailErr.message)
        // We don't block the reply if email fails, but we log it
      }
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
    
    if (status === 'resolved' && ticket) {
      // Send Resolution Email
      try {
        const config = await EmailConfig.findOne().sort({ createdAt: -1 })
        if (config) {
          const transporter = nodemailer.createTransport({
            host: config.smtpHost,
            port: config.smtpPort,
            secure: config.smtpPort === 465,
            auth: { user: config.username, pass: config.password },
          })

          await transporter.sendMail({
            from: `"${config.fromName}" <${config.fromEmail}>`,
            to: ticket.clientEmail,
            subject: `[Resolved] Ticket #${String(ticket._id).slice(-6)}: ${ticket.subject}`,
            html: `
              <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #059669;">Support Ticket Resolved</h2>
                <p>Hello,</p>
                <p>Your support ticket <strong>"${ticket.subject}"</strong> has been marked as <strong>Resolved</strong>.</p>
                <p>We hope we were able to assist you effectively. If you have any further questions or if the issue persists, please feel free to reach out or submit a new ticket.</p>
                <div style="background: #f9fafb; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0;">
                  <p style="margin: 0; font-size: 14px; color: #6b7280;"><strong>Summary of Resolution:</strong></p>
                  <p style="margin: 5px 0 0; font-size: 14px;">The agent has completed the request and closed this ticket thread.</p>
                </div>
                <p>Thank you for choosing ${config.fromName}!</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
                <p style="font-size: 11px; color: #9ca3af;">This is an automated notification. Please do not reply to this email.</p>
              </div>
            `,
          })
        }
      } catch (emailErr) {
        console.error('Failed to send resolution email:', emailErr.message)
      }
    }

    res.json(ticket)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

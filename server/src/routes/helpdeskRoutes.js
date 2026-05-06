const express = require('express')
const router = express.Router()
const helpdeskController = require('../controllers/helpdeskController')
const { protect } = require('../middleware/authMiddleware')

// Public routes
router.post('/public/tickets', helpdeskController.createPublicTicket)
router.post('/public/tickets/:id/reply', helpdeskController.replyToTicket) // Allowing client to reply without auth for this simplified demo

// Protected routes
router.use(protect)
router.get('/tickets', helpdeskController.getTickets)
router.get('/tickets/:id', helpdeskController.getTicketById)
router.post('/tickets/:id/reply', helpdeskController.replyToTicket)
router.patch('/tickets/:id/status', helpdeskController.updateTicketStatus)

module.exports = router

const express = require('express')
const authMiddleware = require('../middleware/authMiddleware.js')
const {
  getLeads,
  createLead,
  getLeadById,
  updateLead,
  deleteLead,
  updateLeadStatus,
} = require('../controllers/leadController.js')

const router = express.Router()

router.use(authMiddleware)
router.get('/', getLeads)
router.post('/', createLead)
router.get('/:id', getLeadById)
router.put('/:id', updateLead)
router.delete('/:id', deleteLead)
router.patch('/:id/status', updateLeadStatus)

module.exports = router

const express = require('express')
const authMiddleware = require('../middleware/authMiddleware.js')
const { createNote, getNotes, deleteNote } = require('../controllers/noteController.js')

const router = express.Router()

router.use(authMiddleware)
router.post('/', createNote)
router.get('/:leadId', getNotes)
router.delete('/:id', deleteNote)

module.exports = router

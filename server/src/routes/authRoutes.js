const express = require('express')
const { login, getMe } = require('../controllers/authController.js')
const authMiddleware = require('../middleware/authMiddleware.js')

const router = express.Router()

router.post('/login', login)
router.get('/me', authMiddleware, getMe)

module.exports = router

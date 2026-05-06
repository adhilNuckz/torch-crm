const express = require('express')
const authMiddleware = require('../middleware/authMiddleware.js')
const { getStats } = require('../controllers/dashboardController.js')

const router = express.Router()

router.use(authMiddleware)
router.get('/stats', getStats)

module.exports = router

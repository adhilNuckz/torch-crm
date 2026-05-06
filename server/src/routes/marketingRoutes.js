const express = require('express')
const router = express.Router()
const marketingController = require('../controllers/marketingController')
const authMiddleware = require('../middleware/authMiddleware')

// Public routes for tracking
router.get('/track/open/:campaignId/:leadId', marketingController.trackOpen)
router.get('/track/click/:campaignId/:leadId', marketingController.trackClick)

// Protected routes
router.use(authMiddleware)
router.get('/campaigns', marketingController.getCampaigns)
router.post('/campaigns', marketingController.createCampaign)
router.post('/campaigns/:id/send', marketingController.sendCampaign)
router.get('/config', marketingController.getConfig)
router.post('/config', marketingController.saveConfig)
router.post('/ai/generate-content', marketingController.generateAIContent)
router.post('/ai/generate-image', marketingController.generateAIImage)

module.exports = router

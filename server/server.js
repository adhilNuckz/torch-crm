require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const authRoutes = require('./src/routes/authRoutes.js')
const leadRoutes = require('./src/routes/leadRoutes.js')
const noteRoutes = require('./src/routes/noteRoutes.js')
const dashboardRoutes = require('./src/routes/dashboardRoutes.js')
const marketingRoutes = require('./src/routes/marketingRoutes.js')
const helpdeskRoutes = require('./src/routes/helpdeskRoutes.js')
const errorHandler = require('./src/middleware/errorHandler.js')

const app = express()

app.set('trust proxy', 1)
app.use(express.json())
app.use(helmet())
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
  }),
)

app.get('/api/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok' } })
})

app.use('/api/auth', authRoutes)
app.use('/api/leads', leadRoutes)
app.use('/api/notes', noteRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/marketing', marketingRoutes)
app.use('/api/helpdesk', helpdeskRoutes)

app.use(errorHandler)

const PORT = process.env.PORT || 5000

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      process.stdout.write(`Server running on port ${PORT}\n`)
    })
  })
  .catch((err) => {
    process.stderr.write(`Failed to connect to MongoDB: ${err.message}\n`)
  })

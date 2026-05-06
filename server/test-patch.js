const mongoose = require('mongoose')
const Lead = require('./src/models/Lead')
const User = require('./src/models/User')
const dotenv = require('dotenv')

dotenv.config()

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB')

    const lead = await Lead.findOne()
    if (!lead) {
      console.log('No leads found')
      process.exit(1)
    }

    console.log('Found lead:', lead._id, lead.status)
    
    const prevStatus = lead.status
    lead.status = 'Won'
    lead.activities.push({
      message: `Status changed: ${prevStatus} → Won`,
      createdBy: '69fb1d40d82ebf50af951c36', // admin user id
    })
    
    console.log('About to save...')
    await lead.save()
    console.log('Saved successfully')
    
    const updated = await Lead.findById(lead._id)
      .populate('assignedTo')
      .populate('activities.createdBy')
    
    console.log('Updated lead status:', updated.status)
    console.log('Activities count:', updated.activities.length)
    console.log('✅ PATCH fix works!')
    
    await mongoose.disconnect()
  } catch (err) {
    console.error('Error:', err.message)
    console.error('Stack:', err.stack)
    process.exit(1)
  }
}

test()

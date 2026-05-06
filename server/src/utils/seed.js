const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')
const User = require('../models/User.js')
const Lead = require('../models/Lead.js')
const Note = require('../models/Note.js')

dotenv.config()

const sources = ['Website', 'LinkedIn', 'Referral', 'Cold Email', 'Event', 'Other']
const statuses = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost']
const priorities = ['Low', 'Medium', 'High']

const sampleNames = [
  'Acme Corp',
  'Globex',
  'Initech',
  'Umbrella',
  'Stark Industries',
  'Wayne Enterprises',
  'Hooli',
  'Wonka Industries',
  'Oscorp',
  'Pied Piper',
]

const runSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    await Promise.all([User.deleteMany(), Lead.deleteMany(), Note.deleteMany()])

    const passwordHash = await bcrypt.hash('password123', 10)
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash,
      role: 'admin',
    })

    const leads = await Lead.insertMany(
      sampleNames.map((company, index) => {
        const status = statuses[index % statuses.length]
        return {
          leadName: `${company} Lead`,
          companyName: company,
          email: `contact${index + 1}@example.com`,
          phone: `555-010${index}`,
          leadSource: sources[index % sources.length],
          assignedTo: adminUser._id,
          status,
          dealValue: 5000 + index * 1500,
          priority: priorities[index % priorities.length],
          tags: index % 2 === 0 ? ['enterprise', 'vip'] : ['urgent'],
          nextFollowUp: new Date(Date.now() + (index - 3) * 86400000),
          activities: [
            {
              message: `Status set to ${status}`,
              createdBy: adminUser._id,
            },
          ],
        }
      }),
    )

    const notes = leads.flatMap((lead, index) => [
      {
        leadId: lead._id,
        createdBy: adminUser._id,
        content: `Initial outreach planned for ${lead.companyName}.`,
        noteType: 'Call',
      },
      {
        leadId: lead._id,
        createdBy: adminUser._id,
        content: `Follow-up email scheduled for lead ${index + 1}.`,
        noteType: 'Email',
      },
    ])

    await Note.insertMany(notes)

    process.stdout.write('Seed data created successfully.\n')
    await mongoose.disconnect()
  } catch (err) {
    process.stderr.write(`Seed failed: ${err.message}\n`)
    process.exit(1)
  }
}

runSeed()

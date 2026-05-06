const Note = require('../models/Note.js')
const Lead = require('../models/Lead.js')

const createNote = async (req, res, next) => {
  try {
    const { leadId, content, noteType } = req.body
    if (!leadId || !content) {
      return res.status(400).json({ success: false, message: 'Lead ID and content are required.' })
    }

    const lead = await Lead.findById(leadId).lean()
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found.' })
    }

    const note = await Note.create({
      leadId,
      content,
      noteType,
      createdBy: req.user.id,
    })

    const populated = await Note.findById(note._id)
      .populate('createdBy', 'name email role avatarUrl')
      .lean()

    return res.status(201).json({ success: true, data: populated })
  } catch (err) {
    return next(err)
  }
}

const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ leadId: req.params.leadId })
      .populate('createdBy', 'name email role avatarUrl')
      .sort({ createdAt: -1 })
      .lean()
    return res.json({ success: true, data: notes })
  } catch (err) {
    return next(err)
  }
}

const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id)
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found.' })
    }
    await note.deleteOne()
    return res.json({ success: true, data: { id: req.params.id } })
  } catch (err) {
    return next(err)
  }
}

module.exports = { createNote, getNotes, deleteNote }

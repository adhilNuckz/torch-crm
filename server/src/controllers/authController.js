const bcrypt = require('bcryptjs')
const User = require('../models/User.js')
const generateToken = require('../utils/generateToken.js')

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' })
    }

    const user = await User.findOne({ email: email.toLowerCase() }).lean()
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' })
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' })
    }

    const token = generateToken(user)
    return res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl || '',
        },
      },
    })
  } catch (err) {
    return next(err)
  }
}

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).lean()
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' })
    }
    return res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl || '',
      },
    })
  } catch (err) {
    return next(err)
  }
}

module.exports = { login, getMe }

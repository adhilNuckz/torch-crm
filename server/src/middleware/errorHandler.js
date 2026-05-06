const errorHandler = (err, req, res, next) => {
  console.error('Error caught by handler:', err.message)
  console.error('Stack:', err.stack)
  const statusCode = err.statusCode || 500
  const message = err.message || 'Server error.'
  res.status(statusCode).json({ success: false, message })
}

module.exports = errorHandler

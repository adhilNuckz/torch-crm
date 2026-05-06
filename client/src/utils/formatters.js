import { format, isValid, parseISO } from 'date-fns'

export const formatCurrency = (value) => {
  const amount = Number(value || 0)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export const formatDate = (dateValue, pattern = 'MMM dd, yyyy') => {
  if (!dateValue) return '—'
  const date = typeof dateValue === 'string' ? parseISO(dateValue) : dateValue
  if (!isValid(date)) return '—'
  return format(date, pattern)
}

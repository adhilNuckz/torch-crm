import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('crm_token')}` },
})

export const fetchTickets = async () => {
  const response = await axios.get(`${API_URL}/helpdesk/tickets`, getAuthHeader())
  return response.data
}

export const fetchTicketById = async (id) => {
  const response = await axios.get(`${API_URL}/helpdesk/tickets/${id}`, getAuthHeader())
  return response.data
}

export const replyToTicket = async (id, replyData) => {
  const response = await axios.post(`${API_URL}/helpdesk/tickets/${id}/reply`, replyData, getAuthHeader())
  return response.data
}

export const updateTicketStatus = async (id, status) => {
  const response = await axios.patch(`${API_URL}/helpdesk/tickets/${id}/status`, { status }, getAuthHeader())
  return response.data
}

export const createPublicTicket = async (ticketData) => {
  const response = await axios.post(`${API_URL}/helpdesk/public/tickets`, ticketData)
  return response.data
}

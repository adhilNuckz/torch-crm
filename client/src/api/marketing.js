import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('crm_token')}` },
})

export const fetchCampaigns = async () => {
  const response = await axios.get(`${API_URL}/marketing/campaigns`, getAuthHeader())
  return response.data
}

export const createCampaign = async (campaignData) => {
  const response = await axios.post(`${API_URL}/marketing/campaigns`, campaignData, getAuthHeader())
  return response.data
}

export const sendCampaign = async (id, targetStatus = 'All') => {
  const response = await axios.post(`${API_URL}/marketing/campaigns/${id}/send`, { targetStatus }, getAuthHeader())
  return response.data
}

export const fetchEmailConfig = async () => {
  const response = await axios.get(`${API_URL}/marketing/config`, getAuthHeader())
  return response.data
}

export const saveEmailConfig = async (configData) => {
  const response = await axios.post(`${API_URL}/marketing/config`, configData, getAuthHeader())
  return response.data
}

export const generateAIContent = async (data) => {
  const response = await axios.post(`${API_URL}/marketing/ai/generate-content`, data, getAuthHeader())
  return response.data
}

export const generateAIImage = async (data) => {
  const response = await axios.post(`${API_URL}/marketing/ai/generate-image`, data, getAuthHeader())
  return response.data
}

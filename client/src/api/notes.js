import api from './axios.js'

export const createNote = async (payload) => {
  const { data } = await api.post('/notes', payload)
  return data
}

export const fetchNotes = async (leadId) => {
  const { data } = await api.get(`/notes/${leadId}`)
  return data
}

export const deleteNote = async (id) => {
  const { data } = await api.delete(`/notes/${id}`)
  return data
}

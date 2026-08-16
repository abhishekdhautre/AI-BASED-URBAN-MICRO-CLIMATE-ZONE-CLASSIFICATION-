import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
})

export const predictLCZ = async (formData) => {
  const response = await api.post('/predict', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export const getHealth = async () => {
  const response = await api.get('/health')
  return response.data
}

export default api

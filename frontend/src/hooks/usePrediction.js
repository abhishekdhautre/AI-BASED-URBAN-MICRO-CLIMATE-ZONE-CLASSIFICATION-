import { useState, useCallback } from 'react'
import { predictLCZ } from '../services/api'

export const usePrediction = () => {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const predict = useCallback(async (file) => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const data = await predictLCZ(formData)
      setResult(data)
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Prediction failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  return { result, loading, error, predict, reset: () => { setResult(null); setError(null) } }
}

import { useCallback, useEffect, useState } from 'react'
import { fetchLeads } from '../api/leads.js'

export const useLeads = (initialParams = {}) => {
  const [params, setParams] = useState(initialParams)
  const [data, setData] = useState({ items: [], total: 0, page: 1, limit: 10 })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshIndex, setRefreshIndex] = useState(0)

  useEffect(() => {
    let isMounted = true
    const loadLeads = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetchLeads(params)
        if (!isMounted) return
        if (response?.success) {
          setData(response.data)
        } else {
          setError(response?.message || 'Failed to load leads.')
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.response?.data?.message || 'Failed to load leads.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }
    loadLeads()
    return () => {
      isMounted = false
    }
  }, [params, refreshIndex])

  const updateParams = useCallback((next) => {
    setParams((prev) => ({ ...prev, ...next }))
  }, [])

  const refetch = useCallback(() => {
    setRefreshIndex((prev) => prev + 1)
  }, [])

  return {
    params,
    data,
    isLoading,
    error,
    setParams: updateParams,
    refetch,
  }
}

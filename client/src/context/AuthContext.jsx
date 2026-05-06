import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchMe, loginRequest } from '../api/auth.js'
import { AuthContext } from './authContext.js'

export const AuthProvider = ({ children }) => {
  const cachedUser = localStorage.getItem('crm_user')
  const cachedToken = localStorage.getItem('crm_token')
  const [user, setUser] = useState(cachedUser ? JSON.parse(cachedUser) : null)
  const [isLoading, setIsLoading] = useState(Boolean(cachedToken))

  const persistAuth = useCallback((token, userData) => {
    localStorage.setItem('crm_token', token)
    localStorage.setItem('crm_user', JSON.stringify(userData))
    setUser(userData)
  }, [])

  const clearAuth = useCallback(() => {
    localStorage.removeItem('crm_token')
    localStorage.removeItem('crm_user')
    setUser(null)
  }, [])

  const login = useCallback(async (payload) => {
    const response = await loginRequest(payload)
    if (response?.success) {
      persistAuth(response.data.token, response.data.user)
    }
    return response
  }, [persistAuth])

  const logout = useCallback(() => {
    clearAuth()
  }, [clearAuth])

  useEffect(() => {
    if (!cachedToken) return

    fetchMe()
      .then((response) => {
        if (response?.success) {
          setUser(response.data)
          localStorage.setItem('crm_user', JSON.stringify(response.data))
        } else {
          clearAuth()
        }
      })
      .catch(() => {
        clearAuth()
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [cachedToken, clearAuth])

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

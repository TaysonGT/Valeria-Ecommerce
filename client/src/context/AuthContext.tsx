import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import type { AuthContextType, SignupDataType, UserType } from '../types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const authCookieOptions = {
  sameSite: 'lax' as const,
  secure: false,
}

const parseUserCookie = (cookieValue: string | undefined): UserType | null => {
  if (!cookieValue) return null
  try {
    return JSON.parse(decodeURIComponent(cookieValue))
  } catch {
    return null
  }
}

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [token, setToken] = useState<string | null>(Cookies.get('access_token') || null)
  const [user, setUser] = useState<UserType | null>(parseUserCookie(Cookies.get('current_user')))
  const [loading, setLoading] = useState<boolean>(true)

  const saveSession = (newToken: string, newUser: UserType) => {
    setToken(newToken)
    setUser(newUser)
    Cookies.set('access_token', newToken, authCookieOptions)
    Cookies.set('current_user', encodeURIComponent(JSON.stringify(newUser)), authCookieOptions)
  }

  const resetAuth = () => {
    setToken(null)
    setUser(null)
    Cookies.remove('access_token')
    Cookies.remove('current_user')
  }

  const checkAuth = async () => {
    const storedToken = Cookies.get('access_token')
    if (!storedToken) {
      resetAuth()
      setLoading(false)
      return
    }

    try {
      const response = await axios.get('/users/me')
      if (response.data?.success && response.data?.user) {
        saveSession(storedToken, response.data.user)
      } else {
        resetAuth()
      }
    } catch {
      resetAuth()
    } finally {
      setLoading(false)
    }
  }

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post('/users/auth/login', { username, password })
      if (response.data?.success && response.data?.token && response.data?.user) {
        saveSession(response.data.token, response.data.user)
        return response.data.user
      }
    } catch (error: any) {
      throw new Error(error.message || 'Unable to sign in')
    }
  }

  const loginWithGoogle = (newToken: string, newUser: UserType) => {
    saveSession(newToken, newUser)
  }

  const register = async (payload: SignupDataType) => {
    try {
      const response = await axios.post('/users/auth/register', payload)
      if (response.data?.success) {
        return response.data.user
      }
    } catch (error: any) {
      throw new Error(error.message || 'Unable to register')
    }
  }

  const logout = () => {
    resetAuth()
  }

  const refreshToken = () => {
    return checkAuth()
  }

  const refreshCurrentUser = () => {
    return checkAuth()
  }

  useEffect(() => {
    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      loginWithGoogle,
      register,
      logout,
      refreshCurrentUser,
      refreshToken,
      resetAuth,
      checkAuth,
    }),
    [user, token, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

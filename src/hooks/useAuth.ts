import { useEffect, useState } from 'react'
import axios from 'axios'
import { User } from '../types'

import { endpoints } from '../config'

const API_URL = endpoints.auth

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [userType, setUserType] = useState<'investor' | 'student' | 'startup' | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored token
    console.log('useAuth: Checking localStorage on mount...')
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    const storedUserType = localStorage.getItem('userType') as 'investor' | 'student' | 'startup'

    console.log('useAuth: Found in localStorage:', { token, storedUser, storedUserType })

    if (token && storedUser) {
      const parsedUser = JSON.parse(storedUser)
      console.log('useAuth: Setting user and userType:', { parsedUser, storedUserType })
      setUser(parsedUser)
      setUserType(storedUserType)
      // Optional: Verify token with backend /me endpoint
    } else {
      console.log('useAuth: No user found in localStorage')
    }
    setLoading(false)
    console.log('useAuth: Loading complete')
  }, [])

  const signIn = async (email: string, password: string, type: 'investor' | 'student' | 'startup') => {
    try {
      const { data } = await axios.post(API_URL.login, { email, password })

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('userType', type) // In real app, get type from user object

      setUser(data.user)
      setUserType(type)

      // Force page reload to show dashboard
      window.location.reload()

      return { error: null }
    } catch (err: any) {
      console.error('Login Error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: API_URL.login
      });
      return { error: err.response?.data?.error || err.message }
    }
  }

  const signUp = async (email: string, password: string, type: 'investor' | 'student' | 'startup') => {
    try {
      const { data } = await axios.post(API_URL.signup, { email, password, type })

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('userType', type)

      setUser(data.user)
      setUserType(type)

      // Force page reload to show dashboard
      window.location.reload()

      return { error: null }
    } catch (err: any) {
      console.error('Signup Error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: API_URL.signup
      });
      return { error: err.response?.data?.error || err.message }
    }
  }

  const signOut = async () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('userType')
    setUser(null)
    setUserType(null)

    // Force page reload to show login page
    window.location.reload()

    return { error: null }
  }

  return {
    user,
    userType,
    loading,
    signIn,
    signUp,
    signOut,
  }
}
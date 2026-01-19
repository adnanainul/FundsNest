import { useEffect, useState } from 'react'
import axios from 'axios'
import { Portfolio } from '../types'

const API_URL = 'http://localhost:5001/api/portfolio'

export function usePortfolio(userId: string | undefined) {
  const [portfolio, setPortfolio] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchPortfolio = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/${userId}`)
        setPortfolio(data || [])
        setError(null)
      } catch (err: any) {
        console.error('Error fetching portfolio:', err)
        setError(err.response?.data?.error || err.message)
        setPortfolio([])
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolio()
  }, [userId])

  const refetch = async () => {
    if (!userId) return

    setLoading(true)
    try {
      const { data } = await axios.get(`${API_URL}/${userId}`)
      setPortfolio(data || [])
      setError(null)
    } catch (err: any) {
      console.error('Error fetching portfolio:', err)
      setError(err.response?.data?.error || err.message)
      setPortfolio([])
    } finally {
      setLoading(false)
    }
  }

  return { portfolio, loading, error, refetch }
}
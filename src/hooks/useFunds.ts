import { useEffect, useState } from 'react'
import axios from 'axios'
import { Fund } from '../types'

import { endpoints } from '../config'

const API_URL = endpoints.funds

export function useFunds() {
  const [funds, setFunds] = useState<Fund[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFunds()
  }, [])

  const fetchFunds = async () => {
    try {
      const { data } = await axios.get(API_URL)
      setFunds(data || [])
    } catch (error) {
      console.error('Error fetching funds:', error)
    } finally {
      setLoading(false)
    }
  }

  return { funds, loading, refetch: fetchFunds }
}
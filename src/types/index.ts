export interface User {
  id: string
  email: string
  name?: string
  created_at: string
}

export interface Fund {
  id: string
  name: string
  symbol: string
  type: 'equity' | 'bond' | 'hybrid' | 'index'
  current_price: number
  previous_price: number
  description: string
  expense_ratio: number
  min_investment: number
  risk_level: 'low' | 'medium' | 'high'
  created_at: string
}

export interface Portfolio {
  id: string
  user_id: string
  fund_id: string
  shares: number
  purchase_price: number
  purchase_date: string
  fund?: Fund
}

export interface Transaction {
  id: string
  user_id: string
  fund_id: string
  type: 'buy' | 'sell'
  shares: number
  price_per_share: number
  total_amount: number
  transaction_date: string
  fund?: Fund
}

export interface Goal {
  id: string
  user_id: string
  title: string
  target_amount: number
  current_amount: number
  target_date: string
  status: 'active' | 'completed' | 'paused'
  created_at: string
}
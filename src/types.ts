// Type definitions for the FundsNest application

export interface User {
    id: string
    email: string
    name?: string
    type?: 'investor' | 'student' | 'startup'
    createdAt?: Date
}

export interface Fund {
    id: string
    name: string
    description?: string
    category?: string
    risk?: 'low' | 'medium' | 'high'
    returns?: number
    minInvestment?: number
    currentValue?: number
    change?: number
    allocation?: number
}

export interface Portfolio {
    id: string
    userId: string
    funds: Fund[]
    totalValue: number
    totalReturns: number
    lastUpdated: Date
}

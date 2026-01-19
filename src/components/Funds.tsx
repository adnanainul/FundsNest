import React, { useState } from 'react'
import { useFunds } from '../hooks/useFunds'
import { TrendingUp, TrendingDown, Search, Filter } from 'lucide-react'

export function Funds() {
  const { funds, loading } = useFunds()
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const filteredFunds = funds.filter(fund => {
    const matchesSearch = fund.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fund.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || fund.type === typeFilter
    return matchesSearch && matchesType
  })

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'high': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'equity': return 'text-blue-600 bg-blue-50'
      case 'bond': return 'text-green-600 bg-green-50'
      case 'hybrid': return 'text-purple-600 bg-purple-50'
      case 'index': return 'text-orange-600 bg-orange-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Funds</h1>
        <p className="text-gray-600">Discover and invest in top-performing funds</p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search funds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="all">All Types</option>
            <option value="equity">Equity</option>
            <option value="bond">Bond</option>
            <option value="hybrid">Hybrid</option>
            <option value="index">Index</option>
          </select>
        </div>
      </div>

      {/* Funds Grid */}
      <div className="grid gap-6">
        {filteredFunds.map((fund) => {
          const priceChange = fund.current_price - fund.previous_price
          const priceChangePercent = fund.previous_price > 0 ? (priceChange / fund.previous_price) * 100 : 0
          const isPositive = priceChange >= 0

          return (
            <div key={fund.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{fund.name}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600">{fund.symbol}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(fund.type)}`}>
                      {fund.type}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(fund.risk_level)}`}>
                      {fund.risk_level} risk
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">${fund.current_price.toFixed(2)}</p>
                  <div className={`flex items-center justify-end ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    <span className="font-medium">
                      {isPositive ? '+' : ''}${Math.abs(priceChange).toFixed(2)} ({priceChangePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{fund.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Expense Ratio</p>
                  <p className="font-semibold text-gray-900">{fund.expense_ratio}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Min Investment</p>
                  <p className="font-semibold text-gray-900">${fund.min_investment.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Risk Level</p>
                  <p className="font-semibold text-gray-900 capitalize">{fund.risk_level}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Invest Now
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  View Details
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {filteredFunds.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No funds found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
}
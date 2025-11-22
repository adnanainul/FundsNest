import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { usePortfolio } from '../hooks/usePortfolio'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

export function Portfolio() {
  const { user } = useAuth()
  const { portfolio, loading } = usePortfolio(user?.id)

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Portfolio</h1>
        <p className="text-gray-600">Track your fund investments and performance</p>
      </div>

      {portfolio.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No investments yet</h3>
          <p className="text-gray-600 mb-6">Start building your portfolio by exploring available funds</p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Explore Funds
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {portfolio.map((holding) => {
            const currentValue = (holding.fund?.current_price || 0) * holding.shares
            const investedValue = holding.purchase_price * holding.shares
            const gain = currentValue - investedValue
            const gainPercentage = investedValue > 0 ? (gain / investedValue) * 100 : 0
            const isPositive = gain >= 0

            return (
              <div key={holding.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{holding.fund?.name}</h3>
                    <p className="text-gray-600">{holding.fund?.symbol} • {holding.fund?.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      ${currentValue.toLocaleString()}
                    </p>
                    <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositive ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      <span className="font-medium">
                        {isPositive ? '+' : ''}${Math.abs(gain).toLocaleString()} ({gainPercentage.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-sm text-gray-600">Shares</p>
                    <p className="font-semibold text-gray-900">{holding.shares.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Price</p>
                    <p className="font-semibold text-gray-900">${holding.fund?.current_price?.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Purchase Price</p>
                    <p className="font-semibold text-gray-900">${holding.purchase_price.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Purchase Date</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(holding.purchase_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
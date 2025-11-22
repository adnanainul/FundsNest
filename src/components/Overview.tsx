import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { usePortfolio } from '../hooks/usePortfolio'
import { TrendingUp, TrendingDown, DollarSign, PieChart, Users, Building2, Lightbulb, Target, Award, Calendar } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie, BarChart, Bar, AreaChart, Area, RadialBarChart, RadialBar, Legend } from 'recharts'

const mockPerformanceData = [
  { month: 'Jan', portfolio: 12000, investments: 8000, returns: 1200 },
  { month: 'Feb', portfolio: 12500, investments: 9200, returns: 1350 },
  { month: 'Mar', portfolio: 11800, investments: 8800, returns: 980 },
  { month: 'Apr', portfolio: 13200, investments: 10500, returns: 1580 },
  { month: 'May', portfolio: 14100, investments: 11200, returns: 1750 },
  { month: 'Jun', portfolio: 15500, investments: 12800, returns: 2100 },
]

const mockAllocationData = [
  { name: 'Startups', value: 45, color: '#3B82F6', amount: 2250000 },
  { name: 'Student Ideas', value: 25, color: '#10B981', amount: 1250000 },
  { name: 'Growth Funds', value: 20, color: '#F59E0B', amount: 1000000 },
  { name: 'Safe Bonds', value: 10, color: '#8B5CF6', amount: 500000 },
]

const mockIndustryData = [
  { name: 'FinTech', value: 35, investments: 15, color: '#3B82F6' },
  { name: 'HealthTech', value: 28, investments: 12, color: '#10B981' },
  { name: 'CleanTech', value: 22, investments: 8, color: '#059669' },
  { name: 'EdTech', value: 15, investments: 5, color: '#8B5CF6' },
]

const mockActivityData = [
  { day: 'Mon', investments: 3, meetings: 2, reviews: 5 },
  { day: 'Tue', investments: 5, meetings: 4, reviews: 8 },
  { day: 'Wed', investments: 2, meetings: 3, reviews: 6 },
  { day: 'Thu', investments: 7, meetings: 5, reviews: 12 },
  { day: 'Fri', investments: 4, meetings: 3, reviews: 9 },
  { day: 'Sat', investments: 1, meetings: 1, reviews: 3 },
  { day: 'Sun', investments: 2, meetings: 0, reviews: 4 },
]

const mockGoalProgress = [
  { name: 'Q1 Target', value: 85, color: '#10B981' },
  { name: 'Annual Goal', value: 62, color: '#3B82F6' },
  { name: 'Portfolio Growth', value: 78, color: '#F59E0B' },
]

export function Overview() {
  const { user } = useAuth()
  const { portfolio, loading } = usePortfolio(user?.id)

  const totalValue = portfolio.reduce((sum, item) => {
    const currentValue = (item.fund?.current_price || 0) * item.shares
    return sum + currentValue
  }, 0)

  const totalInvested = portfolio.reduce((sum, item) => {
    return sum + (item.purchase_price * item.shares)
  }, 0)

  const totalGain = totalValue - totalInvested
  const gainPercentage = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0

  const stats = [
    {
      title: 'Total Portfolio Value',
      value: `$${(totalValue || 5000000).toLocaleString()}`,
      icon: DollarSign,
      change: `${gainPercentage >= 0 ? '+' : ''}${(gainPercentage || 12.5).toFixed(2)}%`,
      changeType: 'positive',
      trend: [65, 68, 72, 69, 75, 78, 82, 85, 88, 92, 89, 95]
    },
    {
      title: 'Active Investments',
      value: '42',
      icon: Building2,
      change: '+8 this month',
      changeType: 'positive',
      trend: [20, 25, 28, 32, 35, 38, 40, 42, 44, 46, 45, 42]
    },
    {
      title: 'Student Ideas Reviewed',
      value: '156',
      icon: Lightbulb,
      change: '+23 this week',
      changeType: 'positive',
      trend: [100, 110, 120, 125, 130, 135, 140, 145, 150, 152, 154, 156]
    },
    {
      title: 'ROI This Quarter',
      value: '+18.7%',
      icon: TrendingUp,
      change: 'Above target',
      changeType: 'positive',
      trend: [5, 8, 12, 15, 16, 17, 18, 18.5, 18.7, 18.9, 18.8, 18.7]
    }
  ]

  if (loading) {
    return (
      <div className="p-4 sm:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
      {/* Header with Gradient */}
      <div className="mb-6 sm:mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl sm:rounded-3xl opacity-10"></div>
        <div className="relative p-4 sm:p-8 text-center">
          <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Welcome back, {user?.email?.split('@')[0]}
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">Your investment dashboard with real-time insights</p>
        </div>
      </div>

      {/* Enhanced Stats Grid with Mini Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${
                  index === 0 ? 'bg-blue-100' : 
                  index === 1 ? 'bg-green-100' : 
                  index === 2 ? 'bg-purple-100' : 'bg-orange-100'
                }`}>
                  <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${
                    index === 0 ? 'text-blue-600' : 
                    index === 1 ? 'text-green-600' : 
                    index === 2 ? 'text-purple-600' : 'text-orange-600'
                  }`} />
                </div>
                <div className="w-16 sm:w-20 h-6 sm:h-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stat.trend.map((value, i) => ({ value, index: i }))}>
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke={index === 0 ? '#3B82F6' : index === 1 ? '#10B981' : index === 2 ? '#8B5CF6' : '#F59E0B'} 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <span className={`text-xs sm:text-sm font-medium px-2 py-1 rounded-full ${
                  stat.changeType === 'positive' 
                    ? 'text-green-600 bg-green-50' 
                    : 'text-red-600 bg-red-50'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
        {/* Portfolio Performance with Area Chart */}
        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-0">Portfolio Performance</h2>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs sm:text-sm font-medium">Portfolio</span>
              <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs sm:text-sm font-medium">Investments</span>
              <span className="px-2 sm:px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs sm:text-sm font-medium">Returns</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={mockPerformanceData}>
              <defs>
                <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="investmentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                  fontSize: '14px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="portfolio" 
                stroke="#3B82F6" 
                strokeWidth={3}
                fill="url(#portfolioGradient)"
              />
              <Area 
                type="monotone" 
                dataKey="investments" 
                stroke="#10B981" 
                strokeWidth={3}
                fill="url(#investmentGradient)"
              />
              <Line 
                type="monotone" 
                dataKey="returns" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Goal Progress with Radial Charts */}
        <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Goal Progress</h2>
          <div className="space-y-4 sm:space-y-6">
            {mockGoalProgress.map((goal, index) => (
              <div key={index} className="relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-700">{goal.name}</span>
                  <span className="text-xs sm:text-sm font-bold text-gray-900">{goal.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                  <div 
                    className="h-2 sm:h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${goal.value}%`,
                      background: `linear-gradient(90deg, ${goal.color}, ${goal.color}dd)`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100">
            <ResponsiveContainer width="100%" height={120}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="80%" data={mockGoalProgress}>
                <RadialBar dataKey="value" cornerRadius={10} fill="#3B82F6" />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
        {/* Asset Allocation with Enhanced Pie Chart */}
        <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Investment Allocation</h2>
          <div className="flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-1/2 mb-4 lg:mb-0">
              <ResponsiveContainer width="100%" height={200}>
                <RechartsPieChart>
                  <Pie
                    data={mockAllocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {mockAllocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full lg:w-1/2 lg:pl-4">
              <div className="space-y-3 sm:space-y-4">
                {mockAllocationData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 sm:w-4 sm:h-4 rounded-full mr-2 sm:mr-3"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-xs sm:text-sm font-medium text-gray-700">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs sm:text-sm font-bold text-gray-900">{item.value}%</p>
                      <p className="text-xs text-gray-500">${(item.amount / 1000000).toFixed(1)}M</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Industry Distribution */}
        <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Industry Focus</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={mockIndustryData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" stroke="#6b7280" fontSize={12} />
              <YAxis dataKey="name" type="category" stroke="#6b7280" width={60} fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Weekly Activity</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={mockActivityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                fontSize: '12px'
              }}
            />
            <Bar dataKey="investments" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="meetings" fill="#10B981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="reviews" fill="#F59E0B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        
        <div className="flex justify-center gap-4 sm:gap-6 mt-4">
          <div className="flex items-center">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-xs sm:text-sm text-gray-600">Investments</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-xs sm:text-sm text-gray-600">Meetings</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-xs sm:text-sm text-gray-600">Reviews</span>
          </div>
        </div>
      </div>
    </div>
  )
}
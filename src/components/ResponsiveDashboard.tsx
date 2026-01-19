import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { usePortfolio } from '../hooks/usePortfolio'
import { TrendingUp, DollarSign, Building2, Lightbulb, Users, Target, BarChart3, PieChart, Activity, Smartphone, Tablet, Monitor } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie, BarChart, Bar, AreaChart, Area } from 'recharts'

const mockData = {
  performance: [
    { month: 'Jan', portfolio: 12000, investments: 8000, returns: 1200 },
    { month: 'Feb', portfolio: 12500, investments: 9200, returns: 1350 },
    { month: 'Mar', portfolio: 11800, investments: 8800, returns: 980 },
    { month: 'Apr', portfolio: 13200, investments: 10500, returns: 1580 },
    { month: 'May', portfolio: 14100, investments: 11200, returns: 1750 },
    { month: 'Jun', portfolio: 15500, investments: 12800, returns: 2100 },
  ],
  allocation: [
    { name: 'Startups', value: 45, color: '#3B82F6', amount: 2250000 },
    { name: 'Student Ideas', value: 25, color: '#10B981', amount: 1250000 },
    { name: 'Growth Funds', value: 20, color: '#F59E0B', amount: 1000000 },
    { name: 'Safe Bonds', value: 10, color: '#8B5CF6', amount: 500000 },
  ]
}

export function ResponsiveDashboard() {
  const { user } = useAuth()
  const { portfolio, loading } = usePortfolio(user?.id)

  const stats = [
    {
      title: 'Portfolio Value',
      value: '$5,000,000',
      icon: DollarSign,
      change: '+12.5%',
      changeType: 'positive',
      color: 'blue'
    },
    {
      title: 'Active Investments',
      value: '42',
      icon: Building2,
      change: '+8 this month',
      changeType: 'positive',
      color: 'green'
    },
    {
      title: 'Student Ideas',
      value: '156',
      icon: Lightbulb,
      change: '+23 this week',
      changeType: 'positive',
      color: 'purple'
    },
    {
      title: 'ROI Quarter',
      value: '+18.7%',
      icon: TrendingUp,
      change: 'Above target',
      changeType: 'positive',
      color: 'orange'
    }
  ]

  if (loading) {
    return (
      <div className="p-4 sm:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
    <>
      {/* Mobile Dashboard Layout (< 768px) */}
      <div className="block md:hidden p-4 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
        {/* Mobile Header */}
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Smartphone className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-sm text-gray-600">Mobile Dashboard</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome, {user?.email?.split('@')[0]}
          </h1>
        </div>

        {/* Mobile Stats - Vertical Stack */}
        <div className="space-y-4 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${stat.color}-100`}>
                      <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">{stat.title}</p>
                      <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium px-3 py-1 rounded-full bg-green-50 text-green-600">
                    {stat.change}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Mobile Chart - Simplified */}
        <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Portfolio Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={mockData.performance}>
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="portfolio" stroke="#3B82F6" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Mobile Allocation - Simplified List */}
        <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Investment Allocation</h3>
          <div className="space-y-3">
            {mockData.allocation.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{item.value}%</p>
                  <p className="text-xs text-gray-500">${(item.amount / 1000000).toFixed(1)}M</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tablet Dashboard Layout (768px - 1023px) */}
      <div className="hidden md:block lg:hidden p-6 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
        {/* Tablet Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-2">
            <Tablet className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-sm text-gray-600">Tablet Dashboard</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome back, {user?.email?.split('@')[0]}
          </h1>
        </div>

        {/* Tablet Stats - 2x2 Grid */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-${stat.color}-100`}>
                    <Icon className={`h-7 w-7 text-${stat.color}-600`} />
                  </div>
                  <div className="w-20 h-10 bg-gray-100 rounded-lg"></div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <span className="text-sm font-medium px-3 py-1 rounded-full bg-green-50 text-green-600">
                    {stat.change}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Tablet Charts - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Portfolio Performance */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Portfolio Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mockData.performance}>
                <defs>
                  <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="portfolio" stroke="#3B82F6" fill="url(#portfolioGradient)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Investment Allocation */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Investment Allocation</h3>
            <div className="flex items-center justify-center mb-6">
              <ResponsiveContainer width="100%" height={200}>
                <RechartsPieChart>
                  <Pie
                    data={mockData.allocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {mockData.allocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {mockData.allocation.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{item.value}%</p>
                    <p className="text-xs text-gray-500">${(item.amount / 1000000).toFixed(1)}M</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Dashboard Layout (>= 1024px) */}
      <div className="hidden lg:block p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
        {/* Desktop Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <Monitor className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm text-gray-600">Desktop Dashboard</span>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome back, {user?.email?.split('@')[0]}
              </h1>
              <p className="text-gray-600 text-lg">Your comprehensive investment overview</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Last updated</p>
              <p className="text-lg font-semibold text-gray-900">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Desktop Stats - 4 Column Grid */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${stat.color}-100`}>
                    <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                  <div className="w-20 h-8">
                    <div className="w-full h-full bg-gradient-to-r from-blue-100 to-purple-100 rounded"></div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <span className="text-sm font-medium px-2 py-1 rounded-full bg-green-50 text-green-600">
                    {stat.change}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Desktop Main Charts Grid */}
        <div className="grid grid-cols-3 gap-8 mb-8">
          {/* Portfolio Performance - Large */}
          <div className="col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Portfolio Performance</h2>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">Portfolio</span>
                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">Investments</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">Returns</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={mockData.performance}>
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
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area type="monotone" dataKey="portfolio" stroke="#3B82F6" fill="url(#portfolioGradient)" strokeWidth={3} />
                <Area type="monotone" dataKey="investments" stroke="#10B981" fill="url(#investmentGradient)" strokeWidth={3} />
                <Line type="monotone" dataKey="returns" stroke="#8B5CF6" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Investment Allocation */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Investment Allocation</h2>
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPieChart>
                <Pie
                  data={mockData.allocation}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {mockData.allocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value}%`, name]} />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="space-y-4 mt-4">
              {mockData.allocation.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{item.value}%</p>
                    <p className="text-xs text-gray-500">${(item.amount / 1000000).toFixed(1)}M</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Secondary Charts */}
        <div className="grid grid-cols-2 gap-8">
          {/* Activity Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Weekly Activity</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { day: 'Mon', investments: 3, meetings: 2, reviews: 5 },
                { day: 'Tue', investments: 5, meetings: 4, reviews: 8 },
                { day: 'Wed', investments: 2, meetings: 3, reviews: 6 },
                { day: 'Thu', investments: 7, meetings: 5, reviews: 12 },
                { day: 'Fri', investments: 4, meetings: 3, reviews: 9 },
                { day: 'Sat', investments: 1, meetings: 1, reviews: 3 },
                { day: 'Sun', investments: 2, meetings: 0, reviews: 4 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="investments" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="meetings" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="reviews" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Goal Progress */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Goal Progress</h2>
            <div className="space-y-6">
              {[
                { name: 'Q1 Target', value: 85, color: '#10B981' },
                { name: 'Annual Goal', value: 62, color: '#3B82F6' },
                { name: 'Portfolio Growth', value: 78, color: '#F59E0B' },
              ].map((goal, index) => (
                <div key={index} className="relative">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">{goal.name}</span>
                    <span className="text-sm font-bold text-gray-900">{goal.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${goal.value}%`,
                        background: `linear-gradient(90deg, ${goal.color}, ${goal.color}dd)`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
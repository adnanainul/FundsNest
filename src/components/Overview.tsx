import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { TrendingUp, DollarSign, Building2, Lightbulb } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { CallList } from './CallList'

import { endpoints } from '../config';

export function Overview() {
  const { user } = useAuth()
  const [profile, setProfile] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return
      try {
        const response = await fetch(`${endpoints.investor}/profile/${user.id}`)
        const data = await response.json()
        setProfile(data)
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [user])

  const totalInvested = profile?.portfolio?.reduce((sum: number, item: any) => sum + (item.investedAmount || 0), 0) || 0
  const avgROI = profile?.portfolio?.reduce((sum: number, item: any) => sum + (item.returnOnInvestment || 0), 0) / (profile?.portfolio?.length || 1) || 0
  const activeInvestments = profile?.portfolio?.length || 0
  const totalValue = totalInvested * (1 + avgROI / 100)

  const stats = [
    {
      title: 'Total Portfolio Value',
      value: `$${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      icon: DollarSign,
      change: `${avgROI >= 0 ? '+' : ''}${avgROI.toFixed(1)}%`,
      changeType: avgROI >= 0 ? 'positive' : 'negative',
      trend: [65, 68, 72, 69, 75, 78, 82, 85, 88, 92, 89, 95]
    },
    {
      title: 'Active Investments',
      value: activeInvestments.toString(),
      icon: Building2,
      change: 'Based on profile',
      changeType: 'neutral',
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
      title: 'Avg ROI',
      value: `${avgROI.toFixed(1)}%`,
      icon: TrendingUp,
      change: 'Portfolio Average',
      changeType: 'positive',
      trend: [5, 8, 12, 15, 16, 17, 18, 18.5, 18.7, 18.9, 18.8, 18.7]
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
        <p className="text-gray-600">Here's what's happening with your portfolio today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.changeType === 'positive' ? 'bg-green-50 text-green-600' :
                  stat.changeType === 'negative' ? 'bg-red-50 text-red-600' :
                    'bg-blue-50 text-blue-600'
                  }`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' :
                  stat.changeType === 'negative' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Portfolio Performance Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Portfolio Performance</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats[0].trend.map((val, i) => ({ name: `Month ${i + 1}`, value: val }))}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Upcoming Calls */}
          <CallList />
        </div>

        <div className="space-y-8">
          {/* Recent Activity or other widgets can go here */}
        </div>
      </div>
    </div>
  )
}
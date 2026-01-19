import React, { useState } from 'react'
import { Building2, Plus, Edit3, Trash2, Eye, TrendingUp, Users, DollarSign } from 'lucide-react'

// Mock startup data
const mockStartup = {
  id: '1',
  name: 'EcoTech Solutions',
  tagline: 'Sustainable technology for a greener future',
  description: 'We develop innovative clean energy solutions and smart grid technologies to reduce carbon footprint and promote sustainable living.',
  industry: 'CleanTech',
  stage: 'Series A',
  location: 'San Francisco, CA',
  founded: '2021',
  employees: '25-50',
  website: 'https://ecotech-solutions.com',
  fundingRaised: 2500000,
  fundingGoal: 5000000,
  valuation: 15000000,
  revenue: 500000,
  growth: 150,
  customers: 50,
  status: 'active',
  views: 1250,
  inquiries: 23,
  lastUpdated: '2024-01-20'
}

export function MyStartup() {
  const [startup, setStartup] = useState(mockStartup)
  const [isEditing, setIsEditing] = useState(false)

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    }
    return `$${(amount / 1000).toFixed(0)}K`
  }

  const fundingProgress = (startup.fundingRaised / startup.fundingGoal) * 100

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Startup</h1>
          <p className="text-gray-600">Manage your startup profile and track investor interest</p>
        </div>
        
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center"
        >
          <Edit3 className="h-5 w-5 mr-2" />
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      <div className="grid gap-8">
        {/* Main Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 px-8 py-12 text-white rounded-t-xl">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-6">
                <Building2 className="h-10 w-10" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">{startup.name}</h2>
                <p className="text-green-100 text-lg">{startup.tagline}</p>
                <p className="text-green-200">{startup.industry} • {startup.stage}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Valuation</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(startup.valuation)}</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(startup.revenue)}</p>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg text-center">
                <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Customers</p>
                <p className="text-2xl font-bold text-gray-900">{startup.customers}</p>
              </div>
              
              <div className="bg-orange-50 p-6 rounded-lg text-center">
                <Eye className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Profile Views</p>
                <p className="text-2xl font-bold text-gray-900">{startup.views}</p>
              </div>
            </div>

            {/* Funding Progress */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">Funding Progress</span>
                <span className="text-sm text-gray-600">
                  {formatCurrency(startup.fundingRaised)} of {formatCurrency(startup.fundingGoal)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(fundingProgress, 100)}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">{fundingProgress.toFixed(1)}% funded</p>
            </div>

            {/* Company Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    {isEditing ? (
                      <textarea
                        value={startup.description}
                        onChange={(e) => setStartup({...startup, description: e.target.value})}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-700">{startup.description}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                      {isEditing ? (
                        <select
                          value={startup.industry}
                          onChange={(e) => setStartup({...startup, industry: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="FinTech">FinTech</option>
                          <option value="HealthTech">HealthTech</option>
                          <option value="CleanTech">CleanTech</option>
                          <option value="EdTech">EdTech</option>
                        </select>
                      ) : (
                        <p className="text-gray-700">{startup.industry}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                      {isEditing ? (
                        <select
                          value={startup.stage}
                          onChange={(e) => setStartup({...startup, stage: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="Seed">Seed</option>
                          <option value="Pre-Series A">Pre-Series A</option>
                          <option value="Series A">Series A</option>
                          <option value="Series B">Series B</option>
                        </select>
                      ) : (
                        <p className="text-gray-700">{startup.stage}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Recent Activity</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Profile Views (30 days):</span>
                        <span className="font-medium">{startup.views}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Investor Inquiries:</span>
                        <span className="font-medium">{startup.inquiries}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Growth Rate:</span>
                        <span className="font-medium text-green-600">+{startup.growth}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Funding Status</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-600">Raised:</span>
                        <span className="font-medium text-blue-900">{formatCurrency(startup.fundingRaised)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-600">Goal:</span>
                        <span className="font-medium text-blue-900">{formatCurrency(startup.fundingGoal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-600">Remaining:</span>
                        <span className="font-medium text-blue-900">{formatCurrency(startup.fundingGoal - startup.fundingRaised)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Update Profile</h3>
            <p className="text-gray-600 mb-4">Keep your startup information current</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Edit Details
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">View Analytics</h3>
            <p className="text-gray-600 mb-4">Track your profile performance</p>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              View Stats
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Find Investors</h3>
            <p className="text-gray-600 mb-4">Connect with potential investors</p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Browse Investors
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
import React, { useState } from 'react'
import { Building2, Mail, MapPin, Calendar, Users, DollarSign, Edit3, Save, X, TrendingUp } from 'lucide-react'

export function StartupProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: 'EcoTech Solutions',
    tagline: 'Sustainable technology for a greener future',
    description: 'We develop innovative clean energy solutions and smart grid technologies to reduce carbon footprint and promote sustainable living.',
    industry: 'CleanTech',
    stage: 'Series A',
    location: 'San Francisco, CA',
    founded: '2021',
    employees: '25-50',
    website: 'https://ecotech-solutions.com',
    email: 'contact@ecotech-solutions.com',
    fundingRaised: 2500000,
    fundingGoal: 5000000,
    valuation: 15000000,
    revenue: 500000,
    growth: 150,
    customers: 50,
    businessModel: 'SaaS subscription for smart grid management and B2B sales of IoT devices',
    targetMarket: 'Utility companies, smart cities, and environmentally conscious businesses',
    uniqueValue: 'First integrated platform combining IoT sensors, AI analytics, and carbon tracking',
    competition: 'Tesla Energy, Sunrun, Enphase',
    achievements: ['Y Combinator Graduate', 'TechCrunch Disrupt Winner', 'Green Tech Award 2023'],
    team: [
      { name: 'Sarah Chen', role: 'CEO', background: 'Former Tesla Engineer' },
      { name: 'Mike Rodriguez', role: 'CTO', background: 'Ex-Google AI Researcher' }
    ]
  })

  const handleSave = () => {
    setIsEditing(false)
    // In a real app, this would save to the database
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    }
    return `$${(amount / 1000).toFixed(0)}K`
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 px-8 py-12 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-24 h-24 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-6">
                  <Building2 className="h-12 w-12" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{profile.name}</h1>
                  <p className="text-green-100 text-lg">{profile.tagline}</p>
                  <p className="text-green-200">{profile.industry} • {profile.stage}</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors flex items-center"
              >
                {isEditing ? <X className="h-5 w-5 mr-2" /> : <Edit3 className="h-5 w-5 mr-2" />}
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          <div className="p-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Valuation</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(profile.valuation)}</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(profile.revenue)}</p>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg text-center">
                <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Customers</p>
                <p className="text-2xl font-bold text-gray-900">{profile.customers}</p>
              </div>
              
              <div className="bg-orange-50 p-6 rounded-lg text-center">
                <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Growth Rate</p>
                <p className="text-2xl font-bold text-gray-900">+{profile.growth}%</p>
              </div>
            </div>

            {/* Company Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Company Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.tagline}
                      onChange={(e) => setProfile({...profile, tagline: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.tagline}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                  {isEditing ? (
                    <select
                      value={profile.industry}
                      onChange={(e) => setProfile({...profile, industry: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="FinTech">FinTech</option>
                      <option value="HealthTech">HealthTech</option>
                      <option value="CleanTech">CleanTech</option>
                      <option value="EdTech">EdTech</option>
                      <option value="Enterprise">Enterprise</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{profile.industry}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Funding Stage</label>
                  {isEditing ? (
                    <select
                      value={profile.stage}
                      onChange={(e) => setProfile({...profile, stage: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="Seed">Seed</option>
                      <option value="Pre-Series A">Pre-Series A</option>
                      <option value="Series A">Series A</option>
                      <option value="Series B">Series B</option>
                      <option value="Series C">Series C</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{profile.stage}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setProfile({...profile, location: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      {profile.location}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Founded</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.founded}
                      onChange={(e) => setProfile({...profile, founded: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      {profile.founded}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Team Size</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.employees}
                      onChange={(e) => setProfile({...profile, employees: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 flex items-center">
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      {profile.employees}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={profile.website}
                      onChange={(e) => setProfile({...profile, website: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                      {profile.website}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Company Description</h2>
              {isEditing ? (
                <textarea
                  value={profile.description}
                  onChange={(e) => setProfile({...profile, description: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-700">{profile.description}</p>
              )}
            </div>

            {/* Business Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Model</h3>
                {isEditing ? (
                  <textarea
                    value={profile.businessModel}
                    onChange={(e) => setProfile({...profile, businessModel: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-700">{profile.businessModel}</p>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Target Market</h3>
                {isEditing ? (
                  <textarea
                    value={profile.targetMarket}
                    onChange={(e) => setProfile({...profile, targetMarket: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-700">{profile.targetMarket}</p>
                )}
              </div>
            </div>

            {/* Team */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Leadership Team</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.team.map((member, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900">{member.name}</h4>
                    <p className="text-sm text-gray-600">{member.role}</p>
                    <p className="text-sm text-gray-500">{member.background}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Achievements</h2>
              <div className="flex flex-wrap gap-2">
                {profile.achievements.map((achievement, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium"
                  >
                    {achievement}
                  </span>
                ))}
              </div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
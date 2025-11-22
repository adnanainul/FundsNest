import React, { useState } from 'react';
import { Users, DollarSign, TrendingUp, MapPin, Star, Filter, Search, Award, Target, Video, MessageCircle, Phone } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { CommunicationModal, Participant } from './CommunicationModal';

// Mock investor data with enhanced details and corrected data
const mockInvestors = [
  {
    id: '1',
    name: 'Shaikshavalli',
    type: 'Crypto Investment',
    avatar: 'https://t4.ftcdn.net/jpg/11/78/23/11/360_F_1178231104_BAINhFQQBmJz42BIaOz9sYwp6yupK8YV.jpg',
    company: 'SSV Ventures',
    location: 'Delhi, India',
    totalInvestments: 45,
    totalInvested: 12500000,
    averageInvestment: 275000,
    successfulExits: 8,
    rating: 4.9,
    focusAreas: ['FinTech', 'HealthTech', 'AI/ML'],
    investmentRange: { min: 50000, max: 500000 },
    portfolio: [
      { name: 'TechCorp', industry: 'FinTech', investment: 300000, status: 'Active', roi: 250 },
      { name: 'HealthAI', industry: 'HealthTech', investment: 200000, status: 'Exited', roi: 400 },
      { name: 'EcoTech', industry: 'CleanTech', investment: 150000, status: 'Active', roi: 180 }
    ],
    investmentHistory: [
      { year: '2020', amount: 1200000 },
      { year: '2021', amount: 2800000 },
      { year: '2022', amount: 3500000 },
      { year: '2023', amount: 4200000 },
      { year: '2024', amount: 800000 }
    ],
    bio: '15+ Years of Experience and Former member of Google.',
    achievements: ['Top 50 Angel Investors 2023', 'Forbes 40 Under 40', 'Best Investor of the Year'],
    availability: 'Actively Investing',
    communicationPrefs: {
      video: true,
      messaging: true,
      phone: true,
      email: true
    },
    responseTime: '< 24 hours',
    meetingAvailability: 'Mon-Fri 9AM-5PM PST'
  },
  {
    id: '2',
    name: 'Tarun',
    type: 'Venture Capitalist',
    avatar: 'https://t3.ftcdn.net/jpg/12/69/34/12/360_F_1269341294_197TzH7Qx3z3pVIo3VO2qKhpNUxK26NP.jpg',
    company: 'Innovation Capital',
    location: 'Chennai, India',
    totalInvestments: 32,
    totalInvested: 25000000,
    averageInvestment: 780000,
    successfulExits: 12,
    rating: 4.8,
    focusAreas: ['Enterprise Software', 'Cybersecurity', 'DevTools'],
    investmentRange: { min: 250000, max: 2000000 },
    portfolio: [
      { name: 'SecureNet', industry: 'Cybersecurity', investment: 1500000, status: 'Active', roi: 320 },
      { name: 'DevFlow', industry: 'DevTools', investment: 800000, status: 'Active', roi: 180 },
      { name: 'CloudSync', industry: 'Enterprise', investment: 1200000, status: 'Exited', roi: 450 }
    ],
    investmentHistory: [
      { year: '2020', amount: 3200000 },
      { year: '2021', amount: 5800000 },
      { year: '2022', amount: 7500000 },
      { year: '2023', amount: 6200000 },
      { year: '2024', amount: 2300000 }
    ],
    bio: 'Managing Partner at Innovation Capital with expertise in B2B software and enterprise solutions. Former CTO at Microsoft.',
    achievements: ['Midas List 2023', 'Best VC Investor Award', 'Tech Innovation Leader'],
    availability: 'Selective Investing',
    communicationPrefs: {
      video: true,
      messaging: true,
      phone: false,
      email: true
    },
    responseTime: '< 48 hours',
    meetingAvailability: 'Tue-Thu 10AM-4PM EST'
  },
  {
    id: '3',
    name: 'Nikhil',
    type: 'Corporate Investor',
    avatar: 'https://t3.ftcdn.net/jpg/04/33/28/48/360_F_433284834_pmi4jWJDOmRWQKmtAEQhZKarr8PaCvLr.jpg',
    company: 'Google Ventures',
    location: 'Mumbai, India',
    totalInvestments: 28,
    totalInvested: 18000000,
    averageInvestment: 640000,
    successfulExits: 6,
    rating: 4.7,
    focusAreas: ['AI/ML', 'Consumer Tech', 'Mobile Apps'],
    investmentRange: { min: 100000, max: 1500000 },
    portfolio: [
      { name: 'SmartHome', industry: 'IoT', investment: 900000, status: 'Active', roi: 220 },
      { name: 'FoodTech', industry: 'Consumer', investment: 600000, status: 'Active', roi: 150 },
      { name: 'MobileFirst', industry: 'Mobile', investment: 750000, status: 'Exited', roi: 380 }
    ],
    investmentHistory: [
      { year: '2020', amount: 2100000 },
      { year: '2021', amount: 4200000 },
      { year: '2022', amount: 5800000 },
      { year: '2023', amount: 4500000 },
      { year: '2024', amount: 1400000 }
    ],
    bio: 'Principal at Google Ventures focusing on consumer technology and AI applications. Former product manager at Facebook.',
    achievements: ['Top Corporate Investor', 'AI Innovation Award', 'Women in VC Leadership'],
    availability: 'Actively Investing',
    communicationPrefs: {
      video: true,
      messaging: true,
      phone: true,
      email: true
    },
    responseTime: '< 12 hours',
    meetingAvailability: 'Mon-Fri 8AM-6PM PST'
  }
];

const industryColors = {
  'FinTech': '#3B82F6',
  'HealthTech': '#10B981',
  'CleanTech': '#059669',
  'AI/ML': '#8B5CF6',
  'Cybersecurity': '#EF4444',
  'DevTools': '#F59E0B',
  'Enterprise': '#6366F1',
  'IoT': '#EC4899',
  'Consumer': '#14B8A6',
  'Mobile': '#F97316'
};

export function InvestorProfiles() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [focusFilter, setFocusFilter] = useState('all');
  const [selectedInvestor, setSelectedInvestor] = useState<any>(null);
  const [showCommunicationModal, setShowCommunicationModal] = useState(false);
  const [commParticipant, setCommParticipant] = useState<Participant | null>(null);
  const [commRoomId, setCommRoomId] = useState<string>('');
  const [commMode, setCommMode] = useState<'video' | 'chat' | 'schedule' | 'email'>('video');

  const filteredInvestors = mockInvestors.filter(investor => {
    const matchesSearch = investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investor.focusAreas.some(area => area.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'all' || investor.type === typeFilter;
    const matchesFocus = focusFilter === 'all' || investor.focusAreas.includes(focusFilter);
    return matchesSearch && matchesType && matchesFocus;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Angel Investor': return 'text-blue-600 bg-blue-50';
      case 'Venture Capitalist': return 'text-purple-600 bg-purple-50';
      case 'Corporate Investor': return 'text-green-600 bg-green-50';
      case 'Crypto Investment': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Actively Investing': return 'text-green-600 bg-green-50';
      case 'Selective Investing': return 'text-yellow-600 bg-yellow-50';
      case 'Not Investing': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${(amount / 1000).toFixed(0)}K`;
  };

  const openCommunication = (investor: any, mode: 'video' | 'chat' | 'schedule' | 'email') => {
    const room = `investor:${investor.id}`;
    setCommParticipant({
      name: investor.name,
      avatar: investor.avatar,
      email: `${investor.name.toLowerCase().replace(' ', '.')}@${investor.company.toLowerCase().replace(' ', '')}.com`,
      availability: investor.meetingAvailability
    });
    setCommRoomId(room);
    setCommMode(mode);
    setShowCommunicationModal(true);
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Investor Network
        </h1>
        <p className="text-gray-600 text-lg">Connect with top investors and explore their investment portfolios</p>
      </div>

      {/* Enhanced Filters */}
      <div className="mb-8 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search investors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Types</option>
                <option value="Angel Investor">Angel Investor</option>
                <option value="Venture Capitalist">Venture Capitalist</option>
                <option value="Corporate Investor">Corporate Investor</option>
                <option value="Crypto Investment">Crypto Investment</option>
              </select>
            </div>

            <select
              value={focusFilter}
              onChange={(e) => setFocusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Focus Areas</option>
              <option value="FinTech">FinTech</option>
              <option value="HealthTech">HealthTech</option>
              <option value="AI/ML">AI/ML</option>
              <option value="CleanTech">CleanTech</option>
            </select>
          </div>
        </div>
      </div>

      {/* Enhanced Investor Cards Grid */}
      <div className="grid gap-8">
        {filteredInvestors.map((investor) => (
          <div key={investor.id} className="bg-white rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
            {/* Gradient Header */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6">
              <div className="flex items-start justify-between text-white">
                <div className="flex items-center">
                  <div className="relative">
                    <img
                      src={investor.avatar}
                      alt={investor.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white ${investor.availability === 'Actively Investing' ? 'bg-green-500' :
                        investor.availability === 'Selective Investing' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-2xl font-bold mb-1">{investor.name}</h3>
                    <p className="text-blue-100 text-lg mb-2">{investor.company}</p>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium">
                        {investor.type}
                      </span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-300 mr-1" />
                        <span className="text-sm font-medium">{investor.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-3xl font-bold">{formatCurrency(investor.totalInvested)}</p>
                  <p className="text-blue-100">Total Invested</p>
                  <p className="text-sm text-blue-200 mt-1">{investor.totalInvestments} investments</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">{investor.bio}</p>

              {/* Enhanced Key Metrics with Charts */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl text-center">
                  <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-1">Avg Investment</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(investor.averageInvestment)}</p>
                  <div className="mt-2 h-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={investor.investmentHistory.slice(-4)}>
                        <Line type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl text-center">
                  <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-1">Successful Exits</p>
                  <p className="text-xl font-bold text-gray-900">{investor.successfulExits}</p>
                  <p className="text-sm text-green-600 font-medium mt-1">
                    {((investor.successfulExits / investor.totalInvestments) * 100).toFixed(0)}% success rate
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl text-center">
                  <Target className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-1">Investment Range</p>
                  <p className="text-sm font-bold text-gray-900">
                    {formatCurrency(investor.investmentRange.min)} - {formatCurrency(investor.investmentRange.max)}
                  </p>
                  <p className="text-xs text-purple-600 mt-1">Per round</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl text-center">
                  <MapPin className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-1">Location</p>
                  <p className="text-sm font-bold text-gray-900">{investor.location}</p>
                  <p className="text-xs text-orange-600 mt-1">{investor.responseTime}</p>
                </div>
              </div>

              {/* Communication Options */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-3">Communication Preferences</h4>
                <div className="flex gap-3">
                  {investor.communicationPrefs.video && (
                    <button
                      onClick={() => openCommunication(investor, 'video')}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Video Call
                    </button>
                  )}
                  {investor.communicationPrefs.messaging && (
                    <button
                      onClick={() => openCommunication(investor, 'chat')}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </button>
                  )}
                  {investor.communicationPrefs.phone && (
                    <button
                      onClick={() => openCommunication(investor, 'schedule')}
                      className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Schedule Call
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2">Available: {investor.meetingAvailability}</p>
              </div>

              {/* Focus Areas */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Investment Focus</h4>
                <div className="flex flex-wrap gap-2">
                  {investor.focusAreas.map((area, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-gray-700 rounded-full text-sm font-medium border border-blue-200"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recent Portfolio Companies */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Recent Investments</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {investor.portfolio.slice(0, 3).map((company, index) => (
                    <div key={index} className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-semibold text-gray-900">{company.name}</h5>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${company.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                          }`}>
                          {company.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{company.industry}</p>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Investment: {formatCurrency(company.investment)}</span>
                        <span className="text-green-600 font-semibold">ROI: {company.roi}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Recognition & Awards</h4>
                <div className="flex flex-wrap gap-2">
                  {investor.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center px-3 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 text-yellow-700 rounded-full text-sm border border-yellow-200">
                      <Award className="h-3 w-3 mr-2" />
                      {achievement}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedInvestor(investor)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg"
                >
                  View Full Profile
                </button>
                <button
                  onClick={() => openCommunication(investor, 'chat')}
                  className="px-6 py-3 border-2 border-blue-300 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors font-semibold"
                >
                  Connect
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Communication Modal */}
      {showCommunicationModal && commParticipant && (
        <CommunicationModal
          visible={showCommunicationModal}
          onClose={() => setShowCommunicationModal(false)}
          roomId={commRoomId}
          participant={commParticipant}
          initialMode={commMode}
        />
      )}

      {/* Detailed Investor Modal */}
      {selectedInvestor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center">
                <img
                  src={selectedInvestor.avatar}
                  alt={selectedInvestor.name}
                  className="w-20 h-20 rounded-full object-cover mr-6"
                />
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{selectedInvestor.name}</h2>
                  <p className="text-xl text-gray-600">{selectedInvestor.company}</p>
                  <p className="text-gray-500">{selectedInvestor.location}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvestor(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Investment History Chart */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">Investment History</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={selectedInvestor.investmentHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Line type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Portfolio Distribution */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">Portfolio by Industry</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={selectedInvestor.portfolio.map((p: any) => ({ name: p.industry, value: p.investment }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {selectedInvestor.portfolio.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={industryColors[entry.industry as keyof typeof industryColors] || '#8884d8'} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Full Portfolio */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Complete Portfolio</h3>
              <div className="grid gap-4">
                {selectedInvestor.portfolio.map((company: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div>
                      <h4 className="font-semibold text-gray-900">{company.name}</h4>
                      <p className="text-sm text-gray-600">{company.industry}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(company.investment)}</p>
                      <p className={`text-sm ${company.roi > 200 ? 'text-green-600' : 'text-gray-600'}`}>
                        ROI: {company.roi}%
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${company.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                      {company.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors">
                Connect with {selectedInvestor.name}
              </button>
              <button
                onClick={() => {
                  openCommunication(selectedInvestor, 'video');
                  setSelectedInvestor(null);
                }}
                className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center"
              >
                <Video className="h-4 w-4 mr-2" />
                Video Call
              </button>
              <button
                onClick={() => {
                  openCommunication(selectedInvestor, 'chat');
                  setSelectedInvestor(null);
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredInvestors.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No investors found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}


import React, { useState, useEffect } from 'react'
import { Building2, Users, DollarSign, TrendingUp, MapPin, Calendar, Star, Plus, Search, Filter, Award, Target, Video, MessageCircle, Phone, ChevronLeft, ChevronRight } from 'lucide-react'
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { CommunicationModal, Participant } from './CommunicationModal'
import { LoadingSpinner, SkeletonCard } from './LoadingSpinner'
import { Pagination } from './Pagination'
import { ToastContainer, ToastType } from './Toast'
import axios from 'axios'
import { endpoints } from '../config'

// Enhanced mock startup data with image galleries
interface Investor {
  name: string;
  amount: number;
  round: string;
}

interface Founder {
  name: string;
  role: string;
  background: string;
  linkedin: string;
}

interface Metrics {
  revenue: number;
  growth: number;
  customers: number;
  monthlyRecurring: number;
  burnRate: number;
  runway: number;
}

interface Financials {
  year: string;
  revenue: number;
  expenses: number;
  profit: number;
}

interface MonthlyMetric {
  month: string;
  revenue: number;
  customers: number;
  mrr: number;
}

interface SocialImpact {
  [key: string]: number;
}

interface CommunicationPrefs {
  video: boolean;
  messaging: boolean;
  phone: boolean;
  email: boolean;
}

interface Startup {
  id: string;
  name: string;
  logo: string;
  images: string[];
  tagline: string;
  description: string;
  industry: string;
  stage: string;
  location: string;
  founded: string;
  employees: string;
  fundingRaised: number;
  fundingGoal: number;
  valuation: number;
  rating: number;
  investors: Investor[];
  founders: Founder[];
  metrics: Metrics;
  financials: Financials[];
  monthlyMetrics: MonthlyMetric[];
  marketSize: number;
  competition: string[];
  achievements: string[];
  socialImpact: SocialImpact;
  communicationPrefs: CommunicationPrefs;
  responseTime: string;
  meetingAvailability: string;
  submittedBy?: string;
}

const mockStartups: Startup[] = [
  {
    id: '1',
    name: 'EcoTech Solutions',
    logo: 'https://t4.ftcdn.net/jpg/11/78/23/11/360_F_1178231104_BAINhFQQBmJz42BIaOz9sYwp6yupK8YV.jpg',
    images: [
      'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'
    ],
    tagline: 'Sustainable technology for a greener future',
    description: 'We develop innovative clean energy solutions and smart grid technologies to reduce carbon footprint and promote sustainable living.',
    industry: 'CleanTech',
    stage: 'Series A',
    location: 'San Francisco, CA',
    founded: '2021',
    employees: '25-50',
    fundingRaised: 2500000,
    fundingGoal: 5000000,
    valuation: 15000000,
    rating: 4.8,
    investors: [
      { name: 'Green Ventures', amount: 1000000, round: 'Seed' },
      { name: 'Climate Capital', amount: 800000, round: 'Series A' },
      { name: 'Eco Fund', amount: 700000, round: 'Series A' }
    ],
    founders: [
      { name: 'Sarah Chen', role: 'CEO', background: 'Former Tesla Engineer', linkedin: '#' },
      { name: 'Mike Rodriguez', role: 'CTO', background: 'Ex-Google AI Researcher', linkedin: '#' }
    ],
    metrics: {
      revenue: 500000,
      growth: 150,
      customers: 50,
      monthlyRecurring: 42000,
      burnRate: 85000,
      runway: 18
    },
    financials: [
      { year: '2021', revenue: 50000, expenses: 200000, profit: -150000 },
      { year: '2022', revenue: 180000, expenses: 350000, profit: -170000 },
      { year: '2023', revenue: 350000, expenses: 480000, profit: -130000 },
      { year: '2024', revenue: 500000, expenses: 620000, profit: -120000 }
    ],
    monthlyMetrics: [
      { month: 'Jan', revenue: 35000, customers: 42, mrr: 35000 },
      { month: 'Feb', revenue: 38000, customers: 45, mrr: 38000 },
      { month: 'Mar', revenue: 40000, customers: 47, mrr: 40000 },
      { month: 'Apr', revenue: 42000, customers: 50, mrr: 42000 }
    ],
    marketSize: 50000000000,
    competition: ['Tesla Energy', 'Sunrun', 'Enphase'],
    achievements: ['Y Combinator Graduate', 'TechCrunch Disrupt Winner', 'Green Tech Award 2023'],
    socialImpact: {
      co2Reduced: 1200,
      energySaved: 5000000,
      householdsServed: 2500
    },
    communicationPrefs: {
      video: true,
      messaging: true,
      phone: true,
      email: true
    },
    responseTime: '< 24 hours',
    meetingAvailability: 'Mon-Fri 9AM-6PM PST'
  },
  {
    id: '2',
    name: 'HealthAI',
    logo: 'https://t3.ftcdn.net/jpg/04/33/28/48/360_F_433284834_pmi4jWJDOmRWQKmtAEQhZKarr8PaCvLr.jpg',
    images: [
      'https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      'https://images.pexels.com/photos/3938022/pexels-photo-3938022.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      'https://images.pexels.com/photos/3938025/pexels-photo-3938025.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      'https://images.pexels.com/photos/3938024/pexels-photo-3938024.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'
    ],
    tagline: 'AI-powered healthcare diagnostics',
    description: 'Revolutionary AI platform that assists doctors in early disease detection and personalized treatment recommendations.',
    industry: 'HealthTech',
    stage: 'Seed',
    location: 'Boston, MA',
    founded: '2022',
    employees: '10-25',
    fundingRaised: 800000,
    fundingGoal: 2000000,
    valuation: 8000000,
    rating: 4.6,
    investors: [
      { name: 'Health Ventures', amount: 500000, round: 'Seed' },
      { name: 'AI Capital', amount: 300000, round: 'Seed' }
    ],
    founders: [
      { name: 'Dr. Emily Watson', role: 'CEO', background: 'Harvard Medical School', linkedin: '#' },
      { name: 'Alex Kim', role: 'CTO', background: 'Former Microsoft AI', linkedin: '#' }
    ],
    metrics: {
      revenue: 100000,
      growth: 200,
      customers: 15,
      monthlyRecurring: 8500,
      burnRate: 65000,
      runway: 12
    },
    financials: [
      { year: '2022', revenue: 10000, expenses: 150000, profit: -140000 },
      { year: '2023', revenue: 45000, expenses: 280000, profit: -235000 },
      { year: '2024', revenue: 100000, expenses: 350000, profit: -250000 }
    ],
    monthlyMetrics: [
      { month: 'Jan', revenue: 6000, customers: 12, mrr: 6000 },
      { month: 'Feb', revenue: 7000, customers: 13, mrr: 7000 },
      { month: 'Mar', revenue: 7500, customers: 14, mrr: 7500 },
      { month: 'Apr', revenue: 8500, customers: 15, mrr: 8500 }
    ],
    marketSize: 25000000000,
    competition: ['IBM Watson Health', 'Google Health', 'Tempus'],
    achievements: ['FDA Breakthrough Device', 'MIT Innovation Award', 'Healthcare Innovation Prize'],
    socialImpact: {
      patientsHelped: 10000,
      diseasesDetected: 500,
      accuracyImprovement: 25
    },
    communicationPrefs: {
      video: true,
      messaging: true,
      phone: false,
      email: true
    },
    responseTime: '< 12 hours',
    meetingAvailability: 'Tue-Thu 10AM-4PM EST'
  },
  {
    id: '3',
    name: 'FinFlow',
    logo: 'https://img.freepik.com/premium-photo/handsome-businessman-standing-indoor_474601-9312.jpg?semt=ais_hybrid&w=740&q=80',
    images: [
      'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      'https://images.pexels.com/photos/3184460/pexels-photo-3184460.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      'https://images.pexels.com/photos/3184463/pexels-photo-3184463.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'
    ],
    tagline: 'Next-gen financial management for SMEs',
    description: 'Comprehensive financial platform helping small and medium enterprises manage cash flow, payments, and financial planning.',
    industry: 'FinTech',
    stage: 'Pre-Series A',
    location: 'New York, NY',
    founded: '2020',
    employees: '50-100',
    fundingRaised: 3200000,
    fundingGoal: 8000000,
    valuation: 25000000,
    rating: 4.7,
    investors: [
      { name: 'FinTech Ventures', amount: 1500000, round: 'Seed' },
      { name: 'Banking Capital', amount: 1000000, round: 'Series A' },
      { name: 'Growth Partners', amount: 700000, round: 'Series A' }
    ],
    founders: [
      { name: 'David Park', role: 'CEO', background: 'Ex-Goldman Sachs', linkedin: '#' },
      { name: 'Lisa Zhang', role: 'CPO', background: 'Former Stripe Product', linkedin: '#' }
    ],
    metrics: {
      revenue: 1200000,
      growth: 180,
      customers: 200,
      monthlyRecurring: 100000,
      burnRate: 120000,
      runway: 24
    },
    financials: [
      { year: '2020', revenue: 50000, expenses: 300000, profit: -250000 },
      { year: '2021', revenue: 250000, expenses: 500000, profit: -250000 },
      { year: '2022', revenue: 600000, expenses: 750000, profit: -150000 },
      { year: '2023', revenue: 950000, expenses: 1100000, profit: -150000 },
      { year: '2024', revenue: 1200000, expenses: 1350000, profit: -150000 }
    ],
    monthlyMetrics: [
      { month: 'Jan', revenue: 85000, customers: 180, mrr: 85000 },
      { month: 'Feb', revenue: 92000, customers: 190, mrr: 92000 },
      { month: 'Mar', revenue: 96000, customers: 195, mrr: 96000 },
      { month: 'Apr', revenue: 100000, customers: 200, mrr: 100000 }
    ],
    marketSize: 15000000000,
    competition: ['QuickBooks', 'Xero', 'FreshBooks'],
    achievements: ['Fintech50 Winner', 'Best SME Solution', 'Banking Innovation Award'],
    socialImpact: {
      businessesHelped: 200,
      jobsCreated: 1500,
      economicImpact: 50000000
    },
    communicationPrefs: {
      video: true,
      messaging: true,
      phone: true,
      email: true
    },
    responseTime: '< 6 hours',
    meetingAvailability: 'Mon-Fri 8AM-7PM EST'
  }
]

const industryColors = {
  'FinTech': '#3B82F6',
  'HealthTech': '#10B981',
  'CleanTech': '#059669',
  'EdTech': '#8B5CF6',
  'Enterprise': '#6366F1'
}

// Image Slider Component
function ImageSlider({ images, alt }: { images: string[], alt: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  React.useEffect(() => {
    const interval = setInterval(nextImage, 4000)
    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className="relative w-full h-48 rounded-xl overflow-hidden group">
      {images.map((image: string, index: number) => (
        <img
          key={index}
          src={image}
          alt={`${alt} ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
        />
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={prevImage}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={nextImage}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
        {images.map((_: string, index: number) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
          />
        ))}
      </div>

      {/* Image Counter */}
      <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  )
}

export function StartupProfiles() {
  // Existing state
  const [searchTerm, setSearchTerm] = useState('')
  const [industryFilter, setIndustryFilter] = useState('all')
  const [stageFilter, setStageFilter] = useState('all')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null)
  const [showCommunicationModal, setShowCommunicationModal] = useState(false)
  const [commParticipant, setCommParticipant] = useState<Participant | null>(null)
  const [commRoomId, setCommRoomId] = useState<string>('')
  const [commMode, setCommMode] = useState<'video' | 'chat' | 'schedule' | 'email'>('video')
  const [showInvestModal, setShowInvestModal] = useState(false)
  const [currentInvestStartup, setCurrentInvestStartup] = useState<Startup | null>(null)
  const [investmentAmount, setInvestmentAmount] = useState('')
  const [investmentMessage, setInvestmentMessage] = useState('')

  // Add Startup Form State
  const [newStartup, setNewStartup] = useState({
    name: '',
    industry: '',
    tagline: '',
    description: '',
    stage: '',
    fundingGoal: ''
  })
  const [formMessage, setFormMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // New state for pagination and API
  const [startups, setStartups] = useState<Startup[]>(mockStartups)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [pagination, setPagination] = useState({ total: mockStartups.length, pages: Math.ceil(mockStartups.length / 10), page: 1, limit: 10 })
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: ToastType }>>([])

  // Fetch startups from API
  const fetchStartups = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(endpoints.startups, {
        params: {
          industry: industryFilter !== 'all' ? industryFilter : undefined,
          stage: stageFilter !== 'all' ? stageFilter : undefined,
          page,
          limit
        }
      })
      if (data.startups && data.startups.length > 0) {
        setStartups(data.startups)
        setPagination(data.pagination)
      } else {
        // Use mock data as fallback
        const filtered = mockStartups.filter(s => {
          const matchesIndustry = industryFilter === 'all' || s.industry === industryFilter
          const matchesStage = stageFilter === 'all' || s.stage === stageFilter
          return matchesIndustry && matchesStage
        })
        setStartups(filtered)
        setPagination({ total: filtered.length, pages: Math.ceil(filtered.length / limit), page, limit })
      }
    } catch (err) {
      console.error('Failed to fetch startups, using mock data', err)
      // Use mock data as fallback
      const filtered = mockStartups.filter(s => {
        const matchesIndustry = industryFilter === 'all' || s.industry === industryFilter
        const matchesStage = stageFilter === 'all' || s.stage === stageFilter
        return matchesIndustry && matchesStage
      })
      setStartups(filtered)
      setPagination({ total: filtered.length, pages: Math.ceil(filtered.length / limit), page, limit })
    } finally {
      setLoading(false)
    }
  }

  // Fetch data when filters or pagination change
  useEffect(() => {
    fetchStartups()
  }, [industryFilter, stageFilter, page, limit])

  // Toast helpers
  const addToast = (message: string, type: ToastType) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  // Filter startups for search
  const filteredStartups = startups.filter(startup => {
    const matchesSearch = startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      startup.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      startup.industry.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Seed': return 'text-green-600 bg-green-50'
      case 'Series A': return 'text-blue-600 bg-blue-50'
      case 'Series B': return 'text-purple-600 bg-purple-50'
      case 'Pre-Series A': return 'text-orange-600 bg-orange-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    }
    return `$${(amount / 1000).toFixed(0)}K`
  }

  const openCommunication = (startup: Startup, mode: 'video' | 'chat' | 'schedule' | 'email') => {
    const room = `startup:${startup.id}`
    setCommParticipant({
      name: startup.name,
      avatar: startup.logo,
      email: startup.founders?.[0]?.name ? `${startup.founders[0].name.toLowerCase().replace(' ', '.')}@${startup.name.toLowerCase().replace(' ', '')}.com` : 'contact@startup.com',
      id: startup.submittedBy || startup.id, // Prioritize real User ID from backend
      availability: startup.meetingAvailability
    })
    setCommRoomId(room)
    setCommMode(mode)
    setShowCommunicationModal(true)
  }

  const handleInvest = (startup: Startup) => {
    setCurrentInvestStartup(startup)
    setShowInvestModal(true)
  }

  const submitInvestment = async () => {
    if (!investmentAmount || !currentInvestStartup) return

    const amount = parseFloat(investmentAmount)
    if (amount < 1000) {
      addToast('Minimum investment amount is $1,000', 'error')
      return
    }

    try {
      await axios.post(`${endpoints.actions}/invest`, {
        amount: amount,
        startupId: currentInvestStartup.id,
        startupName: currentInvestStartup.name,
        message: investmentMessage
      })

      addToast(`Investment of $${amount.toLocaleString()} successfully submitted for ${currentInvestStartup.name}!`, 'success')
      setShowInvestModal(false)
      setInvestmentAmount('')
      setInvestmentMessage('')
      setCurrentInvestStartup(null)

      // Refresh startup data to reflect new funding
      fetchStartups()
    } catch (err: any) {
      console.error('Investment failed', err)
      const errorMsg = err.response?.data?.message || 'Failed to process investment. Please try again.'
      addToast(errorMsg, 'error')
    }
  }

  const handleStartupFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // Prevent form from refreshing page

    // Validation
    if (!newStartup.name || !newStartup.industry || !newStartup.tagline ||
      !newStartup.description || !newStartup.stage || !newStartup.fundingGoal) {
      setFormMessage({ type: 'error', text: 'Please fill in all required fields' })
      setTimeout(() => setFormMessage(null), 3000)
      return
    }

    try {
      const response = await axios.post(endpoints.startups, {
        name: newStartup.name,
        industry: newStartup.industry,
        tagline: newStartup.tagline,
        description: newStartup.description,
        stage: newStartup.stage,
        fundingGoal: parseFloat(newStartup.fundingGoal)
      })

      // Show success message
      setFormMessage({
        type: 'success',
        text: response.data.message || `${newStartup.name} submitted successfully!`
      })

      // Reset form after 2 seconds
      setTimeout(() => {
        setNewStartup({
          name: '',
          industry: '',
          tagline: '',
          description: '',
          stage: '',
          fundingGoal: ''
        })
        setFormMessage(null)
        setShowCreateForm(false)
        fetchStartups() // Refresh list after submission
      }, 3000)
    } catch (err) {
      console.error('Failed to submit startup', err)
      setFormMessage({ type: 'error', text: 'Failed to submit startup. Please try again.' })
      setTimeout(() => setFormMessage(null), 3000)
    }
  }

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 via-green-50 to-blue-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Startup Ecosystem
        </h1>
        <p className="text-gray-600 text-lg">Discover innovative startups seeking investment opportunities</p>
      </div>

      {/* Enhanced Header Actions */}
      <div className="mb-8 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search startups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={industryFilter}
                  onChange={(e) => { setIndustryFilter(e.target.value); setPage(1); }}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Industries</option>
                  <option value="FinTech">FinTech</option>
                  <option value="HealthTech">HealthTech</option>
                  <option value="CleanTech">CleanTech</option>
                  <option value="EdTech">EdTech</option>
                </select>
              </div>

              <select
                value={stageFilter}
                onChange={(e) => { setStageFilter(e.target.value); setPage(1); }}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Stages</option>
                <option value="Seed">Seed</option>
                <option value="Pre-Series A">Pre-Series A</option>
                <option value="Series A">Series A</option>
                <option value="Series B">Series B</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-green-700 transition-all duration-300 flex items-center shadow-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Startup
          </button>
        </div>
      </div>

      {/* Enhanced Startup Grid with Image Sliders */}
      {loading ? (
        <div className="grid gap-8">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : filteredStartups.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-600 text-lg">No startups found matching your criteria</p>
        </div>
      ) : (
        <>
          <div className="grid gap-8">
            {filteredStartups.map((startup) => {
              const fundingProgress = (startup.fundingRaised / startup.fundingGoal) * 100

              return (
                <div key={startup.id} className="bg-white rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                  {/* Image Slider Header */}
                  <div className="relative">
                    <ImageSlider images={startup.images} alt={startup.name} />
                    <div className="absolute top-4 left-4 flex items-center">
                      <img
                        src={startup.logo}
                        alt={startup.name}
                        className="w-16 h-16 rounded-xl object-cover border-4 border-white shadow-lg"
                      />
                      <div className="ml-4 text-white">
                        <h3 className="text-xl font-bold drop-shadow-lg">{startup.name}</h3>
                        <p className="text-white/90 drop-shadow-lg">{startup.tagline}</p>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStageColor(startup.stage)} backdrop-blur-sm`}>
                        {startup.stage}
                      </span>
                      <div className="flex items-center bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                        <Star className="h-4 w-4 text-yellow-300 mr-1" />
                        <span className="text-white text-sm font-medium">{startup.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-gray-700 mb-6 text-lg leading-relaxed">{startup.description}</p>

                    {/* Enhanced Key Metrics with Mini Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                          <DollarSign className="h-8 w-8 text-blue-600" />
                          <div className="w-16 h-8">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={startup.monthlyMetrics}>
                                <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} dot={false} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Monthly Revenue</p>
                        <p className="text-xl font-bold text-gray-900">{formatCurrency(startup.metrics.revenue)}</p>
                        <p className="text-sm text-green-600 font-medium">+{startup.metrics.growth}% YoY</p>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                          <Users className="h-8 w-8 text-green-600" />
                          <div className="w-16 h-8">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={startup.monthlyMetrics}>
                                <Line type="monotone" dataKey="customers" stroke="#10B981" strokeWidth={2} dot={false} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Customers</p>
                        <p className="text-xl font-bold text-gray-900">{startup.metrics.customers}</p>
                        <p className="text-sm text-gray-600">Enterprise</p>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                          <TrendingUp className="h-8 w-8 text-purple-600" />
                          <div className="w-16 h-8">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={startup.monthlyMetrics}>
                                <Line type="monotone" dataKey="mrr" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">MRR</p>
                        <p className="text-xl font-bold text-gray-900">{formatCurrency(startup.metrics.monthlyRecurring)}</p>
                        <p className="text-sm text-purple-600">Recurring</p>
                      </div>

                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                          <Target className="h-8 w-8 text-orange-600" />
                          <span className="text-xs font-medium px-2 py-1 bg-orange-200 text-orange-700 rounded-full">
                            {startup.metrics.runway}mo runway
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Burn Rate</p>
                        <p className="text-xl font-bold text-gray-900">{formatCurrency(startup.metrics.burnRate)}</p>
                        <p className="text-sm text-gray-600">Monthly</p>
                      </div>
                    </div>

                    {/* Communication Options */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-3">Connect with Team</h4>
                      <div className="flex gap-3 mb-3">
                        {startup.communicationPrefs.video && (
                          <button
                            onClick={() => openCommunication(startup, 'video')}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Video className="h-4 w-4 mr-2" />
                            Video Call
                          </button>
                        )}
                        {startup.communicationPrefs.messaging && (
                          <button
                            onClick={() => openCommunication(startup, 'chat')}
                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Message
                          </button>
                        )}
                        {startup.communicationPrefs.phone && (
                          <button
                            onClick={() => openCommunication(startup, 'schedule')}
                            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            Schedule Call
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">Response time: {startup.responseTime} • Available: {startup.meetingAvailability}</p>
                    </div>

                    {/* Funding Progress */}
                    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold text-gray-900">Funding Progress</span>
                        <span className="text-sm text-gray-600">
                          {formatCurrency(startup.fundingRaised)} of {formatCurrency(startup.fundingGoal)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-purple-600 h-4 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${Math.min(fundingProgress, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600">{fundingProgress.toFixed(1)}% funded</p>
                    </div>

                    {/* Investors */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Key Investors</h4>
                      <div className="flex flex-wrap gap-2">
                        {startup.investors.map((investor: Investor, index: number) => (
                          <div key={index} className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-full text-sm border border-blue-200">
                            <span className="font-medium">{investor.name}</span>
                            <span className="ml-2 text-xs">({formatCurrency(investor.amount)})</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Company Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 block">Location</span>
                        <p className="font-semibold flex items-center mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {startup.location}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 block">Founded</span>
                        <p className="font-semibold flex items-center mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          {startup.founded}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 block">Team Size</span>
                        <p className="font-semibold flex items-center mt-1">
                          <Users className="h-4 w-4 mr-1" />
                          {startup.employees}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 block">Industry</span>
                        <p className="font-semibold flex items-center mt-1">
                          <Building2 className="h-4 w-4 mr-1" />
                          {startup.industry}
                        </p>
                      </div>
                    </div>

                    {/* Achievements */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Achievements</h4>
                      <div className="flex flex-wrap gap-2">
                        {startup.achievements.map((achievement: string, index: number) => (
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
                        onClick={() => handleInvest(startup)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg"
                      >
                        Invest Now
                      </button>
                      <button
                        onClick={() => setSelectedStartup(startup)}
                        className="px-6 py-3 border-2 border-blue-300 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors font-semibold"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => openCommunication(startup, 'chat')}
                        className="px-6 py-3 border-2 border-green-300 text-green-600 rounded-xl hover:bg-green-50 transition-colors font-semibold"
                      >
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
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

          {/* Investment Modal */}
          {showInvestModal && currentInvestStartup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Invest in {currentInvestStartup.name}</h2>

                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Funding Progress</span>
                    <span className="font-semibold">{formatCurrency(currentInvestStartup.fundingRaised)} / {formatCurrency(currentInvestStartup.fundingGoal)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                      style={{ width: `${Math.min((currentInvestStartup.fundingRaised / currentInvestStartup.fundingGoal) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Investment Amount ($)</label>
                    <input
                      type="number"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                      placeholder="Enter amount..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="1000"
                      step="1000"
                    />
                    <p className="text-sm text-gray-500 mt-1">Minimum investment: $1,000</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message to Founders (Optional)</label>
                    <textarea
                      value={investmentMessage}
                      onChange={(e) => setInvestmentMessage(e.target.value)}
                      placeholder="Introduce yourself and explain why you're interested..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={4}
                    ></textarea>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> This is a preliminary indication of interest. Our team will contact you to complete the investment process.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => setShowInvestModal(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitInvestment}
                    disabled={!investmentAmount || parseFloat(investmentAmount) < 1000}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Investment
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Startup Modal */}
          {selectedStartup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center">
                    <img
                      src={selectedStartup.logo}
                      alt={selectedStartup.name}
                      className="w-20 h-20 rounded-xl object-cover mr-6"
                    />
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">{selectedStartup.name}</h2>
                      <p className="text-xl text-gray-600">{selectedStartup.tagline}</p>
                      <p className="text-gray-500">{selectedStartup.location}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedStartup(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                {/* Image Gallery */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Company Gallery</h3>
                  <ImageSlider images={selectedStartup.images} alt={selectedStartup.name} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Financial Performance */}
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4">Financial Performance</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={selectedStartup.financials}>
                        <defs>
                          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis tickFormatter={(value) => formatCurrency(value)} />
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="url(#revenueGradient)" strokeWidth={3} />
                        <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Investment Breakdown */}
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4">Investment Breakdown</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={selectedStartup.investors.map((inv) => ({ name: inv.name, value: inv.amount }))}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                        >
                          {selectedStartup.investors.map((entry: Investor, index: number) => (
                            <Cell key={`cell-${index}`} fill={`hsl(${index * 137.5}, 70%, 50%)`} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Detailed Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Market & Competition</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Total Addressable Market</p>
                        <p className="text-xl font-bold">{formatCurrency(selectedStartup.marketSize)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Key Competitors</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedStartup.competition.map((comp: string, index: number) => (
                            <span key={index} className="px-2 py-1 bg-red-50 text-red-600 rounded text-sm">
                              {comp}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Social Impact</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(selectedStartup.socialImpact).map(([key, value]) => (
                        <div key={key} className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">{value.toLocaleString()}</p>
                          <p className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => {
                      handleInvest(selectedStartup)
                      setSelectedStartup(null)
                    }}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Invest in {selectedStartup.name}
                  </button>
                  <button
                    onClick={() => {
                      openCommunication(selectedStartup, 'video')
                      setSelectedStartup(null)
                    }}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Video Call
                  </button>
                  <button
                    onClick={() => {
                      openCommunication(selectedStartup, 'chat')
                      setSelectedStartup(null)
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Contact Team
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={pagination.pages}
            onPageChange={setPage}
            itemsPerPage={limit}
            totalItems={pagination.total}
            onItemsPerPageChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
          />
        </>
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* No Startups Found */}
      {!loading && filteredStartups.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No startups found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Create Startup Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Your Startup</h2>

            <form onSubmit={handleStartupFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Startup Name *
                  </label>
                  <input
                    type="text"
                    value={newStartup.name}
                    onChange={(e) => setNewStartup({ ...newStartup, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., TechCorp"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry *
                  </label>
                  <select
                    value={newStartup.industry}
                    onChange={(e) => setNewStartup({ ...newStartup, industry: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Industry</option>
                    <option value="FinTech">FinTech</option>
                    <option value="HealthTech">HealthTech</option>
                    <option value="CleanTech">CleanTech</option>
                    <option value="EdTech">EdTech</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tagline *
                </label>
                <input
                  type="text"
                  value={newStartup.tagline}
                  onChange={(e) => setNewStartup({ ...newStartup, tagline: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of what you do"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  rows={4}
                  value={newStartup.description}
                  onChange={(e) => setNewStartup({ ...newStartup, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Detailed description of your startup"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Funding Stage *
                  </label>
                  <select
                    value={newStartup.stage}
                    onChange={(e) => setNewStartup({ ...newStartup, stage: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Stage</option>
                    <option value="Seed">Seed</option>
                    <option value="Pre-Series A">Pre-Series A</option>
                    <option value="Series A">Series A</option>
                    <option value="Series B">Series B</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Funding Goal *
                  </label>
                  <input
                    type="number"
                    value={newStartup.fundingGoal}
                    onChange={(e) => setNewStartup({ ...newStartup, fundingGoal: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Amount in USD"
                    min="1000"
                    required
                  />
                </div>
              </div>

              {formMessage && (
                <div className={`p-4 rounded-lg ${formMessage.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <p className={`text-sm font-medium ${formMessage.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                    {formMessage.text}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={formMessage?.type === 'success'}
                >
                  Submit for Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
// src/components/StudentIdeas.tsx
import React, { useState, useEffect } from 'react'
import { Users, Heart, MessageCircle, Share2, Plus, Search, Filter, Star, Calendar, TrendingUp, Video, Phone, Mail } from 'lucide-react'
import { CommunicationModal, Participant } from './CommunicationModal'
import { SkeletonCard } from './LoadingSpinner'
import { Pagination } from './Pagination'
import { ToastContainer, ToastType } from './Toast'
import axios from 'axios'

const mockIdeas = [
  {
    id: 1,
    title: 'AI-Powered Study Assistant',
    description: 'An intelligent platform that helps students optimize their study schedules using machine learning',
    author: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      major: 'Computer Science',
      year: 'Junior',
      university: 'MIT',
      gpa: '3.9',
      skills: ['Python', 'Machine Learning', 'React'],
      email: 'sarah.j@mit.edu',
      id: 'student-1' // Mock ID for signaling
    },
    category: 'Technology',
    stage: 'Prototype',
    fundingNeeded: 50000,
    timeframe: '6 months',
    tags: ['AI', 'EdTech', 'SaaS'],
    likes: 156,
    comments: 24,
    shares: 12,
    views: 1240,
    postedDate: '2024-01-15',
    featured: true,
    availability: 'Weekdays 2-6 PM EST',
    responseTime: 'within 24h',
    communicationPrefs: {
      video: true,
      messaging: true,
      phone: true,
      email: true
    }
  },
  {
    id: 2,
    title: 'Sustainable Packaging Solution',
    description: 'Biodegradable packaging made from agricultural waste',
    author: {
      name: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      major: 'Environmental Engineering',
      year: 'Senior',
      university: 'Stanford',
      gpa: '3.8',
      skills: ['Materials Science', 'CAD', 'Business'],
      email: 'mchen@stanford.edu',
      id: 'student-2' // Mock ID for signaling
    },
    category: 'Environmental',
    stage: 'MVP',
    fundingNeeded: 75000,
    timeframe: '12 months',
    tags: ['Sustainability', 'Green Tech', 'Manufacturing'],
    likes: 203,
    comments: 31,
    shares: 18,
    views: 1580,
    postedDate: '2024-01-10',
    featured: false,
    availability: 'Flexible',
    responseTime: 'within 12h',
    communicationPrefs: {
      video: true,
      messaging: true,
      phone: false,
      email: true
    }
  }
]

const API_URL = 'http://localhost:5001/api/ideas';

export function StudentIdeas() {
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [stageFilter, setStageFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedIdea, setSelectedIdea] = useState<any>(null)

  // API state
  const [ideas, setIdeas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [pagination, setPagination] = useState({ total: 0, pages: 1, page: 1, limit: 10 })
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: ToastType }>>([])

  // Communication modal state
  const [showCommunicationModal, setShowCommunicationModal] = useState(false)
  const [commParticipant, setCommParticipant] = useState<Participant | null>(null)
  const [commRoomId, setCommRoomId] = useState<string>('')
  const [commMode, setCommMode] = useState<'video' | 'chat' | 'schedule' | 'email'>('chat')

  // Investment state
  const [showInvestModal, setShowInvestModal] = useState(false)
  const [currentInvestIdea, setCurrentInvestIdea] = useState<any>(null)
  const [investmentAmount, setInvestmentAmount] = useState('')
  const [investmentMessage, setInvestmentMessage] = useState('')

  // Create Idea state
  const [newIdea, setNewIdea] = useState({
    title: '',
    description: '',
    category: '',
    fundingNeeded: '',
    timeframe: '',
    stage: ''
  })

  // Fetch ideas from API  
  const fetchIdeas = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(API_URL, {
        params: {
          category: categoryFilter !== 'all' ? categoryFilter : undefined,
          stage: stageFilter !== 'all' ? stageFilter : undefined,
          page,
          limit
        }
      })
      if (data.ideas && data.ideas.length > 0) {
        setIdeas(data.ideas)
        setPagination(data.pagination)
      } else {
        // Fallback to mock data
        const filtered = mockIdeas.filter(idea => {
          const matchesCat = categoryFilter === 'all' || idea.category === categoryFilter
          const matchesStage = stageFilter === 'all' || idea.stage === stageFilter
          return matchesCat && matchesStage
        })
        setIdeas(filtered)
        setPagination({ total: filtered.length, pages: Math.ceil(filtered.length / limit), page, limit })
      }
    } catch (err) {
      console.error('Failed to fetch ideas, using mock data', err)
      const filtered = mockIdeas.filter(idea => {
        const matchesCat = categoryFilter === 'all' || idea.category === categoryFilter
        const matchesStage = stageFilter === 'all' || idea.stage === stageFilter
        return matchesCat && matchesStage
      })
      setIdeas(filtered)
      setPagination({ total: filtered.length, pages: Math.ceil(filtered.length / limit), page, limit })
    } finally {
      setLoading(false)
    }
  }

  // Fetch when filters or pagination change
  useEffect(() => {
    fetchIdeas()
  }, [categoryFilter, stageFilter, page, limit])

  // Toast helpers
  const addToast = (message: string, type: ToastType) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  // Like idea
  const handleLike = async (ideaId: string) => {
    try {
      await axios.post(`${API_URL}/${ideaId}/like`)
      addToast('Liked!', 'success')
      fetchIdeas() // Refresh
    } catch (err) {
      console.error('Failed to like idea', err)
    }
  }

  // helper to open the unified modal (room id: idea.id + '-' + current timestamp)
  const openCommunication = (idea: any, mode: 'video' | 'chat' | 'schedule' | 'email') => {
    const room = `idea:${idea.id}`
    setCommParticipant({
      name: idea.author.name,
      avatar: idea.author.avatar,
      email: idea.author.email || '',
      university: idea.author.university,
      availability: idea.availability,
      id: idea.submittedBy || idea.author.id || 'student-1' // Prioritize real User ID from backend
    })
    setCommRoomId(room)
    setCommMode(mode)
    setShowCommunicationModal(true)
  }

  const handleInvestClick = (idea: any) => {
    setCurrentInvestIdea(idea)
    setShowInvestModal(true)
  }

  const submitInvestment = async () => {
    if (!investmentAmount || !currentInvestIdea) return

    const amount = parseFloat(investmentAmount)
    if (amount < 100) {
      addToast('Minimum investment is $100', 'error')
      return
    }

    try {
      await axios.post('http://localhost:5001/api/actions/invest', {
        amount,
        startupId: currentInvestIdea.id, // Mapping for mock backend
        startupName: currentInvestIdea.title, // Mapping for mock backend
        message: investmentMessage,
        type: 'idea'
      })
      addToast(`Investment of $${amount.toLocaleString()} submitted for ${currentInvestIdea.title}`, 'success')
      setShowInvestModal(false)
      setInvestmentAmount('')
      setInvestmentMessage('')
      setCurrentInvestIdea(null)
    } catch (err) {
      console.error(err)
      addToast('Failed to submit investment', 'error')
    }
  }

  const handleCreateIdea = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post(API_URL, {
        ...newIdea,
        fundingNeeded: parseFloat(newIdea.fundingNeeded),
        author: {
          name: 'Current User', // Mock
          avatar: 'https://github.com/shadcn.png',
          major: 'Computer Science',
          year: 'Senior',
          university: 'Tech University'
        },
        postedDate: new Date().toISOString(),
        likes: 0,
        comments: 0,
        shares: 0,
        views: 0,
        tags: ['New', newIdea.category],
        communicationPrefs: { video: true, messaging: true, phone: true, email: true },
        availability: 'Flexible',
        responseTime: 'within 24h'
      })
      addToast('Idea posted successfully!', 'success')
      setShowCreateForm(false)
      setNewIdea({ title: '', description: '', category: '', fundingNeeded: '', timeframe: '', stage: '' })
      fetchIdeas()
    } catch (err) {
      console.error(err)
      addToast('Failed to post idea', 'error')
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Technology': return 'text-blue-600 bg-blue-50'
      case 'Healthcare': return 'text-green-600 bg-green-50'
      case 'Education': return 'text-purple-600 bg-purple-50'
      case 'Environmental': return 'text-emerald-600 bg-emerald-50'
      case 'Agriculture': return 'text-orange-600 bg-orange-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Concept': return 'text-yellow-600 bg-yellow-50'
      case 'Research': return 'text-blue-600 bg-blue-50'
      case 'Prototype': return 'text-purple-600 bg-purple-50'
      case 'MVP': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    }
    return `$${(amount / 1000).toFixed(0)}K`
  }

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Innovation Hub
        </h1>
        <p className="text-gray-600 text-lg">Discover innovative ideas from students seeking investment and mentorship</p>
      </div>

      {/* Header Actions (same as before) */}
      <div className="mb-8 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search ideas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Categories</option>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Environmental">Environmental</option>
                  <option value="Agriculture">Agriculture</option>
                </select>
              </div>

              <select
                value={stageFilter}
                onChange={(e) => { setStageFilter(e.target.value); setPage(1); }}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Stages</option>
                <option value="Concept">Concept</option>
                <option value="Research">Research</option>
                <option value="Prototype">Prototype</option>
                <option value="MVP">MVP</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center shadow-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Post Your Idea
          </button>
        </div>
      </div>

      {/* Ideas Grid */}
      {loading ? (
        <div className="grid gap-8">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : ideas.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-600 text-lg">No ideas found</p>
        </div>
      ) : (
        <>
          <div className="grid gap-8">
            {ideas.filter((idea: any) => {
              const matchesSearch = idea.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                idea.description?.toLowerCase().includes(searchTerm.toLowerCase())
              return matchesSearch
            }).map((idea: any) => (
              <div key={idea.id} className={`bg-white rounded-2xl shadow-xl border hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden ${idea.featured ? 'border-purple-200 ring-2 ring-purple-100' : 'border-gray-100'}`}>
                {idea.featured && (
                  <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-6 py-3 text-sm font-medium">
                    <Star className="h-4 w-4 inline mr-2" />
                    Featured Innovation
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{idea.title}</h3>
                      <p className="text-gray-600 mb-4 text-lg leading-relaxed">{idea.description}</p>

                      <div className="flex items-center gap-3 mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(idea.category)}`}>
                          {idea.category}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStageColor(idea.stage)}`}>
                          {idea.stage}
                        </span>
                        {idea.tags.map((tag: string, index: number) => (
                          <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm border border-gray-200">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right ml-6">
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl">
                        <p className="text-sm text-gray-600">Views</p>
                        <p className="text-2xl font-bold text-gray-900">{idea.views}</p>
                      </div>
                    </div>
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center mb-6 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100">
                    <img
                      src={idea.author.avatar}
                      alt={idea.author.name}
                      className="w-16 h-16 rounded-full object-cover mr-6 border-4 border-white shadow-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-lg">{idea.author.name}</h4>
                      <p className="text-gray-600">{idea.author.major}, {idea.author.year}</p>
                      <p className="text-gray-500">{idea.author.university}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-blue-600 font-medium">GPA: {idea.author.gpa}</span>
                        <div className="flex gap-1">
                          {idea.author.skills.slice(0, 3).map((skill: string, index: number) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Posted</p>
                      <p className="text-sm font-medium">{new Date(idea.postedDate).toLocaleDateString()}</p>
                      <p className="text-xs text-green-600 mt-1">Responds {idea.responseTime}</p>
                    </div>
                  </div>

                  {/* Communication Options (OPEN unified modal) */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-3">Connect with Student</h4>
                    <div className="flex gap-3 mb-3">
                      {idea.communicationPrefs.video && (
                        <button
                          onClick={() => openCommunication(idea, 'video')}
                          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Video Call
                        </button>
                      )}
                      {idea.communicationPrefs.messaging && (
                        <button
                          onClick={() => openCommunication(idea, 'chat')}
                          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message
                        </button>
                      )}
                      {idea.communicationPrefs.phone && (
                        <button
                          onClick={() => openCommunication(idea, 'schedule')}
                          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Schedule Call
                        </button>
                      )}
                      <button
                        onClick={() => openCommunication(idea, 'email')}
                        className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">Available: {idea.availability}</p>
                  </div>

                  {/* Key Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                      <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-1">Funding Needed</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(idea.fundingNeeded)}</p>
                    </div>

                    <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                      <Calendar className="h-8 w-8 text-green-600 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-1">Timeframe</p>
                      <p className="text-2xl font-bold text-gray-900">{idea.timeframe}</p>
                    </div>

                    <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                      <Users className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-1">Stage</p>
                      <p className="text-2xl font-bold text-gray-900">{idea.stage}</p>
                    </div>
                  </div>

                  {/* Engagement and Action Buttons */}
                  <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-6">
                      <button
                        onClick={() => handleLike(idea.id || idea._id)}
                        className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <Heart className="h-5 w-5 mr-2" />
                        <span className="font-medium">{idea.likes}</span>
                      </button>
                      <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                        <MessageCircle className="h-5 w-5 mr-2" />
                        <span className="font-medium">{idea.comments}</span>
                      </button>
                      <button className="flex items-center text-gray-600 hover:text-green-600 transition-colors">
                        <Share2 className="h-5 w-5 mr-2" />
                        <span className="font-medium">{idea.shares}</span>
                      </button>
                    </div>
                    <div className="text-sm text-gray-500">
                      {idea.views} views • {idea.comments} discussions
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedIdea(idea)}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg"
                    >
                      View Full Details
                    </button>
                    <button
                      onClick={() => openCommunication(idea, 'chat')}
                      className="px-6 py-3 border-2 border-purple-300 text-purple-600 rounded-xl hover:bg-purple-50 transition-colors font-semibold"
                    >
                      Contact Student
                    </button>
                    <button
                      onClick={() => handleInvestClick(idea)}
                      className="px-6 py-3 border-2 border-green-300 text-green-600 rounded-xl hover:bg-green-50 transition-colors font-semibold"
                    >
                      Invest
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

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

      {/* Create Idea Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Post Your Innovation</h2>
            <form onSubmit={handleCreateIdea} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newIdea.title}
                  onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newIdea.category}
                  onChange={(e) => setNewIdea({ ...newIdea, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Environmental">Environmental</option>
                  <option value="Agriculture">Agriculture</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newIdea.description}
                  onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Funding Needed ($)</label>
                  <input
                    type="number"
                    value={newIdea.fundingNeeded}
                    onChange={(e) => setNewIdea({ ...newIdea, fundingNeeded: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stage</label>
                  <select
                    value={newIdea.stage}
                    onChange={(e) => setNewIdea({ ...newIdea, stage: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Stage</option>
                    <option value="Concept">Concept</option>
                    <option value="Research">Research</option>
                    <option value="Prototype">Prototype</option>
                    <option value="MVP">MVP</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timeframe</label>
                <input
                  type="text"
                  value={newIdea.timeframe}
                  onChange={(e) => setNewIdea({ ...newIdea, timeframe: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 6 months"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700"
                >
                  Post Idea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Investment Modal */}
      {showInvestModal && currentInvestIdea && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Invest in {currentInvestIdea.title}</h2>
            <p className="text-gray-600 mb-6">Support this student innovation with funding.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount ($)</label>
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Min $100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
                <textarea
                  value={investmentMessage}
                  onChange={(e) => setInvestmentMessage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowInvestModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={submitInvestment}
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700"
                >
                  Confirm Investment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Idea Modal */}
      {selectedIdea && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedIdea.title}</h2>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedIdea.category)}`}>
                    {selectedIdea.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStageColor(selectedIdea.stage)}`}>
                    {selectedIdea.stage}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedIdea(null)} className="text-gray-400 hover:text-gray-600">
                <div className="h-6 w-6">✕</div>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedIdea.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500">Funding Needed</p>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(selectedIdea.fundingNeeded)}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500">Timeframe</p>
                    <p className="text-xl font-bold text-gray-900">{selectedIdea.timeframe}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedIdea.tags.map((tag: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center mb-4">
                    <img src={selectedIdea.author.avatar} alt={selectedIdea.author.name} className="w-12 h-12 rounded-full mr-4" />
                    <div>
                      <p className="font-bold text-gray-900">{selectedIdea.author.name}</p>
                      <p className="text-sm text-gray-500">{selectedIdea.author.university}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>🎓 {selectedIdea.author.major}</p>
                    <p>📅 Class of {selectedIdea.author.year}</p>
                    <p>⭐ GPA: {selectedIdea.author.gpa}</p>
                  </div>
                  <button
                    onClick={() => {
                      openCommunication(selectedIdea, 'chat')
                      setSelectedIdea(null)
                    }}
                    className="w-full mt-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    Contact Student
                  </button>
                </div>

                <button
                  onClick={() => {
                    handleInvestClick(selectedIdea)
                    setSelectedIdea(null)
                  }}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 font-bold shadow-lg"
                >
                  Invest Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

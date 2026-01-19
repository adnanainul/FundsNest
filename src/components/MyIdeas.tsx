import React, { useState, useEffect } from 'react'
import { Lightbulb, Plus, Edit3, Trash2, Eye, Heart, MessageCircle, Share2, BarChart2, ExternalLink, X } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../hooks/useAuth'
import { ToastContainer, ToastType } from './Toast'

// Mock user's ideas fallback
const mockMyIdeas = [
  {
    id: '1',
    title: 'EcoWaste - Smart Waste Management System',
    description: 'An IoT-based smart waste management system that optimizes garbage collection routes and reduces environmental impact through real-time monitoring.',
    category: 'Environmental',
    stage: 'Prototype',
    fundingNeeded: 50000,
    timeframe: '6 months',
    status: 'active',
    likes: 124,
    comments: 18,
    shares: 7,
    views: 450,
    createdDate: '2024-01-15',
    lastUpdated: '2024-01-20'
  },
  {
    id: '2',
    title: 'Campus Food Sharing App',
    description: 'A mobile app that connects students to share leftover food from dining halls and reduce food waste on campus.',
    category: 'Social Impact',
    stage: 'Concept',
    fundingNeeded: 25000,
    timeframe: '4 months',
    status: 'draft',
    likes: 67,
    comments: 12,
    shares: 3,
    views: 230,
    createdDate: '2024-01-10',
    lastUpdated: '2024-01-18'
  }
]

export function MyIdeas() {
  const { user } = useAuth()
  const [ideas, setIdeas] = useState<any[]>(mockMyIdeas)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingIdea, setEditingIdea] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: ToastType }>>([])
  const [showAnalytics, setShowAnalytics] = useState<any>(null)

  // Toast helpers
  const addToast = (message: string, type: ToastType) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const fetchMyIdeas = async () => {
    setLoading(true)
    try {
      // In a real app, we would fetch from API
      // const { data } = await axios.get('http://localhost:5001/api/ideas/my-ideas')
      // setIdeas(data)

      // For now, we'll use the mock data or local state
      // If we had a real backend for "my ideas", we'd use it here.
      // simulating network delay
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (err) {
      console.error('Failed to fetch ideas', err)
      addToast('Failed to load your ideas', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyIdeas()
  }, [])

  const handleCreateIdea = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const newIdeaData = {
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      stage: formData.get('stage'),
      fundingNeeded: parseFloat(formData.get('fundingNeeded') as string),
      timeframe: formData.get('timeframe'),
      status: formData.get('status'),
      author: {
        name: user?.name || 'Current User',
        id: user?.id || 'user-1'
      },
      createdDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      likes: 0,
      comments: 0,
      shares: 0,
      views: 0
    }

    try {
      // await axios.post('http://localhost:5001/api/ideas', newIdeaData)
      const createdIdea = { ...newIdeaData, id: Math.random().toString(36).substr(2, 9) }
      setIdeas([createdIdea, ...ideas])
      addToast('Idea created successfully!', 'success')
      setShowCreateForm(false)
    } catch (err) {
      addToast('Failed to create idea', 'error')
    }
  }

  const handleUpdateIdea = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingIdea) return

    const formData = new FormData(e.target as HTMLFormElement)
    const updatedData = {
      ...editingIdea,
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      stage: formData.get('stage'),
      fundingNeeded: parseFloat(formData.get('fundingNeeded') as string),
      timeframe: formData.get('timeframe'),
      status: formData.get('status'),
      lastUpdated: new Date().toISOString()
    }

    try {
      // await axios.put(`http://localhost:5001/api/ideas/${editingIdea.id}`, updatedData)
      setIdeas(ideas.map(idea => idea.id === editingIdea.id ? updatedData : idea))
      addToast('Idea updated successfully!', 'success')
      setEditingIdea(null)
    } catch (err) {
      addToast('Failed to update idea', 'error')
    }
  }

  const handleDeleteIdea = async (ideaId: string) => {
    if (!window.confirm('Are you sure you want to delete this idea?')) return

    try {
      // await axios.delete(`http://localhost:5001/api/ideas/${ideaId}`)
      setIdeas(ideas.filter(idea => idea.id !== ideaId))
      addToast('Idea deleted successfully', 'success')
    } catch (err) {
      addToast('Failed to delete idea', 'error')
    }
  }

  const handleShare = (idea: any) => {
    const url = `${window.location.origin}/ideas/${idea.id}`
    navigator.clipboard.writeText(url)
    addToast('Link copied to clipboard!', 'success')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50'
      case 'draft': return 'text-yellow-600 bg-yellow-50'
      case 'archived': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Technology': return 'text-blue-600 bg-blue-50'
      case 'Healthcare': return 'text-green-600 bg-green-50'
      case 'Education': return 'text-purple-600 bg-purple-50'
      case 'Environmental': return 'text-emerald-600 bg-emerald-50'
      case 'Social Impact': return 'text-pink-600 bg-pink-50'
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
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Ideas</h1>
          <p className="text-gray-600">Manage and track your innovative ideas</p>
        </div>

        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center shadow-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Idea
        </button>
      </div>

      {/* Ideas Grid */}
      <div className="grid gap-6">
        {ideas.map((idea) => (
          <div key={idea.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{idea.title}</h3>
                  <p className="text-gray-600 mb-3">{idea.description}</p>

                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(idea.category)}`}>
                      {idea.category}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(idea.status)}`}>
                      {idea.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      Updated {new Date(idea.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingIdea(idea)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Idea"
                  >
                    <Edit3 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteIdea(idea.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Idea"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Key Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Funding Needed</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(idea.fundingNeeded)}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Timeframe</p>
                  <p className="text-lg font-bold text-gray-900">{idea.timeframe}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Stage</p>
                  <p className="text-lg font-bold text-gray-900">{idea.stage}</p>
                </div>
              </div>

              {/* Engagement Stats */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-6">
                  <div className="flex items-center text-gray-600" title="Views">
                    <Eye className="h-5 w-5 mr-1" />
                    <span>{idea.views}</span>
                  </div>
                  <div className="flex items-center text-gray-600" title="Likes">
                    <Heart className="h-5 w-5 mr-1" />
                    <span>{idea.likes}</span>
                  </div>
                  <div className="flex items-center text-gray-600" title="Comments">
                    <MessageCircle className="h-5 w-5 mr-1" />
                    <span>{idea.comments}</span>
                  </div>
                  <div className="flex items-center text-gray-600" title="Shares">
                    <Share2 className="h-5 w-5 mr-1" />
                    <span>{idea.shares}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => addToast('Navigating to public page...', 'success')}
                  className="flex-1 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Public Page
                </button>
                <button
                  onClick={() => handleShare(idea)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </button>
                <button
                  onClick={() => setShowAnalytics(idea)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center"
                >
                  <BarChart2 className="h-4 w-4 mr-2" />
                  Analytics
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {ideas.length === 0 && !loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No ideas yet</h3>
          <p className="text-gray-600 mb-6">Start by creating your first innovative idea</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create Your First Idea
          </button>
        </div>
      )}

      {/* Create/Edit Idea Modal */}
      {(showCreateForm || editingIdea) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingIdea ? 'Edit Idea' : 'Create New Idea'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateForm(false)
                  setEditingIdea(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={editingIdea ? handleUpdateIdea : handleCreateIdea} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Idea Title
                </label>
                <input
                  name="title"
                  type="text"
                  defaultValue={editingIdea?.title || ''}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Give your idea a catchy title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  defaultValue={editingIdea?.description || ''}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Describe your idea in detail"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    defaultValue={editingIdea?.category || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Environmental">Environmental</option>
                    <option value="Social Impact">Social Impact</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Stage
                  </label>
                  <select
                    name="stage"
                    defaultValue={editingIdea?.stage || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Funding Needed
                  </label>
                  <input
                    name="fundingNeeded"
                    type="number"
                    defaultValue={editingIdea?.fundingNeeded || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Amount in USD"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeline
                  </label>
                  <input
                    name="timeframe"
                    type="text"
                    defaultValue={editingIdea?.timeframe || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., 6 months"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  defaultValue={editingIdea?.status || 'draft'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false)
                    setEditingIdea(null)
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {editingIdea ? 'Update Idea' : 'Create Idea'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {showAnalytics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
              <button
                onClick={() => setShowAnalytics(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 mb-1">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{showAnalytics.views}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600 mb-1">Total Likes</p>
                <p className="text-2xl font-bold text-gray-900">{showAnalytics.likes}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600 mb-1">Engagement Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {((showAnalytics.likes + showAnalytics.comments) / (showAnalytics.views || 1) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}
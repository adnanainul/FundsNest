// src/components/StudentRequests.tsx
import { useEffect, useState } from 'react'
import { Mail, User, Calendar, DollarSign, Building2, Eye, MessageCircle, CheckCircle, X, Star } from 'lucide-react'
import { CommunicationModal, Participant } from './CommunicationModal'
import { StudentRequestDetailModal } from './StudentRequestDetailModal'
import { LoadingSpinner, SkeletonCard } from './LoadingSpinner'
import { Pagination } from './Pagination'
import { ToastContainer, ToastType } from './Toast'
import { io, Socket } from 'socket.io-client'
import axios from 'axios'

export interface Student {
  name: string;
  email: string;
  avatar: string;
  university: string;
  major: string;
  year: string;
}

export interface Idea {
  title: string;
  description: string;
  category: string;
  fundingNeeded: number;
  timeframe: string;
  stage: string;
}

export interface StudentRequest {
  id: string;
  userId: string;
  student: Student;
  idea: Idea;
  status: 'new' | 'reviewed' | 'interested' | 'rejected';
  priority: 'high' | 'medium' | 'low';
  submittedDate: string;
}

import config, { endpoints } from '../config';

const API_URL = endpoints.requests;

export function StudentRequests() {
  const [requests, setRequests] = useState<StudentRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<StudentRequest | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [pagination, setPagination] = useState({ total: 0, pages: 1, page: 1, limit: 10 })
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: ToastType }>>([])

  // communication modal
  const [showCommunicationModal, setShowCommunicationModal] = useState(false)
  const [commParticipant, setCommParticipant] = useState<Participant | null>(null)
  const [commRoomId, setCommRoomId] = useState<string>('')
  const [commMode, setCommMode] = useState<'video' | 'chat' | 'schedule' | 'email'>('chat')

  // Fetch requests from API
  const fetchRequests = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(API_URL, {
        params: {
          status: statusFilter,
          priority: priorityFilter,
          category: categoryFilter,
          page,
          limit
        }
      })
      setRequests(data.requests || [])
      setPagination(data.pagination || { total: 0, pages: 1, page: 1, limit: 10 })
    } catch (err) {
      console.error('Failed to fetch requests', err)
      addToast('Failed to load requests', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Fetch on mount and when filters/pagination change
  useEffect(() => {
    fetchRequests()
  }, [statusFilter, priorityFilter, categoryFilter, page, limit])

  // Socket.io for real-time updates
  useEffect(() => {
    const socket: Socket = io(config.socketUrl)

    socket.on('request_status_updated', (data) => {
      addToast(`Request status updated to: ${data.status}`, 'success')
      fetchRequests() // Refresh the list
    })

    socket.on('new_student_request', (data) => {
      addToast(`New student request received: ${data.idea.title}`, 'info')
      fetchRequests() // Refresh the list
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const addToast = (message: string, type: ToastType) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const openCommunication = (request: StudentRequest, mode: 'video' | 'chat' | 'schedule' | 'email') => {
    const room = `request:${request.id}`
    setCommParticipant({
      name: request.student.name,
      avatar: request.student.avatar,
      email: request.student.email,
      availability: `${request.student.university} student`
    })
    setCommRoomId(room)
    setCommMode(mode)
    setShowCommunicationModal(true)
  }

  const updateRequestStatus = async (requestId: string, newStatus: string) => {
    try {
      await axios.put(`${API_URL}/${requestId}/status`, {
        status: newStatus
      })

      addToast(`Request status updated to: ${newStatus}`, 'success')
      fetchRequests() // Refresh list
      setSelectedRequest(null) // Close modal
    } catch (err) {
      console.error('Failed to update request status', err)
      addToast('Failed to update request status', 'error')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'text-blue-600 bg-blue-50'
      case 'reviewed': return 'text-yellow-600 bg-yellow-50'
      case 'interested': return 'text-green-600 bg-green-50'
      case 'rejected': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Technology': return 'text-blue-600 bg-blue-50'
      case 'Healthcare': return 'text-green-600 bg-green-50'
      case 'Education': return 'text-purple-600 bg-purple-50'
      case 'Environmental': return 'text-emerald-600 bg-emerald-50'
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Requests</h1>
        <p className="text-gray-600">Review and respond to student ideas seeking investment and mentorship</p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="reviewed">Reviewed</option>
            <option value="interested">Interested</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="all">All Priority</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="all">All Domains</option>
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
            <option value="Environmental">Environmental</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Finance">Finance</option>
            <option value="Social Impact">Social Impact</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-600 text-lg">No requests found matching your filters</p>
        </div>
      ) : (
        <>
          {/* Requests List */}
          <div className="grid gap-6">
            {requests.map((request) => (
              <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <img
                        src={request.student.avatar}
                        alt={request.student.name}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{request.idea.title}</h3>
                        <p className="text-gray-600">{request.student.name} • {request.student.university}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(request.idea.category)}`}>
                            {request.idea.category}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                            {request.priority} priority
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-600">Submitted</p>
                      <p className="text-sm font-medium">{new Date(request.submittedDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{request.idea.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                        <span className="font-medium text-gray-900">Funding Needed</span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">{formatCurrency(request.idea.fundingNeeded)}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="font-medium text-gray-900">Timeframe</span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">{request.idea.timeframe}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Building2 className="h-5 w-5 text-purple-600 mr-2" />
                        <span className="font-medium text-gray-900">Stage</span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">{request.idea.stage}</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <h4 className="font-medium text-blue-900 mb-2">Student Information</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-blue-600">Major:</span>
                        <p className="font-medium text-blue-900">{request.student.major}</p>
                      </div>
                      <div>
                        <span className="text-blue-600">Year:</span>
                        <p className="font-medium text-blue-900">{request.student.year}</p>
                      </div>
                      <div>
                        <span className="text-blue-600">University:</span>
                        <p className="font-medium text-blue-900">{request.student.university}</p>
                      </div>
                      <div>
                        <span className="text-blue-600">Email:</span>
                        <p className="font-medium text-blue-900">{request.student.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                    >
                      <Eye className="h-5 w-5 mr-2" />
                      View Full Details
                    </button>
                    <button
                      onClick={() => updateRequestStatus(request.id, 'interested')}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center"
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Interested
                    </button>
                    <button
                      onClick={() => openCommunication(request, 'chat')}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center"
                    >
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Message
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

      {/* Detailed Request Modal */}
      <StudentRequestDetailModal
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onStatusUpdate={updateRequestStatus}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}

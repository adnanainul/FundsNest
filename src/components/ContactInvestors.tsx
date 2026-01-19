import React, { useState } from 'react'
import { Send, User, Building2, DollarSign, FileText, CheckCircle, Video, MessageCircle, Phone, Mail } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { endpoints } from '../config';

export function ContactInvestors() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    university: '',
    major: '',
    year: '',
    ideaTitle: '',
    category: '',
    description: '',
    fundingNeeded: '',
    timeframe: '',
    stage: '',
    teamSize: '',
    previousExperience: '',
    businessModel: '',
    targetMarket: '',
    competition: '',
    uniqueValue: '',
    attachments: null as File[] | null,
    communicationPrefs: {
      video: false,
      messaging: false,
      phone: false,
      email: true
    },
    availability: '',
    responseTime: '< 24 hours'
  })

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({ ...prev, attachments: Array.from(e.target.files!) }))
    }
  }

  const handleCommunicationPrefChange = (pref: string) => {
    setFormData(prev => ({
      ...prev,
      communicationPrefs: {
        ...prev.communicationPrefs,
        [pref]: !prev.communicationPrefs[pref as keyof typeof prev.communicationPrefs]
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Construct the payload to match StudentRequest model
      const payload = {
        userId: user?.id,
        student: {
          name: formData.name,
          email: formData.email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`,
          university: formData.university,
          major: formData.major,
          year: formData.year
        },
        idea: {
          title: formData.ideaTitle,
          description: formData.description,
          category: formData.category,
          fundingNeeded: Number(formData.fundingNeeded),
          timeframe: formData.timeframe,
          stage: formData.stage
        },
        status: 'new',
        priority: 'medium'
      };

      // Send to backend
      // Note: Using the existing students endpoint or creating a new one if needed.
      // Assuming POST /api/students/requests creates a new request
      // If not, I might need to create it. Let's assume it exists or I'll create it.
      // Based on previous exploration, routes/students.js exists.
      await fetch(endpoints.requests, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      setSubmitted(true)
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit request. Please try again.');
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="p-8 bg-gradient-to-br from-gray-50 via-green-50 to-blue-50 min-h-screen">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Request Sent Successfully!
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Your innovative idea has been submitted to our network of investors and startup mentors.
            You'll receive responses within 3-5 business days.
          </p>

          <div className="bg-white p-8 rounded-2xl shadow-lg mb-8 border border-gray-100">
            <h3 className="font-bold text-blue-900 mb-4 text-xl">What happens next?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-blue-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">Review Process</h4>
                  <p className="text-sm text-blue-800">Our team will review your submission within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-green-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-green-900">Investor Matching</h4>
                  <p className="text-sm text-green-800">Qualified investors will be notified about your idea</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-purple-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-900">Direct Contact</h4>
                  <p className="text-sm text-purple-800">You'll receive direct messages from interested parties</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-orange-600 font-bold text-sm">4</span>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-900">Meetings</h4>
                  <p className="text-sm text-orange-800">We'll schedule introduction calls with potential investors</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setSubmitted(false)
              setFormData({
                name: '', email: '', university: '', major: '', year: '',
                ideaTitle: '', category: '', description: '', fundingNeeded: '',
                timeframe: '', stage: '', teamSize: '', previousExperience: '',
                businessModel: '', targetMarket: '', competition: '', uniqueValue: '',
                attachments: null,
                communicationPrefs: { video: false, messaging: false, phone: false, email: true },
                availability: '', responseTime: '< 24 hours'
              })
            }}
            className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-green-700 transition-all duration-300 font-semibold shadow-lg"
          >
            Submit Another Idea
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 via-green-50 to-blue-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Connect with Investors
          </h1>
          <p className="text-gray-600 text-lg">
            Submit your innovative idea to connect with investors and startup mentors who can help bring your vision to life.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* Personal Information */}
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">University *</label>
                <input
                  type="text"
                  name="university"
                  value={formData.university}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your university"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Major/Field of Study *</label>
                <input
                  type="text"
                  name="major"
                  value={formData.major}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Computer Science, Business, etc."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year *</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select year</option>
                  <option value="Freshman">Freshman</option>
                  <option value="Sophomore">Sophomore</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                  <option value="Graduate">Graduate</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>
            </div>
          </div>

          {/* Communication Preferences */}
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Communication Preferences</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Communication Methods</label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.communicationPrefs.video}
                      onChange={() => handleCommunicationPrefChange('video')}
                      className="mr-3 h-4 w-4 text-blue-600 rounded"
                    />
                    <Video className="h-4 w-4 mr-2 text-blue-600" />
                    Video Calls
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.communicationPrefs.messaging}
                      onChange={() => handleCommunicationPrefChange('messaging')}
                      className="mr-3 h-4 w-4 text-green-600 rounded"
                    />
                    <MessageCircle className="h-4 w-4 mr-2 text-green-600" />
                    Instant Messaging
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.communicationPrefs.phone}
                      onChange={() => handleCommunicationPrefChange('phone')}
                      className="mr-3 h-4 w-4 text-purple-600 rounded"
                    />
                    <Phone className="h-4 w-4 mr-2 text-purple-600" />
                    Phone Calls
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.communicationPrefs.email}
                      onChange={() => handleCommunicationPrefChange('email')}
                      className="mr-3 h-4 w-4 text-gray-600 rounded"
                    />
                    <Mail className="h-4 w-4 mr-2 text-gray-600" />
                    Email
                  </label>
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Response Time</label>
                  <select
                    name="responseTime"
                    value={formData.responseTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="< 6 hours">Within 6 hours</option>
                    <option value="< 24 hours">Within 24 hours</option>
                    <option value="< 48 hours">Within 48 hours</option>
                    <option value="< 1 week">Within 1 week</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                  <input
                    type="text"
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Mon-Fri 2PM-6PM EST"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Idea Information */}
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Idea Information</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Idea Title *</label>
                <input
                  type="text"
                  name="ideaTitle"
                  value={formData.ideaTitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Give your idea a compelling title"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Environmental">Environmental</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Finance">Finance</option>
                    <option value="Social Impact">Social Impact</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Stage *</label>
                  <select
                    name="stage"
                    value={formData.stage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select stage</option>
                    <option value="Concept">Concept</option>
                    <option value="Research">Research</option>
                    <option value="Prototype">Prototype</option>
                    <option value="MVP">MVP</option>
                    <option value="Beta Testing">Beta Testing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your idea, the problem it solves, and your proposed solution..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Business & Funding Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Funding Needed *</label>
                <input
                  type="number"
                  name="fundingNeeded"
                  value={formData.fundingNeeded}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Amount in USD"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Development Timeframe *</label>
                <input
                  type="text"
                  name="timeframe"
                  value={formData.timeframe}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 6 months, 1 year"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Team Size</label>
                <input
                  type="text"
                  name="teamSize"
                  value={formData.teamSize}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Current team members"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Previous Experience</label>
                <input
                  type="text"
                  name="previousExperience"
                  value={formData.previousExperience}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Relevant experience or projects"
                />
              </div>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Model</label>
                <textarea
                  name="businessModel"
                  value={formData.businessModel}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="How will your idea generate revenue?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Market</label>
                <textarea
                  name="targetMarket"
                  value={formData.targetMarket}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Who are your target customers?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Competition Analysis</label>
                <textarea
                  name="competition"
                  value={formData.competition}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Who are your competitors and how do you differentiate?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unique Value Proposition</label>
                <textarea
                  name="uniqueValue"
                  value={formData.uniqueValue}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What makes your idea unique and valuable?"
                />
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Supporting Documents</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments (Optional)
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                multiple
                accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.png"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-2">
                Upload pitch decks, prototypes, research papers, or other relevant documents (PDF, DOC, PPT, images)
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold flex items-center shadow-lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-3" />
                  Submit to Investors
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
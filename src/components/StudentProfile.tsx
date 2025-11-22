import React, { useState } from 'react'
import { User, Mail, School, BookOpen, Calendar, Award, Edit3, Save, X } from 'lucide-react'

export function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@mit.edu',
    university: 'MIT',
    major: 'Environmental Engineering',
    year: 'Senior',
    gpa: '3.8',
    bio: 'Passionate about sustainable technology and environmental solutions. Currently working on IoT-based waste management systems.',
    skills: ['IoT Development', 'Environmental Science', 'Data Analytics', 'Python', 'Arduino'],
    achievements: ['Dean\'s List 2023', 'Sustainability Innovation Award', 'Hackathon Winner'],
    interests: ['Clean Technology', 'Smart Cities', 'Environmental Impact'],
    linkedin: 'https://linkedin.com/in/alexjohnson',
    github: 'https://github.com/alexjohnson',
    portfolio: 'https://alexjohnson.dev'
  })

  const handleSave = () => {
    setIsEditing(false)
    // In a real app, this would save to the database
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-12 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-6">
                  <User className="h-12 w-12" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{profile.name}</h1>
                  <p className="text-purple-100 text-lg">{profile.major}</p>
                  <p className="text-purple-200">{profile.university} • {profile.year}</p>
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
            {/* Basic Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <p className="text-gray-900 flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    {profile.email}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">University</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.university}
                      onChange={(e) => setProfile({...profile, university: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 flex items-center">
                      <School className="h-4 w-4 mr-2 text-gray-500" />
                      {profile.university}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Major</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.major}
                      onChange={(e) => setProfile({...profile, major: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 flex items-center">
                      <BookOpen className="h-4 w-4 mr-2 text-gray-500" />
                      {profile.major}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
                  {isEditing ? (
                    <select
                      value={profile.year}
                      onChange={(e) => setProfile({...profile, year: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="Freshman">Freshman</option>
                      <option value="Sophomore">Sophomore</option>
                      <option value="Junior">Junior</option>
                      <option value="Senior">Senior</option>
                      <option value="Graduate">Graduate</option>
                      <option value="PhD">PhD</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      {profile.year}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GPA</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.gpa}
                      onChange={(e) => setProfile({...profile, gpa: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.gpa}/4.0</p>
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About Me</h2>
              {isEditing ? (
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-700">{profile.bio}</p>
              )}
            </div>

            {/* Skills */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Achievements</h2>
              <div className="space-y-2">
                {profile.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center">
                    <Award className="h-5 w-5 text-yellow-500 mr-3" />
                    <span className="text-gray-700">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Links</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={profile.linkedin}
                      onChange={(e) => setProfile({...profile, linkedin: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  ) : (
                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                      {profile.linkedin}
                    </a>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={profile.github}
                      onChange={(e) => setProfile({...profile, github: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  ) : (
                    <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                      {profile.github}
                    </a>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio</label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={profile.portfolio}
                      onChange={(e) => setProfile({...profile, portfolio: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  ) : (
                    <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                      {profile.portfolio}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
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
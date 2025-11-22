import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { User, Mail, Shield, Bell, CreditCard, Download, Check, X, Loader } from 'lucide-react'
import axios from 'axios'

export function Settings() {
  const { user } = useAuth()
  const [fullName, setFullName] = useState(user?.name || '')
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [notifications, setNotifications] = useState({
    portfolio: true,
    price: false,
    monthly: true
  })

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleUpdateProfile = async () => {
    if (!fullName.trim()) {
      showMessage('error', 'Name cannot be empty')
      return
    }

    setLoading(true)
    try {
      // await axios.put('http://localhost:5001/api/users/profile', { name: fullName })
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      showMessage('success', 'Profile updated successfully!')
    } catch (error) {
      showMessage('error', 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      showMessage('error', 'Please fill in all password fields')
      return
    }

    if (passwords.new !== passwords.confirm) {
      showMessage('error', 'New passwords do not match')
      return
    }

    if (passwords.new.length < 6) {
      showMessage('error', 'Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      // await axios.post('http://localhost:5001/api/auth/change-password', { 
      //   currentPassword: passwords.current,
      //   newPassword: passwords.new 
      // })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      showMessage('success', 'Password changed successfully!')
      setPasswords({ current: '', new: '', confirm: '' })
      setShowPasswordForm(false)
    } catch (error) {
      showMessage('error', 'Failed to change password. Please check your current password.')
    } finally {
      setLoading(false)
    }
  }

  const handleToggle2FA = async () => {
    setLoading(true)
    try {
      // await axios.post('http://localhost:5001/api/users/2fa', { enabled: !is2FAEnabled })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))

      setIs2FAEnabled(!is2FAEnabled)
      showMessage('success', !is2FAEnabled ? '2FA enabled successfully!' : '2FA disabled')
    } catch (error) {
      showMessage('error', 'Failed to update 2FA settings')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadReport = (reportType: string) => {
    showMessage('success', `${reportType} download started...`)

    // Simulate download
    setTimeout(() => {
      const element = document.createElement("a");
      const file = new Blob([`Sample ${reportType} Content`], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${reportType.replace(' ', '_')}_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
      document.body.removeChild(element);
    }, 1000)
  }

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
    // Ideally save to backend here
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account preferences and settings</p>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
          {message.type === 'success' ? (
            <Check className="h-5 w-5 mr-2" />
          ) : (
            <X className="h-5 w-5 mr-2" />
          )}
          {message.text}
        </div>
      )}

      <div className="grid gap-8 max-w-4xl">
        {/* Profile Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-6">
            <User className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || ''}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleUpdateProfile}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-70"
            >
              {loading ? <Loader className="h-5 w-5 animate-spin mr-2" /> : null}
              Update Profile
            </button>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-6">
            <Shield className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Security</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Change Password</h3>
                <p className="text-sm text-gray-600">Update your account password</p>
              </div>
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {showPasswordForm ? 'Cancel' : 'Change'}
              </button>
            </div>

            {showPasswordForm && (
              <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                <input
                  type="password"
                  placeholder="Current Password"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleChangePassword}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex justify-center items-center disabled:opacity-70"
                >
                  {loading ? <Loader className="h-4 w-4 animate-spin mr-2" /> : null}
                  Update Password
                </button>
              </div>
            )}

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-600">Add an extra layer of security</p>
              </div>
              <button
                onClick={handleToggle2FA}
                disabled={loading}
                className={`${is2FAEnabled ? 'bg-gray-600' : 'bg-green-600'
                  } text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors text-sm flex items-center disabled:opacity-70`}
              >
                {loading ? <Loader className="h-3 w-3 animate-spin mr-2" /> : null}
                {is2FAEnabled ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-6">
            <Bell className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Portfolio Updates</h3>
                <p className="text-sm text-gray-600">Get notified about portfolio performance</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notifications.portfolio}
                  onChange={() => toggleNotification('portfolio')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Price Alerts</h3>
                <p className="text-sm text-gray-600">Receive alerts for significant price changes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notifications.price}
                  onChange={() => toggleNotification('price')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Monthly Reports</h3>
                <p className="text-sm text-gray-600">Get monthly portfolio performance reports</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notifications.monthly}
                  onChange={() => toggleNotification('monthly')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Export Data */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-6">
            <Download className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Export Data</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Portfolio Report</h3>
                <p className="text-sm text-gray-600">Download a complete portfolio summary</p>
              </div>
              <button
                onClick={() => handleDownloadReport('Portfolio Report')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Download
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Transaction History</h3>
                <p className="text-sm text-gray-600">Export all your transactions as CSV</p>
              </div>
              <button
                onClick={() => handleDownloadReport('Transaction History')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { 
  Lightbulb, 
  Building2,
  Bell, 
  Search, 
  User, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react'

interface StudentStartupNavbarProps {
  currentView: string
  onViewChange: (view: string) => void
  userType: 'student' | 'startup'
}

export function StudentStartupNavbar({ currentView, onViewChange, userType }: StudentStartupNavbarProps) {
  const { user, signOut } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const config = {
    student: {
      icon: Lightbulb,
      title: 'Student Hub',
      color: 'purple',
      quickNav: [
        { id: 'ideas', label: 'Browse Ideas' },
        { id: 'my-ideas', label: 'My Ideas' },
        { id: 'startups', label: 'Startups' },
        { id: 'contact', label: 'Contact Investors' },
      ]
    },
    startup: {
      icon: Building2,
      title: 'Startup Center',
      color: 'green',
      quickNav: [
        { id: 'startups', label: 'Browse Startups' },
        { id: 'my-startup', label: 'My Startup' },
        { id: 'ideas', label: 'Student Ideas' },
        { id: 'contact', label: 'Find Investors' },
      ]
    }
  }

  const currentConfig = config[userType]
  const IconComponent = currentConfig.icon

  const notifications = [
    { id: 1, title: 'Investor showed interest in your idea', time: '2 hours ago', unread: true },
    { id: 2, title: 'New startup posted in your category', time: '4 hours ago', unread: true },
    { id: 3, title: 'Weekly digest available', time: '1 day ago', unread: false },
  ]

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setShowNotifications(false)
      setShowUserMenu(false)
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Logo and Quick Nav */}
          <div className="flex items-center space-x-4 lg:space-x-8">
            {/* Logo */}
            <div className="flex items-center">
              <IconComponent className={`h-6 w-6 sm:h-8 sm:w-8 text-${currentConfig.color}-600 mr-2 sm:mr-3`} />
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">FundsNest</h1>
                <p className={`text-xs text-${currentConfig.color}-600 hidden sm:block`}>{currentConfig.title}</p>
              </div>
            </div>

            {/* Quick Navigation - Desktop */}
            <div className="hidden lg:flex items-center space-x-1">
              {currentConfig.quickNav.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`px-3 xl:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentView === item.id
                      ? `bg-${currentConfig.color}-100 text-${currentConfig.color}-700`
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4 lg:mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={userType === 'student' ? "Search ideas, startups..." : "Search startups, ideas..."}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Right Section - Actions and User */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowNotifications(!showNotifications)
                  setShowUserMenu(false)
                }}
                className="p-2 text-gray-600 hover:text-gray-900 relative"
              >
                <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                          notification.unread ? `bg-${currentConfig.color}-50` : ''
                        }`}
                      >
                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowUserMenu(!showUserMenu)
                  setShowNotifications(false)
                }}
                className="flex items-center space-x-2 sm:space-x-3 p-2 rounded-lg hover:bg-gray-100"
              >
                <div className={`w-6 h-6 sm:w-8 sm:h-8 bg-${currentConfig.color}-100 rounded-full flex items-center justify-center`}>
                  <User className={`h-3 w-3 sm:h-4 sm:w-4 text-${currentConfig.color}-600`} />
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {user?.email?.split('@')[0]}
                </span>
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                    <p className={`text-xs text-${currentConfig.color}-600 capitalize`}>{userType} Account</p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => {
                        onViewChange('profile')
                        setShowUserMenu(false)
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="h-4 w-4 mr-3" />
                      My Profile
                    </button>
                    <button
                      onClick={() => {
                        onViewChange('settings')
                        setShowUserMenu(false)
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Settings
                    </button>
                    <button
                      onClick={signOut}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden mt-4 pt-4 border-t border-gray-200">
            {/* Mobile Search */}
            <div className="mb-4 md:hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              {currentConfig.quickNav.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id)
                    setShowMobileMenu(false)
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentView === item.id
                      ? `bg-${currentConfig.color}-100 text-${currentConfig.color}-700`
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
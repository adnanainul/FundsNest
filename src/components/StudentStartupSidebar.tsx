import React from 'react'
import {
  Lightbulb,
  Building2,
  User,
  Mail,
  PlusCircle,
  Settings as SettingsIcon,
  Search,
  Heart,
  ChevronLeft,
  ChevronRight,
  TrendingUp
} from 'lucide-react'

interface StudentStartupSidebarProps {
  currentView: string
  onViewChange: (view: string) => void
  userType: 'student' | 'startup'
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export function StudentStartupSidebar({ currentView, onViewChange, userType, isCollapsed, onToggleCollapse }: StudentStartupSidebarProps) {
  const studentMenuItems = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'ideas', label: 'Browse Ideas', icon: Search },
    { id: 'my-ideas', label: 'My Ideas', icon: Lightbulb },
    { id: 'startups', label: 'Startup Profiles', icon: Building2 },
    { id: 'contact', label: 'Contact Investors', icon: Mail },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ]

  const startupMenuItems = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'startups', label: 'Browse Startups', icon: Search },
    { id: 'my-startup', label: 'My Startup', icon: Building2 },
    { id: 'ideas', label: 'Student Ideas', icon: Lightbulb },
    { id: 'contact', label: 'Find Investors', icon: Mail },
    { id: 'pitch-analysis', label: 'Pitch Analysis', icon: TrendingUp },
    { id: 'profile', label: 'Company Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ]

  const menuItems = userType === 'student' ? studentMenuItems : startupMenuItems
  const colorClass = userType === 'student' ? 'purple' : 'green'

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white shadow-lg border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out relative`}>
      {/* Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className={`absolute -right-3 top-6 w-6 h-6 bg-${colorClass}-600 text-white rounded-full flex items-center justify-center hover:bg-${colorClass}-700 transition-colors z-10 shadow-lg`}
      >
        {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id

            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-4'} py-3 text-left rounded-lg transition-colors group relative ${isActive
                    ? `bg-${colorClass}-50 text-${colorClass}-600 border border-${colorClass}-200`
                    : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon className={`h-5 w-5 ${isActive ? `text-${colorClass}-600` : 'text-gray-500'} ${isCollapsed ? '' : 'mr-3'}`} />
                  {!isCollapsed && <span className="font-medium">{item.label}</span>}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                      {item.label}
                    </div>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => onViewChange(userType === 'student' ? 'my-ideas' : 'my-startup')}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-center px-4'} py-3 bg-${colorClass}-600 text-white rounded-lg hover:bg-${colorClass}-700 transition-colors font-medium group relative`}
          title={isCollapsed ? (userType === 'student' ? 'Post New Idea' : 'Update Startup') : ''}
        >
          <PlusCircle className={`h-5 w-5 ${isCollapsed ? '' : 'mr-2'}`} />
          {!isCollapsed && (userType === 'student' ? 'Post New Idea' : 'Update Startup')}

          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
              {userType === 'student' ? 'Post New Idea' : 'Update Startup'}
            </div>
          )}
        </button>
      </div>
    </div>
  )
}
import React from 'react'
import {
  LayoutDashboard,
  PieChart,
  TrendingUp,
  History,
  Target,
  Settings as SettingsIcon,
  Building2,
  Lightbulb,
  Users,
  Mail,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface InvestorSidebarProps {
  currentView: string
  onViewChange: (view: string) => void
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export function InvestorSidebar({ currentView, onViewChange, isCollapsed, onToggleCollapse }: InvestorSidebarProps) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'startups', label: 'Startup Profiles', icon: Building2 },
    { id: 'ideas', label: 'Student Ideas', icon: Lightbulb },
    { id: 'investors', label: 'Other Investors', icon: Users },
    { id: 'requests', label: 'Student Requests', icon: Mail },
    { id: 'profile', label: 'My Profile', icon: Users },
    { id: 'portfolio', label: 'My Portfolio', icon: PieChart },
    { id: 'funds', label: 'Available Funds', icon: TrendingUp },
    { id: 'transactions', label: 'Transactions', icon: History },
    { id: 'goals', label: 'Investment Goals', icon: Target },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ]

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white shadow-lg border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out relative`}>
      {/* Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-6 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors z-10 shadow-lg"
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
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500'} ${isCollapsed ? '' : 'mr-3'}`} />
                  {!isCollapsed && <span className="font-medium">{item.label}</span>}
                  {item.id === 'requests' && !isCollapsed && (
                    <span className="ml-auto bg-green-500 text-white text-xs px-2 py-1 rounded-full">3</span>
                  )}
                  {item.id === 'requests' && isCollapsed && (
                    <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">3</span>
                  )}

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
    </div>
  )
}
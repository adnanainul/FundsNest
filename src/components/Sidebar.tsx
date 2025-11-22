import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { 
  LayoutDashboard, 
  PieChart, 
  TrendingUp, 
  History, 
  Target, 
  Settings as SettingsIcon,
  Building2,
  Lightbulb,
  Users
} from 'lucide-react'

interface SidebarProps {
  currentView: string
  onViewChange: (view: string) => void
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'portfolio', label: 'Portfolio', icon: PieChart },
    { id: 'funds', label: 'Funds', icon: TrendingUp },
    { id: 'startups', label: 'Startup Profiles', icon: Building2 },
    { id: 'investors', label: 'Investor Profiles', icon: Users },
    { id: 'ideas', label: 'Student Ideas', icon: Lightbulb },
    { id: 'transactions', label: 'Transactions', icon: History },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ]

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
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
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
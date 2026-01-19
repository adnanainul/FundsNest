import React, { useState } from 'react'
import { InvestorNavbar } from './InvestorNavbar'
import { InvestorSidebar } from './InvestorSidebar'
import { Overview } from './Overview'
import { Portfolio } from './Portfolio'
import { Funds } from './Funds'
import { Transactions } from './Transactions'
import { Goals } from './Goals'
import { Settings } from './Settings'
import { StartupProfiles } from './StartupProfiles'
import { StudentIdeas } from './StudentIdeas'
import { InvestorProfiles } from './InvestorProfiles'
import { StudentRequests } from './StudentRequests'
import { InvestorProfilePage } from './InvestorProfilePage'

type View = 'overview' | 'portfolio' | 'funds' | 'transactions' | 'goals' | 'settings' | 'startups' | 'ideas' | 'investors' | 'requests' | 'profile'

export function InvestorDashboard() {
  const [currentView, setCurrentView] = useState<View>('overview')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return <Overview />
      case 'portfolio':
        return <Portfolio />
      case 'funds':
        return <Funds />
      case 'transactions':
        return <Transactions />
      case 'goals':
        return <Goals />
      case 'settings':
        return <Settings />
      case 'startups':
        return <StartupProfiles />
      case 'ideas':
        return <StudentIdeas />
      case 'investors':
        return <InvestorProfiles />
      case 'requests':
        return <StudentRequests />
      case 'profile':
        return <InvestorProfilePage />
      default:
        return <Overview />
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <InvestorNavbar currentView={currentView} onViewChange={(view) => setCurrentView(view as View)} />
      <div className="flex flex-1 overflow-hidden">
        <InvestorSidebar
          currentView={currentView}
          onViewChange={(view) => setCurrentView(view as View)}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  )
}
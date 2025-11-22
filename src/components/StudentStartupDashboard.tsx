import React, { useState } from 'react'
import { StudentStartupNavbar } from './StudentStartupNavbar'
import { StudentStartupSidebar } from './StudentStartupSidebar'
import { StudentIdeas } from './StudentIdeas'
import { StartupProfiles } from './StartupProfiles'
import { StudentProfile } from './StudentProfile'
import { StartupProfile } from './StartupProfile'
import { ContactInvestors } from './ContactInvestors'
import { MyIdeas } from './MyIdeas'
import { MyStartup } from './MyStartup'
import { Settings } from './Settings'

type View = 'ideas' | 'startups' | 'profile' | 'contact' | 'my-ideas' | 'my-startup' | 'settings'

interface StudentStartupDashboardProps {
  userType: 'student' | 'startup'
}

export function StudentStartupDashboard({ userType }: StudentStartupDashboardProps) {
  const [currentView, setCurrentView] = useState<View>(userType === 'student' ? 'ideas' : 'startups')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const renderView = () => {
    switch (currentView) {
      case 'ideas':
        return <StudentIdeas />
      case 'startups':
        return <StartupProfiles />
      case 'profile':
        return userType === 'student' ? <StudentProfile /> : <StartupProfile />
      case 'contact':
        return <ContactInvestors />
      case 'my-ideas':
        return <MyIdeas />
      case 'my-startup':
        return <MyStartup />
      case 'settings':
        return <Settings />
      default:
        return userType === 'student' ? <StudentIdeas /> : <StartupProfiles />
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <StudentStartupNavbar currentView={currentView} onViewChange={setCurrentView} userType={userType} />
      <div className="flex flex-1 overflow-hidden">
        <StudentStartupSidebar 
          currentView={currentView} 
          onViewChange={setCurrentView} 
          userType={userType}
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
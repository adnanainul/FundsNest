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
// @ts-ignore
import PitchAnalysisView from './PitchAnalysisView'
import { CallList } from './CallList'

type View = 'overview' | 'ideas' | 'startups' | 'profile' | 'contact' | 'my-ideas' | 'my-startup' | 'settings' | 'pitch-analysis'

interface StudentStartupDashboardProps {
  userType: 'student' | 'startup'
}

export function StudentStartupDashboard({ userType }: StudentStartupDashboardProps) {
  const [currentView, setCurrentView] = useState<View>('overview')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return null // Handled in main render
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
      case 'pitch-analysis':
        return <PitchAnalysisView />
      default:
        return userType === 'student' ? <StudentIdeas /> : <StartupProfiles />
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <StudentStartupNavbar currentView={currentView} onViewChange={(view) => setCurrentView(view as View)} userType={userType} />
      <div className="flex flex-1 overflow-hidden">
        <StudentStartupSidebar
          currentView={currentView}
          onViewChange={(view) => setCurrentView(view as View)}
          userType={userType}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 overflow-y-auto">
          {renderView()}
          {currentView === 'overview' && (
            <div className="p-8">
              <CallList />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
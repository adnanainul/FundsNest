import React, { useState } from 'react'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { Overview } from './Overview'
import { Portfolio } from './Portfolio'
import { Funds } from './Funds'
import { Transactions } from './Transactions'
import { Goals } from './Goals'
import { Settings } from './Settings'
import { StartupProfiles } from './StartupProfiles'
import { StudentIdeas } from './StudentIdeas'
import { InvestorProfiles } from './InvestorProfiles'

type View = 'overview' | 'portfolio' | 'funds' | 'transactions' | 'goals' | 'settings' | 'startups' | 'ideas' | 'investors'

export function Dashboard() {
  const [currentView, setCurrentView] = useState<View>('overview')

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
      default:
        return <Overview />
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar currentView={currentView} onViewChange={setCurrentView} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        <main className="flex-1 overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  )
}
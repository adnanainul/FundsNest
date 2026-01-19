import { useAuth } from './hooks/useAuth'
import { ResponsiveAuth } from './components/ResponsiveAuth'
import { DeviceAdaptiveLayout } from './components/DeviceAdaptiveLayout'
import { InvestorDashboard } from './components/InvestorDashboard'
import { StudentStartupDashboard } from './components/StudentStartupDashboard'
import { CallManager } from './components/CallManager'

function App() {
  try {
    console.log('App component rendering...')
    const { user, userType, loading } = useAuth()
    console.log('Auth state:', { user, userType, loading })

    if (loading) {
      console.log('Showing loading state')
      return (
        <DeviceAdaptiveLayout>
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </DeviceAdaptiveLayout>
      )
    }

    if (!user || !userType) {
      console.log('Showing auth page')
      return (
        <DeviceAdaptiveLayout>
          <ResponsiveAuth />
        </DeviceAdaptiveLayout>
      )
    }

    // Render different dashboards based on user type
    if (userType === 'investor') {
      console.log('Showing investor dashboard')
      return (
        <DeviceAdaptiveLayout>
          <CallManager />
          <InvestorDashboard />
        </DeviceAdaptiveLayout>
      )
    }

    if (userType === 'student' || userType === 'startup') {
      console.log('Showing student/startup dashboard')
      return (
        <DeviceAdaptiveLayout>
          <CallManager />
          <StudentStartupDashboard userType={userType} />
        </DeviceAdaptiveLayout>
      )
    }

    console.log('Showing default auth page')
    return (
      <DeviceAdaptiveLayout>
        <ResponsiveAuth />
      </DeviceAdaptiveLayout>
    )
  } catch (error) {
    console.error('Error in App component:', error)
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h1>Error loading application</h1>
        <pre>{error instanceof Error ? error.message : String(error)}</pre>
      </div>
    )
  }
}

export default App
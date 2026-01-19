import React, { useState, useEffect } from 'react'

interface DeviceAdaptiveLayoutProps {
  children: React.ReactNode
}

export function DeviceAdaptiveLayout({ children }: DeviceAdaptiveLayoutProps) {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape')

  useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      // Determine device type
      if (width < 768) {
        setDeviceType('mobile')
      } else if (width < 1024) {
        setDeviceType('tablet')
      } else {
        setDeviceType('desktop')
      }
      
      // Determine orientation
      setOrientation(width > height ? 'landscape' : 'portrait')
    }

    updateDeviceType()
    window.addEventListener('resize', updateDeviceType)
    window.addEventListener('orientationchange', updateDeviceType)

    return () => {
      window.removeEventListener('resize', updateDeviceType)
      window.removeEventListener('orientationchange', updateDeviceType)
    }
  }, [])

  return (
    <div 
      className={`device-adaptive ${deviceType} ${orientation}`}
      data-device={deviceType}
      data-orientation={orientation}
    >
      {children}
    </div>
  )
}
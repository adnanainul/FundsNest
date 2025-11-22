import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { TrendingUp, Shield, BarChart3, Users, Lightbulb, Building2, ChevronLeft, ChevronRight, Smartphone, Tablet, Monitor } from 'lucide-react'

const backgroundImages = [
  'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080',
  'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080',
  'https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080',
  'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080',
  'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080'
]

export function ResponsiveAuth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState<'investor' | 'student' | 'startup'>('investor')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted', { isLogin, email, userType })
    setLoading(true)
    setError('')

    const result = isLogin
      ? await signIn(email, password, userType)
      : await signUp(email, password, userType)

    console.log('Auth result:', result)

    if (result.error) {
      console.log('Setting error:', result.error)
      setError(result.error)
    } else {
      console.log('Auth successful!')
    }

    setLoading(false)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + backgroundImages.length) % backgroundImages.length)
  }

  const userTypeConfig = {
    investor: {
      title: 'Investor Portal',
      subtitle: 'Discover and invest in innovative startups',
      icon: TrendingUp,
      color: 'blue',
      gradient: 'from-blue-600 to-purple-600',
      features: [
        { icon: Shield, text: 'Secure investment platform' },
        { icon: BarChart3, text: 'Advanced analytics & insights' },
        { icon: Building2, text: 'Curated startup opportunities' }
      ]
    },
    student: {
      title: 'Student Hub',
      subtitle: 'Share your ideas and connect with investors',
      icon: Lightbulb,
      color: 'purple',
      gradient: 'from-purple-600 to-pink-600',
      features: [
        { icon: Lightbulb, text: 'Showcase innovative ideas' },
        { icon: Users, text: 'Connect with mentors' },
        { icon: TrendingUp, text: 'Get funding opportunities' }
      ]
    },
    startup: {
      title: 'Startup Center',
      subtitle: 'Grow your business and find investors',
      icon: Building2,
      color: 'green',
      gradient: 'from-green-600 to-blue-600',
      features: [
        { icon: Building2, text: 'Company profile management' },
        { icon: Users, text: 'Investor networking' },
        { icon: BarChart3, text: 'Performance tracking' }
      ]
    }
  }

  const currentConfig = userTypeConfig[userType]
  const IconComponent = currentConfig.icon

  // Auto-advance images every 5 seconds
  React.useEffect(() => {
    const interval = setInterval(nextImage, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Mobile Layout (< 768px) */}
      <div className="block md:hidden min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
        {/* Mobile Background */}
        <div className="absolute inset-0 z-0">
          {backgroundImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-20' : 'opacity-0'
                }`}
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          ))}
        </div>

        {/* Mobile Content */}
        <div className="relative z-10 flex flex-col min-h-screen p-4">
          {/* Mobile Header */}
          <div className="text-center pt-8 pb-6">
            <div className="flex items-center justify-center mb-4">
              <div className={`w-16 h-16 bg-gradient-to-br ${currentConfig.gradient} rounded-2xl flex items-center justify-center mr-4 shadow-2xl`}>
                <IconComponent className="h-8 w-8 text-white" />
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold">FundsNest</h1>
                <p className="text-sm opacity-80">{currentConfig.title}</p>
              </div>
            </div>
            <p className="text-white/90 text-lg px-4">{currentConfig.subtitle}</p>
          </div>

          {/* Mobile Form */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-sm">
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/20">
                {/* User Type Selection - Mobile Stack */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                    Choose Your Role
                  </label>
                  <div className="space-y-3">
                    {Object.entries(userTypeConfig).map(([type, config]) => {
                      const TypeIcon = config.icon
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setUserType(type as any)}
                          className={`w-full flex items-center p-4 rounded-2xl border-2 transition-all ${userType === type
                            ? `border-${config.color}-500 bg-gradient-to-r ${config.gradient} text-white shadow-lg`
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                        >
                          <TypeIcon className="h-6 w-6 mr-3" />
                          <div className="text-left">
                            <span className="font-semibold capitalize">{type}</span>
                            <p className="text-xs opacity-80">{config.title}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <h2 className="text-xl font-bold text-center mb-6 text-gray-900">
                  {isLogin ? 'Welcome Back' : 'Join Innovation'}
                </h2>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/90 backdrop-blur-sm text-base"
                      placeholder="Email Address"
                      required
                    />
                  </div>

                  <div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/90 backdrop-blur-sm text-base"
                      placeholder="Password"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-gradient-to-r ${currentConfig.gradient} text-white py-4 px-4 rounded-2xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-base`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Please wait...
                      </div>
                    ) : (
                      isLogin ? 'Sign In' : 'Create Account'
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className={`text-${currentConfig.color}-600 hover:text-${currentConfig.color}-700 font-medium transition-colors text-sm`}
                  >
                    {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Device Indicator */}
          <div className="text-center pb-4">
            <div className="flex items-center justify-center text-white/60">
              <Smartphone className="h-4 w-4 mr-2" />
              <span className="text-xs">Mobile Experience</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tablet Layout (768px - 1023px) */}
      <div className="hidden md:block lg:hidden min-h-screen bg-gradient-to-br from-gray-800 via-blue-800 to-purple-800 relative overflow-hidden">
        {/* Tablet Background */}
        <div className="absolute inset-0 z-0">
          {backgroundImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-25' : 'opacity-0'
                }`}
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          ))}
        </div>

        {/* Tablet Content - Split Layout */}
        <div className="relative z-10 flex min-h-screen">
          {/* Left Panel - Branding */}
          <div className="w-1/2 flex flex-col justify-center p-8">
            <div className="text-white">
              <div className="flex items-center mb-8">
                <div className={`w-20 h-20 bg-gradient-to-br ${currentConfig.gradient} rounded-3xl flex items-center justify-center mr-6 shadow-2xl`}>
                  <IconComponent className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">FundsNest</h1>
                  <p className="text-white/80 text-lg">{currentConfig.title}</p>
                </div>
              </div>

              <h2 className="text-3xl font-bold mb-4">{currentConfig.subtitle}</h2>

              <div className="space-y-6 mb-8">
                {currentConfig.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4">
                      <feature.icon className="h-7 w-7" />
                    </div>
                    <span className="text-white/90 text-xl">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Tablet Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-white/80 text-sm">Startups</div>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                  <div className="text-3xl font-bold">$50M+</div>
                  <div className="text-white/80 text-sm">Invested</div>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                  <div className="text-3xl font-bold">1000+</div>
                  <div className="text-white/80 text-sm">Students</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="w-1/2 flex items-center justify-center p-8">
            <div className="w-full max-w-md">
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
                {/* User Type Selection - Tablet Grid */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                    Select Your Role
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.entries(userTypeConfig).map(([type, config]) => {
                      const TypeIcon = config.icon
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setUserType(type as any)}
                          className={`p-4 rounded-2xl border-2 transition-all transform hover:scale-105 ${userType === type
                            ? `border-${config.color}-500 bg-gradient-to-br ${config.gradient} text-white shadow-lg`
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                        >
                          <TypeIcon className="h-8 w-8 mx-auto mb-2" />
                          <span className="text-sm font-medium capitalize block">{type}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                  {isLogin ? 'Welcome Back' : 'Join the Innovation'}
                </h2>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/80 backdrop-blur-sm"
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/80 backdrop-blur-sm"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-gradient-to-r ${currentConfig.gradient} text-white py-3 px-4 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium transform hover:scale-105`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Please wait...
                      </div>
                    ) : (
                      isLogin ? 'Sign In' : 'Create Account'
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className={`text-${currentConfig.color}-600 hover:text-${currentConfig.color}-700 font-medium transition-colors`}
                  >
                    {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                  </button>
                </div>
              </div>

              {/* Tablet Device Indicator */}
              <div className="text-center mt-4">
                <div className="flex items-center justify-center text-white/60">
                  <Tablet className="h-4 w-4 mr-2" />
                  <span className="text-xs">Tablet Experience</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout (>= 1024px) */}
      <div className="hidden lg:flex min-h-screen relative overflow-hidden">
        {/* Desktop Background Image Slider */}
        <div className="absolute inset-0 z-0">
          {backgroundImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-30' : 'opacity-0'
                }`}
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-black/30" />
        </div>

        {/* Desktop Image Navigation */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Desktop Image Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
            />
          ))}
        </div>

        {/* Desktop Left Panel - Enhanced Branding */}
        <div className="w-1/2 relative z-10">
          <div className={`w-full bg-gradient-to-br ${currentConfig.gradient} p-12 flex flex-col justify-center backdrop-blur-sm bg-opacity-90 min-h-screen`}>
            <div className="text-white">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-6">
                  <IconComponent className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">FundsNest</h1>
                  <p className="text-white/80">Innovation Ecosystem</p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4">{currentConfig.title}</h2>
                <p className="text-white/90 mb-8 text-xl leading-relaxed">
                  {currentConfig.subtitle}
                </p>
              </div>

              <div className="space-y-6 mb-12">
                {currentConfig.features.map((feature, index) => (
                  <div key={index} className="flex items-center group">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4 group-hover:bg-white/30 transition-all">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <span className="text-white/90 text-lg">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Desktop Enhanced Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all">
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-white/80 text-sm">Startups</div>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all">
                  <div className="text-3xl font-bold">$50M+</div>
                  <div className="text-white/80 text-sm">Invested</div>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all">
                  <div className="text-3xl font-bold">1000+</div>
                  <div className="text-white/80 text-sm">Students</div>
                </div>
              </div>

              {/* Desktop Device Indicator */}
              <div className="mt-8 flex items-center justify-center text-white/60">
                <Monitor className="h-4 w-4 mr-2" />
                <span className="text-sm">Desktop Experience</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Right Panel - Enhanced Auth Form */}
        <div className="w-1/2 flex items-center justify-center p-8 relative z-10">
          <div className="w-full max-w-md">
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
              {/* User Type Selection - Desktop Enhanced */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  I am a:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(userTypeConfig).map(([type, config]) => {
                    const TypeIcon = config.icon
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setUserType(type as any)}
                        className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${userType === type
                          ? `border-${config.color}-500 bg-gradient-to-br ${config.gradient} text-white shadow-lg`
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                      >
                        <TypeIcon className="h-6 w-6 mx-auto mb-2" />
                        <span className="text-xs font-medium capitalize">{type}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                {isLogin ? 'Welcome Back' : 'Join the Innovation'}
              </h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/80 backdrop-blur-sm"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/80 backdrop-blur-sm"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-gradient-to-r ${currentConfig.gradient} text-white py-3 px-4 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium transform hover:scale-105`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Please wait...
                    </div>
                  ) : (
                    isLogin ? 'Sign In' : 'Create Account'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className={`text-${currentConfig.color}-600 hover:text-${currentConfig.color}-700 font-medium transition-colors`}
                >
                  {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
              </div>

              {/* Social Proof */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-center text-sm text-gray-600 mb-4">Trusted by innovators worldwide</p>
                <div className="flex justify-center space-x-6 opacity-60">
                  <div className="text-xs font-medium">MIT</div>
                  <div className="text-xs font-medium">Stanford</div>
                  <div className="text-xs font-medium">Harvard</div>
                  <div className="text-xs font-medium">Y Combinator</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
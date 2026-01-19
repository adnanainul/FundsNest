import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { TrendingUp, Shield, BarChart3, Users, Lightbulb, Building2, ChevronLeft, ChevronRight } from 'lucide-react'

const backgroundImages = [
  'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080',
  'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080',
  'https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080',
  'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080',
  'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080'
]

export function Auth() {
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
    setLoading(true)
    setError('')

    const { error } = isLogin
      ? await signIn(email, password, userType)
      : await signUp(email, password, userType)

    if (error) {
      setError(error.message)
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
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background Image Slider */}
      <div className="absolute inset-0 z-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-30' : 'opacity-0'
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

      {/* Image Navigation - Hidden on mobile */}
      <button
        onClick={prevImage}
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
      >
        <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
      </button>
      <button
        onClick={nextImage}
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
      >
        <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
      </button>

      {/* Image Indicators */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
              index === currentImageIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Left Panel - Branding - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10">
        <div className={`w-full bg-gradient-to-br ${currentConfig.gradient} p-8 xl:p-12 flex flex-col justify-center backdrop-blur-sm bg-opacity-90`}>
          <div className="text-white">
            <div className="flex items-center mb-6 xl:mb-8">
              <div className="w-12 h-12 xl:w-16 xl:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4 xl:mr-6">
                <IconComponent className="h-6 w-6 xl:h-8 xl:w-8" />
              </div>
              <div>
                <h1 className="text-2xl xl:text-4xl font-bold">FundsNest</h1>
                <p className="text-white/80 text-sm xl:text-base">Innovation Ecosystem</p>
              </div>
            </div>
            
            <div className="mb-6 xl:mb-8">
              <h2 className="text-2xl xl:text-3xl font-bold mb-3 xl:mb-4">{currentConfig.title}</h2>
              <p className="text-white/90 mb-6 xl:mb-8 text-lg xl:text-xl leading-relaxed">
                {currentConfig.subtitle}
              </p>
            </div>
            
            <div className="space-y-4 xl:space-y-6">
              {currentConfig.features.map((feature, index) => (
                <div key={index} className="flex items-center group">
                  <div className="w-10 h-10 xl:w-12 xl:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-3 xl:mr-4 group-hover:bg-white/30 transition-all">
                    <feature.icon className="h-5 w-5 xl:h-6 xl:w-6" />
                  </div>
                  <span className="text-white/90 text-base xl:text-lg">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-8 xl:mt-12 grid grid-cols-3 gap-4 xl:gap-6">
              <div className="text-center">
                <div className="text-xl xl:text-3xl font-bold">500+</div>
                <div className="text-white/80 text-xs xl:text-sm">Startups</div>
              </div>
              <div className="text-center">
                <div className="text-xl xl:text-3xl font-bold">$50M+</div>
                <div className="text-white/80 text-xs xl:text-sm">Invested</div>
              </div>
              <div className="text-center">
                <div className="text-xl xl:text-3xl font-bold">1000+</div>
                <div className="text-white/80 text-xs xl:text-sm">Students</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="text-center mb-6 sm:mb-8 lg:hidden">
            <div className="flex items-center justify-center mb-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${currentConfig.gradient} rounded-xl flex items-center justify-center mr-3`}>
                <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">FundsNest</h1>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/20">
            {/* User Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I am a:
              </label>
              <div className="grid grid-cols-3 gap-1 sm:gap-2">
                {Object.entries(userTypeConfig).map(([type, config]) => {
                  const TypeIcon = config.icon
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setUserType(type as any)}
                      className={`p-2 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all transform hover:scale-105 ${
                        userType === type
                          ? `border-${config.color}-500 bg-gradient-to-br ${config.gradient} text-white shadow-lg`
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <TypeIcon className="h-4 w-4 sm:h-6 sm:w-6 mx-auto mb-1 sm:mb-2" />
                      <span className="text-xs font-medium capitalize">{type}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-900">
              {isLogin ? 'Welcome Back' : 'Join the Innovation'}
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/80 backdrop-blur-sm text-sm sm:text-base"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/80 backdrop-blur-sm text-sm sm:text-base"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r ${currentConfig.gradient} text-white py-3 px-4 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium transform hover:scale-105 text-sm sm:text-base`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
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
                className={`text-${currentConfig.color}-600 hover:text-${currentConfig.color}-700 font-medium transition-colors text-sm sm:text-base`}
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>

            {/* Social Proof */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
              <p className="text-center text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">Trusted by innovators worldwide</p>
              <div className="flex justify-center space-x-3 sm:space-x-6 opacity-60">
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
  )
}
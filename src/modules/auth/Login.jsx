import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
} from 'lucide-react'
import logoBlack from '../../assets/Domine-Dude_black.png'
import { Button } from '../../components/common'

export const Login = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('admin@domaindude.in')
  const [password, setPassword] = useState('••••••••')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleQuickFill = () => {
    setEmail('admin@domaindude.in')
    setPassword('DomainDude@2026')
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!email.trim()) {
      setError('Please enter your email address')
      return
    }

    if (!password) {
      setError('Please enter your password')
      return
    }

    setIsLoading(true)

    // Simulate authenticating and initializing session
    setTimeout(() => {
      setIsLoading(false)
      try {
        localStorage.setItem(
          'proposalos_session',
          JSON.stringify({
            user: {
              name: 'Alex Morgan',
              email: email.trim(),
              role: 'Administrator',
            },
            authenticatedAt: new Date().toISOString(),
          })
        )
      } catch {
        // Fallback for private mode
      }
      navigate('/')
    }, 600)
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F8F9FB] select-none">
      {/* 1. Left Side: Brand Image Section */}
      <div className="relative hidden lg:block lg:w-1/2 xl:w-7/12 bg-gray-100 overflow-hidden">
        {/* Public Folder Image */}
        <img
          src="/8274.jpg"
          alt="ProposalOS Work Environment"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* 2. Right Side: Login Form Section */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 lg:p-14 xl:p-16 bg-white min-h-screen">
        {/* Top Header Logo */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src={logoBlack}
              alt="Domain Dude"
              className="h-7 w-auto object-contain"
            />
          </div>

          <button
            type="button"
            onClick={handleQuickFill}
            className="text-[11px] font-semibold text-[#0055FF] bg-blue-50 hover:bg-blue-100/80 px-2.5 py-1 rounded-lg border border-blue-100 transition-colors cursor-pointer"
            title="Auto-fill demo credentials"
          >
            Auto-Fill Demo
          </button>
        </div>

        {/* Center Auth Card */}
        <div className="max-w-md w-full mx-auto my-auto py-8">
          <div className="space-y-1 mb-8">
            <h1 className="text-2xl font-bold text-gray-950 tracking-tight">
              Sign in to your account
            </h1>
            <p className="text-xs text-gray-500">
              Welcome back! Please enter your email and password to access your proposals.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domaindude.in"
                  className="w-full h-10 pl-9 pr-3 text-xs text-gray-900 bg-white border border-gray-200 rounded-xl shadow-2xs focus:border-[#0055FF] focus:ring-2 focus:ring-[#0055FF]/20 focus:outline-none transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-gray-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault()
                    alert('Password reset link has been dispatched to your email address.')
                  }}
                  className="text-[11px] font-semibold text-[#0055FF] hover:text-[#0044CC] transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-10 pl-9 pr-10 text-xs text-gray-900 bg-white border border-gray-200 rounded-xl shadow-2xs focus:border-[#0055FF] focus:ring-2 focus:ring-[#0055FF]/20 focus:outline-none transition-all placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#0055FF] focus:ring-[#0055FF] cursor-pointer"
                />
                <span className="text-gray-600 font-medium">
                  Remember me for 30 days
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={isLoading}
              className="w-full h-10 text-xs font-semibold rounded-xl justify-center shadow-xs"
              rightIcon={ArrowRight}
            >
              Sign In to Workspace
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login

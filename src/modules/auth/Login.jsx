import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Send,
} from 'lucide-react'
import logoBlack from '../../assets/Domine-Dude_black.png'
import { Button } from '../../components/common'
import authService from '../../services/auth.service'

export const Login = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // View modes: 'login' | 'forgot' | 'reset'
  const [view, setView] = useState('login')

  // Login form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSuccess, setForgotSuccess] = useState(false)

  // Reset password state
  const [resetToken, setResetToken] = useState('')
  const [resetEmail, setResetEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)

  // Shared UI states
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successNotice, setSuccessNotice] = useState(null)

  // Check if URL has reset token (?token=...&email=...)
  useEffect(() => {
    const token = searchParams.get('token')
    const emailParam = searchParams.get('email')

    if (token) {
      setResetToken(token)
      if (emailParam) setResetEmail(emailParam)
      setView('reset')
    }
  }, [searchParams])

  const extractErrorMessage = (err, defaultMsg = 'An error occurred. Please try again.') => {
    if (err.response?.data?.errors) {
      const errors = err.response.data.errors
      const firstField = Object.keys(errors)[0]
      if (Array.isArray(errors[firstField]) && errors[firstField][0]) {
        return errors[firstField][0]
      }
    }
    return err.response?.data?.message || err.message || defaultMsg
  }

  // 1. Submit Login
  const handleLoginSubmit = async (e) => {
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

    try {
      // Call POST /auth/login
      const result = await authService.login({
        email: email.trim(),
        password: password,
      })

      // Store proposalos_session for backward compatibility if needed
      try {
        localStorage.setItem(
          'proposalos_session',
          JSON.stringify({
            user: result.user || {
              name: 'Administrator',
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
    } catch (err) {
      // If backend API returned error or connection failed
      console.warn('Backend login attempt returned:', err)
      const errorMsg = extractErrorMessage(err, 'Invalid credentials. Please verify your email and password.')
      setError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  // 2. Submit Forgot Password
  const handleForgotSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!forgotEmail.trim()) {
      setError('Please enter your email address')
      return
    }

    setIsLoading(true)

    try {
      // Call POST /auth/forgot-password
      await authService.forgotPassword({
        email: forgotEmail.trim(),
      })
      setForgotSuccess(true)
    } catch (err) {
      console.warn('Forgot password request error:', err)
      const errorMsg = extractErrorMessage(err, 'Unable to send reset instructions. Please check your email and try again.')
      setError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  // 3. Submit Reset Password
  const handleResetSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      // Call POST /auth/reset-password
      await authService.resetPassword({
        token: resetToken,
        email: resetEmail.trim(),
        password: newPassword,
        password_confirmation: confirmPassword,
      })
      setResetSuccess(true)
      setTimeout(() => {
        setView('login')
        setSuccessNotice('Password successfully reset! You can now sign in with your new credentials.')
        setResetSuccess(false)
      }, 2000)
    } catch (err) {
      console.warn('Reset password error:', err)
      const errorMsg = extractErrorMessage(err, 'Invalid or expired password reset token.')
      setError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const switchView = (newView) => {
    setView(newView)
    setError(null)
    setForgotSuccess(false)
    setResetSuccess(false)
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F8F9FB] select-none">
      {/* 1. Left Side: Brand Image Section */}
      <div className="relative hidden lg:block lg:w-1/2 xl:w-7/12 bg-gray-100 overflow-hidden">
        <img
          src="/8274.jpg"
          alt="ProposalOS Work Environment"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* 2. Right Side: Auth Container */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 lg:p-14 xl:p-16 bg-white min-h-screen">
        {/* Top Header Logo */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src={logoBlack}
              alt="ProposalOS"
              className="h-7 w-auto object-contain"
            />
          </div>
        </div>

        {/* Center Auth Card */}
        <div className="max-w-md w-full mx-auto my-auto py-8">
          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* Success Notification Banner */}
          {successNotice && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2.5 animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <span className="leading-relaxed">{successNotice}</span>
            </div>
          )}

          {/* VIEW 1: LOGIN FORM */}
          {view === 'login' && (
            <>
              <div className="space-y-1 mb-8">
                <h1 className="text-2xl font-bold text-gray-950 tracking-tight">
                  Sign in to your account
                </h1>
                <p className="text-xs text-gray-500">
                  Welcome back! Please enter your email and password to access your proposals.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-5">
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
                      placeholder="name@company.com"
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
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(email)
                        switchView('forgot')
                      }}
                      className="text-[11px] font-semibold text-[#0055FF] hover:text-[#0044CC] transition-colors cursor-pointer"
                    >
                      Forgot password?
                    </button>
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
                      title={showPassword ? 'Hide password' : 'Show password'}
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
            </>
          )}

          {/* VIEW 2: FORGOT PASSWORD FORM */}
          {view === 'forgot' && (
            <>
              {forgotSuccess ? (
                <div className="text-center py-4 space-y-4 animate-in fade-in duration-200">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-2xs">
                    <CheckCircle2 className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-950 tracking-tight">
                      Check your email
                    </h2>
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                      We have sent password reset instructions to{' '}
                      <strong className="text-gray-900 font-semibold">{forgotEmail}</strong>.
                    </p>
                  </div>

                  <p className="text-[11px] text-gray-400">
                    Did not receive the email? Check your spam folder or try again in a few minutes.
                  </p>

                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => switchView('login')}
                      className="w-full h-10 text-xs font-semibold rounded-xl bg-[#0055FF] hover:bg-[#0044CC] text-white shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Sign In</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setForgotSuccess(false)}
                      className="text-xs font-semibold text-gray-500 hover:text-gray-800 py-1 transition-colors"
                    >
                      Resend reset link
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-1 mb-8">
                    <button
                      type="button"
                      onClick={() => switchView('login')}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0055FF] hover:text-[#0044CC] mb-3 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Sign In</span>
                    </button>
                    <h1 className="text-2xl font-bold text-gray-950 tracking-tight">
                      Reset your password
                    </h1>
                    <p className="text-xs text-gray-500">
                      Enter the email address associated with your account and we'll send you a password reset link.
                    </p>
                  </div>

                  <form onSubmit={handleForgotSubmit} className="space-y-5">
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
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="name@company.com"
                          className="w-full h-10 pl-9 pr-3 text-xs text-gray-900 bg-white border border-gray-200 rounded-xl shadow-2xs focus:border-[#0055FF] focus:ring-2 focus:ring-[#0055FF]/20 focus:outline-none transition-all placeholder:text-gray-400"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      loading={isLoading}
                      className="w-full h-10 text-xs font-semibold rounded-xl justify-center shadow-xs"
                      rightIcon={Send}
                    >
                      Send Reset Instructions
                    </Button>
                  </form>
                </>
              )}
            </>
          )}

          {/* VIEW 3: RESET PASSWORD (WITH TOKEN) */}
          {view === 'reset' && (
            <>
              {resetSuccess ? (
                <div className="text-center py-4 space-y-3 animate-in fade-in duration-200">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-2xs">
                    <CheckCircle2 className="w-6 h-6 stroke-[2]" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-950 tracking-tight">
                    Password Reset Complete
                  </h2>
                  <p className="text-xs text-gray-500">
                    Your password has been changed. Redirecting to sign in...
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-1 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0055FF] flex items-center justify-center mb-3">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-950 tracking-tight">
                      Set a new password
                    </h1>
                    <p className="text-xs text-gray-500">
                      Create a strong new password for your ProposalOS account.
                    </p>
                  </div>

                  <form onSubmit={handleResetSubmit} className="space-y-4">
                    {/* Email (Readonly) */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-700">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full h-10 px-3 text-xs text-gray-900 bg-gray-50 border border-gray-200 rounded-xl"
                      />
                    </div>

                    {/* New Password */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-700">
                        New Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Minimum 6 characters"
                          className="w-full h-10 pl-9 pr-10 text-xs text-gray-900 bg-white border border-gray-200 rounded-xl focus:border-[#0055FF] focus:ring-2 focus:ring-[#0055FF]/20 focus:outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm New Password */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-700">
                        Confirm New Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter new password"
                          className="w-full h-10 pl-9 pr-3 text-xs text-gray-900 bg-white border border-gray-200 rounded-xl focus:border-[#0055FF] focus:ring-2 focus:ring-[#0055FF]/20 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        loading={isLoading}
                        className="w-full h-10 text-xs font-semibold rounded-xl justify-center shadow-xs"
                      >
                        Reset Password & Sign In
                      </Button>
                    </div>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => switchView('login')}
                        className="text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors"
                      >
                        Cancel and return to Sign In
                      </button>
                    </div>
                  </form>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login

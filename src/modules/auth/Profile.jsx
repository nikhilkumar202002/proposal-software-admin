import React, { useState, useEffect } from 'react'
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Shield,
  ShieldCheck,
  Check,
  AlertCircle,
  Save,
  Key,
  Calendar,
  Clock,
  Sparkles,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Info,
} from 'lucide-react'
import { useAuthStore, getInitials } from '../../store/authStore'

export const Profile = () => {
  const { user, fetchCurrentUser, updateProfile, changePassword } = useAuthStore()

  // Profile fields state
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [avatar, setAvatar] = useState('')
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [profileErrors, setProfileErrors] = useState({})

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState({})

  // Pre-fill user data when user changes or on mount
  useEffect(() => {
    fetchCurrentUser()
  }, [fetchCurrentUser])

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setPhone(user.phone || '')
      setAvatar(user.avatar || '')
    }
  }, [user])

  // Password criteria verification
  const passwordCriteria = {
    length: password.length >= 8,
    mixed: /[a-z]/.test(password) && /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  }
  const isPasswordValid = Object.values(passwordCriteria).every(Boolean)
  const doPasswordsMatch = password && password === passwordConfirmation

  // Avatar presets for quick selection
  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  ]

  // Handle profile form submit
  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setProfileErrors({})

    if (!name.trim()) {
      setProfileErrors({ name: 'Full name is required' })
      return
    }

    setIsSavingProfile(true)
    try {
      await updateProfile({
        name: name.trim(),
        phone: phone.trim() || null,
        avatar: avatar.trim() || null,
      })
    } catch (err) {
      if (err.response?.data?.errors) {
        setProfileErrors(err.response.data.errors)
      }
    } finally {
      setIsSavingProfile(false)
    }
  }

  // Handle password change submit
  const handleSavePassword = async (e) => {
    e.preventDefault()
    setPasswordErrors({})

    const errors = {}
    if (!currentPassword) {
      errors.current_password = 'Current password is required'
    }
    if (!password) {
      errors.password = 'New password is required'
    } else if (!isPasswordValid) {
      errors.password = 'Password must meet all complexity requirements'
    }
    if (!passwordConfirmation) {
      errors.password_confirmation = 'Please confirm your new password'
    } else if (password !== passwordConfirmation) {
      errors.password_confirmation = 'Passwords do not match'
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors)
      return
    }

    setIsSavingPassword(true)
    try {
      await changePassword({
        current_password: currentPassword,
        password: password,
        password_confirmation: passwordConfirmation,
      })
      // Clear fields upon successful password change
      setCurrentPassword('')
      setPassword('')
      setPasswordConfirmation('')
    } catch (err) {
      if (err.response?.data?.errors) {
        setPasswordErrors(err.response.data.errors)
      }
    } finally {
      setIsSavingPassword(false)
    }
  }

  const roleName = Array.isArray(user?.roles) && user.roles.length > 0
    ? typeof user.roles[0] === 'string'
      ? user.roles[0]
      : user.roles[0]?.name || 'Member'
    : 'Administrator'

  const formattedJoinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Nov 2026'

  const formattedLastLogin = user?.last_login_at
    ? new Date(user.last_login_at).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : 'Active Session'

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Hero Banner & Profile Identity Card */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
        {/* Banner Graphic */}
        <div className="h-32 sm:h-36 bg-gradient-to-r from-[#0055FF] via-blue-600 to-indigo-700 relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* User Identity Overview */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-4">
            <div className="flex items-end gap-4">
              {/* Avatar circle */}
              <div className="relative group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white p-1.5 shadow-md border border-gray-100 flex items-center justify-center">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={name || 'User Profile'}
                      className="w-full h-full object-cover rounded-xl"
                      onError={() => setAvatar('')}
                    />
                  ) : (
                    <div className="w-full h-full rounded-xl bg-gradient-to-tr from-[#0055FF] to-blue-400 text-white flex items-center justify-center font-bold text-2xl sm:text-3xl tracking-tight shadow-inner">
                      {getInitials(name || user?.name)}
                    </div>
                  )}
                </div>
              </div>

              {/* User Names & Status */}
              <div className="pt-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                    {name || user?.name || 'Administrator'}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {user?.status ? user.status.toUpperCase() : 'ACTIVE'}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-[#0055FF] border border-blue-100">
                    {roleName}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5 flex items-center gap-2 flex-wrap">
                  <span>{user?.email}</span>
                  {user?.phone && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span>{user.phone}</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Quick Meta Stats */}
            <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 sm:pt-0">
              <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200/70">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>Joined {formattedJoinDate}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200/70">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span>Last login: {formattedLastLogin}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Profile Details & Password Security */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Personal Information & Avatar (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-2xs">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-2">
                  <User className="w-4 h-4 text-[#0055FF]" />
                  Personal Information
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Update your display name, contact phone number, and workspace avatar.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-5 space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className={`w-full text-xs font-medium bg-white text-gray-900 rounded-xl pl-9 pr-3 py-2.5 border transition-all placeholder:text-gray-400 focus:outline-hidden ${
                      profileErrors.name
                        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                        : 'border-gray-200 hover:border-gray-300 focus:border-[#0055FF] focus:ring-2 focus:ring-[#0055FF]/10'
                    }`}
                  />
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {profileErrors.name && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {Array.isArray(profileErrors.name) ? profileErrors.name[0] : profileErrors.name}
                  </p>
                )}
              </div>

              {/* Email Address (Read-only) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    Email Address
                  </label>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-gray-400" /> Read-only
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full text-xs font-medium bg-gray-50/80 text-gray-500 rounded-xl pl-9 pr-3 py-2.5 border border-gray-200 cursor-not-allowed select-none"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                  <Info className="w-3 h-3 text-gray-400 shrink-0" />
                  Email is linked to your organization account and cannot be modified directly.
                </p>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className={`w-full text-xs font-medium bg-white text-gray-900 rounded-xl pl-9 pr-3 py-2.5 border transition-all placeholder:text-gray-400 focus:outline-hidden ${
                      profileErrors.phone
                        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                        : 'border-gray-200 hover:border-gray-300 focus:border-[#0055FF] focus:ring-2 focus:ring-[#0055FF]/10'
                    }`}
                  />
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {profileErrors.phone && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {Array.isArray(profileErrors.phone) ? profileErrors.phone[0] : profileErrors.phone}
                  </p>
                )}
              </div>

              {/* Avatar URL & Presets */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Profile Avatar Image URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className={`w-full text-xs font-medium bg-white text-gray-900 rounded-xl pl-9 pr-3 py-2.5 border transition-all placeholder:text-gray-400 focus:outline-hidden ${
                      profileErrors.avatar
                        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                        : 'border-gray-200 hover:border-gray-300 focus:border-[#0055FF] focus:ring-2 focus:ring-[#0055FF]/10'
                    }`}
                  />
                  <ImageIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Quick Avatar Presets */}
                <div className="mt-3">
                  <span className="text-[11px] font-medium text-gray-500 block mb-2">
                    Or choose a preset avatar:
                  </span>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {avatarPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatar(preset)}
                        className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all p-0.5 cursor-pointer ${
                          avatar === preset
                            ? 'border-[#0055FF] scale-105 shadow-xs'
                            : 'border-transparent hover:border-gray-300 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={preset}
                          alt={`Preset ${idx + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </button>
                    ))}
                    {avatar && (
                      <button
                        type="button"
                        onClick={() => setAvatar('')}
                        className="text-[11px] font-medium text-gray-500 hover:text-red-600 px-2.5 py-1.5 rounded-lg border border-dashed border-gray-300 hover:border-red-200 transition-colors cursor-pointer"
                      >
                        Remove Avatar
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#0055FF] hover:bg-[#0044CC] active:scale-[0.98] rounded-xl shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSavingProfile ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>{isSavingProfile ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Access Roles & Permissions Overview */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0055FF]" />
                <h3 className="text-sm font-bold text-gray-900 tracking-tight">
                  Assigned Roles & Access Rights
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                {user?.permissions?.length || 0} Permissions
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <span className="text-xs font-semibold text-gray-700 block mb-1.5">
                  Current Roles:
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {Array.isArray(user?.roles) && user.roles.length > 0 ? (
                    user.roles.map((r, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-[#0055FF] border border-blue-100"
                      >
                        <Shield className="w-3 h-3 text-[#0055FF]" />
                        {typeof r === 'string' ? r : r.name}
                      </span>
                    ))
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-[#0055FF] border border-blue-100">
                      <Shield className="w-3 h-3 text-[#0055FF]" />
                      Administrator
                    </span>
                  )}
                </div>
              </div>

              {Array.isArray(user?.permissions) && user.permissions.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs font-semibold text-gray-700 block mb-1.5">
                    Permission Scope:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap max-h-36 overflow-y-auto p-1 bg-gray-50/70 rounded-xl border border-gray-100">
                    {user.permissions.map((perm, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white text-gray-600 border border-gray-200/60 shadow-3xs"
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Password & Security (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Change Password Card */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-2xs">
            <div className="pb-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <Key className="w-4 h-4 text-[#0055FF]" />
                Change Password
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Ensure your account uses a strong, unique password to prevent unauthorized access.
              </p>
            </div>

            <form onSubmit={handleSavePassword} className="mt-5 space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Current Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className={`w-full text-xs font-medium bg-white text-gray-900 rounded-xl pl-9 pr-10 py-2.5 border transition-all placeholder:text-gray-400 focus:outline-hidden ${
                      passwordErrors.current_password
                        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                        : 'border-gray-200 hover:border-gray-300 focus:border-[#0055FF] focus:ring-2 focus:ring-[#0055FF]/10'
                    }`}
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {passwordErrors.current_password && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {Array.isArray(passwordErrors.current_password)
                      ? passwordErrors.current_password[0]
                      : passwordErrors.current_password}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    className={`w-full text-xs font-medium bg-white text-gray-900 rounded-xl pl-9 pr-10 py-2.5 border transition-all placeholder:text-gray-400 focus:outline-hidden ${
                      passwordErrors.password
                        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                        : 'border-gray-200 hover:border-gray-300 focus:border-[#0055FF] focus:ring-2 focus:ring-[#0055FF]/10'
                    }`}
                  />
                  <Key className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {passwordErrors.password && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {Array.isArray(passwordErrors.password)
                      ? passwordErrors.password[0]
                      : passwordErrors.password}
                  </p>
                )}

                {/* Password Criteria Checklist */}
                {password && (
                  <div className="mt-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-1.5">
                    <span className="text-[11px] font-semibold text-gray-600 block mb-1">
                      Password Requirements:
                    </span>
                    <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                      <div className={`flex items-center gap-1.5 ${passwordCriteria.length ? 'text-emerald-600' : 'text-gray-400'}`}>
                        {passwordCriteria.length ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        <span>8+ characters</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${passwordCriteria.mixed ? 'text-emerald-600' : 'text-gray-400'}`}>
                        {passwordCriteria.mixed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        <span>Upper & lower</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${passwordCriteria.number ? 'text-emerald-600' : 'text-gray-400'}`}>
                        {passwordCriteria.number ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        <span>At least 1 number</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${passwordCriteria.symbol ? 'text-emerald-600' : 'text-gray-400'}`}>
                        {passwordCriteria.symbol ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        <span>1 special symbol</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    placeholder="Re-enter new password"
                    className={`w-full text-xs font-medium bg-white text-gray-900 rounded-xl pl-9 pr-10 py-2.5 border transition-all placeholder:text-gray-400 focus:outline-hidden ${
                      passwordErrors.password_confirmation
                        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                        : 'border-gray-200 hover:border-gray-300 focus:border-[#0055FF] focus:ring-2 focus:ring-[#0055FF]/10'
                    }`}
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {passwordErrors.password_confirmation && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {Array.isArray(passwordErrors.password_confirmation)
                      ? passwordErrors.password_confirmation[0]
                      : passwordErrors.password_confirmation}
                  </p>
                )}
                {password && passwordConfirmation && !doPasswordsMatch && (
                  <p className="text-[11px] text-amber-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Passwords do not match yet
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSavingPassword || !currentPassword || !password || !passwordConfirmation}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-gray-900 hover:bg-black active:scale-[0.98] rounded-xl shadow-2xs transition-all disabled:opacity-40 cursor-pointer"
                >
                  {isSavingPassword ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Key className="w-3.5 h-3.5" />
                  )}
                  <span>{isSavingPassword ? 'Updating Password...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Session & Enterprise Security Info Card */}
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2.5">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#0055FF] text-white flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Daily Session Security Policy</h4>
                <p className="text-[11px] text-gray-600 leading-relaxed mt-0.5">
                  ProposalOS enforces daily midnight (12:00 AM) automatic re-authentication to ensure client contract pricing, proposal drafts, and confidential agreements remain securely protected.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

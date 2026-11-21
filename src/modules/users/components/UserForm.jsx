import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Upload,
  Check,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Briefcase,
  Edit3,
  AlertCircle,
  Sparkles,
} from 'lucide-react'
import { ROLES, USER_STATUSES } from '../data/usersData'
import PermissionSelector from './PermissionSelector'
import UserAvatar from './UserAvatar'

const roleIcons = {
  super_admin: ShieldAlert,
  admin: ShieldCheck,
  manager: Briefcase,
  editor: Edit3,
  viewer: Eye,
}

export const UserForm = ({
  initialData = null,
  isEdit = false,
  onSubmit = () => {},
  isSubmitting = false,
}) => {
  const navigate = useNavigate()

  // Form State
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    avatar: initialData?.avatar || '',
    role: initialData?.role || 'editor',
    status: initialData?.status || 'active',
    password: '',
    confirmPassword: '',
    permissions: initialData?.permissions || ROLES.editor.defaultPermissions,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [showPermissionsSection, setShowPermissionsSection] = useState(true)

  // Sync state if initialData is loaded asynchronously from API
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        avatar: initialData.avatar || '',
        role: initialData.role || 'editor',
        status: initialData.status || 'active',
        password: '',
        confirmPassword: '',
        permissions:
          initialData.permissions ||
          ROLES[initialData.role]?.defaultPermissions ||
          ROLES.editor.defaultPermissions,
      })
    }
  }, [initialData])

  // When role changes, if permissions haven't been manually detached, update default permissions
  const handleRoleSelect = (newRole) => {
    const defaultPerms = ROLES[newRole]?.defaultPermissions || []
    setFormData((prev) => ({
      ...prev,
      role: newRole,
      permissions: defaultPerms,
    }))
  }

  const handleResetToRoleDefaults = () => {
    const defaultPerms = ROLES[formData.role]?.defaultPermissions || []
    setFormData((prev) => ({
      ...prev,
      permissions: defaultPerms,
    }))
  }

  // Visual Image Upload handler
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const fakeUrl = URL.createObjectURL(file)
      setFormData((prev) => ({ ...prev, avatar: fakeUrl }))
    }
  }

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, avatar: '' }))
  }

  // Form Validation
  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!isEdit) {
      if (!formData.password) {
        newErrors.password = 'Password is required'
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters'
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    } else {
      if (formData.password) {
        if (formData.password.length < 6) {
          newErrors.password = 'Password must be at least 6 characters'
        }
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match'
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return
    onSubmit(formData)
  }

  const currentRoleDefaults = ROLES[formData.role]?.defaultPermissions || []
  const isCustomizedPermissions =
    JSON.stringify([...formData.permissions].sort()) !==
    JSON.stringify([...currentRoleDefaults].sort())

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Personal Information Card */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-gray-100">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0055FF] flex items-center justify-center font-bold text-xs">
            1
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-tight">
              Personal Information
            </h3>
            <p className="text-xs text-gray-500">
              Basic profile identity and contact information
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Avatar Upload UI */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Profile Photo
            </label>
            <div className="flex items-center gap-4">
              <UserAvatar
                src={formData.avatar}
                name={formData.name || 'User'}
                size="xl"
                status={formData.status}
              />
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 cursor-pointer shadow-2xs transition-colors">
                    <Upload className="w-3.5 h-3.5 text-gray-500" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {formData.avatar && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-gray-400">
                  Recommended: Square JPG or PNG, at least 200x200px.
                </p>
              </div>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value })
                    if (errors.name) setErrors({ ...errors, name: null })
                  }}
                  placeholder="e.g. Nikhil Kumar"
                  className={`w-full pl-9 pr-3.5 py-2 text-sm bg-white border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 transition-all ${
                    errors.name
                      ? 'border-rose-300 focus:border-rose-500'
                      : 'border-gray-200 focus:border-[#0055FF]'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value })
                    if (errors.email) setErrors({ ...errors, email: null })
                  }}
                  placeholder="e.g. nikhil.kumar@proposalos.com"
                  className={`w-full pl-9 pr-3.5 py-2 text-sm bg-white border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 transition-all ${
                    errors.email
                      ? 'border-rose-300 focus:border-rose-500'
                      : 'border-gray-200 focus:border-[#0055FF]'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Phone Number (Optional)
              </label>
              <div className="relative max-w-sm">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 focus:border-[#0055FF] transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Account Information Card */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-gray-100">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0055FF] flex items-center justify-center font-bold text-xs">
            2
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-tight">
              Account Credentials & Status
            </h3>
            <p className="text-xs text-gray-500">
              {isEdit
                ? 'Leave passwords empty if you do not wish to modify the existing credentials'
                : 'Configure initial authentication credentials and activation status'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Password {isEdit ? '(Optional)' : <span className="text-rose-500">*</span>}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value })
                    if (errors.password) setErrors({ ...errors, password: null })
                  }}
                  placeholder={isEdit ? '••••••••' : 'Minimum 6 characters'}
                  className={`w-full pl-9 pr-10 py-2 text-sm bg-white border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 transition-all ${
                    errors.password
                      ? 'border-rose-300 focus:border-rose-500'
                      : 'border-gray-200 focus:border-[#0055FF]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Confirm Password {isEdit ? '(Optional)' : <span className="text-rose-500">*</span>}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, confirmPassword: e.target.value })
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null })
                  }}
                  placeholder={isEdit ? '••••••••' : 'Repeat password'}
                  className={`w-full pl-9 pr-10 py-2 text-sm bg-white border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 transition-all ${
                    errors.confirmPassword
                      ? 'border-rose-300 focus:border-rose-500'
                      : 'border-gray-200 focus:border-[#0055FF]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.confirmPassword}</span>
                </p>
              )}
            </div>
          </div>

          {/* Account Status Radio Cards */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Account Status
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.values(USER_STATUSES).map((statusObj) => {
                const isSelected = formData.status === statusObj.id
                return (
                  <label
                    key={statusObj.id}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#0055FF] bg-blue-50/50 ring-2 ring-[#0055FF]/10'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${statusObj.dotColor}`} />
                      <span className="text-xs font-bold text-gray-900">
                        {statusObj.label}
                      </span>
                    </div>
                    <input
                      type="radio"
                      name="status"
                      value={statusObj.id}
                      checked={isSelected}
                      onChange={() => setFormData({ ...formData, status: statusObj.id })}
                      className="sr-only"
                    />
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#0055FF]" />}
                  </label>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Role Assignment Card */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-gray-100">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0055FF] flex items-center justify-center font-bold text-xs">
            3
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-tight">
              Role Assignment
            </h3>
            <p className="text-xs text-gray-500">
              Select the team member's primary security role and access tier
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.values(ROLES).map((role) => {
            const isSelected = formData.role === role.id
            const Icon = roleIcons[role.id] || ShieldCheck

            return (
              <div
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#0055FF] bg-blue-50/40 ring-2 ring-[#0055FF]/15'
                    : 'border-gray-200/90 hover:border-gray-300 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-gray-900 tracking-tight">
                        {role.name}
                      </span>
                    </div>

                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-[#0055FF] text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    {role.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-gray-100/80 flex items-center justify-between text-[10px] text-gray-400">
                  <span>{role.defaultPermissions.length} permissions</span>
                  {isSelected && (
                    <span className="font-semibold text-[#0055FF]">Active Selection</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 4. Permissions Matrix Card */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0055FF] flex items-center justify-center font-bold text-xs">
              4
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-gray-900 tracking-tight">
                  Detailed Permissions Configuration
                </h3>
                {isCustomizedPermissions ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
                    Customized from Role
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                    Role Defaults
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Fine-tune granular feature access across ProposalOS workspace modules
              </p>
            </div>
          </div>

          {isCustomizedPermissions && (
            <button
              type="button"
              onClick={handleResetToRoleDefaults}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#0055FF] hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
              title="Revert all changes to match the selected role defaults"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to Defaults</span>
            </button>
          )}
        </div>

        <PermissionSelector
          selectedPermissions={formData.permissions}
          onChange={(newPerms) => setFormData({ ...formData, permissions: newPerms })}
        />
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => navigate('/users')}
          className="px-5 py-2.5 text-xs font-semibold rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-2xs transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 text-xs font-bold rounded-xl bg-[#0055FF] hover:bg-[#0044CC] text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Saving User...</span>
            </>
          ) : (
            <>
              <span>{isEdit ? 'Save Changes' : 'Create User'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default UserForm

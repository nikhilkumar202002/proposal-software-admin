import { Save, User, Shield, Bell, Check, AlertCircle } from 'lucide-react'
import { useSettings } from '../hooks/useSettings'

export const AccountSettings = ({ standalone = false }) => {
  const {
    account,
    updateAccount,
    saveAccount,
    isSaving,
    error,
    successMessage,
  } = useSettings()

  const handleSave = async (e) => {
    if (e) e.preventDefault()
    try {
      await saveAccount()
    } catch {
      // Error handled in store
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Page Title & Save Action if standalone */}
      {standalone && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-gray-200">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <User className="w-5 h-5 text-[#0055FF]" />
              Account & Profile Settings
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage your personal workspace account, role permissions, and notification preferences.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0055FF] hover:bg-[#0044CC] active:scale-[0.98] rounded-xl shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Saving...' : 'Save Account'}</span>
          </button>
        </div>
      )}

      {/* Status Messages */}
      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-800">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Profile Details Card */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900">Personal Information</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Your name and email associated with proposal signatures and activity audits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={account.fullName || ''}
              onChange={(e) => updateAccount({ fullName: e.target.value })}
              disabled={isSaving}
              placeholder="e.g. Administrator"
              className="w-full h-9 px-3 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-2xs focus:border-[#0055FF] focus:ring-1 focus:ring-[#0055FF]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Account Email Address
            </label>
            <input
              type="email"
              value={account.email || ''}
              onChange={(e) => updateAccount({ email: e.target.value })}
              disabled={isSaving}
              placeholder="e.g. admin@domaindude.in"
              className="w-full h-9 px-3 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-2xs focus:border-[#0055FF] focus:ring-1 focus:ring-[#0055FF]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Workspace Role
            </label>
            <input
              type="text"
              value={account.role || 'Workspace Administrator'}
              disabled
              className="w-full h-9 px-3 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg shadow-2xs cursor-not-allowed"
            />
            <p className="mt-1 text-[10px] text-gray-400">
              Full administrator rights over proposals, clients, and corporate templates.
            </p>
          </div>
        </div>
      </div>

      {/* Security & Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#0055FF]" />
            <h3 className="text-sm font-bold text-gray-900">Proposal Notifications</h3>
          </div>
          <p className="text-xs text-gray-500">
            Receive email alerts when clients view, accept, sign, or comment on proposals.
          </p>

          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer">
            <input
              type="checkbox"
              checked={account.notificationsEnabled !== false}
              onChange={(e) => updateAccount({ notificationsEnabled: e.target.checked })}
              disabled={isSaving}
              className="w-4 h-4 text-[#0055FF] rounded border-gray-300 focus:ring-[#0055FF]"
            />
            <span className="text-xs font-semibold text-gray-800">
              Enable Real-Time Proposal Activity Emails
            </span>
          </label>
        </div>

        {/* Security / 2FA */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#0055FF]" />
            <h3 className="text-sm font-bold text-gray-900">Security & Access</h3>
          </div>
          <p className="text-xs text-gray-500">
            Enforce multi-factor verification on sensitive proposal and financial exports.
          </p>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
            <div>
              <div className="text-xs font-semibold text-gray-800">Two-Factor Authentication</div>
              <div className="text-[11px] text-gray-400">Enhanced account security</div>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Save Button for tab mode */}
      {!standalone && (
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#0055FF] hover:bg-[#0044CC] active:scale-[0.98] rounded-xl shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Saving Changes...' : 'Save Account Settings'}</span>
          </button>
        </div>
      )}
    </form>
  )
}

export default AccountSettings

import { useState } from 'react'
import {
  Building2,
  Sliders,
  Coins,
  User,
  Settings as SettingsIcon,
  RotateCcw,
  Check,
  AlertCircle,
} from 'lucide-react'
import CompanyProfile from './CompanyProfile'
import DocumentSettings from './DocumentSettings'
import CurrencySettings from './CurrencySettings'
import AccountSettings from './AccountSettings'
import { useSettings } from '../hooks/useSettings'

const TABS = [
  {
    id: 'company',
    label: 'Company Profile & Logo',
    icon: Building2,
    description: 'Legal identity, branding, logo, GST registration & address',
  },
  {
    id: 'document',
    label: 'Document Layout & A4',
    icon: Sliders,
    description: 'Margins, fixed headers, footers, page numbering & watermark',
  },
  {
    id: 'currency',
    label: 'Currency & Commercial Defaults',
    icon: Coins,
    description: 'Invoicing currency, tax rates, payment terms & validity',
  },
  {
    id: 'account',
    label: 'Account & Workspace',
    icon: User,
    description: 'Administrator credentials, notifications & security',
  },
]

export const SettingsPage = ({ initialTab = 'company' }) => {
  const [activeTab, setActiveTab] = useState(initialTab)
  const {
    resetToDefaults,
    successMessage,
    error,
    clearError,
  } = useSettings()

  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const handleResetConfirm = () => {
    resetToDefaults(activeTab)
    setShowResetConfirm(false)
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FB6C00] shadow-2xs">
            <SettingsIcon className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Workspace & Organization Settings
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Centrally manage branding, company details, A4 physical document layouts, and commercial standards.
            </p>
          </div>
        </div>

        {/* Global Reset Action */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset {TABS.find((t) => t.id === activeTab)?.label || 'Section'}</span>
          </button>
        </div>
      </div>

      {/* Global Status Banner */}
      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between gap-2.5 text-xs text-red-800">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={clearError}
            className="text-[11px] font-bold underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Modern Tabs Navigation */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 p-1.5 bg-gray-100/80 rounded-2xl border border-gray-200/80">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer select-none ${
                isActive
                  ? 'bg-white text-[#FB6C00] shadow-2xs ring-1 ring-black/5'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <Icon
                className={`w-4 h-4 ${isActive ? 'text-[#FB6C00]' : 'text-gray-400'}`}
              />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Active Tab Content Panel */}
      <div className="mt-4">
        {activeTab === 'company' && <CompanyProfile standalone={false} />}
        {activeTab === 'document' && <DocumentSettings standalone={false} />}
        {activeTab === 'currency' && <CurrencySettings standalone={false} />}
        {activeTab === 'account' && <AccountSettings standalone={false} />}
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Reset to Standard Defaults?
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  This will restore the standard {TABS.find((t) => t.id === activeTab)?.label} configuration.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetConfirm}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                Reset Section
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SettingsPage

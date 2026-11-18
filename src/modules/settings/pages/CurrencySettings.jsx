import { Save, Coins, Check, AlertCircle } from 'lucide-react'
import DefaultCurrencySelector from '../components/DefaultCurrencySelector'
import { useSettings } from '../hooks/useSettings'

export const CurrencySettings = ({ standalone = false }) => {
  const {
    currency,
    updateCurrency,
    saveCurrency,
    isSaving,
    error,
    successMessage,
  } = useSettings()

  const handleSave = async (e) => {
    if (e) e.preventDefault()
    try {
      await saveCurrency()
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
              <Coins className="w-5 h-5 text-[#0055FF]" />
              Currency & Commercial Default Rules
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Set default currencies, tax brackets, validity intervals, and commercial payment milestone terms.
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
            <span>{isSaving ? 'Saving...' : 'Save Defaults'}</span>
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

      {/* Main Commercial Selector */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900">
            Commercial Standards & Invoicing Defaults
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            These preferences are loaded whenever you start drafting a new proposal.
          </p>
        </div>

        <DefaultCurrencySelector
          currencySettings={currency}
          onChange={updateCurrency}
          disabled={isSaving}
        />
      </div>

      {/* Save button for tab mode */}
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
            <span>{isSaving ? 'Saving Changes...' : 'Save Commercial Defaults'}</span>
          </button>
        </div>
      )}
    </form>
  )
}

export default CurrencySettings

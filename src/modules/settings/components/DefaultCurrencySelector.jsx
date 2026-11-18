import { CURRENCY_OPTIONS } from '../utils/settingsHelpers'
import { STANDARD_PAYMENT_TERMS, VALIDITY_PERIOD_OPTIONS } from '../utils/settingsHelpers'

export const DefaultCurrencySelector = ({
  currencySettings = {},
  onChange = () => {},
  disabled = false,
  className = '',
}) => {
  const handleChange = (field, value) => {
    onChange({ ...currencySettings, [field]: value })
  }

  const currentCurrency = currencySettings.defaultCurrency || 'INR'

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Default Currency */}
        <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-200/80 space-y-3">
          <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
            Default Invoicing Currency
          </label>
          <p className="text-xs text-gray-500">
            Automatically pre-selected when creating new client proposals and quotations.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CURRENCY_OPTIONS.map((c) => {
              const isSelected = currentCurrency === c.code
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => handleChange('defaultCurrency', c.code)}
                  disabled={disabled}
                  className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#0055FF] bg-blue-50/50 ring-1 ring-[#0055FF]'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{c.flag}</span>
                    <div>
                      <div className="text-xs font-bold text-gray-900">{c.code}</div>
                      <div className="text-[11px] text-gray-500">{c.symbol}</div>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#0055FF]" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Default Statutory Tax Rate */}
        <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-200/80 space-y-3">
          <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
            Default Statutory Tax Rate
          </label>
          <p className="text-xs text-gray-500">
            Default GST or VAT percentage applied to new deliverables.
          </p>

          <div className="flex items-center gap-2">
            <div className="relative w-36">
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={currencySettings.defaultTaxRate ?? 18}
                onChange={(e) =>
                  handleChange('defaultTaxRate', parseFloat(e.target.value) || 0)
                }
                disabled={disabled}
                className="w-full h-9 pl-3 pr-8 text-xs font-semibold text-gray-900 bg-white border border-gray-300 rounded-lg shadow-2xs focus:border-[#0055FF] focus:ring-1 focus:ring-[#0055FF]"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                %
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {[0, 5, 12, 18, 28].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => handleChange('defaultTaxRate', rate)}
                  disabled={disabled}
                  className={`px-2 py-1 text-[11px] font-semibold rounded-md border transition-colors cursor-pointer ${
                    currencySettings.defaultTaxRate === rate
                      ? 'bg-blue-50 text-[#0055FF] border-blue-200'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Proposal Validity Period */}
        <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-200/80 space-y-3">
          <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
            Default Proposal Validity Period
          </label>
          <p className="text-xs text-gray-500">
            Automatically computes the expiry &quot;Valid Until&quot; date when drafting proposals.
          </p>

          <select
            value={currencySettings.defaultValidityDays || 30}
            onChange={(e) =>
              handleChange('defaultValidityDays', parseInt(e.target.value) || 30)
            }
            disabled={disabled}
            className="w-full h-9 px-3 text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded-lg shadow-2xs focus:border-[#0055FF] cursor-pointer"
          >
            {VALIDITY_PERIOD_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Default Commercial Payment Terms */}
        <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
              Default Commercial Payment Terms
            </label>
            <select
              onChange={(e) => {
                if (e.target.value) handleChange('defaultPaymentTerms', e.target.value)
              }}
              defaultValue=""
              disabled={disabled}
              className="text-[11px] text-[#0055FF] font-semibold bg-transparent border-0 cursor-pointer focus:ring-0"
            >
              <option value="" disabled>
                Choose Preset...
              </option>
              {STANDARD_PAYMENT_TERMS.map((term) => (
                <option key={term} value={term}>
                  {term}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-gray-500">
            Pre-populated in proposal financial terms and commercial agreements.
          </p>

          <input
            type="text"
            value={currencySettings.defaultPaymentTerms || ''}
            onChange={(e) => handleChange('defaultPaymentTerms', e.target.value)}
            disabled={disabled}
            placeholder="e.g. 40% Advance, 40% Beta Milestone, 20% on Go-Live"
            className="w-full h-9 px-3 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-2xs focus:border-[#0055FF] focus:ring-1 focus:ring-[#0055FF]"
          />
        </div>
      </div>
    </div>
  )
}

export default DefaultCurrencySelector

import { STANDARD_TAX_RATES } from '../utils/taxHelpers'

export const TaxInput = ({
  value = 18,
  onChange = () => {},
  compact = false,
  disabled = false,
  className = '',
}) => {
  const numericValue = parseFloat(value) || 0

  const handleSelectChange = (e) => {
    const val = e.target.value
    if (val === 'custom') return
    onChange(parseFloat(val) || 0)
  }

  const handleCustomChange = (e) => {
    const raw = e.target.value
    if (raw === '') {
      onChange(0)
      return
    }
    const parsed = parseFloat(raw)
    if (!isNaN(parsed)) {
      onChange(Math.min(100, Math.max(0, parsed)))
    }
  }

  const isStandardRate = STANDARD_TAX_RATES.some((r) => r.value === numericValue)

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {/* Quick Select */}
      <select
        value={isStandardRate ? numericValue : 'custom'}
        onChange={handleSelectChange}
        disabled={disabled}
        aria-label="Select Tax Rate"
        className={`bg-white border border-gray-300 rounded-lg text-gray-800 font-medium shadow-2xs hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FB6C00]/20 focus:border-[#FB6C00] cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed ${
          compact ? 'h-8 text-xs px-2' : 'h-9 text-sm px-2.5'
        }`}
      >
        {STANDARD_TAX_RATES.map((rate) => (
          <option key={rate.value} value={rate.value}>
            {rate.label}
          </option>
        ))}
        {!isStandardRate && <option value="custom">Custom ({numericValue}%)</option>}
      </select>

      {/* Direct custom numeric input if not in standard preset */}
      {!isStandardRate && (
        <div className={`relative flex items-center w-16 border border-gray-300 rounded-lg overflow-hidden bg-white focus-within:border-[#FB6C00] focus-within:ring-2 focus-within:ring-[#FB6C00]/20 ${
          compact ? 'h-8 text-xs' : 'h-9 text-sm'
        }`}>
          <input
            type="number"
            min="0"
            max="100"
            step="0.5"
            value={numericValue === 0 ? '' : numericValue}
            placeholder="0"
            onChange={handleCustomChange}
            disabled={disabled}
            aria-label="Custom Tax Rate Percentage"
            className="w-full h-full pl-2 pr-4 text-right text-xs font-semibold text-gray-800 outline-none"
          />
          <span className="absolute right-1.5 text-[10px] text-gray-400 font-bold pointer-events-none">%</span>
        </div>
      )}
    </div>
  )
}

export default TaxInput

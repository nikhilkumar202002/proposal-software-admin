import { CURRENCY_OPTIONS, getCurrencyConfig } from '../utils/currencyHelpers'

export const CurrencySelector = ({
  value = 'INR',
  onChange = () => {},
  className = '',
  disabled = false,
}) => {
  const currentConfig = getCurrencyConfig(value)

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-label="Select Currency"
        className="w-full h-9 pl-3 pr-8 text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded-lg shadow-2xs hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 focus:border-[#0055FF] transition-colors appearance-none cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed"
      >
        {CURRENCY_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.flag} {opt.symbol} - {opt.name || opt.code} ({opt.code})
          </option>
        ))}
      </select>
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1 text-gray-400">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{currentConfig.code}</span>
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}

export default CurrencySelector

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
]

export const CurrencyInput = ({
  label,
  value = '',
  onChange = () => {},
  currency = 'INR',
  onCurrencyChange = () => {},
  placeholder = '0.00',
  error,
  helperText,
  disabled = false,
  required = false,
  currencies = CURRENCIES,
  className = '',
  id,
}) => {
  const selectedCurrency =
    currencies.find((c) => c.code === currency) || currencies[0]

  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false)

  const handleAmountChange = (e) => {
    const raw = e.target.value
    // Allow numbers and decimal dot
    if (raw === '' || /^\d*\.?\d*$/.test(raw)) {
      onChange(raw)
    }
  }

  const handleSelectCurrency = (code) => {
    onCurrencyChange(code)
    setIsCurrencyOpen(false)
  }

  const inputId = id || (label ? `currency-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined)

  return (
    <div className={`w-full flex flex-col ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-gray-700 mb-1.5 select-none"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative flex rounded-lg border border-gray-200 bg-white focus-within:border-[#0055FF] focus-within:ring-2 focus-within:ring-[#0055FF]/15 transition-all">
        {/* Currency Selector dropdown */}
        <div className="relative">
          <button
            type="button"
            disabled={disabled}
            onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
            className="h-full px-3 py-2 bg-gray-50 border-r border-gray-200 rounded-l-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 flex items-center gap-1.5 focus:outline-none transition-colors cursor-pointer select-none"
          >
            <span>{selectedCurrency.code}</span>
            <span className="text-gray-400">({selectedCurrency.symbol})</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {isCurrencyOpen && (
            <div className="absolute top-[calc(100%+4px)] left-0 w-44 bg-white rounded-xl shadow-xl border border-gray-200/90 py-1.5 z-50 animate-in fade-in-50 zoom-in-95">
              {currencies.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => handleSelectCurrency(c.code)}
                  className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    c.code === selectedCurrency.code
                      ? 'bg-blue-50 text-[#0055FF] font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium">{c.code} ({c.symbol})</span>
                  <span className="text-[10px] text-gray-400">{c.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Currency symbol and input */}
        <div className="relative flex-1 flex items-center">
          <span className="absolute left-3 text-sm font-semibold text-gray-400 pointer-events-none select-none">
            {selectedCurrency.symbol}
          </span>

          <input
            id={inputId}
            type="text"
            inputMode="decimal"
            disabled={disabled}
            value={value}
            onChange={handleAmountChange}
            placeholder={placeholder}
            className="w-full text-sm pl-8 pr-3 py-2 rounded-r-lg text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400"
          />
        </div>
      </div>

      {error ? (
        <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-gray-500">{helperText}</p>
      ) : null}
    </div>
  )
}

export default CurrencyInput

import { Percent } from 'lucide-react'

export const DiscountInput = ({
  type = 'percentage', // 'percentage' | 'fixed'
  value = 0,
  onChangeType = () => {},
  onChangeValue = () => {},
  currencySymbol = '₹',
  compact = false,
  disabled = false,
  className = '',
}) => {
  const isPercentage = type === 'percentage'

  const handleValueChange = (e) => {
    const raw = e.target.value
    if (raw === '') {
      onChangeValue(0)
      return
    }
    const parsed = parseFloat(raw)
    if (isNaN(parsed)) return
    if (isPercentage) {
      onChangeValue(Math.min(100, Math.max(0, parsed)))
    } else {
      onChangeValue(Math.max(0, parsed))
    }
  }

  const toggleType = () => {
    if (disabled) return
    const nextType = isPercentage ? 'fixed' : 'percentage'
    onChangeType(nextType)
  }

  return (
    <div className={`flex items-center rounded-lg border border-gray-300 bg-white shadow-2xs overflow-hidden focus-within:border-[#0055FF] focus-within:ring-2 focus-within:ring-[#0055FF]/20 transition-all ${className}`}>
      {/* Type toggle button */}
      <button
        type="button"
        onClick={toggleType}
        disabled={disabled}
        title={`Toggle discount type (currently ${isPercentage ? 'Percentage' : 'Fixed Amount'})`}
        className={`flex items-center justify-center font-bold transition-colors select-none ${
          compact ? 'w-7 h-8 text-[11px]' : 'w-8 h-9 text-xs'
        } ${
          isPercentage
            ? 'bg-blue-50 text-[#0055FF] hover:bg-blue-100'
            : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isPercentage ? (
          <Percent className="w-3.5 h-3.5 stroke-[2.5]" />
        ) : (
          <span>{currencySymbol}</span>
        )}
      </button>

      {/* Numeric Input */}
      <input
        type="number"
        min="0"
        max={isPercentage ? 100 : undefined}
        step={isPercentage ? 1 : 10}
        value={value === 0 ? '' : value}
        placeholder="0"
        onChange={handleValueChange}
        disabled={disabled}
        aria-label="Discount Value"
        className={`w-full text-right font-medium text-gray-800 bg-transparent outline-none px-2 ${
          compact ? 'h-8 text-xs' : 'h-9 text-sm'
        } disabled:text-gray-400 disabled:cursor-not-allowed`}
      />
    </div>
  )
}

export default DiscountInput

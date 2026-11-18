import { useState, useRef, useEffect } from 'react'
import { Plus, Sparkles, Layers, SlidersHorizontal } from 'lucide-react'
import CurrencySelector from './CurrencySelector'
import { DEFAULT_ITEM_PRESETS } from '../services/pricingService'

export const PricingToolbar = ({
  onAddItem = () => {},
  onAddPreset = () => {},
  currency = 'INR',
  onCurrencyChange = () => {},
  taxMode = 'per_item',
  onTaxModeChange = () => {},
  itemCount = 0,
  disabled = false,
  className = '',
}) => {
  const [showPresets, setShowPresets] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowPresets(false)
      }
    }
    if (showPresets) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showPresets])

  const handleSelectPreset = (preset) => {
    onAddPreset(preset)
    setShowPresets(false)
  }

  return (
    <div className={`flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 bg-gray-50/80 rounded-xl border border-gray-200/80 ${className}`}>
      {/* Left Actions: Add Item & Presets */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Main Add Button */}
        <button
          type="button"
          onClick={() => onAddItem()}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#0055FF] hover:bg-[#0044CC] active:scale-[0.98] rounded-lg shadow-2xs transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Deliverable Item</span>
        </button>

        {/* Quick Deliverable Presets Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setShowPresets(!showPresets)}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Preset Items</span>
          </button>

          {showPresets && (
            <div className="absolute left-0 mt-1.5 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 py-1.5 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                Pre-defined Service Deliverables
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                {DEFAULT_ITEM_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-blue-50/60 transition-colors flex items-center justify-between group"
                  >
                    <div className="pr-2">
                      <div className="font-semibold text-gray-800 group-hover:text-[#0055FF]">
                        {preset.description}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        {preset.quantity} {preset.unit} • {preset.taxRate}% Tax
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                      + Add
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Deliverable Count Badge */}
        <div className="flex items-center gap-1 text-xs text-gray-500 px-2 select-none">
          <Layers className="w-3.5 h-3.5 text-gray-400" />
          <span>
            {itemCount} {itemCount === 1 ? 'line item' : 'line items'}
          </span>
        </div>
      </div>

      {/* Right Controls: Tax Mode & Currency */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Tax Mode Toggle */}
        <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 border border-gray-200 rounded-lg shadow-2xs">
          <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-xs text-gray-600 font-medium">Tax Mode:</span>
          <div className="flex items-center bg-gray-100 rounded-md p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => onTaxModeChange('per_item')}
              disabled={disabled}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                taxMode === 'per_item'
                  ? 'bg-white text-[#0055FF] shadow-2xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Per Item
            </button>
            <button
              type="button"
              onClick={() => onTaxModeChange('overall')}
              disabled={disabled}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                taxMode === 'overall'
                  ? 'bg-white text-[#0055FF] shadow-2xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Overall
            </button>
          </div>
        </div>

        {/* Currency Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-600 whitespace-nowrap hidden sm:inline">
            Currency:
          </span>
          <CurrencySelector
            value={currency}
            onChange={onCurrencyChange}
            disabled={disabled}
            className="w-48"
          />
        </div>
      </div>
    </div>
  )
}

export default PricingToolbar

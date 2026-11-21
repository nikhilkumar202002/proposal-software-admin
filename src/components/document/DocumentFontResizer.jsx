import { useState, useRef, useEffect } from 'react'
import { Type, Minus, Plus, RotateCcw, ChevronDown, Check } from 'lucide-react'

const FONT_SIZE_PRESETS = [
  { size: 10, label: 'Compact', desc: '10px' },
  { size: 11, label: 'Small', desc: '11px' },
  { size: 12, label: 'Standard (Default)', desc: '12px' },
  { size: 13, label: 'Medium', desc: '13px' },
  { size: 14, label: 'Comfortable', desc: '14px' },
  { size: 15, label: 'Large', desc: '15px' },
  { size: 16, label: 'Extra Large', desc: '16px' },
]

export const DocumentFontResizer = ({
  typography = {},
  onChange = () => {},
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const currentSize = typography.baseSize || 12
  const isDefault = currentSize === 12

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const setFontSize = (newSize) => {
    const clamped = Math.max(9, Math.min(18, newSize))
    const ratio = clamped / 12
    onChange({
      baseSize: clamped,
      heading1Size: Math.round(16 * ratio),
      heading2Size: Math.round(14 * ratio),
      heading3Size: Math.round(14 * ratio),
    })
  }

  const handleDecrease = () => {
    setFontSize(currentSize - 1)
  }

  const handleIncrease = () => {
    setFontSize(currentSize + 1)
  }

  const handleReset = () => {
    onChange({
      baseSize: 12,
      heading1Size: 16,
      heading2Size: 14,
      heading3Size: 14,
    })
    setIsOpen(false)
  }

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-0.5 select-none ${className}`}
    >
      {/* Decrease Font Size Button */}
      <button
        type="button"
        onClick={handleDecrease}
        disabled={currentSize <= 9}
        className="p-1 rounded text-gray-500 hover:text-gray-900 hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
        title="Decrease Document Font Size (A-)"
        aria-label="Decrease Font Size"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      {/* Preset Dropdown Trigger Pill */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[11px] font-semibold text-gray-700 hover:bg-white rounded transition-colors cursor-pointer"
        title="Select Document Font Size Preset"
      >
        <Type className="w-3 h-3 text-gray-400" />
        <span>{currentSize}px</span>
        <ChevronDown
          className={`w-2.5 h-2.5 text-gray-400 transition-transform duration-150 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Increase Font Size Button */}
      <button
        type="button"
        onClick={handleIncrease}
        disabled={currentSize >= 18}
        className="p-1 rounded text-gray-500 hover:text-gray-900 hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
        title="Increase Document Font Size (A+)"
        aria-label="Increase Font Size"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>

      {/* Reset button when non-default */}
      {!isDefault && (
        <button
          type="button"
          onClick={handleReset}
          className="p-1 rounded text-gray-400 hover:text-[#0055FF] hover:bg-white transition-colors cursor-pointer ml-0.5"
          title="Reset Font Size to 12px Default"
          aria-label="Reset Font Size"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      )}

      {/* Dropdown Menu for Presets */}
      {isOpen && (
        <div className="absolute top-[calc(100%+6px)] left-0 w-44 bg-white border border-gray-200 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
            Document Font Size
          </div>
          <div className="py-1">
            {FONT_SIZE_PRESETS.map((preset) => {
              const isSelected = currentSize === preset.size
              return (
                <button
                  key={preset.size}
                  type="button"
                  onClick={() => {
                    setFontSize(preset.size)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/70 text-[#0055FF] font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="truncate">{preset.label}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] text-gray-400 font-mono">
                      {preset.desc}
                    </span>
                    {isSelected && (
                      <Check className="w-3 h-3 text-[#0055FF]" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default DocumentFontResizer

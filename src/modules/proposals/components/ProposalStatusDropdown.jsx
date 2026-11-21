import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { getProposalStatusConfig, PROPOSAL_STATUSES } from '../utils/proposalHelpers'

export const ProposalStatusDropdown = ({
  status = 'proposal_sent',
  onChange = () => {},
  size = 'md',
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const currentConfig = getProposalStatusConfig(status)

  // Close dropdown when clicking outside
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

  const handleSelect = (newStatus, e) => {
    e.stopPropagation()
    setIsOpen(false)
    if (newStatus !== currentConfig.value) {
      onChange(newStatus)
    }
  }

  const dotColorClasses = {
    info: 'bg-blue-500',
    warning: 'bg-amber-500',
    success: 'bg-emerald-500',
    danger: 'bg-red-500',
    neutral: 'bg-gray-400',
  }

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block text-left select-none ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Pill Badge Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className={`group inline-flex items-center gap-1.5 font-medium rounded-full border px-2.5 py-0.5 text-xs transition-all shadow-2xs cursor-pointer ${
          currentConfig.bg || 'bg-gray-100 text-gray-700 border-gray-200'
        } ${isOpen ? 'ring-2 ring-[#0055FF]/20 border-[#0055FF]/40' : 'hover:brightness-95'}`}
        title="Click to change proposal status"
      >
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            dotColorClasses[currentConfig.color] || 'bg-blue-500'
          }`}
        />
        <span>{currentConfig.label}</span>
        <ChevronDown
          className={`w-3 h-3 text-current opacity-60 transition-transform duration-150 ${
            isOpen ? 'rotate-180 opacity-100' : 'group-hover:opacity-100'
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-44 rounded-xl bg-white border border-gray-200/90 shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-2.5 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
            Change Status
          </div>

          <div className="py-1">
            {PROPOSAL_STATUSES.map((option) => {
              const isSelected = currentConfig.value === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={(e) => handleSelect(option.value, e)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-medium text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/70 text-[#0055FF] font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        dotColorClasses[option.color] || 'bg-gray-400'
                      }`}
                    />
                    <span>{option.label}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#0055FF] shrink-0" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProposalStatusDropdown

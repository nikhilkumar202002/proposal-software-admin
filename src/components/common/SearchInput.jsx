import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'

export const SearchInput = ({
  value: controlledValue,
  onChange,
  onSearch,
  debounceDelay = 300,
  placeholder = 'Search...',
  shortcut = '',
  className = '',
  inputClassName = '',
  disabled = false,
  autoFocus = false,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState('')
  const isControlled = controlledValue !== undefined
  const currentValue = isControlled ? controlledValue : internalValue

  const inputRef = useRef(null)
  const debounceTimerRef = useRef(null)

  // Debounced search trigger
  useEffect(() => {
    if (!onSearch) return

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      onSearch(currentValue)
    }, debounceDelay)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [currentValue, debounceDelay, onSearch])

  const handleChange = (e) => {
    if (!isControlled) {
      setInternalValue(e.target.value)
    }
    if (onChange) {
      onChange(e)
    }
  }

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue('')
    }
    if (onChange) {
      const syntheticEvent = { target: { value: '' } }
      onChange(syntheticEvent)
    }
    if (onSearch) {
      onSearch('')
    }
    inputRef.current?.focus()
  }

  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none transition-colors" />

      <input
        ref={inputRef}
        type="text"
        disabled={disabled}
        autoFocus={autoFocus}
        value={currentValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full pl-9 pr-12 py-2 text-sm bg-white hover:bg-gray-50/60 focus:bg-white border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0055FF] focus:ring-2 focus:ring-[#0055FF]/15 transition-all disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed ${inputClassName}`}
        {...props}
      />

      {currentValue ? (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2.5 p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      ) : shortcut ? (
        <div className="absolute right-2.5 pointer-events-none">
          <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-gray-400 bg-gray-50 border border-gray-200 rounded shadow-2xs">
            {shortcut}
          </kbd>
        </div>
      ) : null}
    </div>
  )
}

export default SearchInput

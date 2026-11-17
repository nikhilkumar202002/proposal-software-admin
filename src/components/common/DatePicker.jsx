import { useState, useRef, useEffect } from 'react'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function formatDate(date) {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const DatePicker = ({
  value,
  onChange = () => {},
  label,
  placeholder = 'Select date...',
  error,
  helperText,
  disabled = false,
  required = false,
  minDate,
  maxDate,
  clearable = true,
  className = '',
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  const selectedDate = value ? new Date(value) : null
  const [viewDate, setViewDate] = useState(selectedDate || new Date())

  const viewYear = viewDate.getFullYear()
  const viewMonth = viewDate.getMonth()

  // Outside click & ESC
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handlePrevMonth = () => {
    setViewDate(new Date(viewYear, viewMonth - 1, 1))
  }

  const handleNextMonth = () => {
    setViewDate(new Date(viewYear, viewMonth + 1, 1))
  }

  const handleSelectDay = (day) => {
    const chosen = new Date(viewYear, viewMonth, day)
    onChange(formatDate(chosen))
    setIsOpen(false)
  }

  const handleClear = (e) => {
    e.stopPropagation()
    onChange('')
  }

  const handleSelectToday = () => {
    const today = new Date()
    setViewDate(today)
    onChange(formatDate(today))
    setIsOpen(false)
  }

  // Days calculations
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const today = new Date()

  const dateId = id || (label ? `date-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined)

  return (
    <div className={`w-full flex flex-col relative ${className}`} ref={containerRef}>
      {label && (
        <label
          htmlFor={dateId}
          className="block text-xs font-semibold text-gray-700 mb-1.5 select-none"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Trigger */}
      <button
        id={dateId}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left text-sm rounded-lg border bg-white px-3.5 py-2 flex items-center justify-between transition-all focus:outline-none disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/15'
            : isOpen
            ? 'border-[#FB6C00] ring-2 ring-[#FB6C00]/15'
            : 'border-gray-200 hover:border-gray-300'
        }`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5 truncate">
          <CalendarIcon className="w-4 h-4 text-gray-400 shrink-0" />
          <span className={value ? 'text-gray-900 font-medium' : 'text-gray-400'}>
            {value ? formatDate(selectedDate) : placeholder}
          </span>
        </div>

        {clearable && value && !disabled && (
          <span
            role="button"
            tabIndex={0}
            onClick={handleClear}
            className="p-0.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            title="Clear date"
          >
            <X className="w-3.5 h-3.5" />
          </span>
        )}
      </button>

      {/* Calendar Popover */}
      {isOpen && (
        <div className="absolute top-[calc(100%+6px)] left-0 w-72 bg-white rounded-xl shadow-xl border border-gray-200/90 p-3.5 z-50 animate-in fade-in-50 zoom-in-95 select-none">
          {/* Header Month & Year */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-900">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
            {DAY_NAMES.map((d) => (
              <span key={d} className="text-[10px] font-semibold text-gray-400 uppercase">
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Blank offset days */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`blank-${i}`} className="w-8 h-8" />
            ))}

            {/* Month days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const currentDayDate = new Date(viewYear, viewMonth, day)
              const formattedCurrent = formatDate(currentDayDate)

              const isSelected = value === formattedCurrent
              const isToday =
                today.getFullYear() === viewYear &&
                today.getMonth() === viewMonth &&
                today.getDate() === day

              const isBeforeMin = minDate && formattedCurrent < minDate
              const isAfterMax = maxDate && formattedCurrent > maxDate
              const isDisabled = isBeforeMin || isAfterMax

              return (
                <button
                  key={day}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleSelectDay(day)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium flex items-center justify-center transition-colors cursor-pointer ${
                    isDisabled
                      ? 'text-gray-300 cursor-not-allowed'
                      : isSelected
                      ? 'bg-[#FB6C00] text-white font-semibold shadow-2xs'
                      : isToday
                      ? 'bg-orange-50 text-[#FB6C00] font-semibold border border-orange-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {day}
                </button>
              )
            })}
          </div>

          {/* Today Button Footer */}
          <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={handleSelectToday}
              className="text-[#FB6C00] hover:text-[#E65F00] font-medium cursor-pointer"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-800 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {error ? (
        <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-gray-500">{helperText}</p>
      ) : null}
    </div>
  )
}

export default DatePicker

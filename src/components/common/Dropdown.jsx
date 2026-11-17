import { useState, useRef, useEffect } from 'react'

export const Dropdown = ({
  trigger,
  items = [],
  children,
  align = 'right',
  width = 'w-52',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
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

  const alignStyles = {
    left: 'left-0',
    right: 'right-0',
  }

  const handleItemClick = (item) => {
    if (item.disabled) return
    if (item.onClick) item.onClick()
    setIsOpen(false)
  }

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger */}
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {typeof trigger === 'function' ? trigger({ isOpen }) : trigger}
      </div>

      {/* Popover Menu */}
      {isOpen && (
        <div
          className={`absolute top-[calc(100%+6px)] ${alignStyles[align] || alignStyles.right} ${width} bg-white rounded-xl shadow-xl border border-gray-200/90 py-1.5 z-50 animate-in fade-in-50 zoom-in-95`}
          role="menu"
          aria-orientation="vertical"
        >
          {children
            ? typeof children === 'function'
              ? children({ close: () => setIsOpen(false) })
              : children
            : items.map((item, index) => {
                if (item.divider) {
                  return <div key={`divider-${index}`} className="my-1 border-t border-gray-100" />
                }

                const Icon = item.icon

                return (
                  <button
                    key={item.id || item.label || index}
                    type="button"
                    disabled={item.disabled}
                    onClick={() => handleItemClick(item)}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-left transition-colors cursor-pointer ${
                      item.disabled
                        ? 'opacity-40 cursor-not-allowed text-gray-400'
                        : item.danger
                        ? 'text-red-600 hover:bg-red-50'
                        : 'text-gray-700 hover:bg-gray-100/70 hover:text-gray-900'
                    }`}
                    role="menuitem"
                  >
                    {Icon && (
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          item.danger ? 'text-red-500' : 'text-gray-400'
                        }`}
                      />
                    )}
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.shortcut && (
                      <span className="text-[10px] text-gray-400 tracking-widest font-mono">
                        {item.shortcut}
                      </span>
                    )}
                  </button>
                )
              })}
        </div>
      )}
    </div>
  )
}

export default Dropdown

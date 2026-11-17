import { useState, useRef, useEffect } from 'react'

export const Tooltip = ({
  content,
  children,
  position = 'top', // 'top' | 'bottom' | 'left' | 'right'
  trigger = 'hover', // 'hover' | 'click'
  delay = 100,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const timeoutRef = useRef(null)
  const containerRef = useRef(null)

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsVisible(false)
  }

  // Handle outside click for trigger="click"
  useEffect(() => {
    if (trigger !== 'click' || !isVisible) return

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsVisible(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [trigger, isVisible])

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  const arrowStyles = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-900 border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-900 border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-900 border-y-transparent border-l-transparent',
  }

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex ${className}`}
      onMouseEnter={trigger === 'hover' ? showTooltip : undefined}
      onMouseLeave={trigger === 'hover' ? hideTooltip : undefined}
      onClick={trigger === 'click' ? () => setIsVisible(!isVisible) : undefined}
    >
      {children}

      {isVisible && content && (
        <div
          role="tooltip"
          className={`absolute ${positionStyles[position] || positionStyles.top} z-50 pointer-events-none whitespace-nowrap animate-in fade-in-50 zoom-in-95 duration-100`}
        >
          <div className="relative px-2.5 py-1 text-xs font-medium text-white bg-gray-900 rounded-md shadow-lg select-none">
            {content}
            <span
              className={`absolute w-0 h-0 border-4 ${arrowStyles[position] || arrowStyles.top}`}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Tooltip

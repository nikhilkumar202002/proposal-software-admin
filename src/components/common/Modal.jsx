import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  full: 'max-w-6xl',
}

export const Modal = ({
  isOpen = false,
  onClose = () => {},
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnOutsideClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  className = '',
}) => {
  const modalRef = useRef(null)

  // ESC key handler & body scroll lock
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && closeOnEsc) {
        onClose()
      }
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, closeOnEsc, onClose])

  if (!isOpen) return null

  const handleBackdropClick = (e) => {
    if (closeOnOutsideClick && modalRef.current && !modalRef.current.contains(e.target)) {
      onClose()
    }
  }

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs transition-opacity duration-200"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className={`w-full ${sizeStyles[size] || sizeStyles.md} bg-white rounded-2xl shadow-2xl border border-gray-200/80 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150 ${className}`}
      >
        {/* Modal Header */}
        {(title || showCloseButton) && (
          <div className="px-6 py-4.5 border-b border-gray-100 flex items-start justify-between gap-3 shrink-0">
            <div>
              {title && (
                <h3 className="text-base font-bold text-gray-900 tracking-tight">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0 -mr-1"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Modal Content */}
        <div className="px-6 py-5 overflow-y-auto overflow-x-hidden flex-1 text-sm text-gray-700">
          {children}
        </div>

        {/* Modal Footer */}
        {footer && (
          <div className="px-6 py-3.5 bg-gray-50/70 border-t border-gray-100 flex items-center justify-end gap-2.5 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

export default Modal

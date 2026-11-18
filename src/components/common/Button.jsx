import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

const variantStyles = {
  primary:
    'bg-[#0055FF] hover:bg-[#0044CC] text-white border-transparent focus-visible:ring-[#0055FF]/30 shadow-2xs',
  secondary:
    'bg-gray-100 hover:bg-gray-200/80 text-gray-800 border-transparent focus-visible:ring-gray-300',
  outline:
    'bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300 focus-visible:ring-gray-200 shadow-2xs',
  ghost:
    'bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-900 border-transparent focus-visible:ring-gray-200',
  danger:
    'bg-red-600 hover:bg-red-700 text-white border-transparent focus-visible:ring-red-500/30 shadow-2xs',
  icon:
    'bg-transparent hover:bg-gray-100 text-gray-500 hover:text-gray-800 border-transparent p-0 focus-visible:ring-gray-200',
}

const sizeStyles = {
  sm: 'text-xs px-2.5 py-1.5 gap-1.5 rounded-lg font-medium',
  md: 'text-sm px-3.5 py-2 gap-2 rounded-lg font-medium',
  lg: 'text-base px-4.5 py-2.5 gap-2.5 rounded-xl font-semibold',
}

const iconSizeStyles = {
  sm: 'w-7 h-7 rounded-lg',
  md: 'w-9 h-9 rounded-lg',
  lg: 'w-11 h-11 rounded-xl',
}

export const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon: Icon,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    className = '',
    type = 'button',
    ...props
  },
  ref
) {
  const isIconButton = variant === 'icon' || (!children && (Icon || LeftIcon))

  const baseClasses =
    'inline-flex items-center justify-center border font-medium transition-all duration-150 select-none focus:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer whitespace-nowrap'

  const sizeClass = isIconButton ? iconSizeStyles[size] || iconSizeStyles.md : sizeStyles[size] || sizeStyles.md
  const variantClass = variantStyles[variant] || variantStyles.primary

  const RenderIcon = Icon || LeftIcon

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : RenderIcon ? (
        <RenderIcon className="w-4 h-4 shrink-0" />
      ) : null}

      {children && <span className="inline-flex items-center gap-1.5 whitespace-nowrap">{children}</span>}

      {!loading && RightIcon && <RightIcon className="w-4 h-4 shrink-0" />}
    </button>
  )
})

export default Button

const variantStyles = {
  default: 'bg-orange-50 text-[#FB6C00] border-orange-200/80',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  warning: 'bg-amber-50 text-amber-700 border-amber-200/80',
  danger: 'bg-red-50 text-red-700 border-red-200/80',
  info: 'bg-blue-50 text-blue-700 border-blue-200/80',
  neutral: 'bg-gray-100 text-gray-700 border-gray-200/80',
}

const dotStyles = {
  default: 'bg-[#FB6C00]',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
  neutral: 'bg-gray-400',
}

const sizeStyles = {
  sm: 'text-[10px] px-2 py-0.5 gap-1',
  md: 'text-xs px-2.5 py-0.5 gap-1.5',
  lg: 'text-sm px-3 py-1 gap-2',
}

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  pulse = false,
  className = '',
  ...props
}) => {
  const variantClass = variantStyles[variant] || variantStyles.default
  const sizeClass = sizeStyles[size] || sizeStyles.md
  const dotColor = dotStyles[variant] || dotStyles.default

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border select-none transition-colors ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          {pulse && (
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColor}`}
            />
          )}
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${dotColor}`} />
        </span>
      )}
      {children}
    </span>
  )
}

export default Badge

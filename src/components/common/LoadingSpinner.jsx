import { Loader2 } from 'lucide-react'

const sizeStyles = {
  xs: 'w-3.5 h-3.5',
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
}

export const LoadingSpinner = ({
  size = 'md',
  text,
  fullScreen = false,
  className = '',
  color = 'text-[#0055FF]',
}) => {
  const sizeClass = sizeStyles[size] || sizeStyles.md

  const content = (
    <div className={`flex flex-col items-center justify-center gap-3 select-none ${className}`}>
      <Loader2 className={`${sizeClass} animate-spin ${color} shrink-0`} />
      {text && (
        <span className="text-xs sm:text-sm font-medium text-gray-500">
          {text}
        </span>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-xs">
        {content}
      </div>
    )
  }

  return content
}

export default LoadingSpinner

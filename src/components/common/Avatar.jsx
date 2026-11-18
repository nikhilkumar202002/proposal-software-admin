import { useState } from 'react'

const sizeStyles = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
}

const statusSizeStyles = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-3.5 h-3.5',
}

function getInitials(name = '') {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export const Avatar = ({
  src,
  alt = 'Avatar',
  name = '',
  size = 'md',
  status, // 'online' | 'offline' | 'busy' | 'away'
  className = '',
  bgColor,
}) => {
  const [hasError, setHasError] = useState(false)

  const sizeClass = sizeStyles[size] || sizeStyles.md
  const statusSizeClass = statusSizeStyles[size] || statusSizeStyles.md
  const initials = getInitials(name || alt)

  const statusColors = {
    online: 'bg-emerald-500',
    offline: 'bg-gray-400',
    busy: 'bg-red-500',
    away: 'bg-amber-500',
  }

  return (
    <div className={`relative inline-block shrink-0 select-none ${className}`}>
      <div
        className={`${sizeClass} rounded-full overflow-hidden flex items-center justify-center font-semibold border border-gray-100 shadow-2xs ${
          src && !hasError
            ? 'bg-gray-100'
            : bgColor || 'bg-gradient-to-tr from-[#0055FF] to-amber-400 text-white'
        }`}
      >
        {src && !hasError ? (
          <img
            src={src}
            alt={alt}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {status && (
        <span
          className={`absolute bottom-0 right-0 ${statusSizeClass} rounded-full border-2 border-white ${
            statusColors[status] || statusColors.online
          }`}
          title={status}
        />
      )}
    </div>
  )
}

export default Avatar

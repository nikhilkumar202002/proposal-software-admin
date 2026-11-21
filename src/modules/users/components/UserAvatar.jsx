import { useState } from 'react'

const sizeStyles = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm font-semibold',
  lg: 'w-12 h-12 text-base font-bold',
  xl: 'w-16 h-16 text-lg font-bold',
}

const statusIndicatorSizes = {
  xs: 'w-1.5 h-1.5 ring-1',
  sm: 'w-2 h-2 ring-1.5',
  md: 'w-2.5 h-2.5 ring-2',
  lg: 'w-3 h-3 ring-2',
  xl: 'w-3.5 h-3.5 ring-2',
}

const colorThemes = [
  'bg-blue-100 text-blue-700 border-blue-200',
  'bg-purple-100 text-purple-700 border-purple-200',
  'bg-emerald-100 text-emerald-700 border-emerald-200',
  'bg-amber-100 text-amber-700 border-amber-200',
  'bg-teal-100 text-teal-700 border-teal-200',
  'bg-rose-100 text-rose-700 border-rose-200',
  'bg-indigo-100 text-indigo-700 border-indigo-200',
]

function getInitials(name = '') {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function getColorIndex(name = '') {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash) % colorThemes.length
}

export const UserAvatar = ({
  src,
  name = '',
  email = '',
  size = 'md',
  status, // 'active' | 'inactive' | 'pending' | 'online'
  className = '',
}) => {
  const [hasError, setHasError] = useState(false)

  const sizeClass = sizeStyles[size] || sizeStyles.md
  const statusSizeClass = statusIndicatorSizes[size] || statusIndicatorSizes.md
  const initials = getInitials(name || email)
  const colorTheme = colorThemes[getColorIndex(name || email)]

  const statusColors = {
    active: 'bg-emerald-500',
    online: 'bg-emerald-500',
    pending: 'bg-amber-500',
    inactive: 'bg-slate-300',
    offline: 'bg-slate-300',
  }

  return (
    <div className={`relative inline-block shrink-0 select-none ${className}`}>
      <div
        className={`${sizeClass} rounded-full overflow-hidden flex items-center justify-center border transition-transform duration-150 ${colorTheme}`}
      >
        {src && !hasError ? (
          <img
            src={src}
            alt={name || 'User Avatar'}
            className="w-full h-full object-cover"
            onError={() => setHasError(true)}
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {status && statusColors[status] && (
        <span
          className={`absolute bottom-0 right-0 ${statusSizeClass} rounded-full ring-white ${statusColors[status]}`}
          title={`Status: ${status}`}
        />
      )}
    </div>
  )
}

export default UserAvatar

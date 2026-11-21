import { Loader2 } from 'lucide-react'
import { USER_STATUSES } from '../constants'

export const UserStatusBadge = ({
  status = 'active',
  size = 'sm',
  className = '',
  onClick,
  isUpdating = false,
  interactive = false,
}) => {
  const config = USER_STATUSES[status?.toLowerCase()] || USER_STATUSES.active

  const sizeClasses = {
    xs: 'text-[10px] px-2 py-0.5 gap-1',
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3 py-1.5 gap-2',
  }

  const dotSizes = {
    xs: 'w-1 h-1',
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
  }

  const isClickable = Boolean(onClick || interactive)

  return (
    <span
      onClick={isClickable && !isUpdating ? onClick : undefined}
      className={`inline-flex items-center font-medium rounded-full border shadow-2xs select-none transition-all ${
        config.color
      } ${sizeClasses[size] || sizeClasses.sm} ${
        isClickable ? 'cursor-pointer hover:opacity-85 active:scale-95' : ''
      } ${isUpdating ? 'opacity-60 cursor-wait' : ''} ${className}`}
      title={isClickable ? `Click to toggle status` : undefined}
    >
      {isUpdating ? (
        <Loader2 className={`animate-spin ${dotSizes[size] || dotSizes.sm}`} />
      ) : (
        <span
          className={`rounded-full shrink-0 ${dotSizes[size] || dotSizes.sm} ${
            config.dotColor
          }`}
        />
      )}
      <span className="capitalize">{config.label}</span>
    </span>
  )
}

export default UserStatusBadge

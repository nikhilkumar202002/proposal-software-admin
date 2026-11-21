import { USER_STATUSES } from '../data/usersData'

export const UserStatusBadge = ({ status = 'active', size = 'sm', className = '' }) => {
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

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border shadow-2xs select-none ${config.color} ${sizeClasses[size] || sizeClasses.sm} ${className}`}
    >
      <span className={`rounded-full shrink-0 ${dotSizes[size] || dotSizes.sm} ${config.dotColor}`} />
      <span>{config.label}</span>
    </span>
  )
}

export default UserStatusBadge

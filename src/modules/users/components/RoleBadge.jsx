import { ShieldAlert, ShieldCheck, Briefcase, Edit3, Eye } from 'lucide-react'
import { ROLES } from '../constants'

const roleIcons = {
  super_admin: ShieldAlert,
  admin: ShieldCheck,
  manager: Briefcase,
  editor: Edit3,
  viewer: Eye,
}

export const RoleBadge = ({ role = 'viewer', showIcon = true, size = 'sm', className = '' }) => {
  const roleKey = typeof role === 'string'
    ? role.toLowerCase().replace(/\s+/g, '_')
    : role?.id || 'viewer'
  const roleConfig = ROLES[roleKey] || {
    name: typeof role === 'string' ? role : role?.name || 'Viewer',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  }
  const Icon = roleIcons[roleKey] || Eye

  const sizeClasses = {
    xs: 'text-[10px] px-2 py-0.5 gap-1',
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3 py-1.5 gap-2',
  }

  const iconSizes = {
    xs: 'w-2.5 h-2.5',
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
  }

  return (
    <span
      className={`inline-flex items-center font-medium rounded-lg border shadow-2xs select-none ${roleConfig.color} ${sizeClasses[size] || sizeClasses.sm} ${className}`}
    >
      {showIcon && <Icon className={`shrink-0 ${iconSizes[size] || iconSizes.sm}`} />}
      <span className="tracking-tight">{roleConfig.name}</span>
    </span>
  )
}

export default RoleBadge

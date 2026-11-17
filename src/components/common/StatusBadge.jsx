import Badge from './Badge'

const statusConfig = {
  draft: {
    label: 'Draft',
    variant: 'neutral',
  },
  pending: {
    label: 'Pending',
    variant: 'warning',
  },
  sent: {
    label: 'Sent',
    variant: 'info',
  },
  viewed: {
    label: 'Viewed',
    variant: 'default',
  },
  approved: {
    label: 'Approved',
    variant: 'success',
  },
  accepted: {
    label: 'Accepted',
    variant: 'success',
  },
  signed: {
    label: 'Signed',
    variant: 'success',
  },
  rejected: {
    label: 'Rejected',
    variant: 'danger',
  },
  declined: {
    label: 'Declined',
    variant: 'danger',
  },
  expired: {
    label: 'Expired',
    variant: 'neutral',
  },
}

export const StatusBadge = ({
  status = 'draft',
  size = 'md',
  dot = true,
  pulse = false,
  className = '',
}) => {
  const normalizedKey = String(status).toLowerCase().trim()
  const config = statusConfig[normalizedKey] || {
    label: status.charAt(0).toUpperCase() + status.slice(1),
    variant: 'neutral',
  }

  return (
    <Badge
      variant={config.variant}
      size={size}
      dot={dot}
      pulse={pulse || normalizedKey === 'pending'}
      className={className}
    >
      {config.label}
    </Badge>
  )
}

export default StatusBadge

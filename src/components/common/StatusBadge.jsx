import Badge from './Badge'

const statusConfig = {
  proposal_sent: {
    label: 'Proposal Sent',
    variant: 'info',
  },
  sent: {
    label: 'Proposal Sent',
    variant: 'info',
  },
  proposal_send: {
    label: 'Proposal Sent',
    variant: 'info',
  },
  draft: {
    label: 'Proposal Sent',
    variant: 'info',
  },
  viewed: {
    label: 'Proposal Sent',
    variant: 'info',
  },
  need_time: {
    label: 'Need Time',
    variant: 'warning',
  },
  under_review: {
    label: 'Need Time',
    variant: 'warning',
  },
  pending: {
    label: 'Need Time',
    variant: 'warning',
  },
  signed: {
    label: 'Signed',
    variant: 'success',
  },
  accepted: {
    label: 'Signed',
    variant: 'success',
  },
  approved: {
    label: 'Signed',
    variant: 'success',
  },
  rejected: {
    label: 'Rejected',
    variant: 'danger',
  },
  declined: {
    label: 'Rejected',
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

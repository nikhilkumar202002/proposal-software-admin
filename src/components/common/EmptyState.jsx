import { FolderOpen } from 'lucide-react'
import Button from './Button'

export const EmptyState = ({
  icon: Icon = FolderOpen,
  title = 'No items found',
  description = 'Get started by creating a new item or adjusting your filters.',
  actionText,
  onAction,
  actionIcon,
  children,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-gray-200 bg-white ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-orange-50/60 border border-orange-100 flex items-center justify-center text-[#FB6C00] mb-4 shadow-2xs">
        <Icon className="w-7 h-7 stroke-[1.8]" />
      </div>

      <h3 className="text-base font-bold text-gray-900 tracking-tight">
        {title}
      </h3>

      {description && (
        <p className="text-xs sm:text-sm text-gray-500 max-w-sm mt-1.5 leading-relaxed">
          {description}
        </p>
      )}

      {actionText && onAction && (
        <div className="mt-5">
          <Button
            onClick={onAction}
            icon={actionIcon}
            size="md"
            variant="primary"
          >
            {actionText}
          </Button>
        </div>
      )}

      {children && <div className="mt-5">{children}</div>}
    </div>
  )
}

export default EmptyState

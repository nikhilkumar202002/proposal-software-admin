import {
  MoreVertical,
  Eye,
  Edit3,
  Copy,
  Download,
  Trash2,
} from 'lucide-react'
import Dropdown from './Dropdown'

export const ActionMenu = ({
  onView,
  onEdit,
  onDuplicate,
  onDownload,
  onDelete,
  customActions = [],
  align = 'right',
  triggerIcon: TriggerIcon = MoreVertical,
  className = '',
}) => {
  const defaultItems = []

  if (onView) {
    defaultItems.push({
      id: 'view',
      label: 'View Details',
      icon: Eye,
      onClick: onView,
    })
  }

  if (onEdit) {
    defaultItems.push({
      id: 'edit',
      label: 'Edit',
      icon: Edit3,
      onClick: onEdit,
    })
  }

  if (onDuplicate) {
    defaultItems.push({
      id: 'duplicate',
      label: 'Duplicate',
      icon: Copy,
      onClick: onDuplicate,
    })
  }

  if (onDownload) {
    defaultItems.push({
      id: 'download',
      label: 'Download PDF',
      icon: Download,
      onClick: onDownload,
    })
  }

  if (customActions && customActions.length > 0) {
    if (defaultItems.length > 0) {
      defaultItems.push({ divider: true })
    }
    defaultItems.push(...customActions)
  }

  if (onDelete) {
    if (defaultItems.length > 0) {
      defaultItems.push({ divider: true })
    }
    defaultItems.push({
      id: 'delete',
      label: 'Delete',
      icon: Trash2,
      danger: true,
      onClick: onDelete,
    })
  }

  return (
    <Dropdown
      items={defaultItems}
      align={align}
      width="w-44"
      className={className}
      trigger={({ isOpen }) => (
        <button
          type="button"
          className={`p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer ${
            isOpen ? 'bg-gray-100 text-gray-800' : ''
          }`}
          aria-label="Actions menu"
        >
          <TriggerIcon className="w-4 h-4" />
        </button>
      )}
    />
  )
}

export default ActionMenu

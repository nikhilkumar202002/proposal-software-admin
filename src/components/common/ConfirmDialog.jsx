import { AlertTriangle, Trash2, Info } from 'lucide-react'
import Modal from './Modal'
import Button from './Button'

const variantIcons = {
  danger: Trash2,
  warning: AlertTriangle,
  info: Info,
}

const variantIconBg = {
  danger: 'bg-red-50 text-red-600 border-red-100',
  warning: 'bg-amber-50 text-amber-600 border-amber-100',
  info: 'bg-blue-50 text-blue-600 border-blue-100',
}

const variantBtn = {
  danger: 'danger',
  warning: 'primary',
  info: 'primary',
}

export const ConfirmDialog = ({
  isOpen = false,
  onClose = () => {},
  onConfirm = () => {},
  title = 'Are you sure?',
  description = 'This action cannot be undone. Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // 'danger' | 'warning' | 'info'
  loading = false,
  icon: CustomIcon,
}) => {
  const Icon = CustomIcon || variantIcons[variant] || AlertTriangle
  const iconBg = variantIconBg[variant] || variantIconBg.danger
  const btnVariant = variantBtn[variant] || 'danger'

  return (
    <Modal
      isOpen={isOpen}
      onClose={loading ? undefined : onClose}
      size="sm"
      showCloseButton={!loading}
    >
      <div className="flex flex-col items-center text-center pt-2 pb-1">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center border mb-4 shadow-2xs ${iconBg}`}
        >
          <Icon className="w-6 h-6 stroke-[2]" />
        </div>

        <h3 className="text-base font-bold text-gray-900 tracking-tight">
          {title}
        </h3>

        <p className="text-xs text-gray-500 mt-1.5 leading-relaxed max-w-xs">
          {description}
        </p>

        <div className="flex items-center gap-2.5 w-full mt-6">
          <Button
            variant="outline"
            size="md"
            className="flex-1"
            disabled={loading}
            onClick={onClose}
          >
            {cancelText}
          </Button>

          <Button
            variant={btnVariant}
            size="md"
            className="flex-1"
            loading={loading}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmDialog

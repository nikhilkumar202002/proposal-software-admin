import { AlertTriangle, Trash2, X } from 'lucide-react'

export const DeleteUserModal = ({
  isOpen = false,
  user = null,
  bulkCount = 0,
  onClose = () => {},
  onConfirm = () => {},
  isDeleting = false,
}) => {
  if (!isOpen) return null

  const isBulk = bulkCount > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl border border-gray-200/90 shadow-2xl max-w-md w-full p-6 text-center z-10 animate-in fade-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 mx-auto flex items-center justify-center shadow-2xs mb-4">
          <Trash2 className="w-6 h-6 stroke-[2]" />
        </div>

        <h3 className="text-base font-bold text-gray-900 tracking-tight">
          {isBulk ? `Delete ${bulkCount} Users?` : `Delete User: ${user?.name}?`}
        </h3>

        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
          {isBulk
            ? `You are about to permanently remove ${bulkCount} team member accounts. They will immediately lose workspace access to proposals, clients, and settings.`
            : `Are you sure you want to delete ${user?.name} (${user?.email})? This action cannot be undone and will revoke all platform permissions.`}
        </p>

        {/* Warning banner */}
        <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-left flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-800 leading-normal">
            Proposals and documents previously authored by this account will remain preserved in ProposalOS for compliance.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-medium rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isDeleting ? 'Deleting...' : isBulk ? 'Delete Users' : 'Delete User'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteUserModal

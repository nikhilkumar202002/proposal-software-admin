import { AlertTriangle, X, Check } from 'lucide-react'

export default function AIConfirmationModal({
  isOpen,
  onClose,
  title = 'Confirm AI Modification',
  description = 'Are you sure you want to apply AI-generated changes to this proposal? This may overwrite current content.',
  confirmLabel = 'Confirm & Apply',
  onConfirm,
  isDestructive = false,
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {title}
            </h3>
            <p className="text-[11px] text-slate-500">Security Safeguard</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
          {description}
        </p>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={`px-4 py-2 text-xs font-bold rounded-xl text-white shadow-xs ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-[#FB6C00] hover:bg-[#e05f00]'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

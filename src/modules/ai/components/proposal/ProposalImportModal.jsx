import { X, CheckCircle2, FileEdit, Eye, AlertTriangle } from 'lucide-react'

export default function ProposalImportModal({
  isOpen,
  onClose,
  proposalData,
  onConfirmImport,
  isImporting = false,
}) {
  if (!isOpen || !proposalData) return null

  const { title, clientName, proposalType, pricingItems = [] } = proposalData
  const approvedItems = pricingItems.filter((i) => i.approved !== false)
  const total = approvedItems.reduce((acc, curr) => acc + curr.quantity * curr.unitPrice * (1 + (curr.tax || 0) / 100), 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-[#FB6C00] flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Import to ProposalOS
            </h3>
            <p className="text-xs text-slate-500">
              Convert AI output into an active proposal record
            </p>
          </div>
        </div>

        {/* Summary Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-2 text-xs mb-5">
          <div className="flex justify-between">
            <span className="text-slate-500">Proposal Title:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
              {title}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Client:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {clientName || 'Valued Client'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Type:</span>
            <span className="font-semibold text-[#FB6C00] uppercase text-[11px]">
              {proposalType === 'b2b' ? 'B2B Partner' : 'Direct Client'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Approved Commercials:</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              ₹ {total.toLocaleString('en-IN')} ({approvedItems.length} Milestones)
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/50 text-[11px] text-amber-800 dark:text-amber-300 mb-5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            This proposal will be converted into the standard ProposalOS TipTap AST format and added to your live proposals list.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            type="button"
            disabled={isImporting}
            onClick={() => onConfirmImport('editor')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#FB6C00] hover:bg-[#e05f00] text-white text-xs font-bold shadow-sm shadow-orange-500/20 transition-all disabled:opacity-50"
          >
            <FileEdit className="w-4 h-4" />
            <span>Import & Open TipTap Editor</span>
          </button>

          <button
            type="button"
            disabled={isImporting}
            onClick={() => onConfirmImport('preview')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all"
          >
            <Eye className="w-4 h-4" />
            <span>Import & Open A4 Preview</span>
          </button>
        </div>
      </div>
    </div>
  )
}

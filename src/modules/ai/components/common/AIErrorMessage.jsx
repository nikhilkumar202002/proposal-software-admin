import { AlertCircle, RotateCcw, X } from 'lucide-react'

export const AIErrorMessage = ({ error, onRetry, onDismiss, className = '' }) => {
  if (!error) return null

  return (
    <div
      className={`p-3 bg-red-50/80 border border-red-200/90 rounded-2xl text-xs text-red-800 flex items-start justify-between gap-3 shadow-2xs ${className}`}
    >
      <div className="flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-red-900 block">AI Request Error</span>
          <p className="text-red-700 mt-0.5 leading-relaxed">{error}</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-red-200 text-red-700 hover:bg-red-50 font-semibold transition-colors shadow-2xs cursor-pointer text-[11px]"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Retry</span>
          </button>
        )}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="p-1 text-red-400 hover:text-red-700 rounded-lg hover:bg-red-100/60 transition-colors cursor-pointer"
            title="Dismiss error"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}

export default AIErrorMessage

import { useState } from 'react'
import {
  Copy,
  Check,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Edit2,
  FilePlus,
  Trash2,
} from 'lucide-react'

export default function MessageActions({
  message,
  onCopy,
  onRegenerate,
  onEdit,
  onDelete,
  onUseInProposal,
}) {
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState(null) // 'up' | 'down' | null

  const handleCopy = () => {
    if (onCopy) {
      onCopy(message.content)
    } else {
      navigator.clipboard.writeText(message.content)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isAssistant = message.role === 'assistant' || message.sender === 'assistant'

  return (
    <div className="flex items-center gap-1 mt-2 text-slate-400 opacity-90 transition-opacity duration-200">
      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="p-1.5 rounded-lg hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
        title={copied ? 'Copied!' : 'Copy to clipboard'}
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-emerald-500" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Edit button for user messages */}
      {!isAssistant && onEdit && (
        <button
          onClick={() => onEdit(message)}
          className="p-1.5 rounded-lg hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
          title="Edit and resend"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Assistant specific actions */}
      {isAssistant && (
        <>
          {onRegenerate && (
            <button
              onClick={() => onRegenerate(message.id)}
              className="p-1.5 rounded-lg hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="Regenerate response"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
            className={`p-1.5 rounded-lg transition-colors ${
              feedback === 'up'
                ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                : 'hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800'
            }`}
            title="Good response"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
            className={`p-1.5 rounded-lg transition-colors ${
              feedback === 'down'
                ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/30'
                : 'hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800'
            }`}
            title="Bad response"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
          </button>

          {onUseInProposal && (
            <button
              onClick={() => onUseInProposal(message)}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-[#FB6C00] bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 dark:hover:bg-orange-900/40 rounded-md transition-colors ml-1"
              title="Convert this response into a draft proposal"
            >
              <FilePlus className="w-3.5 h-3.5" />
              <span>Use in Proposal</span>
            </button>
          )}
        </>
      )}

      {onDelete && (
        <button
          onClick={() => onDelete(message.id)}
          className="p-1.5 rounded-lg hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors ml-auto"
          title="Delete message"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}

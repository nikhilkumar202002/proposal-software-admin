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
      onCopy(message.content || message.text || '')
    } else {
      navigator.clipboard.writeText(message.content || message.text || '')
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isAssistant = message.role === 'assistant' || message.sender === 'assistant'

  return (
    <div className="flex items-center gap-1.5 mt-2 text-slate-400">
      {/* Copy button */}
      <button
        type="button"
        onClick={handleCopy}
        className="p-1.5 rounded-lg hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
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
          type="button"
          onClick={() => onEdit(message)}
          className="p-1.5 rounded-lg hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
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
              type="button"
              onClick={() => onRegenerate(message.id)}
              className="p-1.5 rounded-lg hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Regenerate response"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              feedback === 'up'
                ? 'text-emerald-600 bg-emerald-50'
                : 'hover:text-slate-800 hover:bg-slate-100'
            }`}
            title="Good response"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              feedback === 'down'
                ? 'text-rose-600 bg-rose-50'
                : 'hover:text-slate-800 hover:bg-slate-100'
            }`}
            title="Bad response"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
          </button>

          {onUseInProposal && (
            <button
              type="button"
              onClick={() => onUseInProposal(message)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#0055FF] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors ml-1 cursor-pointer"
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
          type="button"
          onClick={() => onDelete(message.id)}
          className="p-1.5 rounded-lg hover:text-rose-600 hover:bg-rose-50 transition-colors ml-auto cursor-pointer"
          title="Delete message"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}

import { Sparkles, MessageSquarePlus } from 'lucide-react'
import { RiChatAiFill } from 'react-icons/ri'

export const AIEmptyState = ({
  title = 'No AI Conversations Yet',
  description = 'Start a new conversation to draft complete proposals, calculate deliverable pricing, or polish commercial terms.',
  actionLabel = 'Start New Chat',
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center max-w-sm mx-auto select-none ${className}`}
    >
      <div className="relative mb-4">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0055FF] shadow-xs">
          <RiChatAiFill className="w-7 h-7 text-[#0055FF]" />
        </div>
        <Sparkles className="w-4 h-4 text-[#00AAFF] absolute -top-1 -right-1 animate-pulse" />
      </div>

      <h3 className="text-sm font-bold text-gray-900 tracking-tight">{title}</h3>
      <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{description}</p>

      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0055FF] hover:bg-[#0044CC] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <MessageSquarePlus className="w-3.5 h-3.5" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  )
}

export default AIEmptyState

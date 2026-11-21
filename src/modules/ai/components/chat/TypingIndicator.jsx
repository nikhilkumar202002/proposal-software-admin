import { RiChatAiFill } from 'react-icons/ri'

export default function TypingIndicator({ statusText = 'ProposalOS AI is crafting response...' }) {
  return (
    <div className="flex items-start gap-4 p-4 max-w-3xl mx-auto rounded-2xl bg-white border border-slate-200/80 shadow-xs animate-in fade-in duration-300">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FB6C00] to-orange-400 flex items-center justify-center text-white shadow-xs shrink-0">
        <RiChatAiFill className="w-4 h-4 animate-pulse" />
      </div>

      <div className="flex-1 pt-1">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="w-2 h-2 rounded-full bg-[#FB6C00] animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-[#FB6C00] animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full bg-[#FB6C00] animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <p className="text-xs text-slate-500 font-medium tracking-wide">
          {statusText}
        </p>
      </div>
    </div>
  )
}

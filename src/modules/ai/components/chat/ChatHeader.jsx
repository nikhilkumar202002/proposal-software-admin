import { useNavigate } from 'react-router-dom'
import {
  PanelLeft,
  Plus,
  Sparkles,
  Settings,
} from 'lucide-react'
import AIModelSelector from '../common/AIModelSelector'

export default function ChatHeader({
  selectedModel,
  onSelectModel,
  isSidebarOpen,
  onToggleSidebar,
  onNewChat,
  activeContext,
  onOpenContextSelector,
  onGenerateProposal,
}) {
  const navigate = useNavigate()

  const handleOpenGenerator = () => {
    if (onGenerateProposal) {
      onGenerateProposal()
    } else {
      navigate('/ai/generator')
    }
  }

  return (
    <header className="h-14 border-b border-slate-200 bg-white px-4 flex items-center justify-between shrink-0 z-10">
      <div className="flex items-center gap-3">
        {/* Sidebar Toggle */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          title={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        {/* Model Selector Dropdown */}
        <AIModelSelector
          selectedModel={selectedModel}
          onSelectModel={onSelectModel}
        />

        {/* Context indicator button */}
        <button
          type="button"
          onClick={onOpenContextSelector}
          className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border border-slate-200 hover:border-[#0055FF] text-slate-600 hover:text-[#0055FF] transition-colors cursor-pointer"
          title="Attach client or proposal context"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#0055FF]" />
          <span>
            {activeContext?.client
              ? `Client: ${activeContext.client.name?.slice(0, 15)}...`
              : activeContext?.proposal
              ? `Prop: ${activeContext.proposal.title?.slice(0, 15)}...`
              : 'Add Context'}
          </span>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleOpenGenerator}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          title="Generate full structured proposal from this conversation"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-200" />
          <span className="hidden sm:inline">Generate Proposal</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/ai/settings')}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          title="AI Provider Settings & Usage"
        >
          <Settings className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onNewChat}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0055FF] hover:bg-[#0044CC] text-white text-xs font-semibold shadow-xs shadow-blue-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Chat</span>
        </button>
      </div>
    </header>
  )
}

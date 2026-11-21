import { useNavigate } from 'react-router-dom'
import {
  PanelLeft,
  Plus,
  Sparkles,
  FilePlus2,
  Settings,
  Share2,
} from 'lucide-react'
import { RiChatAiFill } from 'react-icons/ri'
import AIModelSelector from '../common/AIModelSelector'

export default function ChatHeader({
  selectedModel,
  onSelectModel,
  isSidebarOpen,
  onToggleSidebar,
  onNewChat,
  activeContext,
  onOpenContextSelector,
}) {
  const navigate = useNavigate()

  return (
    <header className="h-14 border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-4 flex items-center justify-between shrink-0 z-10">
      <div className="flex items-center gap-3">
        {/* Sidebar Toggle */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
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
          className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-800 hover:border-[#FB6C00] text-slate-600 dark:text-slate-300 hover:text-[#FB6C00] transition-colors"
          title="Attach client or proposal context"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#FB6C00]" />
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
          onClick={() => navigate('/ai/generator')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 dark:hover:bg-orange-900/40 text-[#FB6C00] text-xs font-semibold transition-colors"
          title="Open Guided AI Proposal Generator"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Proposal Wizard</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/ai/settings')}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
          title="AI Provider Settings & Usage"
        >
          <Settings className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onNewChat}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FB6C00] hover:bg-[#e05f00] text-white text-xs font-semibold shadow-xs shadow-orange-500/20 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Chat</span>
        </button>
      </div>
    </header>
  )
}

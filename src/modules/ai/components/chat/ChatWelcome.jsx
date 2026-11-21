import { RiChatAiFill } from 'react-icons/ri'
import { Sparkles, Building2, UserCheck, FileCheck } from 'lucide-react'
import SuggestedPrompts from './SuggestedPrompts'

export default function ChatWelcome({ onSelectPrompt, activeContext }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto w-full animate-in fade-in duration-300">
      {/* 3D Orb Graphic */}
      <div className="relative mb-6 group">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity" />
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-[#FB6C00] via-orange-500 to-amber-400 p-[2px] shadow-xl shadow-orange-500/25 flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-white dark:bg-slate-950 flex items-center justify-center">
            <RiChatAiFill className="w-10 h-10 text-[#FB6C00] transition-transform duration-300 group-hover:scale-110" />
          </div>
        </div>
      </div>

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200/60 dark:border-orange-900/60 text-[#FB6C00] text-xs font-semibold mb-3">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Enterprise Proposal Intelligence</span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
        What proposal can we craft today?
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
        Draft complete commercial bids, generate structured milestone pricing, audit executive scopes, and export directly to the TipTap editor.
      </p>

      {/* Active context pills if present */}
      {activeContext && (activeContext.client || activeContext.proposal) && (
        <div className="flex items-center justify-center flex-wrap gap-2 mb-6">
          {activeContext.client && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
              <UserCheck className="w-3.5 h-3.5 text-[#FB6C00]" />
              <span>Client: {activeContext.client.name || activeContext.client.companyName}</span>
            </div>
          )}
          {activeContext.proposal && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
              <FileCheck className="w-3.5 h-3.5 text-[#FB6C00]" />
              <span>Target: {activeContext.proposal.title || activeContext.proposal.number}</span>
            </div>
          )}
        </div>
      )}

      {/* Quick Prompts */}
      <SuggestedPrompts onSelectPrompt={onSelectPrompt} />
    </div>
  )
}

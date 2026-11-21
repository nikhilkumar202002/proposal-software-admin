import { useState } from 'react'
import {
  Plus,
  Search,
  MessageSquare,
  Edit2,
  Trash2,
  Check,
  X,
  Settings,
  Sparkles,
  PanelLeftClose,
} from 'lucide-react'
import { RiChatAiFill } from 'react-icons/ri'
import AIUsageIndicator from '../common/AIUsageIndicator'

export default function ChatSidebar({
  conversations = [],
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onRenameConversation,
  onDeleteConversation,
  isOpen = true,
  onClose,
  searchQuery = '',
  onSearchChange,
}) {
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')

  const startRename = (conv, e) => {
    e.stopPropagation()
    setEditingId(conv.id)
    setEditTitle(conv.title)
  }

  const saveRename = (id, e) => {
    e?.stopPropagation()
    if (editTitle.trim()) {
      onRenameConversation(id, editTitle.trim())
    }
    setEditingId(null)
  }

  const cancelRename = (e) => {
    e?.stopPropagation()
    setEditingId(null)
  }

  // Filter conversations
  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes((searchQuery || '').toLowerCase())
  )

  // Group by timestamp / relative age
  const groups = {
    Today: [],
    Yesterday: [],
    'Previous 7 Days': [],
    Older: [],
  }

  filtered.forEach((conv) => {
    const ts = conv.timestamp || 'Today'
    if (ts === 'Today' || ts === 'Yesterday' || ts === 'Previous 7 Days') {
      groups[ts].push(conv)
    } else {
      groups['Older'].push(conv)
    }
  })

  if (!isOpen) return null

  return (
    <aside className="w-68 sm:w-72 bg-slate-50/90 dark:bg-slate-950 border-r border-slate-200/80 dark:border-slate-800 flex flex-col h-full shrink-0 select-none transition-all">
      {/* Top Header */}
      <div className="p-3.5 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#FB6C00] to-orange-400 flex items-center justify-center text-white shadow-xs">
              <RiChatAiFill className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              ProposalOS AI
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors md:hidden"
            title="Close sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* New Chat Button */}
        <button
          type="button"
          onClick={onNewChat}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#FB6C00] text-slate-800 dark:text-slate-100 hover:text-[#FB6C00] font-semibold text-xs shadow-2xs transition-all duration-150"
        >
          <span className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#FB6C00]" />
            New Proposal Chat
          </span>
          <span className="text-[10px] text-slate-400 font-mono">⌘N</span>
        </button>

        {/* Search Conversations */}
        <div className="relative mt-2.5">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-[#FB6C00]"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-4">
        {Object.entries(groups).map(([groupTitle, items]) => {
          if (items.length === 0) return null
          return (
            <div key={groupTitle}>
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {groupTitle}
              </div>
              <div className="space-y-0.5 mt-1">
                {items.map((conv) => {
                  const isActive = conv.id === activeConversationId
                  const isRenaming = editingId === conv.id

                  return (
                    <div
                      key={conv.id}
                      onClick={() => onSelectConversation(conv.id)}
                      className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-all duration-150 ${
                        isActive
                          ? 'bg-orange-50 dark:bg-orange-950/40 text-[#FB6C00] font-semibold shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      {isRenaming ? (
                        <div
                          className="flex items-center gap-1 w-full"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveRename(conv.id, e)
                              if (e.key === 'Escape') cancelRename(e)
                            }}
                            className="flex-1 px-1.5 py-0.5 text-xs rounded border border-[#FB6C00] bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                            autoFocus
                          />
                          <button
                            onClick={(e) => saveRename(conv.id, e)}
                            className="p-1 hover:text-emerald-500"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={cancelRename}
                            className="p-1 hover:text-rose-500"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 truncate pr-2">
                            <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-70" />
                            <span className="truncate">{conv.title}</span>
                          </div>

                          {/* Hover Action Menu */}
                          <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => startRename(conv, e)}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                              title="Rename"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                onDeleteConversation(conv.id)
                              }}
                              className="p-1 rounded text-slate-400 hover:text-rose-500"
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="p-4 text-center text-xs text-slate-400">
            No conversations found
          </div>
        )}
      </div>

      {/* Sidebar Footer with Usage Meter */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40">
        <AIUsageIndicator compact />
      </div>
    </aside>
  )
}

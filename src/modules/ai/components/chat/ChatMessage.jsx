import { useState } from 'react'
import { RiChatAiFill } from 'react-icons/ri'
import { User, FileText } from 'lucide-react'
import MessageActions from './MessageActions'
import { renderCleanContent, formatInlineText } from '../../utils/chatFormatter'

export default function ChatMessage({
  message,
  onCopy,
  onRegenerate,
  onEditSubmit,
  onDelete,
  onUseInProposal,
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(message.content || message.text || '')

  const isUser = message.role === 'user' || message.sender === 'user'
  const content = message.content || message.text || ''

  const handleEditSave = () => {
    if (editText.trim() && onEditSubmit) {
      onEditSubmit(message.id, editText.trim())
      setIsEditing(false)
    }
  }

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code)
  }

  return (
    <div
      className={`group flex items-start gap-3.5 text-xs leading-relaxed max-w-4xl mx-auto w-full transition-colors ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      {/* Assistant Avatar - Clean ProposalOS Gradient */}
      {!isUser && (
        <div className="shrink-0 mt-0.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FB6C00] to-orange-400 flex items-center justify-center text-white shadow-xs">
            <RiChatAiFill className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* Message Card Container - Pure Clean Light Theme */}
      <div
        className={`relative rounded-2xl px-5 py-4 max-w-[88%] sm:max-w-[82%] transition-all ${
          isUser
            ? 'bg-slate-100 text-slate-900 rounded-tr-xs shadow-2xs font-normal'
            : 'bg-white border border-slate-200/90 text-slate-800 shadow-xs'
        }`}
      >
        {/* User Edit Mode */}
        {isEditing ? (
          <div className="w-full space-y-2">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={3}
              className="w-full p-3 text-xs rounded-xl border border-[#FB6C00] bg-white text-slate-900 outline-none ring-2 ring-orange-500/20"
              autoFocus
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 text-xs rounded-lg text-slate-500 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEditSave}
                className="px-3.5 py-1.5 text-xs rounded-lg font-semibold bg-[#FB6C00] hover:bg-[#e05f00] text-white shadow-xs transition-colors"
              >
                Save & Resend
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Attachment badges if present */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {message.attachments.map((att, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-medium text-slate-700"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#FB6C00]" />
                    <span className="truncate max-w-[160px]">{att.name}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Clean Message Body */}
            <div>
              {isUser ? (
                <div className="whitespace-pre-wrap leading-relaxed text-slate-800">
                  {formatInlineText(content)}
                </div>
              ) : (
                renderCleanContent(content, handleCopyCode)
              )}
            </div>

            {/* Actions Bar */}
            <div className="pt-2 mt-2 border-t border-slate-100">
              <MessageActions
                message={message}
                onCopy={onCopy}
                onRegenerate={onRegenerate}
                onEdit={() => setIsEditing(true)}
                onDelete={onDelete}
                onUseInProposal={onUseInProposal}
              />
            </div>
          </>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="shrink-0 mt-0.5">
          <div className="w-8 h-8 rounded-xl bg-slate-200/90 flex items-center justify-center text-slate-600">
            <User className="w-4 h-4" />
          </div>
        </div>
      )}
    </div>
  )
}

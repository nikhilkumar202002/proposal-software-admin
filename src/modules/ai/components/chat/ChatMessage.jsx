import { useState } from 'react'
import { RiChatAiFill } from 'react-icons/ri'
import { User, Copy, Check, CheckCircle2, FileText, ChevronRight } from 'lucide-react'
import MessageActions from './MessageActions'

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
  const [copiedCodeIdx, setCopiedCodeIdx] = useState(null)

  const isUser = message.role === 'user' || message.sender === 'user'
  const content = message.content || message.text || ''

  const handleEditSave = () => {
    if (editText.trim() && onEditSubmit) {
      onEditSubmit(message.id, editText.trim())
      setIsEditing(false)
    }
  }

  const handleCopyCode = (code, index) => {
    navigator.clipboard.writeText(code)
    setCopiedCodeIdx(index)
    setTimeout(() => setCopiedCodeIdx(null), 2000)
  }

  // Markdown block parser for headers, code blocks, tables, and lists
  const renderFormattedMarkdown = (rawText) => {
    if (!rawText) return null

    // Check if contains code blocks
    const parts = rawText.split(/(```[\s\S]*?```)/g)

    return parts.map((part, partIdx) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n')
        const language = lines[0].trim() || 'text'
        const code = lines.slice(1).join('\n') || lines[0]

        return (
          <div key={partIdx} className="my-3 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 text-slate-100 font-mono text-xs shadow-sm">
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800 border-b border-slate-700 text-slate-400 text-[11px]">
              <span className="uppercase font-semibold tracking-wider">{language}</span>
              <button
                onClick={() => handleCopyCode(code, partIdx)}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                {copiedCodeIdx === partIdx ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy code</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3.5 overflow-x-auto text-[11px] leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        )
      }

      // Process regular markdown blocks (tables, headers, lists)
      const paragraphs = part.split(/\n{2,}/)

      return paragraphs.map((para, paraIdx) => {
        const trimmed = para.trim()

        // Markdown Table detection
        if (trimmed.includes('|') && trimmed.includes('\n|')) {
          const tableRows = trimmed.split('\n').filter((r) => r.trim().startsWith('|'))
          if (tableRows.length >= 2) {
            const headerRow = tableRows[0].split('|').slice(1, -1).map((c) => c.trim())
            // row 1 is divider (| --- |)
            const dataRows = tableRows.slice(2).map((row) =>
              row.split('|').slice(1, -1).map((c) => c.trim())
            )

            return (
              <div key={paraIdx} className="my-3 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80">
                    <tr>
                      {headerRow.map((th, thIdx) => (
                        <th
                          key={thIdx}
                          className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-200"
                        >
                          {th}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900/40">
                    {dataRows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        {row.map((td, tdIdx) => (
                          <td
                            key={tdIdx}
                            className="px-3 py-2 text-slate-600 dark:text-slate-300 font-normal leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html: td
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/<br\s*\/?>/gi, '<br/>'),
                            }}
                          />
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }
        }

        // H3 Header ###
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={paraIdx} className="text-sm font-bold text-slate-900 dark:text-white mt-4 mb-2">
              {trimmed.replace('### ', '')}
            </h3>
          )
        }

        // H2 Header ##
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={paraIdx} className="text-base font-bold text-slate-900 dark:text-white mt-5 mb-2 pb-1 border-b border-slate-100 dark:border-slate-800">
              {trimmed.replace('## ', '')}
            </h2>
          )
        }

        // H1 Header #
        if (trimmed.startsWith('# ')) {
          return (
            <h1 key={paraIdx} className="text-lg font-extrabold text-slate-900 dark:text-white mt-6 mb-2">
              {trimmed.replace('# ', '')}
            </h1>
          )
        }

        // Bullet lists
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const items = trimmed.split(/\n(?=[-*\s])/).map((item) => item.replace(/^[-*]\s+/, ''))
          return (
            <ul key={paraIdx} className="my-2 space-y-1 list-disc list-inside text-slate-700 dark:text-slate-300">
              {items.map((item, iIdx) => (
                <li
                  key={iIdx}
                  dangerouslySetInnerHTML={{
                    __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                  }}
                />
              ))}
            </ul>
          )
        }

        // Numbered list
        if (/^\d+\.\s/.test(trimmed)) {
          const items = trimmed.split(/\n(?=\d+\.\s)/).map((item) => item.replace(/^\d+\.\s+/, ''))
          return (
            <ol key={paraIdx} className="my-2 space-y-1 list-decimal list-inside text-slate-700 dark:text-slate-300">
              {items.map((item, iIdx) => (
                <li
                  key={iIdx}
                  dangerouslySetInnerHTML={{
                    __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                  }}
                />
              ))}
            </ol>
          )
        }

        // Divider
        if (trimmed === '---') {
          return <hr key={paraIdx} className="my-4 border-slate-200 dark:border-slate-800" />
        }

        // Standard paragraph
        return (
          <p
            key={paraIdx}
            className="mb-2 leading-relaxed text-slate-700 dark:text-slate-300"
            dangerouslySetInnerHTML={{
              __html: trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
            }}
          />
        )
      })
    })
  }

  return (
    <div
      className={`group flex items-start gap-3 text-xs leading-relaxed max-w-4xl mx-auto w-full transition-colors ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      {/* Assistant Avatar */}
      {!isUser && (
        <div className="shrink-0 mt-0.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FB6C00] to-orange-400 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
            <RiChatAiFill className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* Message Body */}
      <div
        className={`relative rounded-2xl px-4 py-3.5 max-w-[85%] sm:max-w-[78%] transition-all ${
          isUser
            ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tr-xs shadow-xs'
            : 'bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
        }`}
      >
        {/* User Edit Mode */}
        {isEditing ? (
          <div className="w-full space-y-2">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={3}
              className="w-full p-2.5 text-xs rounded-xl border border-[#FB6C00] bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-none ring-2 ring-orange-500/20"
              autoFocus
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-2.5 py-1 text-xs rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-3 py-1 text-xs rounded-lg font-semibold bg-[#FB6C00] hover:bg-[#e05f00] text-white shadow-xs"
              >
                Save & Resend
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Attachment badges if present */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {message.attachments.map((att, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-600 dark:text-slate-300"
                  >
                    <FileText className="w-3 h-3 text-[#FB6C00]" />
                    <span className="truncate max-w-[150px]">{att.name}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Message Text / Markdown */}
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {isUser ? (
                <div className="whitespace-pre-wrap">{content}</div>
              ) : (
                renderFormattedMarkdown(content)
              )}
            </div>

            {/* Actions Bar */}
            <MessageActions
              message={message}
              onCopy={onCopy}
              onRegenerate={onRegenerate}
              onEdit={() => setIsEditing(true)}
              onDelete={onDelete}
              onUseInProposal={onUseInProposal}
            />
          </>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="shrink-0 mt-0.5">
          <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
            <User className="w-4 h-4" />
          </div>
        </div>
      )}
    </div>
  )
}

import { useState, useRef, useEffect } from 'react'
import {
  ArrowUp,
  Square,
  Paperclip,
  Globe,
  X,
  FileText,
  Sparkles,
} from 'lucide-react'

export default function ChatInput({
  onSendMessage,
  onStopGeneration,
  isGenerating = false,
  placeholder = 'Ask ProposalOS AI to draft proposals, pricing, or scopes...',
  onQuickAction,
}) {
  const [input, setInput] = useState('')
  const [attachments, setAttachments] = useState([])
  const [webSearchEnabled, setWebSearchEnabled] = useState(false)
  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`
    }
  }, [input])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    if ((!input.trim() && attachments.length === 0) || isGenerating) return
    onSendMessage(input.trim(), attachments, { webSearch: webSearchEnabled })
    setInput('')
    setAttachments([])
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    const newAttachments = files.map((file) => ({
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      type: file.type,
    }))

    setAttachments((prev) => [...prev, ...newAttachments])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4">
      {/* Attachments preview row */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          {attachments.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 text-[#FB6C00]" />
              <span className="font-medium truncate max-w-[140px]">{file.name}</span>
              <span className="text-[10px] text-slate-400">({file.size})</span>
              <button
                type="button"
                onClick={() => removeAttachment(idx)}
                className="hover:text-rose-500 transition-colors ml-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main floating input box */}
      <div className="relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none focus-within:border-[#FB6C00] dark:focus-within:border-[#FB6C00] focus-within:ring-2 focus-within:ring-orange-500/20 transition-all">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="w-full px-4 pt-3.5 pb-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 bg-transparent resize-none outline-none leading-relaxed"
          style={{ minHeight: '48px', maxHeight: '180px' }}
        />

        {/* Toolbar & Send Actions */}
        <div className="flex items-center justify-between px-3 pb-2.5 pt-1 border-t border-transparent">
          <div className="flex items-center gap-1 text-slate-400">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded-lg hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="Attach RFP, specification, or notes"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Web Search toggle */}
            <button
              type="button"
              onClick={() => setWebSearchEnabled(!webSearchEnabled)}
              className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs ${
                webSearchEnabled
                  ? 'text-[#FB6C00] bg-orange-50 dark:bg-orange-950/40 font-medium'
                  : 'hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800'
              }`}
              title="Toggle Live Web & Market Intelligence"
            >
              <Globe className="w-4 h-4" />
              {webSearchEnabled && <span className="text-[11px]">Web</span>}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {isGenerating ? (
              <button
                type="button"
                onClick={onStopGeneration}
                className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 shadow-sm transition-all"
                title="Stop generation"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!input.trim() && attachments.length === 0}
                className={`inline-flex items-center justify-center w-8 h-8 rounded-xl transition-all shadow-sm ${
                  input.trim() || attachments.length > 0
                    ? 'bg-[#FB6C00] hover:bg-[#e05f00] text-white cursor-pointer shadow-orange-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed'
                }`}
                title="Send message (Enter)"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center mt-2 font-medium">
        ProposalOS AI generates structured commercial drafts. Always review scope and tax compliance before client delivery.
      </p>
    </div>
  )
}

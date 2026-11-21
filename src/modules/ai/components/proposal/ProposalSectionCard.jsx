import { useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Circle,
  Edit2,
  Check,
  RotateCcw,
  FileText,
} from 'lucide-react'

export default function ProposalSectionCard({
  sectionKey,
  title,
  content,
  approved = true,
  onToggleApproval,
  onUpdateContent,
  onRegenerateSection,
  isRegenerating = false,
}) {
  const [isOpen, setIsOpen] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(content || '')

  const wordCount = (content || '').trim().split(/\s+/).filter(Boolean).length

  const handleSave = () => {
    if (onUpdateContent) {
      onUpdateContent(sectionKey, editValue)
    }
    setIsEditing(false)
  }

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 bg-white dark:bg-slate-900 ${
        approved
          ? 'border-slate-200 dark:border-slate-800 shadow-sm'
          : 'border-slate-200/60 dark:border-slate-800/60 opacity-60 bg-slate-50/50 dark:bg-slate-900/30'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 cursor-pointer select-none">
        <div className="flex items-center gap-3">
          {/* Approval Checkbox */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onToggleApproval?.(sectionKey)
            }}
            className="p-0.5 rounded text-[#FB6C00] hover:scale-110 transition-transform"
            title={approved ? 'Approved for import' : 'Excluded from import'}
          >
            {approved ? (
              <CheckCircle className="w-5 h-5 fill-orange-50 dark:fill-orange-950/40 text-[#FB6C00]" />
            ) : (
              <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
            )}
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {title}
              </h4>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                {wordCount} words
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {approved && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsEditing(!isEditing)
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="Edit section content"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}

          {onRegenerateSection && (
            <button
              type="button"
              disabled={isRegenerating}
              onClick={(e) => {
                e.stopPropagation()
                onRegenerateSection(sectionKey)
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
              title="Regenerate this section"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Body Content */}
      {isOpen && (
        <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800">
          {isEditing ? (
            <div className="mt-3 space-y-2">
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                rows={6}
                className="w-full p-3 text-xs rounded-xl border border-[#FB6C00] bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-sans outline-none leading-relaxed"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-2.5 py-1 text-xs rounded-lg text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-3 py-1 text-xs font-semibold rounded-lg bg-[#FB6C00] hover:bg-[#e05f00] text-white"
                >
                  Save Section
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-wrap font-sans">
              {content || <span className="italic text-slate-400">No content generated.</span>}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

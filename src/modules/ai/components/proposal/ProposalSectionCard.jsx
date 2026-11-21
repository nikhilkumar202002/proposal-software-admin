import { useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Circle,
  Edit2,
  RotateCcw,
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
      className={`rounded-2xl border transition-all duration-200 bg-white ${
        approved
          ? 'border-slate-200 shadow-xs'
          : 'border-slate-200/60 opacity-60 bg-slate-50/50'
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
            className="p-0.5 rounded text-[#0055FF] hover:scale-110 transition-transform cursor-pointer"
            title={approved ? 'Approved for import' : 'Excluded from import'}
          >
            {approved ? (
              <CheckCircle className="w-5 h-5 fill-blue-50 text-[#0055FF]" />
            ) : (
              <Circle className="w-5 h-5 text-slate-300" />
            )}
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900">
                {title}
              </h4>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
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
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
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
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer"
              title="Regenerate this section"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Body Content */}
      {isOpen && (
        <div className="p-4 pt-0 border-t border-slate-100">
          {isEditing ? (
            <div className="mt-3 space-y-2">
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                rows={6}
                className="w-full p-3 text-xs rounded-xl border border-[#0055FF] bg-white text-slate-800 font-sans outline-none leading-relaxed"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-2.5 py-1 text-xs rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-3 py-1 text-xs font-semibold rounded-lg bg-[#0055FF] hover:bg-[#0044CC] text-white cursor-pointer"
                >
                  Save Section
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-3 text-xs leading-relaxed text-slate-600 whitespace-pre-wrap font-sans">
              {content || <span className="italic text-slate-400">No content generated.</span>}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import {
  FileCode,
  BookOpen,
  PlusCircle,
  Check,
  Sparkles,
} from 'lucide-react'
import { TipTapEditor } from '../../../components/editor'
import { Button } from '../../../components/common'
import { PROPOSAL_SECTION_TEMPLATES } from '../utils/proposalHelpers'

export const ProposalEditorPanel = ({
  content,
  onChange = () => {},
  className = '',
}) => {
  const [activeTemplateDrawer, setActiveTemplateDrawer] = useState(false)
  const [recentlyAppended, setRecentlyAppended] = useState(null)

  // Append a predefined section template to the existing document JSON
  const handleAppendTemplate = (template) => {
    const currentDoc = content && content.type === 'doc' ? content : { type: 'doc', content: [] }
    const templateContent = template.content?.content || []

    // Append pagebreak first if document already has content
    const updatedContent = [
      ...(currentDoc.content || []),
      { type: 'pageBreak' },
      ...templateContent,
    ]

    const newDoc = {
      ...currentDoc,
      content: updatedContent,
    }

    onChange(newDoc)
    setRecentlyAppended(template.id)
    setTimeout(() => setRecentlyAppended(null), 2500)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Top Banner / Template Trays */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FB6C00]">
              <BookOpen className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Document Body & Proposal Narrative
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Draft rich text narrative, technical proposals, milestones, and legal agreements.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={activeTemplateDrawer ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setActiveTemplateDrawer(!activeTemplateDrawer)}
              icon={Sparkles}
              className="text-xs"
            >
              {activeTemplateDrawer ? 'Hide Section Templates' : 'Insert Proposal Section'}
            </Button>
          </div>
        </div>

        {/* Section Templates Bar */}
        {activeTemplateDrawer && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
              Choose a section block to append to your proposal:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {PROPOSAL_SECTION_TEMPLATES.map((tpl) => {
                const wasAdded = recentlyAppended === tpl.id
                return (
                  <div
                    key={tpl.id}
                    className="p-3 bg-gray-50/70 hover:bg-orange-50/40 rounded-xl border border-gray-200/80 hover:border-orange-200 transition-all flex flex-col justify-between gap-2"
                  >
                    <div>
                      <h4 className="text-xs font-semibold text-gray-900 flex items-center gap-1.5">
                        <FileCode className="w-3.5 h-3.5 text-[#FB6C00]" />
                        {tpl.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                        {tpl.description}
                      </p>
                    </div>

                    <Button
                      type="button"
                      size="sm"
                      variant={wasAdded ? 'secondary' : 'outline'}
                      onClick={() => handleAppendTemplate(tpl)}
                      className="text-xs mt-1 w-full justify-center"
                      icon={wasAdded ? Check : PlusCircle}
                    >
                      {wasAdded ? 'Section Added!' : 'Append Section'}
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main Rich-Text TipTap Editor Container */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
        <TipTapEditor
          content={content}
          onChange={onChange}
          placeholder="Draft introduction, executive summary, methodology, deliverables..."
          className="border-0 shadow-none rounded-none"
          editorClassName="min-h-[460px] max-h-[640px]"
        />
      </div>
    </div>
  )
}

export default ProposalEditorPanel

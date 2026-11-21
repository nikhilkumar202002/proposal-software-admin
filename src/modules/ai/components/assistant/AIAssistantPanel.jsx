import { useState } from 'react'
import { RiChatAiFill } from 'react-icons/ri'
import { X, Check } from 'lucide-react'
import AIActionMenu from './AIActionMenu'
import AIUsageIndicator from '../common/AIUsageIndicator'
import proposalAIService from '../../services/proposalAIService'

export default function AIAssistantPanel({
  isOpen = true,
  onClose,
  targetContent = '',
  onApplyContent,
}) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultText, setResultText] = useState('')

  if (!isOpen) return null

  const handleAction = async (actionId, options = {}) => {
    setIsProcessing(true)

    try {
      let response
      if (actionId === 'improve') {
        response = await proposalAIService.improveContent(targetContent, 'professional')
      } else if (actionId === 'expand') {
        response = await proposalAIService.improveContent(targetContent, 'expand')
      } else if (actionId === 'summarize') {
        response = await proposalAIService.improveContent(targetContent, 'summarize')
      } else if (actionId === 'translate') {
        response = await proposalAIService.improveContent(
          targetContent,
          `translate to ${options.language || 'Hindi'}`
        )
      } else if (actionId === 'review') {
        const analysis = await proposalAIService.analyseProposal({ content: targetContent })
        response = `### Proposal Win Probability Analysis (${analysis.winProbability}%)\n\n**Key Strengths:**\n${analysis.strengths.map((s) => `- ${s}`).join('\n')}\n\n**Recommended Improvements:**\n${analysis.weaknesses.map((w) => `- ${w}`).join('\n')}`
      } else if (actionId === 'suggest-pricing') {
        response = `### Suggested Payment Milestones\n\n1. **Architecture & Scope Signoff (30%)** — Due upon agreement execution.\n2. **Phase 1 Alpha & Staging Deployment (35%)** — Due upon prototype demonstration.\n3. **UAT & Security Verification (25%)** — Due upon user acceptance.\n4. **Production Go-Live & Handover (10%)** — Due upon live production launch.`
      }

      setResultText(typeof response === 'string' ? response : response.improvedContent || '')
    } catch (err) {
      setResultText('Error generating response: ' + err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleApply = () => {
    if (resultText && onApplyContent) {
      onApplyContent(resultText)
      setResultText('')
    }
  }

  return (
    <div className="w-80 sm:w-96 bg-white border-l border-slate-200 flex flex-col h-full shadow-lg z-20">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#0055FF] flex items-center justify-center text-white shadow-xs">
            <RiChatAiFill className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              AI Document Assistant
            </h3>
            <p className="text-[10px] text-slate-400">Contextual writing companion</p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Action Menu */}
        <AIActionMenu onSelectAction={handleAction} isProcessing={isProcessing} />

        {/* Generated Result Preview */}
        {resultText && (
          <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200 animate-in fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0055FF]">
                AI Recommendation
              </span>
              <button
                type="button"
                onClick={() => setResultText('')}
                className="text-[10px] text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
            <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
              {resultText}
            </div>

            {onApplyContent && (
              <button
                type="button"
                onClick={handleApply}
                className="w-full mt-3 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#0055FF] hover:bg-[#0044CC] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Apply to Document</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-100 bg-white">
        <AIUsageIndicator compact />
      </div>
    </div>
  )
}

import { useState } from 'react'
import {
  Wand2,
  Maximize2,
  Minimize2,
  Languages,
  ShieldCheck,
  IndianRupee,
  ChevronRight,
} from 'lucide-react'

export const AI_ACTIONS = [
  {
    id: 'improve',
    name: 'Improve Proposal Content',
    desc: 'Enhance executive tone, clarity, and persuasive flow',
    icon: Wand2,
  },
  {
    id: 'expand',
    name: 'Expand Details & Scope',
    desc: 'Add technical depth, milestones, and deliverables',
    icon: Maximize2,
  },
  {
    id: 'summarize',
    name: 'Summarize into Executive Brief',
    desc: 'Condense into high-impact key takeaway bullet points',
    icon: Minimize2,
  },
  {
    id: 'review',
    name: 'Audit Proposal & Win Rate',
    desc: 'Analyze competitive edge, risks, and win probability',
    icon: ShieldCheck,
  },
  {
    id: 'suggest-pricing',
    name: 'Suggest Milestone Pricing',
    desc: 'Structure milestone percentages and taxes in INR',
    icon: IndianRupee,
  },
]

export default function AIActionMenu({ onSelectAction, isProcessing = false }) {
  const [selectedLanguage, setSelectedLanguage] = useState('Hindi')
  const [showLanguagePicker, setShowLanguagePicker] = useState(false)

  const handleAction = (actionId) => {
    if (actionId === 'translate') {
      onSelectAction('translate', { language: selectedLanguage })
    } else {
      onSelectAction(actionId)
    }
  }

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-3 shadow-sm space-y-1">
      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        ProposalOS AI Actions
      </div>

      {AI_ACTIONS.map((action) => {
        const Icon = action.icon
        return (
          <button
            key={action.id}
            type="button"
            disabled={isProcessing}
            onClick={() => handleAction(action.id)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-orange-50 group transition-colors disabled:opacity-50 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-[#FB6C00] group-hover:text-white flex items-center justify-center transition-colors">
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-800 group-hover:text-[#FB6C00]">
                  {action.name}
                </div>
                <div className="text-[10px] text-slate-400">{action.desc}</div>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#FB6C00] group-hover:translate-x-0.5 transition-all" />
          </button>
        )
      })}

      {/* Translate Action */}
      <div className="pt-1 border-t border-slate-100">
        <button
          type="button"
          disabled={isProcessing}
          onClick={() => setShowLanguagePicker(!showLanguagePicker)}
          className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-orange-50 group transition-colors disabled:opacity-50 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-[#FB6C00] group-hover:text-white flex items-center justify-center transition-colors">
              <Languages className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-800 group-hover:text-[#FB6C00]">
                Translate Content
              </div>
              <div className="text-[10px] text-slate-400">Selected: {selectedLanguage}</div>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {showLanguagePicker && (
          <div className="p-2 mt-1 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="text-xs px-2 py-1 rounded-lg border border-slate-200 bg-white"
            >
              <option value="Hindi">Hindi (हिन्दी)</option>
              <option value="Spanish">Spanish (Español)</option>
              <option value="French">French (Français)</option>
              <option value="German">German (Deutsch)</option>
              <option value="Japanese">Japanese (日本語)</option>
              <option value="Arabic">Arabic (العربية)</option>
            </select>
            <button
              type="button"
              onClick={() => handleAction('translate')}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#FB6C00] text-white hover:bg-[#e05f00] cursor-pointer"
            >
              Translate
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

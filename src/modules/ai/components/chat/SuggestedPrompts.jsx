import { Sparkles, FileText, IndianRupee, ShieldCheck, Layers } from 'lucide-react'

export const PROPOSAL_SUGGESTIONS = [
  {
    icon: Sparkles,
    title: 'Generate Complete Proposal',
    prompt: 'Generate a complete B2B enterprise proposal for a Cloud Migration & DevOps transformation project with executive summary, deliverables, timeline, and structured pricing.',
    category: 'Full Proposal',
    badge: 'Popular',
  },
  {
    icon: IndianRupee,
    title: 'Suggest Pricing & Milestones',
    prompt: 'Suggest a competitive 4-stage milestone pricing structure for a 3-month SaaS development project with 18% GST and milestone acceptance criteria.',
    category: 'Commercials',
  },
  {
    icon: Layers,
    title: 'Draft Scope of Work & Deliverables',
    prompt: 'Draft an airtight Scope of Work (SOW) with clear inclusions, explicit exclusions, and project timeline phases for a custom web application.',
    category: 'Scope',
  },
  {
    icon: ShieldCheck,
    title: 'Proposal Audit & Win Rate',
    prompt: 'Audit this proposal for executive tone, persuasive ROI framing, competitive edge, and recommend specific improvements to increase win probability.',
    category: 'Optimization',
  },
]

export default function SuggestedPrompts({ onSelectPrompt, suggestions = PROPOSAL_SUGGESTIONS }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full mx-auto">
      {suggestions.map((item, index) => {
        const Icon = item.icon || Sparkles
        return (
          <button
            key={index}
            onClick={() => onSelectPrompt(item.prompt)}
            className="group relative flex flex-col items-start p-4 text-left rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-[#FB6C00] dark:hover:border-[#FB6C00] shadow-sm hover:shadow-md hover:shadow-orange-500/5 transition-all duration-200"
          >
            <div className="flex items-center justify-between w-full mb-2">
              <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-[#FB6C00] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Icon className="w-4 h-4" />
              </div>
              {item.badge && (
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/40 text-[#FB6C00]">
                  {item.badge}
                </span>
              )}
            </div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-[#FB6C00] transition-colors mb-1 line-clamp-1">
              {item.title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {item.prompt}
            </p>
          </button>
        )
      })}
    </div>
  )
}

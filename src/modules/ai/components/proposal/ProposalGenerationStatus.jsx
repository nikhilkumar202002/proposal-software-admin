import { CheckCircle2, Loader2, Sparkles, AlertCircle } from 'lucide-react'

export default function ProposalGenerationStatus({
  currentStep = 1,
  steps = [
    { id: 1, name: 'Proposal Blueprint', desc: 'Synthesizing client profile & requirements' },
    { id: 2, name: 'Scope & Deliverables', desc: 'Drafting inclusions, exclusions & timeline' },
    { id: 3, name: 'Milestone Commercials', desc: 'Structuring pricing items, taxes & terms' },
    { id: 4, name: 'Review & Ready', desc: 'Validating TipTap AST and financial totals' },
  ],
  isGenerating = false,
  error = null,
}) {
  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-50 text-[#FB6C00] flex items-center justify-center">
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
          </div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Proposal Generation Workflow
          </h3>
        </div>
        <span className="text-xs font-semibold text-[#FB6C00] bg-orange-50 px-2.5 py-1 rounded-full">
          Step {Math.min(currentStep, steps.length)} of {steps.length}
        </span>
      </div>

      {/* Progress Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {steps.map((s) => {
          const isDone = currentStep > s.id
          const isActive = currentStep === s.id && isGenerating

          return (
            <div
              key={s.id}
              className={`p-3 rounded-xl border transition-all ${
                isDone
                  ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                  : isActive
                  ? 'bg-orange-50/60 border-[#FB6C00] text-[#FB6C00] ring-2 ring-orange-500/10'
                  : 'bg-slate-50 border-slate-200/80 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold tracking-wider uppercase">
                  Phase 0{s.id}
                </span>
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                ) : isActive ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FB6C00]" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                )}
              </div>
              <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">
                {s.name}
              </h4>
              <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                {s.desc}
              </p>
            </div>
          )
        })}
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

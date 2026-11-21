import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Settings,
  ShieldCheck,
  CheckCircle2,
  Trash2,
} from 'lucide-react'
import { useAIStore } from '../store/aiStore'
import AIUsageIndicator from '../components/common/AIUsageIndicator'

export default function AISettingsPage() {
  const navigate = useNavigate()
  const {
    activeProvider,
    setProvider,
    resetUsage,
  } = useAIStore()

  const [savedSuccess, setSavedSuccess] = useState(false)
  const [tokenBudget, setTokenBudget] = useState('500,000')
  const [maxMonthlySpend, setMaxMonthlySpend] = useState('50') // $50

  const handleSaveSettings = (e) => {
    e.preventDefault()
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 2500)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Header */}
      <header className="h-14 border-b border-slate-200 bg-white px-4 sm:px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/ai')}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Back to AI Chat"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#FB6C00]" />
              AI Intelligence & Provider Settings
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Settings Saved
            </span>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {/* Security Alert Callout */}
        <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200/80 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#FB6C00] shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed text-slate-700">
            <span className="font-bold text-slate-900">
              Zero-Trust Key Management Architecture:
            </span>{' '}
            All API provider credentials (OpenAI, Anthropic Claude, Google Gemini) are isolated in your Laravel backend environment (`.env`). The frontend communicates strictly via authenticated CSRF/Bearer tokens. No API keys are ever stored or exposed in the browser bundle.
          </div>
        </div>

        {/* Settings Form */}
        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* Provider Selection Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Active LLM Engine Provider
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Select which upstream foundation model infrastructure processes your proposals
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'openai', name: 'OpenAI (GPT-4o)', desc: 'Fast, structured reasoning & JSON schemas', badge: 'Active' },
                { id: 'gemini', name: 'Google Gemini', desc: 'Gemini 2.5 Flash with live web groundings', badge: 'Fast' },
                { id: 'claude', name: 'Anthropic Claude', desc: 'Claude 3.7 Sonnet for executive prose', badge: 'Deep' },
              ].map((prov) => {
                const isSelected = activeProvider === prov.id
                return (
                  <div
                    key={prov.id}
                    onClick={() => setProvider(prov.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#FB6C00] bg-orange-50/50 ring-2 ring-orange-500/10'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-900">
                        {prov.name}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {prov.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">{prov.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quotas & Budget Limits */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Token Quotas & Cost Guardrails
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Safeguard against unexpected usage spikes with automated billing throttling
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Monthly Token Allowance
                </label>
                <input
                  type="text"
                  value={tokenBudget}
                  onChange={(e) => setTokenBudget(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-[#FB6C00]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Spend Threshold Alert ($ USD)
                </label>
                <input
                  type="number"
                  value={maxMonthlySpend}
                  onChange={(e) => setMaxMonthlySpend(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-[#FB6C00]"
                />
              </div>
            </div>
          </div>

          {/* Usage Metrics Breakdown */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Live Usage & Consumption Logs
                </h3>
                <p className="text-xs text-slate-500">
                  Aggregated telemetry tracked per authenticated user
                </p>
              </div>
              <button
                type="button"
                onClick={resetUsage}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Usage Logs</span>
              </button>
            </div>

            <AIUsageIndicator />
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#FB6C00] hover:bg-[#e05f00] text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

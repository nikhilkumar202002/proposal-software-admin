import { useState } from 'react'
import {
  X,
  UserCheck,
  FileCheck,
  Building2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { useClientStore } from '../../../clients/store/clientStore'
import { useProposalStore } from '../../../proposals/store/proposalStore'
import { useSettingsStore } from '../../../settings/store/settingsStore'

export default function AIContextSelector({
  isOpen,
  onClose,
  activeContext = {},
  onSaveContext,
}) {
  const { clients } = useClientStore()
  const { proposals } = useProposalStore()
  const { company } = useSettingsStore()

  const [selectedClientId, setSelectedClientId] = useState(activeContext?.client?.id || '')
  const [selectedProposalId, setSelectedProposalId] = useState(activeContext?.proposal?.id || '')
  const [includeCompanyInfo, setIncludeCompanyInfo] = useState(
    activeContext?.includeCompanyInfo !== false
  )

  if (!isOpen) return null

  const handleSave = () => {
    const selectedClient = clients.find((c) => String(c.id) === String(selectedClientId)) || null
    const selectedProposal = proposals.find((p) => String(p.id) === String(selectedProposalId)) || null

    onSaveContext?.({
      client: selectedClient,
      proposal: selectedProposal,
      includeCompanyInfo,
      company: includeCompanyInfo ? company : null,
    })
    onClose()
  }

  const handleClear = () => {
    setSelectedClientId('')
    setSelectedProposalId('')
    setIncludeCompanyInfo(true)
    onSaveContext?.({
      client: null,
      proposal: null,
      includeCompanyInfo: true,
      company,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0055FF] flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              AI Context Awareness
            </h3>
            <p className="text-xs text-slate-500">
              Attach active workspace data to ground AI responses
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          {/* Client Selector */}
          <div>
            <label className="flex items-center gap-2 font-semibold text-slate-700 mb-1.5">
              <UserCheck className="w-4 h-4 text-[#0055FF]" />
              <span>Target Client Profile</span>
            </label>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 outline-none focus:border-[#0055FF]"
            >
              <option value="">None (Generic Prompt)</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name || c.companyName} {c.email ? `(${c.email})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Proposal Selector */}
          <div>
            <label className="flex items-center gap-2 font-semibold text-slate-700 mb-1.5">
              <FileCheck className="w-4 h-4 text-[#0055FF]" />
              <span>Existing Proposal Reference</span>
            </label>
            <select
              value={selectedProposalId}
              onChange={(e) => setSelectedProposalId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 outline-none focus:border-[#0055FF]"
            >
              <option value="">None (Start Fresh)</option>
              {proposals.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title || p.number} - {p.client?.name || 'Valued Client'}
                </option>
              ))}
            </select>
          </div>

          {/* Company Info Toggle */}
          <div className="pt-2">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={includeCompanyInfo}
                onChange={(e) => setIncludeCompanyInfo(e.target.checked)}
                className="w-4 h-4 rounded text-[#0055FF] focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#0055FF]" />
                  Include Company Profile & Branding
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Provides your agency name, legal address, and tax GSTIN for accurate terms.
                </div>
              </div>
            </label>
          </div>

          {/* Privacy Note */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>
              Sanitized context only. No system keys or credentials are ever sent to LLM providers.
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleClear}
            className="text-xs font-semibold text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            Clear Context
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs rounded-xl text-slate-500 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-[#0055FF] hover:bg-[#0044CC] text-white shadow-xs cursor-pointer"
            >
              Apply Context
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

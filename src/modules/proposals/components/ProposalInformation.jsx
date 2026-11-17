import { FileText, RefreshCw, Layers } from 'lucide-react'
import { Input, DatePicker, Select } from '../../../components/common'
import { generateProposalNumber, PROPOSAL_STATUSES } from '../utils/proposalHelpers'

export const ProposalInformation = ({
  proposal,
  onChange = () => {},
  className = '',
}) => {
  if (!proposal) return null

  const handleRegenerateNumber = () => {
    const fresh = generateProposalNumber([])
    onChange({ number: fresh })
  }

  const statusOptions = PROPOSAL_STATUSES.map((s) => ({
    value: s.value,
    label: s.label,
  }))

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs">
        <div className="flex items-center gap-3 pb-5 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FB6C00]">
            <FileText className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Proposal Metadata & Overview
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Define the proposal tracking number, primary objective, schedule, and lifecycle state.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-5">
          {/* Proposal Number */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-700">
                Proposal Number <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleRegenerateNumber}
                className="text-[11px] text-[#FB6C00] hover:text-[#E65F00] font-medium flex items-center gap-1 cursor-pointer transition-colors"
                title="Regenerate unique proposal ID"
              >
                <RefreshCw className="w-3 h-3" />
                Auto-generate
              </button>
            </div>
            <Input
              value={proposal.number || ''}
              onChange={(e) => onChange({ number: e.target.value })}
              placeholder="e.g. PROP-2026-001"
              required
            />
          </div>

          {/* Proposal Title */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-gray-700">
              Proposal Title <span className="text-red-500">*</span>
            </label>
            <Input
              value={proposal.title || ''}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="e.g. Enterprise Cloud Infrastructure & DevOps Modernization"
              required
            />
          </div>

          {/* Project Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">
              Project Name / Engagement
            </label>
            <Input
              value={proposal.projectName || ''}
              onChange={(e) => onChange({ projectName: e.target.value })}
              placeholder="e.g. Cloud Transformation Phase 1"
              icon={Layers}
            />
          </div>

          {/* Proposal Date */}
          <div className="space-y-1.5">
            <DatePicker
              label="Proposal Date"
              value={proposal.date}
              onChange={(d) => onChange({ date: d })}
              placeholder="Select proposal issue date"
              required
            />
          </div>

          {/* Valid Until Date */}
          <div className="space-y-1.5">
            <DatePicker
              label="Valid Until"
              value={proposal.validUntil}
              onChange={(d) => onChange({ validUntil: d })}
              placeholder="Select expiration date"
              required
            />
          </div>

          {/* Proposal Status */}
          <div className="space-y-1.5">
            <Select
              label="Proposal Status"
              options={statusOptions}
              value={proposal.status || 'draft'}
              onChange={(val) => onChange({ status: val })}
              placeholder="Select current status"
            />
          </div>

          {/* Internal Notes */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-gray-700">
              Internal Scope Notes / Commercial Remarks
            </label>
            <Input
              value={proposal.notes || ''}
              onChange={(e) => onChange({ notes: e.target.value })}
              placeholder="Brief summary or internal client notes (displayed on proposal summary)"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProposalInformation

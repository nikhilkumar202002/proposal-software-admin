import {
  FileText,
  RefreshCw,
  Layers,
  Building2,
  Briefcase,
  Calendar,
  Clock,
  Tag,
  AlignLeft,
} from 'lucide-react'
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

  const isB2B = proposal.proposalType === 'b2b' || proposal.showCompanyLogo === false

  const statusOptions = PROPOSAL_STATUSES.map((s) => ({
    value: s.value,
    label: s.label,
  }))

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-200/80 shadow-2xs space-y-6">
        {/* Card Header & Compact Toggle Option */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0055FF] shrink-0">
              <FileText className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 tracking-tight">
                Proposal Information & Configuration
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Set document title, unique proposal ID, dates, and header branding output format.
              </p>
            </div>
          </div>

          {/* Instant Toggle Option: Direct Client vs B2B */}
          <div className="flex items-center gap-2 p-1 bg-gray-100/80 rounded-xl border border-gray-200 shrink-0 self-start lg:self-auto select-none">
            <button
              type="button"
              onClick={() => onChange({ proposalType: 'direct', showCompanyLogo: true })}
              title="Direct Client Proposal - Displays company logo on document header"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                !isB2B
                  ? 'bg-[#0055FF] text-white shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Direct (With Logo)</span>
            </button>
            <button
              type="button"
              onClick={() => onChange({ proposalType: 'b2b', showCompanyLogo: false })}
              title="B2B Partner Proposal - Hides company logo while preserving exact dimensions"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isB2B
                  ? 'bg-[#0055FF] text-white shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>B2B (No Logo)</span>
            </button>
          </div>
        </div>

        {/* Output Type Status Notification Banner */}
        <div className="p-3 bg-blue-50/40 rounded-xl border border-blue-100 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-gray-700">
            <span className="font-semibold text-gray-900">Current Output Type:</span>
            <span className="font-bold text-[#0055FF]">
              {!isB2B ? 'Direct Client Proposal' : 'B2B Partner Proposal'}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500">
              {!isB2B
                ? 'Company logo is rendered in the document header.'
                : 'Company logo is hidden from the header (exact layout & margins strictly preserved).'}
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-white border border-blue-200 text-[#0055FF] shrink-0">
            {!isB2B ? 'Logo Active' : 'Logo Hidden'}
          </span>
        </div>

        {/* 1. Core Engagement Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5 text-[#0055FF]" />
            <span>Engagement & Deliverable Scope</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Proposal Title - Dominant Field */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 block">
                Proposal Title <span className="text-red-500">*</span>
              </label>
              <Input
                value={proposal.title || ''}
                onChange={(e) => onChange({ title: e.target.value })}
                placeholder="e.g. Enterprise Cloud Infrastructure & DevOps Modernization"
                required
              />
            </div>

            {/* Project / Engagement Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 block">
                Project Name / Phase
              </label>
              <Input
                value={proposal.projectName || ''}
                onChange={(e) => onChange({ projectName: e.target.value })}
                placeholder="e.g. Digital Modernization Phase 1"
                icon={Layers}
              />
            </div>
          </div>
        </div>

        {/* 2. Document Schedule & Tracking Identifiers */}
        <div className="space-y-4 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-[#0055FF]" />
            <span>Schedule & Reference Identifiers</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Proposal Number */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-700">
                  Proposal ID <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleRegenerateNumber}
                  className="text-[11px] text-[#0055FF] hover:text-[#0044CC] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  title="Generate new unique proposal number"
                >
                  <RefreshCw className="w-3 h-3" />
                  Auto-ID
                </button>
              </div>
              <Input
                value={proposal.number || ''}
                onChange={(e) => onChange({ number: e.target.value })}
                placeholder="PROP-2026-001"
                required
              />
            </div>

            {/* Issue Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 block">
                Issue Date <span className="text-red-500">*</span>
              </label>
              <DatePicker
                value={proposal.date}
                onChange={(d) => onChange({ date: d })}
                placeholder="Select date"
                required
              />
            </div>

            {/* Valid Until Date */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-700 block">
                  Valid Until <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                  <Clock className="w-2.5 h-2.5" />
                  Expiry
                </span>
              </div>
              <DatePicker
                value={proposal.validUntil}
                onChange={(d) => onChange({ validUntil: d })}
                placeholder="Select expiration"
                required
              />
            </div>

            {/* Lifecycle Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 block">
                Proposal Lifecycle Status
              </label>
              <Select
                options={statusOptions}
                value={proposal.status || 'draft'}
                onChange={(val) => onChange({ status: val })}
                placeholder="Select status"
              />
            </div>
          </div>
        </div>

        {/* 3. Internal Notes / Commercial Remarks */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <AlignLeft className="w-3.5 h-3.5 text-[#0055FF]" />
            <span>Commercial Remarks & Scope Summary</span>
          </div>

          <textarea
            rows={2}
            value={proposal.notes || ''}
            onChange={(e) => onChange({ notes: e.target.value })}
            placeholder="Add internal remarks, milestone highlights, or custom terms to be referenced in the proposal summary..."
            className="w-full p-3 text-xs text-gray-900 bg-white border border-gray-300 rounded-xl shadow-2xs focus:border-[#0055FF] focus:ring-2 focus:ring-[#0055FF]/20 outline-none transition-all placeholder:text-gray-400"
          />
        </div>
      </div>
    </div>
  )
}

export default ProposalInformation

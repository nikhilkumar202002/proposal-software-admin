import {
  Calendar,
  Clock,
  FileSpreadsheet,
} from 'lucide-react'
import { StatusBadge } from '../../../components/common'
import { formatCurrency } from '../utils/proposalHelpers'

export const ProposalSummary = ({
  proposal,
  totals,
  className = '',
}) => {
  if (!proposal) return null

  const currency = proposal.pricing?.currency || proposal.currency || 'INR'

  return (
    <div className={`bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4 ${className}`}>
      {/* Title & Status */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-100">
        <div>
          <span className="text-[11px] font-mono font-bold text-[#0055FF]">
            {proposal.number || 'DRAFT'}
          </span>
          <h4 className="text-sm font-bold text-gray-900 mt-0.5 line-clamp-1">
            {proposal.title || 'Untitled Proposal'}
          </h4>
        </div>
        <StatusBadge status={proposal.status || 'draft'} />
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-gray-50/70 rounded-xl border border-gray-100">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
            Client
          </span>
          <span className="text-xs font-bold text-gray-800 line-clamp-1 mt-0.5">
            {proposal.client?.companyName || proposal.client?.name || 'Not Specified'}
          </span>
        </div>

        <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
          <span className="text-[10px] font-semibold text-[#0055FF] uppercase tracking-wider block">
            Grand Total
          </span>
          <span className="text-xs font-extrabold text-[#0055FF] line-clamp-1 mt-0.5">
            {formatCurrency(totals?.grandTotal || 0, currency)}
          </span>
        </div>
      </div>

      {/* Meta Dates & Details */}
      <div className="space-y-2 text-xs text-gray-600 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Output Type:</span>
          <span className="font-semibold text-gray-800 text-[11px] px-2 py-0.5 rounded-md bg-gray-100">
            {proposal.proposalType === 'b2b' || proposal.showCompanyLogo === false
              ? 'B2B (Without Logo)'
              : 'Direct (With Logo)'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-gray-500">
            <Calendar className="w-3.5 h-3.5" />
            Issue Date:
          </span>
          <span className="font-medium text-gray-900">
            {proposal.date || 'Today'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            Valid Until:
          </span>
          <span className="font-medium text-gray-900">
            {proposal.validUntil || '30 days'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-gray-500">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Line Items:
          </span>
          <span className="font-medium text-gray-900">
            {totals?.itemCount || proposal.pricing?.items?.length || 0} deliverables
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProposalSummary

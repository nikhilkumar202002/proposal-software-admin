import { useState } from 'react'
import {
  FileText,
  IndianRupee,
  CheckCircle,
  Circle,
  Sparkles,
  ExternalLink,
  Eye,
} from 'lucide-react'
import ProposalSectionCard from './ProposalSectionCard'

export default function ProposalPreview({
  proposalData,
  onToggleSectionApproval,
  onUpdateSectionContent,
  onTogglePricingItemApproval,
  onApproveAllPricing,
  onImportToProposalOS,
  onOpenInEditor,
  onOpenInA4Preview,
}) {
  const [activeTab, setActiveTab] = useState('sections') // 'sections' | 'pricing'

  if (!proposalData) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-xs text-slate-400">Generate a proposal to preview structured content and commercials.</p>
      </div>
    )
  }

  const {
    title,
    clientName,
    proposalType = 'direct',
    currency = 'INR',
    sections = {},
    pricingItems = [],
  } = proposalData

  // Calculate approved pricing totals
  const approvedPricing = pricingItems.filter((i) => i.approved !== false)
  const subtotal = approvedPricing.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
  const taxTotal = approvedPricing.reduce((sum, item) => sum + (item.quantity * item.unitPrice * (item.tax || 0) / 100), 0)
  const grandTotal = subtotal + taxTotal

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
      {/* Top Header Card */}
      <div className="p-6 border-b border-slate-200 bg-slate-50/50">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-[#0055FF]">
                {proposalType === 'b2b' ? 'B2B Partner Proposal' : 'Direct Client Proposal'}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-semibold text-slate-700">
                Client: {clientName || 'Valued Client'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {title || 'AI Generated Commercial Proposal'}
            </h2>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-right shadow-2xs">
              <div className="text-[10px] uppercase font-bold text-slate-400">Total Estimate</div>
              <div className="text-base font-extrabold text-[#0055FF]">{formatCurrency(grandTotal)}</div>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 mt-6">
          <button
            type="button"
            onClick={() => setActiveTab('sections')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'sections'
                ? 'bg-[#0055FF] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Narrative Sections ({Object.keys(sections).length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pricing')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'pricing'
                ? 'bg-[#0055FF] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <IndianRupee className="w-3.5 h-3.5" />
            <span>Commercial Pricing ({pricingItems.length} Milestones)</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Narrative Sections */}
      {activeTab === 'sections' && (
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Toggle checkmarks to include/exclude sections before importing.</span>
          </div>

          <ProposalSectionCard
            sectionKey="executiveSummary"
            title="1. Executive Summary"
            content={sections.executiveSummary}
            approved={sections.executiveSummaryApproved !== false}
            onToggleApproval={onToggleSectionApproval}
            onUpdateContent={onUpdateSectionContent}
          />

          <ProposalSectionCard
            sectionKey="scopeOfWork"
            title="2. Scope of Work & Technical Architecture"
            content={sections.scopeOfWork}
            approved={sections.scopeOfWorkApproved !== false}
            onToggleApproval={onToggleSectionApproval}
            onUpdateContent={onUpdateSectionContent}
          />

          <ProposalSectionCard
            sectionKey="deliverables"
            title="3. Key Milestones & Deliverables"
            content={sections.deliverables}
            approved={sections.deliverablesApproved !== false}
            onToggleApproval={onToggleSectionApproval}
            onUpdateContent={onUpdateSectionContent}
          />

          <ProposalSectionCard
            sectionKey="timeline"
            title="4. Project Timeline & Sprints"
            content={sections.timeline}
            approved={sections.timelineApproved !== false}
            onToggleApproval={onToggleSectionApproval}
            onUpdateContent={onUpdateSectionContent}
          />

          <ProposalSectionCard
            sectionKey="terms"
            title="5. Commercial Terms & SLA"
            content={sections.terms}
            approved={sections.termsApproved !== false}
            onToggleApproval={onToggleSectionApproval}
            onUpdateContent={onUpdateSectionContent}
          />
        </div>
      )}

      {/* Tab 2: Structured Pricing Items Approval */}
      {activeTab === 'pricing' && (
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Itemized Milestone Breakdown
              </h3>
              <p className="text-xs text-slate-500">
                User approval is required for each milestone before importing into the ProposalOS pricing engine.
              </p>
            </div>
            <button
              type="button"
              onClick={onApproveAllPricing}
              className="text-xs font-semibold text-[#0055FF] hover:underline cursor-pointer"
            >
              Approve All Milestones
            </button>
          </div>

          {/* Pricing Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50 font-bold text-slate-700">
                <tr>
                  <th className="w-10 px-3 py-2.5 text-center">Approve</th>
                  <th className="px-3 py-2.5 text-left">Description / Milestone</th>
                  <th className="w-20 px-3 py-2.5 text-right">Qty</th>
                  <th className="w-20 px-3 py-2.5 text-left">Unit</th>
                  <th className="w-32 px-3 py-2.5 text-right">Unit Price</th>
                  <th className="w-20 px-3 py-2.5 text-right">Tax (%)</th>
                  <th className="w-32 px-3 py-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {pricingItems.map((item, idx) => {
                  const isApproved = item.approved !== false
                  const lineTotal = item.quantity * item.unitPrice * (1 + (item.tax || 0) / 100)

                  return (
                    <tr
                      key={item.id || idx}
                      className={`hover:bg-slate-50 transition-colors ${
                        !isApproved ? 'opacity-40 bg-slate-50/50' : ''
                      }`}
                    >
                      <td className="px-3 py-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => onTogglePricingItemApproval?.(item.id || idx)}
                          className="p-1 rounded text-[#0055FF] cursor-pointer"
                        >
                          {isApproved ? (
                            <CheckCircle className="w-4 h-4 fill-blue-50 text-[#0055FF]" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-300" />
                          )}
                        </button>
                      </td>
                      <td className="px-3 py-2.5 font-medium text-slate-800">
                        {item.description}
                      </td>
                      <td className="px-3 py-2.5 text-right text-slate-600">
                        {item.quantity}
                      </td>
                      <td className="px-3 py-2.5 text-slate-500 uppercase text-[11px]">
                        {item.unit || 'Milestone'}
                      </td>
                      <td className="px-3 py-2.5 text-right font-medium text-slate-800">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="px-3 py-2.5 text-right text-slate-500">
                        {item.tax || 18}%
                      </td>
                      <td className="px-3 py-2.5 text-right font-bold text-slate-900">
                        {formatCurrency(lineTotal)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pricing Totals Box */}
          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-end gap-1.5 text-xs">
            <div className="flex justify-between w-64 text-slate-500">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-800">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between w-64 text-slate-500">
              <span>GST / Taxes:</span>
              <span className="font-semibold text-slate-800">{formatCurrency(taxTotal)}</span>
            </div>
            <div className="flex justify-between w-64 pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
              <span>Grand Total:</span>
              <span className="text-[#0055FF]">{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Action Bar */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate-500">
          <span className="font-semibold text-slate-700">
            {approvedPricing.length} of {pricingItems.length}
          </span>{' '}
          pricing items approved.
        </div>

        <div className="flex items-center gap-2">
          {onOpenInA4Preview && (
            <button
              type="button"
              onClick={onOpenInA4Preview}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 text-xs font-semibold cursor-pointer shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>A4 Document Preview</span>
            </button>
          )}

          {onOpenInEditor && (
            <button
              type="button"
              onClick={onOpenInEditor}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0055FF] text-xs font-semibold cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in TipTap Editor</span>
            </button>
          )}

          <button
            type="button"
            onClick={onImportToProposalOS}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0055FF] hover:bg-[#0044CC] text-white text-xs font-bold shadow-sm shadow-blue-500/20 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Save & Import Proposal</span>
          </button>
        </div>
      </div>
    </div>
  )
}

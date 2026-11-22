import { useState } from 'react'
import {
  FileText,
  IndianRupee,
  DollarSign,
  CheckCircle,
  Circle,
  Sparkles,
  ExternalLink,
  Eye,
  AlertTriangle,
  Plus,
  Trash2,
  X,
  Clock,
  Layers,
  Cpu,
} from 'lucide-react'
import ProposalSectionCard from './ProposalSectionCard'

export default function ProposalPreview({
  proposalData,
  onToggleSectionApproval,
  onUpdateSectionContent,
  onRegenerateSection,
  regeneratingSectionKey,
  onTogglePricingItemApproval,
  onApproveAllPricing,
  onUpdatePricingItem,
  onUpdateCurrency,
  onUpdateDeliverables,
  onUpdateTechnologies,
  onUpdateTimeline,
  onImportToProposalOS,
  onOpenInEditor,
  onOpenInA4Preview,
  isSaving = false,
}) {
  const [activeTab, setActiveTab] = useState('sections') // 'sections' | 'pricing' | 'a4'
  const [newDeliverableText, setNewDeliverableText] = useState('')
  const [newTechText, setNewTechText] = useState('')

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
    currency = 'USD',
    sections = {},
    sectionsRaw = {},
    pricingItems = [],
    paymentTerms = [],
  } = proposalData

  // Calculate approved pricing totals
  const approvedPricing = pricingItems.filter((i) => i.approved !== false)
  const subtotal = approvedPricing.reduce((sum, item) => sum + (Number(item.quantity || 1) * Number(item.unitPrice || item.unit_price || 0)), 0)
  const taxTotal = approvedPricing.reduce((sum, item) => {
    const qty = Number(item.quantity || 1)
    const price = Number(item.unitPrice || item.unit_price || 0)
    const taxRate = Number(item.tax !== undefined ? item.tax : (item.tax_rate || 0))
    return sum + (qty * price * taxRate / 100)
  }, 0)
  const grandTotal = subtotal + taxTotal

  const formatCurrency = (amount) => {
    const curr = currency || 'USD'
    try {
      return new Intl.NumberFormat(curr === 'INR' ? 'en-IN' : 'en-US', {
        style: 'currency',
        currency: curr,
        maximumFractionDigits: 0,
      }).format(amount)
    } catch {
      return `${curr} ${Number(amount).toLocaleString()}`
    }
  }

  // Deliverables add/remove
  const deliverablesList = sectionsRaw.deliverables || (sections.deliverables ? sections.deliverables.split('\n').filter(Boolean) : [])
  const handleAddDeliverable = () => {
    if (!newDeliverableText.trim()) return
    const updated = [...deliverablesList, newDeliverableText.trim()]
    onUpdateDeliverables?.(updated)
    setNewDeliverableText('')
  }
  const handleRemoveDeliverable = (idx) => {
    const updated = deliverablesList.filter((_, i) => i !== idx)
    onUpdateDeliverables?.(updated)
  }

  // Technologies add/remove
  const techList = sectionsRaw.technologyStack || (sections.technologyStack ? sections.technologyStack.split(',').map((t) => t.trim()).filter(Boolean) : [])
  const handleAddTech = () => {
    if (!newTechText.trim()) return
    const updated = [...techList, newTechText.trim()]
    onUpdateTechnologies?.(updated)
    setNewTechText('')
  }
  const handleRemoveTech = (tech) => {
    const updated = techList.filter((t) => t !== tech)
    onUpdateTechnologies?.(updated)
  }

  // Assumptions
  const assumptionsList = sectionsRaw.assumptions || (sections.assumptions ? sections.assumptions.split('\n').filter(Boolean) : [])

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
                Client: {clientName || proposalData.client?.name || 'Valued Client'}
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
            <DollarSign className="w-3.5 h-3.5" />
            <span>Commercial Pricing ({pricingItems.length} Milestones)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('a4')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'a4'
                ? 'bg-[#0055FF] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>A4 Document Preview</span>
          </button>
        </div>
      </div>

      {/* Assumptions Notice Card */}
      {assumptionsList.length > 0 && (
        <div className="mx-6 mt-6 p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900">
          <div className="flex items-center gap-2 font-bold text-xs text-amber-800 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>AI Assumptions & Safeguards (Review before client distribution)</span>
          </div>
          <ul className="text-xs space-y-1 list-disc list-inside text-amber-800/90">
            {assumptionsList.map((a, idx) => (
              <li key={idx}>{a.replace(/^•\s*/, '')}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Tab 1: Narrative Sections */}
      {activeTab === 'sections' && (
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Toggle checkmarks to include/exclude sections before importing. Click the refresh button to regenerate individual sections.</span>
          </div>

          <ProposalSectionCard
            sectionKey="executiveSummary"
            title="1. Executive Summary"
            content={sections.executiveSummary}
            approved={sections.executiveSummaryApproved !== false}
            onToggleApproval={onToggleSectionApproval}
            onUpdateContent={onUpdateSectionContent}
            onRegenerateSection={onRegenerateSection}
            isRegenerating={regeneratingSectionKey === 'executiveSummary'}
          />

          <ProposalSectionCard
            sectionKey="projectOverview"
            title="2. Project Overview & Target Architecture"
            content={sections.projectOverview}
            approved={sections.projectOverviewApproved !== false}
            onToggleApproval={onToggleSectionApproval}
            onUpdateContent={onUpdateSectionContent}
            onRegenerateSection={onRegenerateSection}
            isRegenerating={regeneratingSectionKey === 'projectOverview'}
          />

          <ProposalSectionCard
            sectionKey="objectives"
            title="3. Project Objectives"
            content={sections.objectives}
            approved={sections.objectivesApproved !== false}
            onToggleApproval={onToggleSectionApproval}
            onUpdateContent={onUpdateSectionContent}
            onRegenerateSection={onRegenerateSection}
            isRegenerating={regeneratingSectionKey === 'objectives'}
          />

          <ProposalSectionCard
            sectionKey="scopeOfWork"
            title="4. Scope of Work"
            content={sections.scopeOfWork}
            approved={sections.scopeOfWorkApproved !== false}
            onToggleApproval={onToggleSectionApproval}
            onUpdateContent={onUpdateSectionContent}
            onRegenerateSection={onRegenerateSection}
            isRegenerating={regeneratingSectionKey === 'scopeOfWork'}
          />

          {/* Deliverables Section with Add/Remove */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#0055FF]" />
                <h4 className="text-sm font-bold text-slate-900">5. Deliverables Checklist</h4>
              </div>
              <span className="text-xs text-slate-400">{deliverablesList.length} items</span>
            </div>
            <div className="space-y-1.5">
              {deliverablesList.map((deliv, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-xs text-slate-700">
                  <span>{deliv.replace(/^•\s*/, '')}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDeliverable(idx)}
                    className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer"
                    title="Remove deliverable"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Add a new deliverable..."
                value={newDeliverableText}
                onChange={(e) => setNewDeliverableText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDeliverable())}
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:border-[#0055FF] outline-none"
              />
              <button
                type="button"
                onClick={handleAddDeliverable}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Technology Stack with Add/Remove Badges */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#0055FF]" />
                <h4 className="text-sm font-bold text-slate-900">6. Recommended Technology Stack</h4>
              </div>
              <span className="text-xs text-slate-400">{techList.length} technologies</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {techList.map((tech, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-[#0055FF] border border-blue-100"
                >
                  <span>{tech}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(tech)}
                    className="hover:text-rose-600 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Add technology (e.g. Next.js, Redis, Tailwind)..."
                value={newTechText}
                onChange={(e) => setNewTechText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:border-[#0055FF] outline-none"
              />
              <button
                type="button"
                onClick={handleAddTech}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Tech</span>
              </button>
            </div>
          </div>

          <ProposalSectionCard
            sectionKey="timeline"
            title="7. Project Timeline & Sprints"
            content={sections.timeline}
            approved={sections.timelineApproved !== false}
            onToggleApproval={onToggleSectionApproval}
            onUpdateContent={onUpdateSectionContent}
            onRegenerateSection={onRegenerateSection}
            isRegenerating={regeneratingSectionKey === 'timeline'}
          />

          <ProposalSectionCard
            sectionKey="maintenanceSupport"
            title="8. Maintenance & SLA Support"
            content={sections.maintenanceSupport}
            approved={sections.maintenanceSupportApproved !== false}
            onToggleApproval={onToggleSectionApproval}
            onUpdateContent={onUpdateSectionContent}
            onRegenerateSection={onRegenerateSection}
            isRegenerating={regeneratingSectionKey === 'maintenanceSupport'}
          />

          <ProposalSectionCard
            sectionKey="termsConditions"
            title="9. Commercial Terms & Conditions"
            content={sections.termsConditions}
            approved={sections.termsConditionsApproved !== false}
            onToggleApproval={onToggleSectionApproval}
            onUpdateContent={onUpdateSectionContent}
            onRegenerateSection={onRegenerateSection}
            isRegenerating={regeneratingSectionKey === 'termsConditions'}
          />

          <ProposalSectionCard
            sectionKey="conclusion"
            title="10. Conclusion & Next Steps"
            content={sections.conclusion}
            approved={sections.conclusionApproved !== false}
            onToggleApproval={onToggleSectionApproval}
            onUpdateContent={onUpdateSectionContent}
            onRegenerateSection={onRegenerateSection}
            isRegenerating={regeneratingSectionKey === 'conclusion'}
          />
        </div>
      )}

      {/* Tab 2: Structured Pricing Items Approval & Editing */}
      {activeTab === 'pricing' && (
        <div className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Itemized Commercial Milestones
              </h3>
              <p className="text-xs text-slate-500">
                AI pricing suggestions are estimates only. You can edit every amount, quantity, and tax rate. Totals are recalculated via Laravel.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Currency Selector */}
              <select
                value={currency}
                onChange={(e) => onUpdateCurrency?.(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700 outline-none cursor-pointer"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
                <option value="CAD">CAD ($)</option>
                <option value="AUD">AUD ($)</option>
              </select>

              <button
                type="button"
                onClick={onApproveAllPricing}
                className="text-xs font-semibold text-[#0055FF] hover:underline cursor-pointer"
              >
                Approve All Milestones
              </button>
            </div>
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
                  <th className="w-32 px-3 py-2.5 text-right">Unit Price ({currency})</th>
                  <th className="w-20 px-3 py-2.5 text-right">Tax (%)</th>
                  <th className="w-32 px-3 py-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {pricingItems.map((item, idx) => {
                  const isApproved = item.approved !== false
                  const qty = Number(item.quantity || 1)
                  const unitPrice = Number(item.unitPrice || item.unit_price || 0)
                  const taxRate = Number(item.tax !== undefined ? item.tax : (item.tax_rate || 0))
                  const lineTotal = qty * unitPrice * (1 + taxRate / 100)

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
                        <input
                          type="text"
                          value={item.description || ''}
                          onChange={(e) => onUpdatePricingItem?.(idx, { description: e.target.value })}
                          className="w-full px-2 py-1 rounded border border-transparent hover:border-slate-300 focus:border-[#0055FF] outline-none"
                        />
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <input
                          type="number"
                          min="1"
                          value={qty}
                          onChange={(e) => onUpdatePricingItem?.(idx, { quantity: Number(e.target.value) || 1 })}
                          className="w-16 px-2 py-1 rounded text-right border border-transparent hover:border-slate-300 focus:border-[#0055FF] outline-none"
                        />
                      </td>
                      <td className="px-3 py-2.5 text-slate-500 uppercase text-[11px]">
                        {item.unit || 'Milestone'}
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <input
                          type="number"
                          min="0"
                          step="100"
                          value={unitPrice}
                          onChange={(e) => onUpdatePricingItem?.(idx, { unitPrice: Number(e.target.value) || 0, unit_price: Number(e.target.value) || 0 })}
                          className="w-24 px-2 py-1 rounded text-right font-medium border border-transparent hover:border-slate-300 focus:border-[#0055FF] outline-none"
                        />
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={taxRate}
                          onChange={(e) => onUpdatePricingItem?.(idx, { tax: Number(e.target.value) || 0, tax_rate: Number(e.target.value) || 0 })}
                          className="w-16 px-2 py-1 rounded text-right text-slate-500 border border-transparent hover:border-slate-300 focus:border-[#0055FF] outline-none"
                        />
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

          {/* Payment Terms Review */}
          {paymentTerms.length > 0 && (
            <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Payment Milestones Structure ({paymentTerms.length} Milestones)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {paymentTerms.map((term, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-white border border-slate-200 text-xs">
                    <div className="font-bold text-slate-800">{term.title}</div>
                    <div className="text-[#0055FF] font-extrabold mt-0.5">{term.percentage}% of Grand Total</div>
                    <div className="text-[11px] text-slate-400 mt-1">{term.due_description || term.dueDescription}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing Totals Box */}
          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-end gap-1.5 text-xs">
            <div className="flex justify-between w-64 text-slate-500">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-800">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between w-64 text-slate-500">
              <span>Estimated Taxes:</span>
              <span className="font-semibold text-slate-800">{formatCurrency(taxTotal)}</span>
            </div>
            <div className="flex justify-between w-64 pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
              <span>Grand Total:</span>
              <span className="text-[#0055FF]">{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: A4 Physical Document Preview */}
      {activeTab === 'a4' && (
        <div className="p-6 bg-slate-100/70 flex justify-center">
          <div className="w-full max-w-[700px] min-h-[900px] bg-white border border-slate-300 shadow-md p-10 font-serif text-slate-900 space-y-6">
            <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-end">
              <div>
                <span className="text-xs font-sans font-bold tracking-widest text-[#0055FF] uppercase">Commercial Proposal</span>
                <h1 className="text-2xl font-bold font-sans mt-1 text-slate-900">{title}</h1>
              </div>
              <div className="text-right text-xs font-sans text-slate-500">
                <div>Date: {proposalData.date || new Date().toISOString().split('T')[0]}</div>
                <div>Currency: {currency}</div>
              </div>
            </div>

            <div className="text-sm font-sans space-y-4">
              <div>
                <h3 className="font-bold text-slate-800 uppercase text-xs tracking-wider mb-1">1. Executive Summary</h3>
                <p className="text-slate-700 leading-relaxed text-xs">{sections.executiveSummary}</p>
              </div>

              {sections.projectOverview && (
                <div>
                  <h3 className="font-bold text-slate-800 uppercase text-xs tracking-wider mb-1">2. Project Overview</h3>
                  <p className="text-slate-700 leading-relaxed text-xs">{sections.projectOverview}</p>
                </div>
              )}

              {deliverablesList.length > 0 && (
                <div>
                  <h3 className="font-bold text-slate-800 uppercase text-xs tracking-wider mb-1">3. Key Deliverables</h3>
                  <ul className="list-disc list-inside text-xs text-slate-700 space-y-0.5">
                    {deliverablesList.map((d, i) => (
                      <li key={i}>{d.replace(/^•\s*/, '')}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="font-bold text-slate-800 uppercase text-xs tracking-wider mb-1">4. Commercial Investment</h3>
                <table className="w-full border-collapse border border-slate-300 text-xs text-slate-800 mt-2">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="border border-slate-300 p-2 text-left">Milestone</th>
                      <th className="border border-slate-300 p-2 text-right">Investment ({currency})</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvedPricing.map((item, idx) => (
                      <tr key={idx}>
                        <td className="border border-slate-300 p-2">{item.description}</td>
                        <td className="border border-slate-300 p-2 text-right font-medium">{formatCurrency(item.quantity * item.unitPrice)}</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50 font-bold">
                      <td className="border border-slate-300 p-2 text-right">Grand Total:</td>
                      <td className="border border-slate-300 p-2 text-right text-[#0055FF]">{formatCurrency(grandTotal)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
          pricing milestones approved. Never auto-saved without confirmation.
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
            disabled={isSaving}
            onClick={onImportToProposalOS}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0055FF] hover:bg-[#0044CC] text-white text-xs font-bold shadow-sm shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving to ProposalOS...' : 'Save & Import Proposal'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

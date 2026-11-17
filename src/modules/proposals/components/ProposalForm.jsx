import { useState } from 'react'
import {
  FileText,
  Users,
  Building,
  BookOpen,
  Calculator,
  Eye,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import ProposalInformation from './ProposalInformation'
import ClientDetailsForm from './ClientDetailsForm'
import CompanyDetailsForm from './CompanyDetailsForm'
import ProposalEditorPanel from './ProposalEditorPanel'
import ProposalPricing from './ProposalPricing'
import ProposalSummary from './ProposalSummary'
import ProposalActions from './ProposalActions'
import { DocumentCanvas } from '../../../components/document'
import { convertProposalToDocumentCanvasProps } from '../utils/proposalHelpers'

const STEPS = [
  { step: 1, title: 'Proposal Info', icon: FileText, desc: 'Number & Dates' },
  { step: 2, title: 'Client Details', icon: Users, desc: 'Recipient Info' },
  { step: 3, title: 'Company Details', icon: Building, desc: 'Branding & Entity' },
  { step: 4, title: 'Document Narrative', icon: BookOpen, desc: 'TipTap Editor' },
  { step: 5, title: 'Pricing & Taxes', icon: Calculator, desc: 'Dynamic Schedule' },
  { step: 6, title: 'A4 Document Preview', icon: Eye, desc: 'Print & PDF' },
]

export const ProposalForm = ({
  proposal,
  totals,
  activeStep = 1,
  onStepChange = () => {},
  onUpdateMetadata = () => {},
  onUpdateClient = () => {},
  onUpdateCompany = () => {},
  onResetCompany = () => {},
  onUpdateDocumentContent = () => {},
  onAddPricingItem = () => {},
  onUpdatePricingItem = () => {},
  onRemovePricingItem = () => {},
  onCurrencyChange = () => {},
  onGlobalDiscountChange = () => {},
  onSave = () => {},
  onDownloadPdf = () => {},
  onDuplicate,
  onDelete,
  isSaving = false,
  isGeneratingPdf = false,
  isEditMode = false,
  className = '',
}) => {
  const [saveFeedback, setSaveFeedback] = useState(null)

  const handleSaveWithFeedback = async (status) => {
    try {
      await onSave(status)
      setSaveFeedback({ type: 'success', text: `Proposal saved successfully as ${status}!` })
      setTimeout(() => setSaveFeedback(null), 3000)
    } catch (err) {
      setSaveFeedback({ type: 'error', text: err.message || 'Failed to save proposal' })
    }
  }

  const canvasProps = convertProposalToDocumentCanvasProps(proposal)

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Toast / Notification Alert */}
      {saveFeedback && (
        <div
          className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-xs font-semibold shadow-2xs transition-all ${
            saveFeedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {saveFeedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{saveFeedback.text}</span>
        </div>
      )}

      {/* Modern Multi-Step Wizard Progress Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[680px]">
          {STEPS.map((s, idx) => {
            const Icon = s.icon
            const isCurrent = activeStep === s.step
            const isPast = activeStep > s.step

            return (
              <div key={s.step} className="flex items-center flex-1 last:flex-none">
                <button
                  type="button"
                  onClick={() => onStepChange(s.step)}
                  className="flex items-center gap-3 text-left group cursor-pointer"
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs transition-all border ${
                      isCurrent
                        ? 'bg-[#FB6C00] text-white border-[#FB6C00] shadow-sm shadow-[#FB6C00]/20'
                        : isPast
                        ? 'bg-orange-50 text-[#FB6C00] border-orange-200'
                        : 'bg-gray-50 text-gray-400 border-gray-200 group-hover:bg-gray-100'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-4 h-4 text-[#FB6C00]" /> : <Icon className="w-4 h-4" />}
                  </div>

                  <div>
                    <span
                      className={`text-xs block font-bold transition-colors ${
                        isCurrent
                          ? 'text-gray-900'
                          : isPast
                          ? 'text-gray-700'
                          : 'text-gray-400 group-hover:text-gray-600'
                      }`}
                    >
                      {s.title}
                    </span>
                    <span className="text-[10px] text-gray-400 block -mt-0.5">
                      {s.desc}
                    </span>
                  </div>
                </button>

                {/* Divider Line */}
                {idx < STEPS.length - 1 && (
                  <div className="flex-1 h-0.5 mx-4 bg-gray-100 rounded">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isPast ? 'bg-[#FB6C00]' : 'bg-transparent'
                      }`}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Active Proposal Summary Card (Steps 1-3) */}
      {activeStep <= 3 && (
        <ProposalSummary proposal={proposal} totals={totals} />
      )}

      {/* Step Content Area */}
      <div>
        {activeStep === 1 && (
          <ProposalInformation
            proposal={proposal}
            onChange={onUpdateMetadata}
          />
        )}

        {activeStep === 2 && (
          <ClientDetailsForm
            client={proposal?.client}
            onChange={onUpdateClient}
          />
        )}

        {activeStep === 3 && (
          <CompanyDetailsForm
            company={proposal?.company}
            onChange={onUpdateCompany}
            onResetDefault={onResetCompany}
          />
        )}

        {activeStep === 4 && (
          <ProposalEditorPanel
            content={proposal?.content}
            onChange={onUpdateDocumentContent}
            proposalTitle={proposal?.title}
          />
        )}

        {activeStep === 5 && (
          <ProposalPricing
            pricing={proposal?.pricing}
            onAddItem={onAddPricingItem}
            onUpdateItem={onUpdatePricingItem}
            onRemoveItem={onRemovePricingItem}
            onCurrencyChange={onCurrencyChange}
            onGlobalDiscountChange={onGlobalDiscountChange}
          />
        )}

        {activeStep === 6 && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-gray-900">
                  A4 Physical Page Rendering & Pagination Preview
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Accurate document canvas rendered in 210mm × 297mm A4 portrait format with fixed headers, footers, and automatic page breaks.
                </p>
              </div>
            </div>

            <DocumentCanvas
              content={canvasProps.content}
              company={canvasProps.company}
              proposal={canvasProps.proposal}
              showToolbar={true}
              onPrint={() => window.print()}
            />
          </div>
        )}
      </div>

      {/* Persistent Bottom Actions Bar */}
      <ProposalActions
        currentStep={activeStep}
        totalSteps={STEPS.length}
        onPrev={() => onStepChange(Math.max(1, activeStep - 1))}
        onNext={() => onStepChange(Math.min(STEPS.length, activeStep + 1))}
        onSaveDraft={() => handleSaveWithFeedback('draft')}
        onPublish={() => handleSaveWithFeedback('sent')}
        onPreview={() => onStepChange(6)}
        onDownloadPdf={() => onDownloadPdf(proposal?.id)}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
        isSaving={isSaving}
        isGeneratingPdf={isGeneratingPdf}
        isEditMode={isEditMode}
      />
    </div>
  )
}

export default ProposalForm

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import {
  FileText,
  Users,
  BookOpen,
  Eye,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react'
import ProposalInformation from './ProposalInformation'
import ClientDetailsForm from './ClientDetailsForm'
import ProposalEditorPanel from './ProposalEditorPanel'
import ProposalActions from './ProposalActions'
import { DocumentCanvas } from '../../../components/document'
import {
  convertProposalToDocumentCanvasProps,
  validateProposal,
} from '../utils/proposalHelpers'

const STEPS = [
  { step: 1, title: 'Proposal Info', icon: FileText, desc: 'Number & Dates' },
  { step: 2, title: 'Client Details', icon: Users, desc: 'Recipient Info' },
  { step: 3, title: 'Document Narrative', icon: BookOpen, desc: 'TipTap Editor' },
]

export const ProposalForm = ({
  proposal,
  activeStep = 1,
  onStepChange = () => {},
  onUpdateMetadata = () => {},
  onUpdateClient = () => {},
  onUpdateDocumentContent = () => {},
  onAddPricingItem = () => {},
  onUpdatePricingItem = () => {},
  onRemovePricingItem = () => {},
  onDuplicatePricingItem = () => {},
  onReorderPricingItems = () => {},
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
  const [validationErrors, setValidationErrors] = useState({})

  // Clear specific errors when metadata is updated
  const handleMetadataChange = (fields) => {
    onUpdateMetadata(fields)
    if (Object.keys(validationErrors).length > 0) {
      const updated = { ...validationErrors }
      if (fields.title) delete updated.title
      if (fields.serviceType || fields.service_type_ids) delete updated.serviceType
      if (fields.date || fields.proposal_date) delete updated.proposalDate
      if (fields.validUntil || fields.valid_until) delete updated.validUntil
      setValidationErrors(updated)
    }
  }

  // Clear client errors when client is updated
  const handleClientChange = (fields) => {
    onUpdateClient(fields)
    if (Object.keys(validationErrors).length > 0) {
      const updated = { ...validationErrors }
      delete updated.client
      delete updated.clientEmail
      setValidationErrors(updated)
    }
  }

  // Step progression validation
  const handleNext = () => {
    const check = validateProposal(proposal, { step: activeStep })
    if (!check.isValid) {
      setValidationErrors(check.errors)
      const firstMsg = Object.values(check.errors)[0]
      toast.error(firstMsg || 'Please complete required fields before proceeding')
      return
    }
    setValidationErrors({})
    onStepChange(Math.min(STEPS.length, activeStep + 1))
  }

  // Click on step bar directly
  const handleStepClick = (targetStep) => {
    if (targetStep > activeStep) {
      const check = validateProposal(proposal, { step: activeStep })
      if (!check.isValid) {
        setValidationErrors(check.errors)
        const firstMsg = Object.values(check.errors)[0]
        toast.error(firstMsg || 'Please complete required fields before proceeding')
        return
      }
    }
    setValidationErrors({})
    onStepChange(targetStep)
  }

  // Comprehensive save & publish validation
  const handleSaveWithFeedback = async (status) => {
    const isPublish = status === 'sent' || status === 'accepted'
    const check = validateProposal(proposal, { isPublish })
    if (!check.isValid) {
      setValidationErrors(check.errors)
      if (check.stepWithFirstError) {
        onStepChange(check.stepWithFirstError)
      }
      const firstMsg = Object.values(check.errors)[0]
      toast.error(firstMsg || 'Please correct the highlighted errors before saving')
      return
    }

    setValidationErrors({})
    try {
      await onSave(status)
      setSaveFeedback({ type: 'success', text: `Proposal saved successfully as ${status}!` })
      setTimeout(() => setSaveFeedback(null), 3000)
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        (err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(', ') : null) ||
        err.message ||
        'Failed to save proposal'
      setSaveFeedback({ type: 'error', text: errorMsg })
    }
  }

  const canvasProps = convertProposalToDocumentCanvasProps(proposal)

  return (
    <div className={`space-y-6 print:space-y-0 ${className}`}>
      {/* Toast / Notification Alert */}
      {saveFeedback && (
        <div
          className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-xs font-semibold shadow-2xs transition-all no-print print:hidden ${
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

      {/* Validation Errors Summary Alert */}
      {Object.keys(validationErrors).length > 0 && (
        <div className="p-3.5 rounded-xl border border-red-200 bg-red-50/90 text-red-800 text-xs flex items-center justify-between gap-3 shadow-2xs no-print print:hidden">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>
              <strong>Validation required:</strong> {Object.values(validationErrors)[0]}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setValidationErrors({})}
            className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-100/50 cursor-pointer transition-colors"
            title="Dismiss error notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Modern Multi-Step Wizard Progress Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs overflow-x-auto no-print print:hidden">
        <div className="flex items-center justify-between min-w-[680px]">
          {STEPS.map((s, idx) => {
            const Icon = s.icon
            const isCurrent = activeStep === s.step
            const isPast = activeStep > s.step

            return (
              <div key={s.step} className="flex items-center flex-1 last:flex-none">
                <button
                  type="button"
                  onClick={() => handleStepClick(s.step)}
                  className="flex items-center gap-3 text-left group cursor-pointer"
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs transition-all border ${
                      isCurrent
                        ? 'bg-[#0055FF] text-white border-[#0055FF] shadow-sm shadow-[#0055FF]/20'
                        : isPast
                        ? 'bg-blue-50 text-[#0055FF] border-blue-200'
                        : 'bg-gray-50 text-gray-400 border-gray-200 group-hover:bg-gray-100'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-4 h-4 text-[#0055FF]" /> : <Icon className="w-4 h-4" />}
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
                        isPast ? 'bg-[#0055FF]' : 'bg-transparent'
                      }`}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* On-Screen Step Content Area (Hidden during physical print / PDF export) */}
      <div className="no-print print:hidden">
        {activeStep === 1 && (
          <ProposalInformation
            proposal={proposal}
            onChange={handleMetadataChange}
            errors={validationErrors}
          />
        )}

        {activeStep === 2 && (
          <ClientDetailsForm
            client={proposal?.client}
            onChange={handleClientChange}
            errors={validationErrors}
          />
        )}

        {activeStep === 3 && (
          <ProposalEditorPanel
            content={proposal?.content}
            onChange={onUpdateDocumentContent}
            proposalTitle={proposal?.title}
          />
        )}
      </div>

      {/* Print-Only Proposal Document Pages (Exclusively rendered during print & PDF export; contains ONLY the pristine A4 document) */}
      <div className="hidden print:block print:w-full print:m-0 print:p-0">
        <DocumentCanvas
          content={canvasProps.content}
          company={canvasProps.company}
          proposal={canvasProps.proposal}
          initialSettings={canvasProps.settings}
          showToolbar={false}
        />
      </div>

      {/* Persistent Bottom Actions Bar */}
      <div className="no-print print:hidden">
        <ProposalActions
          currentStep={activeStep}
          totalSteps={STEPS.length}
          onPrev={() => onStepChange(Math.max(1, activeStep - 1))}
          onNext={handleNext}
          onSaveDraft={() => handleSaveWithFeedback('draft')}
          onPublish={() => handleSaveWithFeedback('sent')}
          onDownloadPdf={() => onDownloadPdf(proposal?.id)}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          isSaving={isSaving}
          isGeneratingPdf={isGeneratingPdf}
          isEditMode={isEditMode}
        />
      </div>
    </div>
  )
}

export default ProposalForm

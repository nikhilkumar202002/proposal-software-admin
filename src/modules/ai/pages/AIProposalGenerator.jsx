import { useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  ArrowLeft,
  Sparkles,
  RotateCcw,
} from 'lucide-react'
import ProposalGenerationForm from '../components/proposal/ProposalGenerationForm'
import ProposalGenerationStatus from '../components/proposal/ProposalGenerationStatus'
import ProposalPreview from '../components/proposal/ProposalPreview'
import ProposalImportModal from '../components/proposal/ProposalImportModal'
import AIModelSelector from '../components/common/AIModelSelector'
import { useAIProposal } from '../hooks/useAIProposal'
import { useAIStore } from '../store/aiStore'

export default function AIProposalGenerator() {
  const navigate = useNavigate()
  const location = useLocation()
  const { selectedModel, setModel } = useAIStore()

  // Pre-fill from Chat state if user came from chat "Generate Proposal"
  const chatState = location.state || {}
  const initialFormValues = useMemo(() => ({
    title: chatState.title || 'Enterprise Commercial Proposal',
    requirements: chatState.initialPrompt || '',
    clientId: chatState.client?.id || '',
    clientName: chatState.client?.name || chatState.client?.companyName || '',
    serviceType: chatState.serviceType || 'Full-Stack Custom SaaS Platform',
  }), [chatState])

  const {
    isGenerating,
    currentStep,
    proposalData,
    regeneratingSectionKey,
    isSavingToBackend,
    error,
    generateProposal,
    toggleSectionApproval,
    updateSectionContent,
    regenerateSection,
    togglePricingItemApproval,
    approveAllPricing,
    updatePricingItem,
    updateCurrency,
    updateDeliverables,
    updateTechnologies,
    updateTimeline,
    importIntoProposalOS,
    resetProposal,
  } = useAIProposal()

  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  const handleFormSubmit = async (formData) => {
    await generateProposal(formData)
  }

  const handleConfirmImport = async (destination) => {
    if (!proposalData) return
    setIsImporting(true)
    try {
      await importIntoProposalOS(destination)
      setIsImportModalOpen(false)
    } catch (err) {
      console.error('Import failure:', err)
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Bar */}
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
              <Sparkles className="w-4 h-4 text-[#0055FF]" />
              ProposalOS AI Generator
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <AIModelSelector
            selectedModel={selectedModel}
            onSelectModel={setModel}
          />
          {proposalData && (
            <button
              type="button"
              onClick={resetProposal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {/* Progress bar when generating or previewing */}
        {(isGenerating || proposalData) && (
          <ProposalGenerationStatus
            currentStep={currentStep}
            isGenerating={isGenerating}
            error={error}
          />
        )}

        {/* Wizard Form or Preview */}
        {!proposalData ? (
          <ProposalGenerationForm
            onSubmit={handleFormSubmit}
            isGenerating={isGenerating}
            initialValues={initialFormValues}
          />
        ) : (
          <ProposalPreview
            proposalData={proposalData}
            onToggleSectionApproval={toggleSectionApproval}
            onUpdateSectionContent={updateSectionContent}
            onRegenerateSection={regenerateSection}
            regeneratingSectionKey={regeneratingSectionKey}
            onTogglePricingItemApproval={togglePricingItemApproval}
            onApproveAllPricing={approveAllPricing}
            onUpdatePricingItem={updatePricingItem}
            onUpdateCurrency={updateCurrency}
            onUpdateDeliverables={updateDeliverables}
            onUpdateTechnologies={updateTechnologies}
            onUpdateTimeline={updateTimeline}
            onImportToProposalOS={() => setIsImportModalOpen(true)}
            onOpenInEditor={() => handleConfirmImport('editor')}
            onOpenInA4Preview={() => handleConfirmImport('preview')}
            isSaving={isSavingToBackend || isImporting}
          />
        )}
      </main>

      {/* Import Modal */}
      <ProposalImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        proposalData={proposalData}
        onConfirmImport={handleConfirmImport}
        isImporting={isImporting || isSavingToBackend}
      />
    </div>
  )
}

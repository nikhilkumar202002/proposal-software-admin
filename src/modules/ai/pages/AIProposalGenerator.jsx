import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Sparkles,
  RotateCcw,
  ExternalLink,
  Eye,
  CheckCircle2,
} from 'lucide-react'
import ProposalGenerationForm from '../components/proposal/ProposalGenerationForm'
import ProposalGenerationStatus from '../components/proposal/ProposalGenerationStatus'
import ProposalPreview from '../components/proposal/ProposalPreview'
import ProposalImportModal from '../components/proposal/ProposalImportModal'
import AIModelSelector from '../components/common/AIModelSelector'
import { useAIProposal } from '../hooks/useAIProposal'
import { useAIStore } from '../store/aiStore'
import { useProposalStore } from '../../proposals/store/proposalStore'

export default function AIProposalGenerator() {
  const navigate = useNavigate()
  const { selectedModel, setModel } = useAIStore()
  const { addProposal } = useProposalStore()

  const {
    isGenerating,
    currentStep,
    proposalData,
    error,
    generateProposal,
    toggleSectionApproval,
    updateSectionContent,
    togglePricingItemApproval,
    approveAllPricing,
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
      // Filter out unapproved pricing and assemble standard ProposalModel
      const approvedPricing = (proposalData.pricingItems || []).filter(
        (i) => i.approved !== false
      )
      const subtotal = approvedPricing.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
      )
      const taxTotal = approvedPricing.reduce(
        (sum, item) =>
          sum + (item.quantity * item.unitPrice * (item.tax || 0)) / 100,
        0
      )
      const grandTotal = subtotal + taxTotal

      const newProposalRecord = {
        id: `prop-${Date.now()}`,
        number: `PROP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`,
        title: proposalData.title || 'AI Generated Proposal',
        projectName: proposalData.serviceType || 'Digital Transformation',
        serviceType: proposalData.serviceType || 'Software Development',
        date: new Date().toISOString().split('T')[0],
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        status: 'draft',
        proposalType: proposalData.proposalType || 'direct',
        currency: proposalData.currency || 'INR',
        showCompanyLogo: true,
        client: {
          id: proposalData.clientId,
          name: proposalData.clientName || 'Valued Client',
        },
        pricing: {
          items: approvedPricing,
          subtotal,
          taxTotal,
          total: grandTotal,
          currency: proposalData.currency || 'INR',
        },
        content: proposalData.content, // TipTap ProseMirror AST tree
      }

      addProposal(newProposalRecord)
      setIsImportModalOpen(false)

      if (destination === 'preview') {
        navigate(`/proposals/${newProposalRecord.id}/preview`)
      } else {
        navigate(`/proposals/${newProposalRecord.id}/edit`)
      }
    } catch (err) {
      console.error('Import failure:', err)
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans">
      {/* Top Bar */}
      <header className="h-14 border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-4 sm:px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/ai')}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
            title="Back to AI Chat"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FB6C00]" />
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
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
          />
        ) : (
          <ProposalPreview
            proposalData={proposalData}
            onToggleSectionApproval={toggleSectionApproval}
            onUpdateSectionContent={updateSectionContent}
            onTogglePricingItemApproval={togglePricingItemApproval}
            onApproveAllPricing={approveAllPricing}
            onImportToProposalOS={() => setIsImportModalOpen(true)}
            onOpenInEditor={() => handleConfirmImport('editor')}
            onOpenInA4Preview={() => handleConfirmImport('preview')}
          />
        )}
      </main>

      {/* Import Modal */}
      <ProposalImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        proposalData={proposalData}
        onConfirmImport={handleConfirmImport}
        isImporting={isImporting}
      />
    </div>
  )
}

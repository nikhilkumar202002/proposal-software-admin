import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Copy, Trash2, Eye } from 'lucide-react'
import useProposalStore from '../store/proposalStore'
import ProposalForm from '../components/ProposalForm'
import { Button, ConfirmDialog, StatusBadge } from '../../../components/common'

export const EditProposal = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    currentProposal,
    totals,
    activeStep,
    loadProposal,
    setActiveStep,
    updateMetadata,
    updateClient,
    updateCompany,
    resetCompanyToDefault,
    updateDocumentContent,
    addPricingItem,
    updatePricingItem,
    removePricingItem,
    setPricingCurrency,
    setGlobalDiscount,
    saveCurrentProposal,
    deleteProposal,
    duplicateProposal,
    downloadPdf,
    isLoading,
    isSaving,
    isGeneratingPdf,
  } = useProposalStore()

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (id) {
      loadProposal(id)
    }
  }, [id, loadProposal])

  const handleDuplicate = async () => {
    if (!currentProposal) return
    const clone = await duplicateProposal(currentProposal.id)
    navigate(`/proposals/${clone.id}/edit`)
  }

  const handleDelete = async () => {
    if (!currentProposal) return
    await deleteProposal(currentProposal.id)
    navigate('/proposals')
  }

  if (isLoading || !currentProposal) {
    return (
      <div className="p-12 text-center text-gray-500 text-sm">
        Loading proposal data...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/proposals')}
            icon={ArrowLeft}
            className="text-xs"
          >
            Back
          </Button>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#FB6C00]">
                {currentProposal.number}
              </span>
              <span className="text-gray-300">•</span>
              <StatusBadge status={currentProposal.status || 'draft'} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight mt-0.5">
              {currentProposal.title || 'Untitled Proposal'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/proposals/${currentProposal.id}/preview`)}
            icon={Eye}
            className="text-xs"
          >
            A4 Preview
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDuplicate}
            icon={Copy}
            className="text-xs hidden sm:inline-flex"
          >
            Duplicate
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
            icon={Trash2}
            className="text-xs"
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Main Multi-Step Form */}
      <ProposalForm
        proposal={currentProposal}
        totals={totals}
        activeStep={activeStep}
        onStepChange={setActiveStep}
        onUpdateMetadata={updateMetadata}
        onUpdateClient={updateClient}
        onUpdateCompany={updateCompany}
        onResetCompany={resetCompanyToDefault}
        onUpdateDocumentContent={updateDocumentContent}
        onAddPricingItem={addPricingItem}
        onUpdatePricingItem={updatePricingItem}
        onRemovePricingItem={removePricingItem}
        onCurrencyChange={setPricingCurrency}
        onGlobalDiscountChange={setGlobalDiscount}
        onSave={saveCurrentProposal}
        onDownloadPdf={downloadPdf}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
        isSaving={isSaving}
        isGeneratingPdf={isGeneratingPdf}
        isEditMode={true}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Proposal"
        description={`Are you sure you want to permanently delete proposal "${currentProposal.title}" (${currentProposal.number})? This cannot be undone.`}
        variant="danger"
        confirmText="Delete Proposal"
      />
    </div>
  )
}

export default EditProposal

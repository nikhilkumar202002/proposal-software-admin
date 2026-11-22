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
    duplicatePricingItem,
    reorderPricingItems,
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
    <div className="space-y-6 print:space-y-0">
      {/* Top Header */}
      <div className="space-y-3 no-print print:hidden">
        {/* Back Button Top */}
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/proposals')}
            icon={ArrowLeft}
            className="text-xs shadow-2xs"
          >
            Back
          </Button>
        </div>

        {/* Title on Left, Proposal Number & Action Buttons on Right */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-950 tracking-tight">
            {currentProposal.title || 'Untitled Proposal'}
          </h1>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#0055FF]">
                {currentProposal.number}
              </span>
              <span className="text-gray-300">•</span>
              <StatusBadge status={currentProposal.status || 'draft'} />
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
        onDuplicatePricingItem={duplicatePricingItem}
        onReorderPricingItems={reorderPricingItems}
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

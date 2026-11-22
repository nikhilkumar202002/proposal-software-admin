import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import useProposalStore from '../store/proposalStore'
import ProposalForm from '../components/ProposalForm'
import { Button } from '../../../components/common'

export const CreateProposal = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    currentProposal,
    totals,
    activeStep,
    initNewProposal,
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
    downloadPdf,
    isSaving,
    isGeneratingPdf,
  } = useProposalStore()

  useEffect(() => {
    initNewProposal()
    if (location.state?.prefilledClient) {
      const c = location.state.prefilledClient
      updateClient({
        name: c.name,
        companyName: c.companyName,
        email: c.email,
        phone: c.phone,
        address: c.address,
        taxNumber: c.taxNumber,
      })
    }
  }, [initNewProposal, location.state, updateClient])

  const handleSave = async (status) => {
    const saved = await saveCurrentProposal(status)
    if (saved?.id) {
      navigate(`/proposals/${saved.id}/edit`)
    }
    return saved
  }

  if (!currentProposal) {
    return (
      <div className="p-8 text-center text-gray-500 text-sm">
        Initializing new proposal session...
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

        {/* Title on Left, Proposal Number & Tag on Right */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-950 tracking-tight">
            {currentProposal.title || 'Untitled Proposal'}
          </h1>

          <div className="flex items-center gap-2 shrink-0">
            <span className="font-mono text-xs font-bold text-[#0055FF]">
              {currentProposal.number}
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-xs text-gray-500 font-medium">New Proposal</span>
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
        onSave={handleSave}
        onDownloadPdf={downloadPdf}
        isSaving={isSaving}
        isGeneratingPdf={isGeneratingPdf}
        isEditMode={false}
      />
    </div>
  )
}

export default CreateProposal

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
              <span className="text-xs text-gray-500 font-medium">New Proposal</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight mt-0.5">
              {currentProposal.title || 'Untitled Proposal'}
            </h2>
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

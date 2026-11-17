import { useCallback } from 'react'
import useProposalStore from '../store/proposalStore'
import {
  formatCurrency,
  getProposalStatusConfig,
  convertProposalToDocumentCanvasProps,
} from '../utils/proposalHelpers'

export function useProposal() {
  const store = useProposalStore()

  const nextStep = useCallback(() => {
    store.setActiveStep(Math.min(6, store.activeStep + 1))
  }, [store])

  const prevStep = useCallback(() => {
    store.setActiveStep(Math.max(1, store.activeStep - 1))
  }, [store])

  const getCanvasProps = useCallback(() => {
    return convertProposalToDocumentCanvasProps(store.currentProposal)
  }, [store.currentProposal])

  return {
    // State
    proposal: store.currentProposal,
    totals: store.totals,
    activeStep: store.activeStep,
    isLoading: store.isLoading,
    isSaving: store.isSaving,
    isGeneratingPdf: store.isGeneratingPdf,
    error: store.error,

    // Step navigation
    nextStep,
    prevStep,
    setActiveStep: store.setActiveStep,

    // Form updaters
    updateMetadata: store.updateMetadata,
    updateClient: store.updateClient,
    updateCompany: store.updateCompany,
    resetCompanyToDefault: store.resetCompanyToDefault,
    updateDocumentContent: store.updateDocumentContent,

    // Pricing updaters
    addPricingItem: store.addPricingItem,
    updatePricingItem: store.updatePricingItem,
    removePricingItem: store.removePricingItem,
    setPricingCurrency: store.setPricingCurrency,
    setGlobalDiscount: store.setGlobalDiscount,

    // Save & actions
    saveCurrentProposal: store.saveCurrentProposal,
    downloadPdf: store.downloadPdf,
    initNewProposal: store.initNewProposal,
    loadProposal: store.loadProposal,

    // Helpers
    formatCurrency: (amount) =>
      formatCurrency(amount, store.currentProposal?.pricing?.currency || 'INR'),
    getStatusConfig: (status) => getProposalStatusConfig(status),
    getCanvasProps,
  }
}

export default useProposal

import { create } from 'zustand'
import { toast } from 'react-hot-toast'
import proposalService from '../../../services/proposal.service'
import {
  createNewProposalModel,
  getStoredCompanyDetails,
  calculateProposalTotals,
  validateProposal,
} from '../utils/proposalHelpers'

export const useProposalStore = create((set, get) => ({
  proposals: [],
  selectedProposalIds: [],
  filters: {
    search: '',
    status: 'all',
    sortBy: 'updatedAt',
    sortOrder: 'desc',
  },

  currentProposal: null,
  totals: {
    subtotal: 0,
    lineDiscounts: 0,
    globalDiscountAmount: 0,
    totalDiscount: 0,
    totalTax: 0,
    grandTotal: 0,
    itemCount: 0,
  },
  activeStep: 1, 

  isLoading: false,
  isSaving: false,
  isGeneratingPdf: false,
  error: null,

  fetchProposals: async (customParams = {}, options = {}) => {
    const isSilent = Boolean(options.silent)
    if (!isSilent) {
      set({ isLoading: true, error: null })
    }
    try {
      const params = { ...get().filters, ...customParams }
      const data = await proposalService.getProposals(params)
      const validProposals = (Array.isArray(data) ? data : []).filter(
        (p) => p && !p.deleted_at && !p.deletedAt
      )
      set({ proposals: validProposals, isLoading: false })
    } catch (err) {
      if (!isSilent) {
        set({
          error: err.message,
          proposals: (Array.isArray(get().proposals) ? get().proposals : []).filter(
            (p) => p && !p.deleted_at && !p.deletedAt
          ),
          isLoading: false,
        })
      }
    }
  },

  setFilters: (newFilters) => {
    const updated = { ...get().filters, ...newFilters }
    set({ filters: updated })
    get().fetchProposals(updated)
  },

  setSelectedProposalIds: (ids) => {
    set({ selectedProposalIds: ids })
  },

  initNewProposal: () => {
    const fresh = createNewProposalModel(get().proposals)
    const totals = calculateProposalTotals(fresh.pricing)
    set({
      currentProposal: fresh,
      totals,
      activeStep: 1,
      error: null,
    })
    return fresh
  },

  loadProposal: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const proposal = await proposalService.getProposal(id)
      const totals = calculateProposalTotals(proposal.pricing || {})
      set({
        currentProposal: proposal,
        totals,
        isLoading: false,
      })
      return proposal
    } catch (err) {
      set({ error: err.message, isLoading: false })
      throw err
    }
  },

  setCurrentProposal: (proposal) => {
    const totals = calculateProposalTotals(proposal?.pricing || {})
    set({
      currentProposal: proposal,
      totals,
      error: null,
    })
  },

  addProposal: (proposal) => {
    const totals = calculateProposalTotals(proposal?.pricing || {})
    set((state) => ({
      proposals: [proposal, ...state.proposals.filter((p) => p.id !== proposal.id)],
      currentProposal: proposal,
      totals,
      error: null,
    }))
  },

  setActiveStep: (step) => {
    set({ activeStep: step })
  },

  updateMetadata: (fields) => {
    set((state) => {
      if (!state.currentProposal) return state
      const updated = {
        ...state.currentProposal,
        ...fields,
        updatedAt: new Date().toISOString(),
      }
      return { currentProposal: updated }
    })
  },

  updateClient: (fields) => {
    set((state) => {
      if (!state.currentProposal) return state
      const resolvedClientId = fields.id || fields.clientId || fields.client_id || state.currentProposal.client_id || state.currentProposal.clientId
      const updated = {
        ...state.currentProposal,
        client_id: resolvedClientId,
        clientId: resolvedClientId,
        client: {
          ...state.currentProposal.client,
          ...fields,
        },
        updatedAt: new Date().toISOString(),
      }
      return { currentProposal: updated }
    })
  },

  updateDocumentSettings: (settings) => {
    set((state) => {
      if (!state.currentProposal) return state
      const currentDocSettings = state.currentProposal.document_settings || state.currentProposal.documentSettings || {}
      const merged = {
        ...currentDocSettings,
        ...settings,
      }
      return {
        currentProposal: {
          ...state.currentProposal,
          document_settings: merged,
          documentSettings: merged,
          updatedAt: new Date().toISOString(),
        },
      }
    })
  },

  // Update company details
  updateCompany: (fields) => {
    set((state) => {
      if (!state.currentProposal) return state
      const updated = {
        ...state.currentProposal,
        company: {
          ...state.currentProposal.company,
          ...fields,
        },
        updatedAt: new Date().toISOString(),
      }
      return { currentProposal: updated }
    })
  },

  resetCompanyToDefault: () => {
    set((state) => {
      if (!state.currentProposal) return state
      const defaultCompany = getStoredCompanyDetails()
      const updated = {
        ...state.currentProposal,
        company: { ...defaultCompany },
        updatedAt: new Date().toISOString(),
      }
      return { currentProposal: updated }
    })
  },

  // Update rich-text TipTap document JSON
  updateDocumentContent: (docJson) => {
    set((state) => {
      if (!state.currentProposal) return state
      return {
        currentProposal: {
          ...state.currentProposal,
          content: docJson,
          updatedAt: new Date().toISOString(),
        },
      }
    })
  },

  // --- Pricing Actions ---
  addPricingItem: (item) => {
    set((state) => {
      if (!state.currentProposal) return state
      const currentItems = state.currentProposal.pricing?.items || []
      const newItem = {
        id: item?.id || `item-${Date.now()}-${currentItems.length + 1}`,
        description: item?.description || 'New Service Item',
        quantity: item?.quantity ?? 1,
        unit: item?.unit || 'Milestone',
        unitPrice: item?.unitPrice ?? 0,
        discountType: item?.discountType || 'percentage',
        discountValue: item?.discountValue !== undefined ? item.discountValue : (item?.discount ?? 0),
        taxRate: item?.taxRate !== undefined ? item.taxRate : (item?.tax ?? 18),
        discount: item?.discountValue !== undefined ? item.discountValue : (item?.discount ?? 0),
        tax: item?.taxRate !== undefined ? item.taxRate : (item?.tax ?? 18),
      }
      const updatedItems = [...currentItems, newItem]
      const updatedPricing = {
        ...state.currentProposal.pricing,
        items: updatedItems,
      }
      const totals = calculateProposalTotals(updatedPricing)

      return {
        currentProposal: {
          ...state.currentProposal,
          pricing: updatedPricing,
          updatedAt: new Date().toISOString(),
        },
        totals,
      }
    })
  },

  updatePricingItem: (idOrIndex, updates) => {
    set((state) => {
      if (!state.currentProposal) return state
      const currentItems = [...(state.currentProposal.pricing?.items || [])]
      const index =
        typeof idOrIndex === 'number'
          ? idOrIndex
          : currentItems.findIndex((it) => it.id === idOrIndex)
      if (index === -1 || !currentItems[index]) return state

      currentItems[index] = {
        ...currentItems[index],
        ...updates,
      }

      const updatedPricing = {
        ...state.currentProposal.pricing,
        items: currentItems,
      }
      const totals = calculateProposalTotals(updatedPricing)

      return {
        currentProposal: {
          ...state.currentProposal,
          pricing: updatedPricing,
          updatedAt: new Date().toISOString(),
        },
        totals,
      }
    })
  },

  removePricingItem: (idOrIndex) => {
    set((state) => {
      if (!state.currentProposal) return state
      const currentItems = [...(state.currentProposal.pricing?.items || [])]
      const index =
        typeof idOrIndex === 'number'
          ? idOrIndex
          : currentItems.findIndex((it) => it.id === idOrIndex)
      if (index === -1) return state

      currentItems.splice(index, 1)

      const updatedPricing = {
        ...state.currentProposal.pricing,
        items: currentItems,
      }
      const totals = calculateProposalTotals(updatedPricing)

      return {
        currentProposal: {
          ...state.currentProposal,
          pricing: updatedPricing,
          updatedAt: new Date().toISOString(),
        },
        totals,
      }
    })
  },

  duplicatePricingItem: (idOrIndex) => {
    set((state) => {
      if (!state.currentProposal) return state
      const currentItems = [...(state.currentProposal.pricing?.items || [])]
      const target =
        typeof idOrIndex === 'number'
          ? currentItems[idOrIndex]
          : currentItems.find((it) => it.id === idOrIndex)
      if (!target) return state

      const clone = {
        ...target,
        id: `item-${Date.now()}-${currentItems.length + 1}`,
        description: `${target.description} (Copy)`,
      }

      const updatedItems = [...currentItems, clone]
      const updatedPricing = {
        ...state.currentProposal.pricing,
        items: updatedItems,
      }
      const totals = calculateProposalTotals(updatedPricing)

      return {
        currentProposal: {
          ...state.currentProposal,
          pricing: updatedPricing,
          updatedAt: new Date().toISOString(),
        },
        totals,
      }
    })
  },

  reorderPricingItems: (activeId, overId) => {
    set((state) => {
      if (!state.currentProposal) return state
      const currentItems = [...(state.currentProposal.pricing?.items || [])]
      const oldIndex = currentItems.findIndex((it) => it.id === activeId)
      const newIndex = currentItems.findIndex((it) => it.id === overId)
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return state

      const [removed] = currentItems.splice(oldIndex, 1)
      currentItems.splice(newIndex, 0, removed)

      const updatedPricing = {
        ...state.currentProposal.pricing,
        items: currentItems,
      }
      const totals = calculateProposalTotals(updatedPricing)

      return {
        currentProposal: {
          ...state.currentProposal,
          pricing: updatedPricing,
          updatedAt: new Date().toISOString(),
        },
        totals,
      }
    })
  },

  updatePricingData: (pricingUpdates) => {
    set((state) => {
      if (!state.currentProposal) return state
      const updatedPricing = {
        ...state.currentProposal.pricing,
        ...pricingUpdates,
      }
      const totals = calculateProposalTotals(updatedPricing)

      return {
        currentProposal: {
          ...state.currentProposal,
          pricing: updatedPricing,
          currency: updatedPricing.currency || state.currentProposal.currency,
          updatedAt: new Date().toISOString(),
        },
        totals,
      }
    })
  },

  setPricingCurrency: (currency) => {
    set((state) => {
      if (!state.currentProposal) return state
      const updatedPricing = {
        ...state.currentProposal.pricing,
        currency,
      }
      return {
        currentProposal: {
          ...state.currentProposal,
          currency,
          pricing: updatedPricing,
          updatedAt: new Date().toISOString(),
        },
      }
    })
  },

  setGlobalDiscount: (discountTypeOrPercent, discountValue) => {
    set((state) => {
      if (!state.currentProposal) return state
      let updatedPricing
      if (discountValue !== undefined) {
        updatedPricing = {
          ...state.currentProposal.pricing,
          globalDiscountType: discountTypeOrPercent,
          globalDiscountValue: parseFloat(discountValue) || 0,
        }
      } else {
        updatedPricing = {
          ...state.currentProposal.pricing,
          globalDiscount: parseFloat(discountTypeOrPercent) || 0,
          globalDiscountValue: parseFloat(discountTypeOrPercent) || 0,
        }
      }
      const totals = calculateProposalTotals(updatedPricing)

      return {
        currentProposal: {
          ...state.currentProposal,
          pricing: updatedPricing,
          updatedAt: new Date().toISOString(),
        },
        totals,
      }
    })
  },

  // Save / Submit active proposal
  saveCurrentProposal: async (overrideStatus) => {
    const current = get().currentProposal
    if (!current) return null

    // Run client-side validation
    const targetStatus = overrideStatus || current.status || 'draft'
    const isPublish = targetStatus === 'sent' || targetStatus === 'accepted'
    const validation = validateProposal(current, { isPublish })
    if (!validation.isValid) {
      const firstMsg = Object.values(validation.errors)[0] || 'Please complete required proposal fields'
      toast.error(firstMsg)
      const err = new Error(firstMsg)
      err.errors = validation.errors
      throw err
    }

    set({ isSaving: true, error: null })
    try {
      const payload = {
        ...current,
        status: targetStatus,
        updatedAt: new Date().toISOString(),
      }

      let saved
      const existing = get().proposals.find((p) => p.id === current.id)
      if (existing) {
        saved = await proposalService.updateProposal(current.id, payload)
        toast.success('Proposal updated successfully')
      } else {
        saved = await proposalService.createProposal(payload)
        toast.success('Proposal created successfully')
      }

      // Refresh proposals list
      await get().fetchProposals()
      set({ currentProposal: saved, isSaving: false })
      return saved
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        (err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(', ') : null) ||
        err.message ||
        'Failed to save proposal'
      toast.error(errorMsg)
      set({ error: errorMsg, isSaving: false })
      throw err
    }
  },

  deleteProposal: async (id) => {
    // Immediately remove from store proposals and selection
    set((state) => ({
      proposals: state.proposals.filter(
        (p) => String(p.id) !== String(id) && p.number !== id && p.proposal_number !== id
      ),
      selectedProposalIds: state.selectedProposalIds.filter((selId) => String(selId) !== String(id)),
      currentProposal:
        state.currentProposal &&
        (String(state.currentProposal.id) === String(id) || state.currentProposal.number === id)
          ? null
          : state.currentProposal,
      isLoading: true,
      error: null,
    }))
    try {
      if (typeof id === 'number' || (!String(id).startsWith('prop-') && !isNaN(Number(id)))) {
        await proposalService.deleteProposal(id)
      }
      await get().fetchProposals({}, { silent: true })
      toast.success('Proposal deleted successfully')
    } catch (err) {
      console.warn('API deleteProposal encountered an issue:', err)
      toast.error(err.response?.data?.message || 'Failed to delete proposal')
    } finally {
      // Ensure the deleted proposal stays excluded
      set((state) => ({
        proposals: state.proposals.filter(
          (p) =>
            String(p.id) !== String(id) &&
            p.number !== id &&
            p.proposal_number !== id &&
            !p.deleted_at &&
            !p.deletedAt
        ),
        isLoading: false,
      }))
    }
  },

  duplicateProposal: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const clone = await proposalService.duplicateProposal(id)
      await get().fetchProposals()
      set({ isLoading: false })
      toast.success('Proposal duplicated successfully')
      return clone
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to duplicate proposal'
      toast.error(errorMsg)
      set({ error: errorMsg, isLoading: false })
      throw err
    }
  },

  updateProposalStatus: async (id, status) => {
    try {
      const updated = await proposalService.updateProposal(id, { status })
      set((state) => ({
        proposals: state.proposals.map((p) =>
          String(p.id) === String(id) || p.number === id ? { ...p, status } : p
        ),
        currentProposal:
          state.currentProposal &&
          (String(state.currentProposal.id) === String(id) || state.currentProposal.number === id)
            ? { ...state.currentProposal, status }
            : state.currentProposal,
      }))
      const formattedStatus = String(status).replace(/_/g, ' ')
      toast.success(`Proposal status updated to ${formattedStatus.charAt(0).toUpperCase() + formattedStatus.slice(1)}`)
      return updated
    } catch (err) {
      console.error('Failed to update proposal status:', err)
      toast.error(err.response?.data?.message || 'Failed to update proposal status')
      throw err
    }
  },

  downloadPdf: async (id) => {
    const current = get().currentProposal
    let targetId = id || current?.id
    if (!targetId && !current) return

    set({ isGeneratingPdf: true })

    try {
      // 1. If proposal has not been saved to database yet, auto-save first
      if (!targetId || (typeof targetId !== 'number' && !/^\d+$/.test(String(targetId)))) {
        const saved = await get().saveCurrentProposal(current?.status || 'draft')
        if (saved?.id) {
          targetId = saved.id
        }
      }

      // 2. Attempt direct backend PDF file download
      let directDownloaded = false
      if (targetId && (typeof targetId === 'number' || /^\d+$/.test(String(targetId)))) {
        try {
          await proposalService.generatePdf(targetId)
          const proposalNumber = current?.number || current?.proposal_number || targetId
          const filename = `proposal-${proposalNumber}.pdf`
          await proposalService.downloadPdfFile(targetId, filename)
          toast.success('Proposal PDF exported successfully')
          directDownloaded = true
        } catch (apiErr) {
          console.warn('Backend direct PDF stream download error, falling back to clean browser export:', apiErr)
        }
      }

      // 3. Fallback: browser print dialog
      if (!directDownloaded) {
        // Dismiss all active toasts immediately so they NEVER leak into the exported PDF
        toast.dismiss()
        // Wait 150ms for toast removal from DOM before print dialog freezes rendering
        setTimeout(() => {
          window.print()
        }, 150)
      }
    } catch (err) {
      console.error('Failed to export proposal PDF:', err)
      toast.dismiss()
      const errorMsg = err.response?.data?.message || err.message || 'Failed to export proposal PDF'
      toast.error(errorMsg)
    } finally {
      set({ isGeneratingPdf: false })
    }
  },
}))

export default useProposalStore

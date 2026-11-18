import { create } from 'zustand'
import proposalService from '../services/proposalService'
import {
  createNewProposalModel,
  getStoredCompanyDetails,
  calculateProposalTotals,
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

  fetchProposals: async (customParams = {}) => {
    set({ isLoading: true, error: null })
    try {
      const params = { ...get().filters, ...customParams }
      const data = await proposalService.getProposals(params)
      set({ proposals: Array.isArray(data) ? data : [], isLoading: false })
    } catch (err) {
      set({
        error: err.message,
        proposals: Array.isArray(get().proposals) ? get().proposals : [],
        isLoading: false,
      })
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
      const updated = {
        ...state.currentProposal,
        client: {
          ...state.currentProposal.client,
          ...fields,
        },
        updatedAt: new Date().toISOString(),
      }
      return { currentProposal: updated }
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

    set({ isSaving: true, error: null })
    try {
      const payload = {
        ...current,
        status: overrideStatus || current.status || 'draft',
        updatedAt: new Date().toISOString(),
      }

      let saved
      const existing = get().proposals.find((p) => p.id === current.id)
      if (existing) {
        saved = await proposalService.updateProposal(current.id, payload)
      } else {
        saved = await proposalService.createProposal(payload)
      }

      // Refresh proposals list
      await get().fetchProposals()
      set({ currentProposal: saved, isSaving: false })
      return saved
    } catch (err) {
      set({ error: err.message, isSaving: false })
      throw err
    }
  },

  deleteProposal: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await proposalService.deleteProposal(id)
      await get().fetchProposals()
      set({ isLoading: false })
    } catch (err) {
      set({ error: err.message, isLoading: false })
      throw err
    }
  },

  duplicateProposal: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const clone = await proposalService.duplicateProposal(id)
      await get().fetchProposals()
      set({ isLoading: false })
      return clone
    } catch (err) {
      set({ error: err.message, isLoading: false })
      throw err
    }
  },

  downloadPdf: async (id) => {
    const proposal = get().currentProposal?.id === id ? get().currentProposal : null
    set({ isGeneratingPdf: true })
    try {
      await proposalService.downloadPdf(id, proposal)
    } finally {
      set({ isGeneratingPdf: false })
    }
  },
}))

export default useProposalStore

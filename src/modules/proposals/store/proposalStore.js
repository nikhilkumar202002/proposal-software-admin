import { create } from 'zustand'
import proposalService from '../services/proposalService'
import {
  createNewProposalModel,
  DEFAULT_COMPANY_DETAILS,
  calculateProposalTotals,
} from '../utils/proposalHelpers'

export const useProposalStore = create((set, get) => ({
  // Collection state
  proposals: [],
  selectedProposalIds: [],
  filters: {
    search: '',
    status: 'all',
    sortBy: 'updatedAt',
    sortOrder: 'desc',
  },

  // Active proposal under creation/editing
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
  activeStep: 1, // 1: Info, 2: Client, 3: Company, 4: Content, 5: Pricing, 6: Preview

  // Status flags
  isLoading: false,
  isSaving: false,
  isGeneratingPdf: false,
  error: null,

  // --- Collection Actions ---
  fetchProposals: async (customParams = {}) => {
    set({ isLoading: true, error: null })
    try {
      const params = { ...get().filters, ...customParams }
      const data = await proposalService.getProposals(params)
      set({ proposals: data, isLoading: false })
    } catch (err) {
      set({ error: err.message, isLoading: false })
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

  // --- Single Proposal Actions ---
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

  // Update top-level proposal metadata (Title, dates, project, status)
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

  // Update client details
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
      const updated = {
        ...state.currentProposal,
        company: { ...DEFAULT_COMPANY_DETAILS },
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
        id: `item-${Date.now()}-${currentItems.length + 1}`,
        description: item?.description || 'New Service Item',
        quantity: item?.quantity ?? 1,
        unit: item?.unit || 'Unit',
        unitPrice: item?.unitPrice ?? 0,
        discount: item?.discount ?? 0,
        tax: item?.tax ?? 18,
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

  updatePricingItem: (index, updates) => {
    set((state) => {
      if (!state.currentProposal) return state
      const currentItems = [...(state.currentProposal.pricing?.items || [])]
      if (!currentItems[index]) return state

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

  removePricingItem: (index) => {
    set((state) => {
      if (!state.currentProposal) return state
      const currentItems = [...(state.currentProposal.pricing?.items || [])]
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

  setGlobalDiscount: (discountPercent) => {
    set((state) => {
      if (!state.currentProposal) return state
      const updatedPricing = {
        ...state.currentProposal.pricing,
        globalDiscount: parseFloat(discountPercent) || 0,
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

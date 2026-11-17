import { create } from 'zustand'
import { calculatePricingSummary, calculateRowTotal } from '../utils/pricingCalculations'
import { arrayMove } from '@dnd-kit/sortable'

const createInitialItem = (index = 1) => ({
  id: `item-${Date.now()}-${index}`,
  description: 'New Deliverable / Service',
  quantity: 1,
  unit: 'Milestone',
  unitPrice: 0,
  discountType: 'percentage',
  discountValue: 0,
  taxRate: 18,
  total: 0,
})

const DEFAULT_STATE = {
  currency: 'INR',
  items: [
    {
      id: 'item-init-1',
      description: 'System Architecture & Technical Discovery',
      quantity: 1,
      unit: 'Milestone',
      unitPrice: 150000,
      discountType: 'percentage',
      discountValue: 0,
      taxRate: 18,
      total: 177000,
    },
    {
      id: 'item-init-2',
      description: 'Platform API Development & Cloud Infrastructure',
      quantity: 1,
      unit: 'Milestone',
      unitPrice: 320000,
      discountType: 'percentage',
      discountValue: 5,
      taxRate: 18,
      total: 358720,
    },
    {
      id: 'item-init-3',
      description: 'Frontend Web Portal & Client Dashboard Implementation',
      quantity: 1,
      unit: 'Milestone',
      unitPrice: 280000,
      discountType: 'percentage',
      discountValue: 0,
      taxRate: 18,
      total: 330400,
    },
  ],
  globalDiscountType: 'percentage',
  globalDiscountValue: 0,
  taxMode: 'per_item',
  overallTaxRate: 18,
  additionalCharges: [],
  paymentMilestones: [
    { id: 'ms-1', name: 'Project Kickoff & Advance', type: 'percentage', value: 40 },
    { id: 'ms-2', name: 'Alpha / Beta Milestone Acceptance', type: 'percentage', value: 40 },
    { id: 'ms-3', name: 'Final Production Deployment & Go-Live', type: 'percentage', value: 20 },
  ],
}

export const usePricingStore = create((set, get) => ({
  ...DEFAULT_STATE,

  // Helper to recompute totals
  getSummary: () => {
    const state = get()
    return calculatePricingSummary({
      items: state.items,
      currency: state.currency,
      globalDiscountType: state.globalDiscountType,
      globalDiscountValue: state.globalDiscountValue,
      taxMode: state.taxMode,
      overallTaxRate: state.overallTaxRate,
      additionalCharges: state.additionalCharges,
      paymentMilestones: state.paymentMilestones,
    })
  },

  // Hydrate or initialize from existing proposal pricing object
  setPricing: (pricingData = {}) => {
    if (!pricingData) return
    const rawItems = Array.isArray(pricingData.items) ? pricingData.items : []
    const normalizedItems = rawItems.map((item, idx) => {
      const calc = calculateRowTotal(item)
      return {
        id: item.id || `item-${Date.now()}-${idx + 1}`,
        description: item.description || '',
        quantity: item.quantity !== undefined ? item.quantity : 1,
        unit: item.unit || 'Unit',
        unitPrice: item.unitPrice !== undefined ? item.unitPrice : 0,
        discountType: item.discountType || 'percentage',
        discountValue: item.discountValue !== undefined ? item.discountValue : (item.discount || 0),
        taxRate: item.taxRate !== undefined ? item.taxRate : (item.tax !== undefined ? item.tax : 18),
        total: calc.total,
      }
    })

    set({
      currency: pricingData.currency || 'INR',
      items: normalizedItems.length > 0 ? normalizedItems : [createInitialItem(1)],
      globalDiscountType: pricingData.globalDiscountType || 'percentage',
      globalDiscountValue: pricingData.globalDiscountValue !== undefined
        ? pricingData.globalDiscountValue
        : (pricingData.globalDiscount || 0),
      taxMode: pricingData.taxMode || 'per_item',
      overallTaxRate: pricingData.overallTaxRate !== undefined ? pricingData.overallTaxRate : 18,
      additionalCharges: Array.isArray(pricingData.additionalCharges) ? pricingData.additionalCharges : [],
      paymentMilestones: Array.isArray(pricingData.paymentMilestones) && pricingData.paymentMilestones.length > 0
        ? pricingData.paymentMilestones
        : DEFAULT_STATE.paymentMilestones,
    })
  },

  setCurrency: (currency) => {
    set({ currency })
  },

  addItem: (customItem = {}) => {
    set((state) => {
      const newItem = {
        ...createInitialItem(state.items.length + 1),
        ...customItem,
      }
      const calc = calculateRowTotal(newItem)
      newItem.total = calc.total
      return { items: [...state.items, newItem] }
    })
  },

  updateItem: (idOrIndex, updates) => {
    set((state) => {
      const newItems = state.items.map((item, idx) => {
        if (item.id === idOrIndex || idx === idOrIndex) {
          const merged = { ...item, ...updates }
          const calc = calculateRowTotal(merged)
          return { ...merged, total: calc.total }
        }
        return item
      })
      return { items: newItems }
    })
  },

  removeItem: (idOrIndex) => {
    set((state) => {
      const filtered = state.items.filter((item, idx) => item.id !== idOrIndex && idx !== idOrIndex)
      return { items: filtered.length > 0 ? filtered : [createInitialItem(1)] }
    })
  },

  duplicateItem: (idOrIndex) => {
    set((state) => {
      const target = state.items.find((item, idx) => item.id === idOrIndex || idx === idOrIndex)
      if (!target) return state
      const clone = {
        ...target,
        id: `item-${Date.now()}-${state.items.length + 1}`,
        description: `${target.description} (Copy)`,
      }
      const calc = calculateRowTotal(clone)
      clone.total = calc.total
      return { items: [...state.items, clone] }
    })
  },

  reorderItems: (activeId, overId) => {
    set((state) => {
      const oldIndex = state.items.findIndex((item) => item.id === activeId)
      const newIndex = state.items.findIndex((item) => item.id === overId)
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return state
      return { items: arrayMove(state.items, oldIndex, newIndex) }
    })
  },

  setGlobalDiscount: (discountType, discountValue) => {
    set({
      globalDiscountType: discountType,
      globalDiscountValue: parseFloat(discountValue) || 0,
    })
  },

  setTaxMode: (taxMode) => {
    set({ taxMode })
  },

  setOverallTaxRate: (rate) => {
    set({ overallTaxRate: parseFloat(rate) || 0 })
  },

  // Additional charges
  addAdditionalCharge: (charge) => {
    set((state) => {
      const newCharge = {
        id: `chg-${Date.now()}-${state.additionalCharges.length + 1}`,
        label: charge?.label || 'Custom Fee',
        amount: parseFloat(charge?.amount) || 0,
      }
      return { additionalCharges: [...state.additionalCharges, newCharge] }
    })
  },

  updateAdditionalCharge: (id, updates) => {
    set((state) => ({
      additionalCharges: state.additionalCharges.map((chg) =>
        chg.id === id ? { ...chg, ...updates } : chg
      ),
    }))
  },

  removeAdditionalCharge: (id) => {
    set((state) => ({
      additionalCharges: state.additionalCharges.filter((chg) => chg.id !== id),
    }))
  },

  // Payment Milestones
  addPaymentMilestone: (milestone) => {
    set((state) => {
      const newMs = {
        id: `ms-${Date.now()}-${state.paymentMilestones.length + 1}`,
        name: milestone?.name || `Milestone ${state.paymentMilestones.length + 1}`,
        type: milestone?.type || 'percentage',
        value: parseFloat(milestone?.value) || 0,
      }
      return { paymentMilestones: [...state.paymentMilestones, newMs] }
    })
  },

  updatePaymentMilestone: (id, updates) => {
    set((state) => ({
      paymentMilestones: state.paymentMilestones.map((ms) =>
        ms.id === id ? { ...ms, ...updates } : ms
      ),
    }))
  },

  removePaymentMilestone: (id) => {
    set((state) => ({
      paymentMilestones: state.paymentMilestones.filter((ms) => ms.id !== id),
    }))
  },

  applyMilestonePreset: (presetMilestones) => {
    if (!Array.isArray(presetMilestones)) return
    set({
      paymentMilestones: presetMilestones.map((pm, i) => ({
        id: `ms-${Date.now()}-${i}`,
        name: pm.name,
        type: pm.type || 'percentage',
        value: pm.value,
      })),
    })
  },

  // Full snapshot for saving to proposal model
  getPricingSnapshot: () => {
    const s = get()
    const summary = s.getSummary()
    return {
      currency: s.currency,
      items: s.items,
      globalDiscountType: s.globalDiscountType,
      globalDiscountValue: s.globalDiscountValue,
      taxMode: s.taxMode,
      overallTaxRate: s.overallTaxRate,
      additionalCharges: s.additionalCharges,
      paymentMilestones: s.paymentMilestones,
      totals: {
        subtotal: summary.subtotal,
        totalDiscount: summary.totalDiscount,
        taxableAmount: summary.taxableAmount,
        totalTax: summary.totalTax,
        additionalChargesTotal: summary.additionalChargesTotal,
        grandTotal: summary.grandTotal,
      },
    }
  },

  resetPricing: () => {
    set({ ...DEFAULT_STATE })
  },
}))

export default usePricingStore

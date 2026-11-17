import { useMemo, useCallback } from 'react'
import { usePricingStore } from '../store/pricingStore'
import { getCurrencyConfig, formatCurrency } from '../utils/currencyHelpers'

/**
 * Custom hook to interact with the pricing store with helper utilities
 */
export function usePricing() {
  const currency = usePricingStore((s) => s.currency)
  const items = usePricingStore((s) => s.items)
  const globalDiscountType = usePricingStore((s) => s.globalDiscountType)
  const globalDiscountValue = usePricingStore((s) => s.globalDiscountValue)
  const taxMode = usePricingStore((s) => s.taxMode)
  const overallTaxRate = usePricingStore((s) => s.overallTaxRate)
  const additionalCharges = usePricingStore((s) => s.additionalCharges)
  const paymentMilestones = usePricingStore((s) => s.paymentMilestones)

  const setPricing = usePricingStore((s) => s.setPricing)
  const setCurrency = usePricingStore((s) => s.setCurrency)
  const addItem = usePricingStore((s) => s.addItem)
  const updateItem = usePricingStore((s) => s.updateItem)
  const removeItem = usePricingStore((s) => s.removeItem)
  const duplicateItem = usePricingStore((s) => s.duplicateItem)
  const reorderItems = usePricingStore((s) => s.reorderItems)
  const setGlobalDiscount = usePricingStore((s) => s.setGlobalDiscount)
  const setTaxMode = usePricingStore((s) => s.setTaxMode)
  const setOverallTaxRate = usePricingStore((s) => s.setOverallTaxRate)
  const addAdditionalCharge = usePricingStore((s) => s.addAdditionalCharge)
  const updateAdditionalCharge = usePricingStore((s) => s.updateAdditionalCharge)
  const removeAdditionalCharge = usePricingStore((s) => s.removeAdditionalCharge)
  const addPaymentMilestone = usePricingStore((s) => s.addPaymentMilestone)
  const updatePaymentMilestone = usePricingStore((s) => s.updatePaymentMilestone)
  const removePaymentMilestone = usePricingStore((s) => s.removePaymentMilestone)
  const applyMilestonePreset = usePricingStore((s) => s.applyMilestonePreset)
  const getSummary = usePricingStore((s) => s.getSummary)
  const getPricingSnapshot = usePricingStore((s) => s.getPricingSnapshot)
  const resetPricing = usePricingStore((s) => s.resetPricing)

  const summary = useMemo(() => getSummary(), [
    items,
    currency,
    globalDiscountType,
    globalDiscountValue,
    taxMode,
    overallTaxRate,
    additionalCharges,
    paymentMilestones,
    getSummary,
  ])

  const currencyConfig = useMemo(() => getCurrencyConfig(currency), [currency])

  const formatAmount = useCallback(
    (amt, opts) => formatCurrency(amt, currency, opts),
    [currency]
  )

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event
      if (over && active.id !== over.id) {
        reorderItems(active.id, over.id)
      }
    },
    [reorderItems]
  )

  return {
    // State
    currency,
    currencyConfig,
    items,
    globalDiscountType,
    globalDiscountValue,
    taxMode,
    overallTaxRate,
    additionalCharges,
    paymentMilestones,
    summary,

    // Formatter
    formatAmount,

    // Actions
    setPricing,
    setCurrency,
    addItem,
    updateItem,
    removeItem,
    duplicateItem,
    reorderItems,
    handleDragEnd,
    setGlobalDiscount,
    setTaxMode,
    setOverallTaxRate,
    addAdditionalCharge,
    updateAdditionalCharge,
    removeAdditionalCharge,
    addPaymentMilestone,
    updatePaymentMilestone,
    removePaymentMilestone,
    applyMilestonePreset,
    getPricingSnapshot,
    resetPricing,
  }
}

export default usePricing

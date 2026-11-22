/**
 * Decimal-safe financial calculations for ProposalOS Pricing & Calculations Module
 */

/**
 * Rounds numbers to 2 decimal places avoiding IEEE 754 floating point inaccuracies
 */
export function round2(num) {
  const n = typeof num === 'number' ? num : parseFloat(num) || 0
  return Math.round((n + Number.EPSILON) * 100) / 100
}

/**
 * Calculate totals for an individual pricing row
 *
 * @param {Object} item
 * @param {number} item.quantity
 * @param {number} item.unitPrice
 * @param {'percentage'|'fixed'} item.discountType
 * @param {number} item.discountValue
 * @param {number} item.taxRate
 * @returns {Object} Calculated row values
 */
export function calculateRowTotal(item = {}) {
  const quantity = Math.max(0, parseFloat(item.quantity) || 0)
  const unitPrice = Math.max(
    0,
    parseFloat(item.unitPrice !== undefined ? item.unitPrice : item.unit_price) || 0
  )
  const baseSubtotal = round2(quantity * unitPrice)

  // Support both discountType/discountValue and legacy discount percent
  const discountType = item.discountType || item.discount_type || 'percentage'
  const discountVal = Math.max(
    0,
    parseFloat(
      item.discountValue !== undefined
        ? item.discountValue
        : item.discount_value !== undefined
        ? item.discount_value
        : item.discount
    ) || 0
  )

  const discountAmount =
    discountType === 'percentage'
      ? round2(baseSubtotal * (Math.min(100, discountVal) / 100))
      : round2(Math.min(baseSubtotal, discountVal))

  const taxableAmount = Math.max(0, round2(baseSubtotal - discountAmount))

  // Support both taxRate and legacy tax
  const taxRate = Math.max(
    0,
    parseFloat(
      item.taxRate !== undefined
        ? item.taxRate
        : item.tax_rate !== undefined
        ? item.tax_rate
        : item.tax
    ) || 0
  )
  const taxAmount = round2(taxableAmount * (taxRate / 100))
  const total = round2(taxableAmount + taxAmount)

  return {
    baseSubtotal,
    discountType,
    discountValue: discountVal,
    discountAmount,
    taxableAmount,
    taxRate,
    taxAmount,
    total,
  }
}

/**
 * Calculate complete pricing summary across all items, global discounts,
 * additional charges, and payment milestones.
 *
 * @param {Object} pricing
 * @param {Array} pricing.items
 * @param {'percentage'|'fixed'} [pricing.globalDiscountType='percentage']
 * @param {number} [pricing.globalDiscountValue=0]
 * @param {'per_item'|'overall'} [pricing.taxMode='per_item']
 * @param {number} [pricing.overallTaxRate=0]
 * @param {Array} [pricing.additionalCharges=[]]
 * @param {Array} [pricing.paymentMilestones=[]]
 */
export function calculatePricingSummary(pricing = {}) {
  const safePricing = pricing || {}
  const rawItems = Array.isArray(safePricing.items)
    ? safePricing.items
    : Array.isArray(safePricing.pricing?.items)
    ? safePricing.pricing.items
    : []
  const taxMode = safePricing.taxMode || 'per_item'
  const overallTaxRate = Math.max(0, parseFloat(safePricing.overallTaxRate) || 0)

  let subtotal = 0
  let totalLineDiscounts = 0

  // 1. Calculate each item line
  const calculatedItems = rawItems.map((item) => {
    const row = calculateRowTotal(item)
    subtotal = round2(subtotal + row.baseSubtotal)
    totalLineDiscounts = round2(totalLineDiscounts + row.discountAmount)
    return {
      ...item,
      ...row,
    }
  })

  // 2. Base after item line discounts
  const afterLineDiscounts = Math.max(0, round2(subtotal - totalLineDiscounts))

  // 3. Global Discount
  const globalDiscountType = safePricing.globalDiscountType || 'percentage'
  const globalDiscountValue = Math.max(
    0,
    parseFloat(
      safePricing.globalDiscountValue !== undefined
        ? safePricing.globalDiscountValue
        : safePricing.globalDiscount
    ) || 0
  )

  const globalDiscountAmount =
    globalDiscountType === 'percentage'
      ? round2(afterLineDiscounts * (Math.min(100, globalDiscountValue) / 100))
      : round2(Math.min(afterLineDiscounts, globalDiscountValue))

  const totalDiscount = round2(totalLineDiscounts + globalDiscountAmount)
  const taxableAmount = Math.max(0, round2(afterLineDiscounts - globalDiscountAmount))

  // 4. Tax computation
  let totalTax
  if (taxMode === 'overall') {
    // Overall tax applied on the net taxable amount
    totalTax = round2(taxableAmount * (overallTaxRate / 100))
  } else {
    // Sum of per-item taxes
    // If a global discount was applied, item taxes are proportionally scaled or taken from items
    if (globalDiscountAmount > 0 && afterLineDiscounts > 0) {
      const discountRatio = taxableAmount / afterLineDiscounts
      totalTax = calculatedItems.reduce((acc, it) => {
        const adjustedTax = round2(it.taxAmount * discountRatio)
        return round2(acc + adjustedTax)
      }, 0)
    } else {
      totalTax = calculatedItems.reduce((acc, it) => round2(acc + it.taxAmount), 0)
    }
  }

  // 5. Additional charges (e.g. Onboarding, Shipping, Support)
  const additionalCharges = Array.isArray(safePricing.additionalCharges)
    ? safePricing.additionalCharges
    : []

  let additionalChargesTotal = 0
  const calculatedCharges = additionalCharges.map((chg) => {
    const amount = round2(parseFloat(chg.amount) || 0)
    additionalChargesTotal = round2(additionalChargesTotal + amount)
    return {
      ...chg,
      amount,
    }
  })

  // 6. Grand total
  const grandTotal = round2(taxableAmount + totalTax + additionalChargesTotal)

  // 7. Payment milestones & advance breakdown
  const paymentMilestones = Array.isArray(safePricing.paymentMilestones)
    ? safePricing.paymentMilestones
    : []

  let milestonesSum = 0
  const calculatedMilestones = paymentMilestones.map((m) => {
    const mType = m.type || 'percentage'
    const mValue = parseFloat(m.value) || 0
    const calculatedAmount =
      mType === 'percentage'
        ? round2(grandTotal * (Math.min(100, mValue) / 100))
        : round2(Math.min(grandTotal, mValue))

    milestonesSum = round2(milestonesSum + calculatedAmount)
    return {
      ...m,
      amount: calculatedAmount,
    }
  })

  const remainingBalance = Math.max(0, round2(grandTotal - milestonesSum))

  return {
    items: calculatedItems,
    itemCount: calculatedItems.length,
    subtotal,
    totalLineDiscounts,
    globalDiscountType,
    globalDiscountValue,
    globalDiscountAmount,
    totalDiscount,
    taxableAmount,
    taxMode,
    overallTaxRate,
    totalTax,
    additionalCharges: calculatedCharges,
    additionalChargesTotal,
    grandTotal,
    paymentMilestones: calculatedMilestones,
    milestonesTotal: milestonesSum,
    remainingBalance,
  }
}

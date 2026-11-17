/**
 * Tax configuration and computation helpers
 */

export const STANDARD_TAX_RATES = [
  { value: 0, label: '0% (Exempt / Zero-rated)' },
  { value: 5, label: '5% (Concessional)' },
  { value: 12, label: '12% (Standard Low)' },
  { value: 18, label: '18% (Standard GST / Services)' },
  { value: 28, label: '28% (Higher Bracket)' },
]

export const TAX_MODE = {
  PER_ITEM: 'per_item',
  OVERALL: 'overall',
}

/**
 * Validates and normalizes tax rate
 */
export function normalizeTaxRate(rate) {
  const parsed = parseFloat(rate)
  if (isNaN(parsed) || parsed < 0) return 0
  return Math.min(100, Math.round(parsed * 100) / 100)
}

/**
 * Format tax rate display (e.g., "18%")
 */
export function formatTaxRate(rate) {
  const r = normalizeTaxRate(rate)
  return `${r}%`
}

/**
 * Group item taxes by their respective tax rates for detailed invoice/tax breakdowns
 * @param {Array} items
 * @returns {Array<{ rate: number, taxableAmount: number, taxAmount: number }>}
 */
export function groupTaxBreakdown(items = []) {
  const map = {}

  items.forEach((item) => {
    const rate = normalizeTaxRate(item.taxRate ?? item.tax ?? 0)
    const taxable = parseFloat(item.taxableAmount) || 0
    const tax = parseFloat(item.taxAmount) || 0

    if (!map[rate]) {
      map[rate] = { rate, taxableAmount: 0, taxAmount: 0 }
    }
    map[rate].taxableAmount = Math.round((map[rate].taxableAmount + taxable) * 100) / 100
    map[rate].taxAmount = Math.round((map[rate].taxAmount + tax) * 100) / 100
  })

  return Object.values(map).sort((a, b) => a.rate - b.rate)
}

/**
 * Currency configuration and formatting helpers
 * Supports INR, USD, AED, GBP, and EUR
 */

export const CURRENCY_MAP = {
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    locale: 'en-IN',
    fractionDigits: 2,
    flag: '🇮🇳',
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    locale: 'en-US',
    fractionDigits: 2,
    flag: '🇺🇸',
  },
  AED: {
    code: 'AED',
    symbol: 'AED',
    name: 'UAE Dirham',
    locale: 'en-AE',
    fractionDigits: 2,
    flag: '🇦🇪',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    locale: 'en-GB',
    fractionDigits: 2,
    flag: '🇬🇧',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    locale: 'de-DE',
    fractionDigits: 2,
    flag: '🇪🇺',
  },
}

export const SUPPORTED_CURRENCIES = Object.keys(CURRENCY_MAP)

export const CURRENCY_OPTIONS = SUPPORTED_CURRENCIES.map((code) => ({
  value: code,
  label: `${CURRENCY_MAP[code].symbol} - ${CURRENCY_MAP[code].name} (${code})`,
  symbol: CURRENCY_MAP[code].symbol,
  flag: CURRENCY_MAP[code].flag,
  code,
}))

/**
 * Get currency metadata or default to INR
 */
export function getCurrencyConfig(currencyCode = 'INR') {
  return CURRENCY_MAP[currencyCode?.toUpperCase()] || CURRENCY_MAP.INR
}

/**
 * Get single currency symbol
 */
export function getCurrencySymbol(currencyCode = 'INR') {
  return getCurrencyConfig(currencyCode).symbol
}

/**
 * Format numeric amount into localized currency display
 */
export function formatCurrency(amount, currencyCode = 'INR', options = {}) {
  const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0
  const cfg = getCurrencyConfig(currencyCode)

  const {
    showDecimals = true,
    compact = false,
  } = options

  try {
    const formatted = new Intl.NumberFormat(cfg.locale, {
      minimumFractionDigits: showDecimals ? (num % 1 === 0 ? 0 : cfg.fractionDigits) : 0,
      maximumFractionDigits: showDecimals ? cfg.fractionDigits : 0,
      notation: compact ? 'compact' : 'standard',
    }).format(num)

    return `${cfg.symbol} ${formatted}`
  } catch {
    return `${cfg.symbol} ${num.toFixed(cfg.fractionDigits)}`
  }
}

/**
 * Parse input string into a valid positive number
 */
export function parseCurrencyInput(value) {
  if (typeof value === 'number') return isNaN(value) ? 0 : Math.max(0, value)
  if (!value) return 0
  const clean = String(value).replace(/[^0-9.-]+/g, '')
  const parsed = parseFloat(clean)
  return isNaN(parsed) ? 0 : Math.max(0, parsed)
}

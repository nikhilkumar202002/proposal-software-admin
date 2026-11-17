import logoImg from '../../../assets/Domine-Dude_black.png'
export {
  CURRENCY_OPTIONS,
  CURRENCY_MAP,
  SUPPORTED_CURRENCIES,
  formatCurrency,
} from '../../pricing/utils/currencyHelpers'

/**
 * Standard Default Company Profile
 */
export const DEFAULT_COMPANY_SETTINGS = {
  name: 'Domain Dude',
  tagline: 'Enterprise Document & Workflow Systems',
  email: 'contact@domaindude.in',
  phone: '+91 98765 43210',
  website: 'www.domaindude.in',
  taxNumber: '07AABCP1234F1Z5',
  address: 'Tower B, Suite 402, DLF CyberCity',
  city: 'Gurugram',
  state: 'Haryana',
  country: 'India',
  postalCode: '122002',
  logoUrl: logoImg,
  additionalInfo: 'Registered under Indian Companies Act 2013. Authorized IT & Enterprise Software Solutions.',
}

/**
 * Standard Default Document Layout Settings
 */
export const DEFAULT_DOCUMENT_CONFIG = {
  orientation: 'portrait', // 'portrait' | 'landscape'
  marginPreset: 'normal', // 'normal' | 'compact' | 'relaxed'
  margins: {
    top: 35, // mm
    bottom: 25, // mm
    left: 18, // mm
    right: 18, // mm
  },
  header: {
    visible: true,
    height: 22, // mm
    showDivider: true,
    website: 'www.domaindude.in',
    showDate: true,
  },
  footer: {
    visible: true,
    height: 16, // mm
    showDivider: true,
    contactPhone: '+91 98765 43210',
    addressText: 'Tower B, Suite 402, DLF CyberCity, Gurugram, Haryana 122002',
    pageNumberFormat: 'pageOfTotal', // 'pageOfTotal' | 'number' | 'fraction'
    showPageNumbers: true,
  },
  watermark: {
    enabled: false,
    text: 'CONFIDENTIAL',
    opacity: 0.08,
    angle: -45,
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    baseSize: '14px',
    lineHeight: '1.6',
  },
  pageSpacing: 28, // px
}

/**
 * Standard Default Currency & Commercial Rules
 */
export const DEFAULT_CURRENCY_SETTINGS = {
  defaultCurrency: 'INR',
  defaultTaxRate: 18,
  defaultPaymentTerms: '40% Advance, 40% Milestone Beta, 20% Final Delivery',
  defaultValidityDays: 30,
}

/**
 * Standard Default Account Profile
 */
export const DEFAULT_ACCOUNT_SETTINGS = {
  fullName: 'Administrator',
  email: 'admin@domaindude.in',
  role: 'Workspace Administrator',
  avatarUrl: '',
  notificationsEnabled: true,
  twoFactorEnabled: false,
}

export const MARGIN_PRESETS = {
  compact: {
    name: 'Compact',
    description: 'Narrow margins for text-heavy documents (Top: 25mm, Sides: 12mm)',
    margins: { top: 25, bottom: 20, left: 12, right: 12 },
  },
  normal: {
    name: 'Normal (Standard A4)',
    description: 'Balanced margins optimal for proposals & contracts (Top: 35mm, Sides: 18mm)',
    margins: { top: 35, bottom: 25, left: 18, right: 18 },
  },
  relaxed: {
    name: 'Relaxed / Executive',
    description: 'Generous white space for executive briefings (Top: 40mm, Sides: 24mm)',
    margins: { top: 40, bottom: 30, left: 24, right: 24 },
  },
}

export const PAGE_NUMBER_FORMATS = [
  { value: 'pageOfTotal', label: 'Page X of Y (e.g. Page 1 of 3)' },
  { value: 'fraction', label: 'Fraction (e.g. 1 / 3)' },
  { value: 'number', label: 'Simple Number (e.g. 1)' },
]

export const STANDARD_PAYMENT_TERMS = [
  '100% Advance Payment',
  '50% Deposit on Kickoff, 50% on Handover',
  '40% Advance, 40% Milestone Beta, 20% Final Delivery',
  'Net 15 Days after Invoice',
  'Net 30 Days after Invoice',
  'Monthly Retainer in Advance',
]

export const VALIDITY_PERIOD_OPTIONS = [
  { value: 7, label: '7 Days' },
  { value: 15, label: '15 Days' },
  { value: 30, label: '30 Days (Standard)' },
  { value: 45, label: '45 Days' },
  { value: 60, label: '60 Days' },
  { value: 90, label: '90 Days' },
]

/**
 * Validate Company Profile Fields
 */
export function validateCompanyProfile(company) {
  const errors = {}

  if (!company.name || !company.name.trim()) {
    errors.name = 'Company legal name is required'
  }

  if (company.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(company.email.trim())) {
    errors.email = 'Please provide a valid company email address'
  }

  if (company.website && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(company.website.trim())) {
    errors.website = 'Please provide a valid website domain or URL'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Format full address line from components
 */
export function formatFullAddress(company) {
  if (!company) return ''
  const parts = [
    company.address,
    company.city,
    company.state,
    company.postalCode,
    company.country,
  ].filter(Boolean)
  return parts.join(', ')
}

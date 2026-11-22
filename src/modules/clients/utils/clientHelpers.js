/**
 * Client Management Helpers & Initial Data Seeds
 */

export const COUNTRY_OPTIONS = [
  { value: 'India', label: 'India' },
  { value: 'United States', label: 'United States' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'United Arab Emirates', label: 'United Arab Emirates' },
  { value: 'Singapore', label: 'Singapore' },
  { value: 'Germany', label: 'Germany' },
  { value: 'Canada', label: 'Canada' },
  { value: 'Australia', label: 'Australia' },
]

export const CLIENT_STATUS_OPTIONS = [
  { value: 'active', label: 'Active Client' },
  { value: 'lead', label: 'Prospective Lead' },
  { value: 'inactive', label: 'Inactive' },
]

export const INITIAL_CLIENTS = []

/**
 * Creates empty client model for creation forms
 */
export function createNewClientModel() {
  return {
    id: `client-${Date.now()}`,
    name: '',
    companyName: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    postalCode: '',
    taxNumber: '',
    status: 'active',
    notes: '',
    proposalsCount: 0,
    totalRevenue: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

/**
 * Validate client form fields
 */
export function validateClient(data) {
  const errors = {}

  if (!data.name || !data.name.trim()) {
    errors.name = 'Contact person name is required'
  }

  if (!data.companyName || !data.companyName.trim()) {
    errors.companyName = 'Company / Organization name is required'
  }

  if (!data.email || !data.email.trim()) {
    errors.email = 'Email address is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = 'Please enter a valid email address'
  }

  if (data.website && !/^https?:\/\/.+/i.test(data.website.trim())) {
    errors.website = 'Website must start with http:// or https://'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Extract 2-letter uppercase initials from client name or company name
 */
export function getClientInitials(name = '', companyName = '') {
  const target = (companyName || name).trim()
  if (!target) return 'CL'
  const words = target.split(/\s+/)
  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase()
  }
  return target.slice(0, 2).toUpperCase()
}

/**
 * Format full address string
 */
export function formatClientAddress(client) {
  if (!client) return 'No address provided'
  const parts = [
    client.address,
    client.city,
    client.state,
    client.postalCode,
    client.country,
  ].filter(Boolean)
  return parts.length > 0 ? parts.join(', ') : 'No address provided'
}

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

export const INITIAL_CLIENTS = [
  {
    id: 'client-1',
    name: 'Mark Henderson',
    companyName: 'Acme Technologies Inc.',
    email: 'mark@acme.io',
    phone: '+1 (555) 382-9102',
    website: 'https://acme.io',
    address: '100 Montgomery St, Suite 1200',
    city: 'San Francisco',
    state: 'California',
    country: 'United States',
    postalCode: '94104',
    taxNumber: 'US-EIN-94301928',
    status: 'active',
    notes: 'Key enterprise account. Focus on Kubernetes migration and ongoing 24/7 cloud DevOps SLA.',
    proposalsCount: 3,
    totalRevenue: 680000,
    createdAt: '2026-01-15T10:30:00Z',
    updatedAt: '2026-11-17T14:20:00Z',
  },
  {
    id: 'client-2',
    name: 'Mr. Rohan Mehta',
    companyName: 'Apex Global Enterprises Inc.',
    email: 'rohan.mehta@apexglobal.com',
    phone: '+91 98201 12345',
    website: 'https://apexglobal.com',
    address: 'Level 14, Commercial Plaza, Bandra-Kurla Complex',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    postalCode: '400051',
    taxNumber: '27AAACE5678B1Z2',
    status: 'active',
    notes: 'CTO requires bi-weekly architecture updates. Primary contact for digital transformation contracts.',
    proposalsCount: 4,
    totalRevenue: 1485000,
    createdAt: '2026-02-10T11:00:00Z',
    updatedAt: '2026-11-16T18:00:00Z',
  },
  {
    id: 'client-3',
    name: 'Sarah Jenkins',
    companyName: 'NextEra Logistics Ltd.',
    email: 's.jenkins@nextera.co',
    phone: '+44 20 7946 0912',
    website: 'https://nextera.co.uk',
    address: '30 St Mary Axe, City of London',
    city: 'London',
    state: 'Greater London',
    country: 'United Kingdom',
    postalCode: 'EC3A 8EP',
    taxNumber: 'GB-VAT-99281726',
    status: 'active',
    notes: 'Logistics tracking workflow automation project. Invoicing in GBP.',
    proposalsCount: 2,
    totalRevenue: 520000,
    createdAt: '2026-04-18T09:15:00Z',
    updatedAt: '2026-11-15T11:45:00Z',
  },
  {
    id: 'client-4',
    name: 'Tariq Al-Mansoor',
    companyName: 'Falcon Middle East Investments',
    email: 'tariq@falconinvest.ae',
    phone: '+971 4 362 7000',
    website: 'https://falconinvest.ae',
    address: 'Gate Precinct Building 4, DIFC',
    city: 'Dubai',
    state: 'Dubai',
    country: 'United Arab Emirates',
    postalCode: '506500',
    taxNumber: 'AE-TRN-100293847500003',
    status: 'active',
    notes: 'Commercial agreements require DIFC jurisdiction clauses. Invoicing in AED.',
    proposalsCount: 1,
    totalRevenue: 450000,
    createdAt: '2026-06-22T14:00:00Z',
    updatedAt: '2026-10-30T16:20:00Z',
  },
  {
    id: 'client-5',
    name: 'David Miller',
    companyName: 'Starlight Financial',
    email: 'dmiller@starlight.finance',
    phone: '+91 98111 22334',
    website: 'https://starlight.finance',
    address: '42 Barakhamba Road, Connaught Place',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    postalCode: '110001',
    taxNumber: '07AAACS4321D1Z4',
    status: 'lead',
    notes: 'Evaluating SOC 2 compliance proposal. Decision scheduled for next financial quarter.',
    proposalsCount: 1,
    totalRevenue: 240000,
    createdAt: '2026-08-05T08:30:00Z',
    updatedAt: '2026-11-12T10:00:00Z',
  },
]

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

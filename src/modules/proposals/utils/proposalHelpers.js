/**
 * Proposal Management Helper Utilities
 * Financial calculations, currency formatting, status definitions,
 * default proposal content generators, and document adapters.
 */

export const CURRENCY_CONFIG = {
  INR: { symbol: '₹', code: 'INR', name: 'Indian Rupee', locale: 'en-IN' },
  USD: { symbol: '$', code: 'USD', name: 'US Dollar', locale: 'en-US' },
  AED: { symbol: 'AED', code: 'AED', name: 'UAE Dirham', locale: 'en-AE' },
  GBP: { symbol: '£', code: 'GBP', name: 'British Pound', locale: 'en-GB' },
  EUR: { symbol: '€', code: 'EUR', name: 'Euro', locale: 'de-DE' },
}

export const PROPOSAL_STATUSES = [
  { value: 'draft', label: 'Draft', color: 'neutral', bg: 'bg-gray-100 text-gray-700 border-gray-200' },
  { value: 'sent', label: 'Sent', color: 'info', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'viewed', label: 'Viewed', color: 'info', bg: 'bg-sky-50 text-sky-700 border-sky-200' },
  { value: 'under_review', label: 'Under Review', color: 'warning', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'accepted', label: 'Accepted', color: 'success', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { value: 'signed', label: 'Signed', color: 'success', bg: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
  { value: 'declined', label: 'Declined', color: 'danger', bg: 'bg-red-50 text-red-700 border-red-200' },
  { value: 'expired', label: 'Expired', color: 'neutral', bg: 'bg-gray-100 text-gray-500 border-gray-300' },
]

export function getProposalStatusConfig(status) {
  const norm = String(status || 'draft').toLowerCase().replace(/\s+/g, '_')
  const found = PROPOSAL_STATUSES.find((s) => s.value === norm)
  return found || { value: norm, label: status || 'Draft', color: 'neutral', bg: 'bg-gray-100 text-gray-700 border-gray-200' }
}

/**
 * Format currency with exact symbol and thousand grouping
 */
export function formatCurrency(amount, currency = 'INR') {
  const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0
  const cfg = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.INR

  try {
    const formatted = new Intl.NumberFormat(cfg.locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(num)
    return `${cfg.symbol} ${formatted}`
  } catch {
    return `${cfg.symbol} ${num.toFixed(2)}`
  }
}

/**
 * Decimal-safe rounding to 2 places
 */
export function round2(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100
}

/**
 * Calculate totals for a single pricing table row
 */
export function calculateLineItemTotal(item) {
  const qty = parseFloat(item.quantity) || 0
  const unitPrice = parseFloat(item.unitPrice) || 0
  const discountPercent = parseFloat(item.discount) || 0
  const taxPercent = parseFloat(item.tax) || 0

  const subtotal = round2(qty * unitPrice)
  const discountAmount = round2(subtotal * (discountPercent / 100))
  const taxableAmount = Math.max(0, round2(subtotal - discountAmount))
  const taxAmount = round2(taxableAmount * (taxPercent / 100))
  const total = round2(taxableAmount + taxAmount)

  return {
    subtotal,
    discountAmount,
    taxableAmount,
    taxAmount,
    total,
  }
}

/**
 * Calculate overall proposal pricing totals
 */
export function calculateProposalTotals(pricing = {}) {
  const items = Array.isArray(pricing.items) ? pricing.items : []
  const globalDiscountPercent = parseFloat(pricing.globalDiscount) || 0

  let rawSubtotal = 0
  let totalLineDiscounts = 0
  let totalTax = 0

  items.forEach((item) => {
    const row = calculateLineItemTotal(item)
    rawSubtotal = round2(rawSubtotal + row.subtotal)
    totalLineDiscounts = round2(totalLineDiscounts + row.discountAmount)
    totalTax = round2(totalTax + row.taxAmount)
  })

  // Apply global discount if any on top
  const afterLineDiscounts = Math.max(0, round2(rawSubtotal - totalLineDiscounts))
  const globalDiscountAmount = round2(afterLineDiscounts * (globalDiscountPercent / 100))
  const netTaxable = Math.max(0, round2(afterLineDiscounts - globalDiscountAmount))
  const grandTotal = round2(netTaxable + totalTax)

  return {
    subtotal: rawSubtotal,
    lineDiscounts: totalLineDiscounts,
    globalDiscountAmount,
    totalDiscount: round2(totalLineDiscounts + globalDiscountAmount),
    totalTax,
    grandTotal,
    itemCount: items.length,
  }
}

/**
 * Auto-generate proposal number
 */
export function generateProposalNumber(existingList = []) {
  const year = new Date().getFullYear()
  const randomSuffix = Math.floor(100 + Math.random() * 900)
  const candidate = `PROP-${year}-${String(existingList.length + 1).padStart(3, '0')}`
  const exists = existingList.some((p) => p.number === candidate)
  return exists ? `PROP-${year}-${randomSuffix}` : candidate
}

/**
 * Default company information
 */
export const DEFAULT_COMPANY_DETAILS = {
  name: 'ProposalOS Technologies Ltd.',
  tagline: 'Enterprise Document & Workflow Systems',
  address: 'Tower B, Suite 402, DLF CyberCity, Gurugram, Haryana 122002',
  phone: '+91 98765 43210',
  email: 'contact@proposalos.com',
  website: 'www.proposalos.com',
  taxNumber: '07AABCP1234F1Z5',
  logoUrl: '/src/assets/Domine-Dude_black.png',
}

/**
 * Pre-defined client records for fast selection
 */
export const PREDEFINED_CLIENTS = [
  {
    id: 'client-1',
    name: 'Mark Henderson',
    companyName: 'Acme Technologies Inc.',
    email: 'mark@acme.io',
    phone: '+1 (555) 382-9102',
    address: '100 Montgomery St, Suite 1200, San Francisco, CA 94104',
    taxNumber: 'US-EIN-94301928',
  },
  {
    id: 'client-2',
    name: 'Mr. Rohan Mehta',
    companyName: 'Apex Global Enterprises Inc.',
    email: 'rohan.mehta@apexglobal.com',
    phone: '+91 98201 12345',
    address: 'Level 14, Commercial Plaza, Bandra-Kurla Complex, Mumbai 400051',
    taxNumber: '27AAACE5678B1Z2',
  },
  {
    id: 'client-3',
    name: 'Sarah Jenkins',
    companyName: 'NextEra Logistics Ltd.',
    email: 's.jenkins@nextera.co',
    phone: '+44 20 7946 0912',
    address: '30 St Mary Axe, City of London, London EC3A 8EP',
    taxNumber: 'GB-VAT-99281726',
  },
  {
    id: 'client-4',
    name: 'Tariq Al-Mansoor',
    companyName: 'Falcon Middle East Investments',
    email: 'tariq@falconinvest.ae',
    phone: '+971 4 362 7000',
    address: 'Gate Precinct Building 4, DIFC, Dubai, UAE',
    taxNumber: 'AE-TRN-100293847500003',
  },
]

/**
 * Standard Proposal Section Templates for TipTap Document
 */
export const PROPOSAL_SECTION_TEMPLATES = [
  {
    id: 'sec-overview',
    title: '1. Executive Summary',
    description: 'High-level business context, objectives, and value proposition.',
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: '1. Executive Summary' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'This proposal outlines our strategic approach to delivering high-impact technological solutions tailored to your operational goals. Our team combines deep industry expertise, agile execution, and enterprise-grade security to ensure seamless project delivery.',
            },
          ],
        },
      ],
    },
  },
  {
    id: 'sec-scope',
    title: '2. Scope of Work & Deliverables',
    description: 'Key project phases, implementation tasks, and deliverables.',
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: '2. Scope of Work & Deliverables' }],
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Phase 1: Architecture blueprint, stakeholder discovery, and requirements sign-off.' }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Phase 2: Core platform build, API integrations, and continuous deployment pipeline setup.' }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Phase 3: QA testing, user acceptance drills, performance tuning, and zero-downtime go-live.' }],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: 'sec-specs',
    title: '3. Technical Specifications',
    description: 'Stack architecture, infrastructure reliability, and security standards.',
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: '3. Technical Specifications & Architecture' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'All services are deployed within isolated Virtual Private Clouds (VPC) featuring end-to-end TLS 1.3 encryption, automated daily snapshots, automated blue-green deployments, and 99.9% uptime SLA compliance.',
            },
          ],
        },
      ],
    },
  },
  {
    id: 'sec-timeline',
    title: '4. Project Timeline & Milestones',
    description: 'Gantt schedule, milestone review dates, and handover.',
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: '4. Project Timeline & Milestones' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'The complete implementation is scheduled across an 8-week sprint cycle. Weekly progress syncs and staging demos will be conducted with your project lead.',
            },
          ],
        },
      ],
    },
  },
  {
    id: 'sec-terms',
    title: '5. Terms & Conditions',
    description: 'Invoicing terms, payment schedule, IP rights, and confidentiality.',
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: '5. Commercial Terms & Conditions' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Payment milestones: 40% advance on contract signing, 40% on milestone beta delivery, and 20% on final acceptance sign-off. All invoices are payable within 15 calendar days from the date of issue.',
            },
          ],
        },
      ],
    },
  },
]

/**
 * Creates initial default TipTap document JSON
 */
export function createDefaultProposalDocJson(proposalTitle = 'Enterprise Software Solution Proposal') {
  return {
    type: 'doc',
    content: [
      {
        type: 'heading',
        attrs: { level: 1 },
        content: [{ type: 'text', text: proposalTitle }],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Prepared for client review. This comprehensive proposal defines the technical roadmap, resource commitment, deliverables, and commercial pricing structure for our proposed engagement.',
          },
        ],
      },
      {
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: '1. Executive Summary' }],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'We are delighted to submit this proposal for your upcoming technology initiative. Our enterprise solution is engineered to eliminate operational bottlenecks, enhance user engagement, and accelerate time-to-market.',
          },
        ],
      },
      {
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: '2. Project Scope & Deliverables' }],
      },
      {
        type: 'bulletList',
        content: [
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Requirement analysis, system architecture design, and project planning.' }],
              },
            ],
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Core application development with responsive web and mobile interfaces.' }],
              },
            ],
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Comprehensive testing, security auditing, and deployment automation.' }],
              },
            ],
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Documentation, user training workshops, and 60 days of post-launch hypercare.' }],
              },
            ],
          },
        ],
      },
      {
        type: 'pageBreak',
      },
      {
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: '3. Commercial Terms & SLA' }],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Detailed pricing breakdowns are itemized below in the financial schedule. All services are governed by standard enterprise confidentiality and master service agreement terms.',
          },
        ],
      },
    ],
  }
}

/**
 * Creates empty initial proposal state
 */
export function createNewProposalModel(existingList = []) {
  const proposalNumber = generateProposalNumber(existingList)
  const today = new Date().toISOString().split('T')[0]
  const validDate = new Date()
  validDate.setDate(validDate.getDate() + 30)
  const validUntil = validDate.toISOString().split('T')[0]

  return {
    id: `prop-${Date.now()}`,
    number: proposalNumber,
    title: 'Enterprise Digital Modernization Proposal',
    projectName: 'Digital Transformation Phase 1',
    date: today,
    validUntil: validUntil,
    status: 'draft',
    currency: 'INR',
    client: {
      name: '',
      companyName: '',
      email: '',
      phone: '',
      address: '',
      taxNumber: '',
    },
    company: { ...DEFAULT_COMPANY_DETAILS },
    content: createDefaultProposalDocJson('Enterprise Digital Modernization Proposal'),
    pricing: {
      currency: 'INR',
      globalDiscount: 0,
      items: [
        {
          id: 'item-1',
          description: 'Core System Architecture & Discovery Workshop',
          quantity: 1,
          unit: 'Milestone',
          unitPrice: 150000,
          discount: 0,
          tax: 18,
        },
        {
          id: 'item-2',
          description: 'Platform API Development & Cloud Infrastructure IaC',
          quantity: 1,
          unit: 'Milestone',
          unitPrice: 320000,
          discount: 5,
          tax: 18,
        },
        {
          id: 'item-3',
          description: 'Frontend Web Portal & Client Dashboard Implementation',
          quantity: 1,
          unit: 'Milestone',
          unitPrice: 280000,
          discount: 0,
          tax: 18,
        },
      ],
    },
    notes: 'Thank you for considering our proposal. Please review the deliverables and feel free to contact us with any questions.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

/**
 * Adapter: Convert proposal object into the props required by DocumentCanvas
 */
export function convertProposalToDocumentCanvasProps(proposal) {
  if (!proposal) return { content: [], company: {}, proposal: {} }

  const totals = calculateProposalTotals(proposal.pricing || {})
  const currency = proposal.pricing?.currency || proposal.currency || 'INR'

  // Build pricing table blocks
  const pricingHeaders = ['#', 'Description', 'Qty', 'Unit Price', 'Tax', 'Total']
  const pricingRows = (proposal.pricing?.items || []).map((item, idx) => {
    const calc = calculateLineItemTotal(item)
    return [
      String(idx + 1).padStart(2, '0'),
      item.description || 'Deliverable Item',
      `${item.quantity || 1} ${item.unit || ''}`.trim(),
      formatCurrency(item.unitPrice || 0, currency),
      `${item.tax || 0}%`,
      formatCurrency(calc.total, currency),
    ]
  })

  // Convert TipTap content doc into blocks
  const contentBlocks = []

  // Add Hero / Header Block
  contentBlocks.push({
    id: 'blk-hero',
    type: 'hero',
    title: proposal.title || 'Proposal Document',
    subtitle: `Prepared for ${proposal.client?.companyName || proposal.client?.name || 'Valued Client'} • ${proposal.number || ''}`,
    lead: `Project: ${proposal.projectName || proposal.title || 'Enterprise Engagement'} | Valid until ${proposal.validUntil || '30 days from date'}`,
  })

  // Add client info summary block
  contentBlocks.push({
    id: 'blk-client-card',
    type: 'custom',
    render: () => null, // fallback
    attrs: {
      type: 'info',
      title: 'Client Information',
      body: `${proposal.client?.companyName || ''} - ${proposal.client?.name || ''} (${proposal.client?.email || ''}) | ${proposal.client?.address || ''}`,
    },
  })

  // Parse TipTap content nodes
  if (proposal.content?.content && Array.isArray(proposal.content.content)) {
    proposal.content.content.forEach((node, i) => {
      const id = `tt-node-${i}`
      if (node.type === 'heading') {
        const text = (node.content || []).map((c) => c.text || '').join('')
        contentBlocks.push({
          id,
          type: 'heading',
          level: node.attrs?.level || 2,
          text,
        })
      } else if (node.type === 'paragraph') {
        const text = (node.content || []).map((c) => c.text || '').join('')
        if (text.trim()) {
          contentBlocks.push({
            id,
            type: 'paragraph',
            text,
          })
        }
      } else if (node.type === 'bulletList') {
        const items = (node.content || []).map((li) => {
          const p = li.content?.[0]
          return (p?.content || []).map((c) => c.text || '').join('')
        })
        contentBlocks.push({
          id,
          type: 'bulletList',
          items,
        })
      } else if (node.type === 'pageBreak') {
        contentBlocks.push({
          id,
          type: 'pageBreak',
          label: 'Page Break',
        })
      }
    })
  }

  // Add Commercial Investment / Pricing Table
  if (pricingRows.length > 0) {
    contentBlocks.push({
      id: 'blk-pricing-title',
      type: 'heading',
      level: 2,
      text: 'Commercial Investment & Pricing Summary',
    })

    contentBlocks.push({
      id: 'blk-pricing-table',
      type: 'table',
      caption: `Financial Schedule (${currency})`,
      headers: pricingHeaders,
      rows: pricingRows,
      summaryRow: [
        'Total',
        `Net Investment (Subtotal: ${formatCurrency(totals.subtotal, currency)} | Tax: ${formatCurrency(totals.totalTax, currency)})`,
        '',
        '',
        '',
        formatCurrency(totals.grandTotal, currency),
      ],
    })
  }

  // Add Acceptance & Signature block
  contentBlocks.push({
    id: 'blk-acceptance-block',
    type: 'signatures',
    partyA: {
      title: `For ${proposal.company?.name || 'ProposalOS'}`,
      name: 'Authorized Signatory',
      role: 'Enterprise Solutions Director',
      date: proposal.date || new Date().toISOString().split('T')[0],
    },
    partyB: {
      title: `For ${proposal.client?.companyName || 'Client Organization'}`,
      name: proposal.client?.name || 'Authorized Client Representative',
      role: 'Project Sponsor / Decision Maker',
      date: '_______________',
    },
  })

  return {
    content: contentBlocks,
    company: proposal.company || DEFAULT_COMPANY_DETAILS,
    proposal: {
      number: proposal.number,
      title: proposal.title,
      date: proposal.date,
      validUntil: proposal.validUntil,
      status: proposal.status,
      totalValue: formatCurrency(totals.grandTotal, currency),
    },
  }
}

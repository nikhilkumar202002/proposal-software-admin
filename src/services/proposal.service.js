import { api } from './api.js'

/**
 * Normalizes a proposal item for seamless camelCase and snake_case compatibility
 * @param {Object} raw
 * @returns {Object|null}
 */
export function normalizeProposal(raw) {
  if (!raw || typeof raw !== 'object') return null

  const items = Array.isArray(raw.items)
    ? raw.items.map((it) => ({
        id: it.id,
        description: it.description || '',
        quantity: Number(it.quantity || 1),
        unit: it.unit || 'hours',
        unitPrice: Number(it.unit_price ?? it.unitPrice ?? 0),
        unit_price: Number(it.unit_price ?? it.unitPrice ?? 0),
        discountType: it.discount_type || it.discountType || null,
        discount_type: it.discount_type || it.discountType || null,
        discountValue: Number(it.discount_value ?? it.discountValue ?? 0),
        discount_value: Number(it.discount_value ?? it.discountValue ?? 0),
        discountAmount: Number(it.discount_amount ?? it.discountAmount ?? 0),
        discount_amount: Number(it.discount_amount ?? it.discountAmount ?? 0),
        taxRate: Number(it.tax_rate ?? it.taxRate ?? 0),
        tax_rate: Number(it.tax_rate ?? it.taxRate ?? 0),
        taxAmount: Number(it.tax_amount ?? it.taxAmount ?? 0),
        tax_amount: Number(it.tax_amount ?? it.taxAmount ?? 0),
        total: Number(it.total ?? 0),
        sortOrder: it.sort_order ?? it.sortOrder ?? 0,
        sort_order: it.sort_order ?? it.sortOrder ?? 0,
      }))
    : []

  const paymentMilestones = Array.isArray(raw.payment_milestones || raw.paymentMilestones)
    ? (raw.payment_milestones || raw.paymentMilestones).map((m) => ({
        id: m.id,
        title: m.title || '',
        description: m.description || '',
        percentage: Number(m.percentage || 0),
        amount: Number(m.amount || 0),
        dueDescription: m.due_description || m.dueDescription || '',
        due_description: m.due_description || m.dueDescription || '',
        sortOrder: m.sort_order ?? m.sortOrder ?? 0,
        sort_order: m.sort_order ?? m.sortOrder ?? 0,
      }))
    : []

  const subtotal = Number(raw.subtotal ?? 0)
  const discountAmount = Number(raw.discount_amount ?? raw.discountAmount ?? 0)
  const taxAmount = Number(raw.tax_amount ?? raw.taxAmount ?? 0)
  const additionalCharges = Number(raw.additional_charges ?? raw.additionalCharges ?? 0)
  const grandTotal = Number(raw.grand_total ?? raw.grandTotal ?? 0)

  return {
    id: raw.id,
    number: raw.proposal_number || raw.number || '',
    proposalNumber: raw.proposal_number || raw.proposalNumber || raw.number || '',
    proposal_number: raw.proposal_number || raw.proposalNumber || raw.number || '',
    title: raw.title || '',
    proposalType: raw.proposal_type || raw.proposalType || 'direct',
    proposal_type: raw.proposal_type || raw.proposalType || 'direct',
    status: (raw.status || 'draft').toLowerCase(),
    date: raw.proposal_date || raw.proposalDate || raw.date || '',
    proposalDate: raw.proposal_date || raw.proposalDate || raw.date || '',
    proposal_date: raw.proposal_date || raw.proposalDate || raw.date || '',
    validUntil: raw.valid_until || raw.validUntil || null,
    valid_until: raw.valid_until || raw.validUntil || null,
    currency: raw.currency || 'USD',
    content: raw.content || null,
    documentSettings: raw.document_settings || raw.documentSettings || null,
    document_settings: raw.document_settings || raw.documentSettings || null,
    internalNotes: raw.internal_notes || raw.internalNotes || '',
    internal_notes: raw.internal_notes || raw.internalNotes || '',

    // Pricing & Totals
    subtotal,
    discountType: raw.discount_type || raw.discountType || 'percentage',
    discount_type: raw.discount_type || raw.discountType || 'percentage',
    discountValue: Number(raw.discount_value ?? raw.discountValue ?? 0),
    discount_value: Number(raw.discount_value ?? raw.discountValue ?? 0),
    discountAmount,
    discount_amount: discountAmount,
    taxAmount,
    tax_amount: taxAmount,
    additionalCharges,
    additional_charges: additionalCharges,
    grandTotal,
    grand_total: grandTotal,

    pricing: {
      currency: raw.currency || 'USD',
      subtotal,
      discountAmount,
      taxAmount,
      additionalCharges,
      grandTotal,
      items,
      paymentMilestones,
      globalDiscount: Number(raw.discount_value ?? 0),
      globalDiscountValue: Number(raw.discount_value ?? 0),
      globalDiscountType: raw.discount_type || 'percentage',
    },

    // Relational fields
    clientId: raw.client_id || raw.clientId || raw.client?.id || null,
    client_id: raw.client_id || raw.clientId || raw.client?.id || null,
    client: raw.client
      ? {
          id: raw.client.id,
          name: raw.client.client_name || raw.client.name || '',
          clientName: raw.client.client_name || raw.client.name || '',
          companyName: raw.client.company_name || raw.client.companyName || '',
          email: raw.client.email || '',
          phone: raw.client.phone || '',
          address: raw.client.address || '',
          country: raw.client.country || '',
          taxNumber: raw.client.tax_number || raw.client.taxNumber || '',
        }
      : null,
    technologies: Array.isArray(raw.technologies) ? raw.technologies : [],
    technology_ids: Array.isArray(raw.technologies)
      ? raw.technologies.map((t) => (typeof t === 'object' ? t.id : t)).filter(Boolean)
      : Array.isArray(raw.technology_ids)
        ? raw.technology_ids
        : [],
    serviceTypes: Array.isArray(raw.service_types || raw.serviceTypes)
      ? raw.service_types || raw.serviceTypes
      : [],
    service_types: Array.isArray(raw.service_types || raw.serviceTypes)
      ? raw.service_types || raw.serviceTypes
      : [],
    service_type_ids: Array.isArray(raw.service_types || raw.serviceTypes)
      ? (raw.service_types || raw.serviceTypes).map((s) => (typeof s === 'object' ? s.id : s)).filter(Boolean)
      : Array.isArray(raw.service_type_ids)
        ? raw.service_type_ids
        : [],
    items,
    paymentMilestones,
    payment_milestones: paymentMilestones,
    notes: raw.notes || raw.internal_notes || '',

    createdBy: raw.created_by || raw.createdBy || null,
    created_by: raw.created_by || raw.createdBy || null,
    createdAt: raw.created_at || raw.createdAt || null,
    created_at: raw.created_at || raw.createdAt || null,
    updatedAt: raw.updated_at || raw.updatedAt || null,
    updated_at: raw.updated_at || raw.updatedAt || null,
    deletedAt: raw.deleted_at || raw.deletedAt || null,
    deleted_at: raw.deleted_at || raw.deletedAt || null,
  }
}

/**
 * Format payload object for backend POST / PUT /proposals
 * @param {Object} data
 * @returns {Object}
 */
export function formatProposalPayload(data) {
  const discountType = data.discount_type || data.discountType || data.pricing?.globalDiscountType
  const discountValue =
    data.discount_value ??
    data.discountValue ??
    data.pricing?.globalDiscountValue ??
    data.pricing?.globalDiscount ??
    0
  const additionalCharges =
    data.additional_charges ??
    data.additionalCharges ??
    data.pricing?.additionalCharges ??
    0

  const statusRaw = String(data.status || 'draft').toLowerCase().trim().replace(/\s+/g, '_')
  const statusMap = {
    proposal_sent: 'sent',
    proposal_send: 'sent',
    signed: 'accepted',
    approved: 'accepted',
  }
  const status = statusMap[statusRaw] || statusRaw

  const payload = {
    title: (data.title || '').trim() || 'Untitled Proposal',
    proposal_type: data.proposal_type || data.proposalType || 'direct',
    status: status,
    currency: data.currency || data.pricing?.currency || 'USD',
    discount_type: ['percentage', 'fixed'].includes(discountType) ? discountType : 'percentage',
    discount_value: Math.max(0, Number(discountValue)),
    additional_charges: Math.max(0, Number(additionalCharges)),
  }

  const clientId = data.client_id ?? data.clientId ?? data.client?.id ?? null
  if (clientId && Number(clientId) > 0) {
    payload.client_id = Number(clientId)
  }
  if (data.client && typeof data.client === 'object') {
    payload.client = {
      name: data.client.name || data.client.client_name || '',
      company_name: data.client.companyName || data.client.company_name || '',
      email: data.client.email || '',
      phone: data.client.phone || '',
      address: data.client.address || '',
      tax_number: data.client.taxNumber || data.client.tax_number || '',
    }
  }

  if (data.proposal_date || data.proposalDate || data.date) {
    payload.proposal_date = data.proposal_date || data.proposalDate || data.date
  } else {
    payload.proposal_date = new Date().toISOString().split('T')[0]
  }
  if (data.valid_until || data.validUntil) {
    payload.valid_until = data.valid_until || data.validUntil
  }
  if (data.content !== undefined) payload.content = data.content
  if (data.document_settings !== undefined || data.documentSettings !== undefined) {
    payload.document_settings = data.document_settings ?? data.documentSettings
  }
  const notes = data.notes || data.internal_notes || data.internalNotes || ''
  if (notes) {
    payload.notes = notes
    payload.internal_notes = notes
  }

  // Relations
  if (Array.isArray(data.technology_ids || data.technologyIds)) {
    payload.technology_ids = data.technology_ids || data.technologyIds
  } else if (Array.isArray(data.technologies)) {
    payload.technology_ids = data.technologies.map((t) => (typeof t === 'object' ? t.id : t)).filter(Boolean)
  }

  if (Array.isArray(data.service_type_ids || data.serviceTypeIds)) {
    payload.service_type_ids = data.service_type_ids || data.serviceTypeIds
  } else if (Array.isArray(data.service_types || data.serviceTypes)) {
    payload.service_type_ids = (data.service_types || data.serviceTypes)
      .map((s) => (typeof s === 'object' ? s.id : s))
      .filter(Boolean)
  }

  // Items
  const items = data.items || data.pricing?.items
  if (Array.isArray(items)) {
    payload.items = items.map((it) => {
      const itemDiscountType = it.discount_type || it.discountType
      return {
        description: (it.description || '').trim() || 'Service Deliverable',
        quantity: Math.max(0.01, Number(it.quantity || 1)),
        unit: it.unit || 'Milestone',
        unit_price: Math.max(0, Number(it.unit_price ?? it.unitPrice ?? 0)),
        discount_type: ['percentage', 'fixed'].includes(itemDiscountType) ? itemDiscountType : null,
        discount_value: Math.max(0, Number(it.discount_value ?? it.discountValue ?? it.discount ?? 0)),
        tax_rate: Math.min(100, Math.max(0, Number(it.tax_rate ?? it.taxRate ?? it.tax ?? 0))),
      }
    })
  }

  // Payment Milestones
  const rawMilestones =
    data.payment_milestones ||
    data.paymentMilestones ||
    data.pricing?.paymentMilestones ||
    data.pricing?.payment_milestones
  if (Array.isArray(rawMilestones) && rawMilestones.length > 0) {
    const totalPct = rawMilestones.reduce((acc, m) => acc + Number(m.percentage || 0), 0)
    payload.payment_milestones = rawMilestones.map((m, idx) => {
      let pct = Number(m.percentage || 0)
      if (totalPct > 0 && Math.abs(totalPct - 100) > 0.01) {
        pct = Math.round((pct / totalPct) * 100 * 100) / 100
      }
      return {
        title: (m.title || m.name || `Phase ${idx + 1}`).trim(),
        description: m.description || null,
        percentage: pct,
        due_description: m.due_description || m.dueDescription || null,
        sort_order: m.sort_order ?? m.sortOrder ?? idx,
      }
    })
  }

  return payload
}

export const proposalService = {
  /**
   * GET /proposals
   * List proposals with optional search, status, pagination, and sorting
   * @param {Object} [params={}] - { search, status, client_id, proposal_type, page, per_page, sort_by, sort_order }
   * @returns {Promise<Array>}
   */
  async getProposals(params = {}) {
    const queryParams = {}

    if (params.search && typeof params.search === 'string' && params.search.trim()) {
      queryParams.search = params.search.trim()
    }
    if (params.status && params.status !== 'all') {
      queryParams.status = params.status
    }
    if (params.client_id || params.clientId) {
      queryParams.client_id = params.client_id || params.clientId
    }
    if (params.proposal_type || params.proposalType) {
      queryParams.proposal_type = params.proposal_type || params.proposalType
    }
    if (params.page) {
      queryParams.page = params.page
    }
    if (params.per_page || params.perPage) {
      queryParams.per_page = params.per_page || params.perPage
    }
    if (params.sort_by || params.sortBy) {
      queryParams.sort_by = params.sort_by || params.sortBy
    }
    if (params.sort_order || params.sortDirection) {
      queryParams.sort_order = params.sort_order || params.sortDirection
    }

    const response = await api.get('/proposals', { params: queryParams })
    const resData = response.data || {}

    let rawList = []
    if (Array.isArray(resData.data?.proposals)) {
      rawList = resData.data.proposals
    } else if (Array.isArray(resData.proposals)) {
      rawList = resData.proposals
    } else if (Array.isArray(resData.data)) {
      rawList = resData.data
    } else if (Array.isArray(resData)) {
      rawList = resData
    }

    const pagination = resData.data?.pagination || resData.pagination || null
    const normalized = rawList.map(normalizeProposal).filter(Boolean)
    normalized.pagination = pagination

    return normalized
  },

  /**
   * GET /proposals/:id
   * Fetch single proposal details by ID
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  async getProposal(id) {
    const response = await api.get(`/proposals/${id}`)
    const resData = response.data || {}
    const raw = resData.data?.proposal || resData.data || resData.proposal || resData
    return normalizeProposal(raw)
  },

  /**
   * POST /proposals
   * Create a new proposal
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async createProposal(data) {
    const payload = formatProposalPayload(data)
    const response = await api.post('/proposals', payload)
    const resData = response.data || {}
    const raw = resData.data?.proposal || resData.data || resData.proposal || resData
    return normalizeProposal(raw)
  },

  /**
   * PUT /proposals/:id
   * Update an existing proposal
   * @param {string|number} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async updateProposal(id, data) {
    const payload = formatProposalPayload(data)
    const response = await api.put(`/proposals/${id}`, payload)
    const resData = response.data || {}
    const raw = resData.data?.proposal || resData.data || resData.proposal || resData
    return normalizeProposal(raw)
  },

  /**
   * DELETE /proposals/:id
   * Delete a proposal by ID
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  async deleteProposal(id) {
    const response = await api.delete(`/proposals/${id}`)
    return response.data
  },

  /**
   * POST /proposals/:id/duplicate
   * Duplicate a proposal by ID
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  async duplicateProposal(id) {
    const response = await api.post(`/proposals/${id}/duplicate`)
    const resData = response.data || {}
    const raw = resData.data?.proposal || resData.data || resData.proposal || resData
    return normalizeProposal(raw)
  },

  /**
   * PATCH /proposals/:id/status
   * Update proposal status
   * @param {string|number} id
   * @param {string} status - 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected'
   * @returns {Promise<Object>}
   */
  async updateProposalStatus(id, status) {
    const response = await api.patch(`/proposals/${id}/status`, { status })
    const resData = response.data || {}
    const raw = resData.data?.proposal || resData.data || resData.proposal || resData
    return normalizeProposal(raw) || resData
  },

  /**
   * POST /proposals/:id/pdf
   * Generate PDF for a proposal
   * @param {string|number} id
   * @returns {Promise<Object>} - { file_path, download_url }
   */
  async generatePdf(id) {
    const response = await api.post(`/proposals/${id}/pdf`)
    const resData = response.data || {}
    return resData.data || resData
  },

  /**
   * GET /proposals/:id/pdf/download
   * Download generated PDF file as blob
   * @param {string|number} id
   * @returns {Promise<Blob>}
   */
  async downloadPdf(id) {
    const response = await api.get(`/proposals/${id}/pdf/download`, {
      responseType: 'blob',
    })
    return response.data
  },

  /**
   * Helper to download PDF and trigger browser file save
   * @param {string|number} id
   * @param {string} [filename]
   */
  async downloadPdfFile(id, filename = `proposal-${id}.pdf`) {
    const blob = await this.downloadPdf(id)
    if (typeof window !== 'undefined') {
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    }
    return blob
  },

  /**
   * GET /proposals/:id/activities
   * Retrieve proposal activity timeline and audit log
   * @param {string|number} id
   * @returns {Promise<Array>}
   */
  async getProposalActivities(id) {
    const response = await api.get(`/proposals/${id}/activities`)
    const resData = response.data || {}
    const list = resData.data?.activities || resData.data || resData.activities || resData
    return Array.isArray(list) ? list : []
  },
}

// Named exports for convenient direct import
export const {
  getProposals,
  getProposal,
  createProposal,
  updateProposal,
  deleteProposal,
  duplicateProposal,
  updateProposalStatus,
  generatePdf,
  downloadPdf,
  downloadPdfFile,
  getProposalActivities,
} = proposalService

export default proposalService

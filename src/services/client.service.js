import { api } from './api.js'

/**
 * Normalizes a client object to support both snake_case (API standard) and camelCase (UI standard)
 * @param {Object} rawClient
 * @returns {Object|null}
 */
export function normalizeClient(rawClient) {
  if (!rawClient || typeof rawClient !== 'object') return null

  return {
    id: rawClient.id,
    clientCode: rawClient.client_code || rawClient.clientCode || '',
    client_code: rawClient.client_code || rawClient.clientCode || '',
    name: rawClient.client_name || rawClient.clientName || rawClient.name || '',
    clientName: rawClient.client_name || rawClient.clientName || rawClient.name || '',
    client_name: rawClient.client_name || rawClient.clientName || rawClient.name || '',
    companyName: rawClient.company_name || rawClient.companyName || '',
    company_name: rawClient.company_name || rawClient.companyName || '',
    email: rawClient.email || '',
    phone: rawClient.phone || '',
    website: rawClient.website || '',
    address: rawClient.address || '',
    city: rawClient.city || '',
    state: rawClient.state || '',
    country: rawClient.country || '',
    postalCode: rawClient.postal_code || rawClient.postalCode || '',
    postal_code: rawClient.postal_code || rawClient.postalCode || '',
    taxNumber: rawClient.tax_number || rawClient.taxNumber || '',
    tax_number: rawClient.tax_number || rawClient.taxNumber || '',
    notes: rawClient.notes || '',
    status: (rawClient.status || 'active').toLowerCase(),
    createdBy: rawClient.created_by || rawClient.createdBy || null,
    created_by: rawClient.created_by || rawClient.createdBy || null,
    activity: rawClient.activity || null,
    proposalsCount:
      rawClient.activity?.total_proposals ??
      rawClient.proposalsCount ??
      rawClient.proposals_count ??
      0,
    totalRevenue:
      rawClient.activity?.total_value ??
      rawClient.totalRevenue ??
      rawClient.total_value ??
      0,
    createdAt: rawClient.created_at || rawClient.createdAt || null,
    created_at: rawClient.created_at || rawClient.createdAt || null,
    updatedAt: rawClient.updated_at || rawClient.updatedAt || null,
    updated_at: rawClient.updated_at || rawClient.updatedAt || null,
    deletedAt: rawClient.deleted_at || rawClient.deletedAt || null,
    deleted_at: rawClient.deleted_at || rawClient.deletedAt || null,
  }
}

export const clientService = {
  /**
   * GET /clients
   * List all clients with optional query filters, pagination, and sorting
   * @param {Object} params - { search, country, status, per_page, sort_by, sort_order, page }
   * @returns {Promise<Array>}
   */
  async getClients(params = {}) {
    const response = await api.get('/clients', { params })
    const resData = response.data || {}

    let rawList = []
    if (Array.isArray(resData.data?.clients)) {
      rawList = resData.data.clients
    } else if (Array.isArray(resData.clients)) {
      rawList = resData.clients
    } else if (Array.isArray(resData.data)) {
      rawList = resData.data
    } else if (Array.isArray(resData)) {
      rawList = resData
    }

    const pagination = resData.data?.pagination || resData.pagination || null
    const normalized = rawList.map(normalizeClient).filter(Boolean)
    normalized.pagination = pagination

    return normalized
  },

  /**
   * GET /clients/search?q=Acme
   * Search clients by keyword across name, company, email, or client code
   * @param {string|Object} query - Search term string or { q, per_page }
   * @param {Object} [extraParams={}] - Optional query parameters
   * @returns {Promise<Array>}
   */
  async searchClients(query, extraParams = {}) {
    const q = typeof query === 'string' ? query : query?.q || query?.search || ''
    const params = {
      q,
      ...(typeof query === 'object' ? query : {}),
      ...extraParams,
    }

    const response = await api.get('/clients/search', { params })
    const resData = response.data || {}

    let rawList = []
    if (Array.isArray(resData.data?.clients)) {
      rawList = resData.data.clients
    } else if (Array.isArray(resData.clients)) {
      rawList = resData.clients
    } else if (Array.isArray(resData.data)) {
      rawList = resData.data
    } else if (Array.isArray(resData)) {
      rawList = resData
    }

    const pagination = resData.data?.pagination || resData.pagination || null
    const normalized = rawList.map(normalizeClient).filter(Boolean)
    normalized.pagination = pagination

    return normalized
  },

  /**
   * GET /clients/:id
   * Fetch single client details by ID
   * @param {string|number} id - Client ID (e.g. 3)
   * @returns {Promise<Object>}
   */
  async getClient(id) {
    const response = await api.get(`/clients/${id}`)
    const resData = response.data || {}
    const rawClient = resData.data?.client || resData.data || resData.client || resData
    return normalizeClient(rawClient)
  },

  /**
   * POST /clients
   * Create a new client record
   */
  async createClient(data) {
    const payload = {
      client_name: data.client_name || data.clientName || data.name || '',
      company_name: data.company_name || data.companyName || '',
      email: data.email || '',
      phone: data.phone || null,
      website: data.website || null,
      address: data.address || null,
      city: data.city || null,
      state: data.state || null,
      country: data.country || null,
      postal_code: data.postal_code || data.postalCode || null,
      tax_number: data.tax_number || data.taxNumber || null,
      notes: data.notes || null,
      status: data.status || 'active',
    }

    const response = await api.post('/clients', payload)
    const resData = response.data || {}
    const rawClient = resData.data?.client || resData.data || resData.client || resData
    return normalizeClient(rawClient)
  },

  /**
   * PUT /clients/:id
   * Update client details
   */
  async updateClient(id, data) {
    const payload = {
      ...(data.client_name || data.clientName || data.name
        ? { client_name: data.client_name || data.clientName || data.name }
        : {}),
      ...(data.company_name !== undefined || data.companyName !== undefined
        ? { company_name: data.company_name ?? data.companyName }
        : {}),
      ...(data.email !== undefined ? { email: data.email } : {}),
      ...(data.phone !== undefined ? { phone: data.phone } : {}),
      ...(data.website !== undefined ? { website: data.website } : {}),
      ...(data.address !== undefined ? { address: data.address } : {}),
      ...(data.city !== undefined ? { city: data.city } : {}),
      ...(data.state !== undefined ? { state: data.state } : {}),
      ...(data.country !== undefined ? { country: data.country } : {}),
      ...(data.postal_code !== undefined || data.postalCode !== undefined
        ? { postal_code: data.postal_code ?? data.postalCode }
        : {}),
      ...(data.tax_number !== undefined || data.taxNumber !== undefined
        ? { tax_number: data.tax_number ?? data.taxNumber }
        : {}),
      ...(data.notes !== undefined ? { notes: data.notes } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
    }

    const response = await api.put(`/clients/${id}`, payload)
    const resData = response.data || {}
    const rawClient = resData.data?.client || resData.data || resData.client || resData
    return normalizeClient(rawClient)
  },

  /**
   * PATCH /clients/:id/status
   * Update client status (active | inactive)
   */
  async updateClientStatus(id, status) {
    const response = await api.patch(`/clients/${id}/status`, { status })
    const resData = response.data || {}
    const rawClient = resData.data?.client || resData.data || resData
    return normalizeClient(rawClient) || resData
  },

  /**
   * DELETE /clients/:id
   * Soft-delete client (with proposal association protection)
   */
  async deleteClient(id) {
    const response = await api.delete(`/clients/${id}`)
    return response.data
  },

  /**
   * POST /clients/:id/restore
   * Restore a soft-deleted client
   */
  async restoreClient(id) {
    const response = await api.post(`/clients/${id}/restore`)
    const resData = response.data || {}
    const rawClient = resData.data?.client || resData.data || resData
    return normalizeClient(rawClient) || resData
  },

  /**
   * GET /clients/:id/proposals
   * Retrieve all proposals associated with the client
   */
  async getClientProposals(id) {
    const response = await api.get(`/clients/${id}/proposals`)
    const resData = response.data || {}
    const list =
      resData.data?.proposals ||
      (Array.isArray(resData.data) ? resData.data : null) ||
      resData.proposals ||
      (Array.isArray(resData) ? resData : [])
    return Array.isArray(list) ? list : []
  },

  /**
   * GET /clients/:id/activity
   * Retrieve overview activity and proposal metrics for a client
   */
  async getClientActivity(id) {
    const response = await api.get(`/clients/${id}/activity`)
    const resData = response.data || {}
    return resData.data?.activity || resData.data || resData.activity || resData
  },
}

// Named exports for convenient direct import
export const {
  getClients,
  searchClients,
  getClient,
  createClient,
  updateClient,
  updateClientStatus,
  deleteClient,
  restoreClient,
  getClientProposals,
  getClientActivity,
} = clientService

export default clientService

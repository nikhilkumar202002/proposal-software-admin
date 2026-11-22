import { api } from './api.js'

/**
 * Normalizes a technology item for dual snake_case and camelCase support
 * @param {Object} raw
 * @returns {Object|null}
 */
export function normalizeTechnology(raw) {
  if (!raw || typeof raw !== 'object') return null
  return {
    id: raw.id,
    name: raw.name || '',
    createdAt: raw.created_at || raw.createdAt || null,
    created_at: raw.created_at || raw.createdAt || null,
    updatedAt: raw.updated_at || raw.updatedAt || null,
    updated_at: raw.updated_at || raw.updatedAt || null,
  }
}

/**
 * Normalizes a service type item for dual snake_case and camelCase support
 * @param {Object} raw
 * @returns {Object|null}
 */
export function normalizeServiceType(raw) {
  if (!raw || typeof raw !== 'object') return null
  return {
    id: raw.id,
    name: raw.name || '',
    createdAt: raw.created_at || raw.createdAt || null,
    created_at: raw.created_at || raw.createdAt || null,
    updatedAt: raw.updated_at || raw.updatedAt || null,
    updated_at: raw.updated_at || raw.updatedAt || null,
  }
}

/**
 * Technology API Services
 */
export const technologyService = {
  /**
   * GET /technologies
   * List technologies with optional search, pagination, and sorting
   * e.g. GET /technologies?search=script&page=1&per_page=5&sort_order=asc
   * @param {Object} [params={}] - { search, page, per_page, sort_order }
   * @returns {Promise<Array>}
   */
  async getTechnologies(params = {}) {
    const response = await api.get('/technologies', { params })
    const resData = response.data || {}

    let rawList = []
    if (Array.isArray(resData.data?.technologies)) {
      rawList = resData.data.technologies
    } else if (Array.isArray(resData.data)) {
      rawList = resData.data
    } else if (Array.isArray(resData.technologies)) {
      rawList = resData.technologies
    } else if (Array.isArray(resData)) {
      rawList = resData
    }

    const pagination = resData.data?.pagination || resData.pagination || null
    const normalized = rawList.map(normalizeTechnology).filter(Boolean)
    normalized.pagination = pagination

    return normalized
  },

  /**
   * GET /technologies/:id
   * Retrieve a single technology by ID
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  async getTechnology(id) {
    const response = await api.get(`/technologies/${id}`)
    const resData = response.data || {}
    const raw = resData.data?.technology || resData.data || resData.technology || resData
    return normalizeTechnology(raw)
  },

  /**
   * POST /technologies
   * Create a new technology
   * Payload: { name: "TypeScript" }
   * @param {Object|string} data - { name: "TypeScript" } or string "TypeScript"
   * @returns {Promise<Object>}
   */
  async createTechnology(data) {
    const payload = typeof data === 'string' ? { name: data } : { name: data.name || '' }
    const response = await api.post('/technologies', payload)
    const resData = response.data || {}
    const raw = resData.data?.technology || resData.data || resData.technology || resData
    return normalizeTechnology(raw)
  },

  /**
   * PUT /technologies/:id
   * Update technology by ID
   * Payload: { name: "..." }
   * @param {string|number} id
   * @param {Object|string} data - { name: "..." } or string
   * @returns {Promise<Object>}
   */
  async updateTechnology(id, data) {
    const payload = typeof data === 'string' ? { name: data } : { name: data.name || '' }
    const response = await api.put(`/technologies/${id}`, payload)
    const resData = response.data || {}
    const raw = resData.data?.technology || resData.data || resData.technology || resData
    return normalizeTechnology(raw)
  },

  /**
   * DELETE /technologies/:id
   * Delete technology by ID
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  async deleteTechnology(id) {
    const response = await api.delete(`/technologies/${id}`)
    return response.data
  },
}

/**
 * Service Types API Services
 */
export const serviceTypeService = {
  /**
   * GET /service-types
   * List service types with optional search, pagination, and sorting
   * e.g. GET /service-types?search=App&page=1&per_page=5&sort_order=asc
   * @param {Object} [params={}] - { search, page, per_page, sort_order }
   * @returns {Promise<Array>}
   */
  async getServiceTypes(params = {}) {
    const response = await api.get('/service-types', { params })
    const resData = response.data || {}

    let rawList = []
    if (Array.isArray(resData.data?.service_types)) {
      rawList = resData.data.service_types
    } else if (Array.isArray(resData.data)) {
      rawList = resData.data
    } else if (Array.isArray(resData.service_types)) {
      rawList = resData.service_types
    } else if (Array.isArray(resData)) {
      rawList = resData
    }

    const pagination = resData.data?.pagination || resData.pagination || null
    const normalized = rawList.map(normalizeServiceType).filter(Boolean)
    normalized.pagination = pagination

    return normalized
  },

  /**
   * GET /service-types/:id
   * Retrieve a single service type by ID
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  async getServiceType(id) {
    const response = await api.get(`/service-types/${id}`)
    const resData = response.data || {}
    const raw = resData.data?.service_type || resData.data || resData.service_type || resData
    return normalizeServiceType(raw)
  },

  /**
   * POST /service-types
   * Create a new service type
   * Payload: { name: "AI Solutions Consulting" }
   * @param {Object|string} data - { name: "..." } or string
   * @returns {Promise<Object>}
   */
  async createServiceType(data) {
    const payload = typeof data === 'string' ? { name: data } : { name: data.name || '' }
    const response = await api.post('/service-types', payload)
    const resData = response.data || {}
    const raw = resData.data?.service_type || resData.data || resData.service_type || resData
    return normalizeServiceType(raw)
  },

  /**
   * PUT /service-types/:id
   * Update service type by ID
   * Payload: { name: "..." }
   * @param {string|number} id
   * @param {Object|string} data - { name: "..." } or string
   * @returns {Promise<Object>}
   */
  async updateServiceType(id, data) {
    const payload = typeof data === 'string' ? { name: data } : { name: data.name || '' }
    const response = await api.put(`/service-types/${id}`, payload)
    const resData = response.data || {}
    const raw = resData.data?.service_type || resData.data || resData.service_type || resData
    return normalizeServiceType(raw)
  },

  /**
   * DELETE /service-types/:id
   * Delete service type by ID
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  async deleteServiceType(id) {
    const response = await api.delete(`/service-types/${id}`)
    return response.data
  },
}

/**
 * Unified techService combining technologies and service-types
 */
export const techService = {
  // Technologies
  getTechnologies: technologyService.getTechnologies,
  getTechnology: technologyService.getTechnology,
  createTechnology: technologyService.createTechnology,
  updateTechnology: technologyService.updateTechnology,
  deleteTechnology: technologyService.deleteTechnology,

  // Service Types
  getServiceTypes: serviceTypeService.getServiceTypes,
  getServiceType: serviceTypeService.getServiceType,
  createServiceType: serviceTypeService.createServiceType,
  updateServiceType: serviceTypeService.updateServiceType,
  deleteServiceType: serviceTypeService.deleteServiceType,
}

// Named exports for convenient direct import
export const {
  getTechnologies,
  getTechnology,
  createTechnology,
  updateTechnology,
  deleteTechnology,
  getServiceTypes,
  getServiceType,
  createServiceType,
  updateServiceType,
  deleteServiceType,
} = techService

export default techService

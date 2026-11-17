import api from '../../../services/api'
import { INITIAL_CLIENTS, createNewClientModel } from '../utils/clientHelpers'

const STORAGE_KEY = 'proposalos_clients_data'

function loadLocalClients() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (err) {
    console.warn('Error reading localStorage clients:', err.message)
  }
  saveLocalClients(INITIAL_CLIENTS)
  return INITIAL_CLIENTS
}

function saveLocalClients(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch (err) {
    console.warn('Error saving clients to localStorage:', err.message)
  }
}

export const clientService = {
  /**
   * GET /api/clients
   */
  async getClients(params = {}) {
    try {
      const res = await api.get('/clients', { params })
      const raw = res.data
      let list = []
      if (Array.isArray(raw)) {
        list = raw
      } else if (Array.isArray(raw?.data)) {
        list = raw.data
      } else if (Array.isArray(raw?.clients)) {
        list = raw.clients
      } else if (Array.isArray(raw?.result)) {
        list = raw.result
      } else {
        console.warn('API /api/clients returned non-array payload, using local store:', raw)
        list = loadLocalClients()
      }
      return list
    } catch (err) {
      console.warn('API /api/clients unreachable, using local store:', err.message)
      let list = loadLocalClients()

      if (params.search) {
        const q = params.search.toLowerCase().trim()
        list = list.filter(
          (c) =>
            c.name?.toLowerCase().includes(q) ||
            c.companyName?.toLowerCase().includes(q) ||
            c.email?.toLowerCase().includes(q) ||
            c.city?.toLowerCase().includes(q)
        )
      }

      if (params.status && params.status !== 'all') {
        list = list.filter((c) => c.status === params.status)
      }

      if (params.country && params.country !== 'all') {
        list = list.filter((c) => c.country === params.country)
      }

      return list
    }
  },

  /**
   * GET /api/clients/{id}
   */
  async getClient(id) {
    try {
      const res = await api.get(`/clients/${id}`)
      return res.data?.data || res.data
    } catch (err) {
      console.warn(`API /api/clients/${id} unreachable, checking local store:`, err.message)
      const list = loadLocalClients()
      const found = list.find((c) => String(c.id) === String(id))
      if (!found) {
        throw new Error(`Client with ID ${id} not found`, { cause: err })
      }
      return found
    }
  },

  /**
   * POST /api/clients
   */
  async createClient(clientData) {
    try {
      const res = await api.post('/clients', clientData)
      return res.data?.data || res.data
    } catch (err) {
      console.warn('API /api/clients [POST] unreachable, creating in local store:', err.message)
      const list = loadLocalClients()
      const newClient = {
        ...createNewClientModel(),
        ...clientData,
        id: clientData.id || `client-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      list.unshift(newClient)
      saveLocalClients(list)
      return newClient
    }
  },

  /**
   * PUT /api/clients/{id}
   */
  async updateClient(id, updates) {
    try {
      const res = await api.put(`/clients/${id}`, updates)
      return res.data?.data || res.data
    } catch (err) {
      console.warn(`API /api/clients/${id} [PUT] unreachable, updating in local store:`, err.message)
      const list = loadLocalClients()
      const index = list.findIndex((c) => String(c.id) === String(id))
      if (index === -1) {
        throw new Error(`Client ${id} not found`, { cause: err })
      }
      const updated = {
        ...list[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      list[index] = updated
      saveLocalClients(list)
      return updated
    }
  },

  /**
   * DELETE /api/clients/{id}
   */
  async deleteClient(id) {
    try {
      const res = await api.delete(`/clients/${id}`)
      return res.data
    } catch (err) {
      console.warn(`API /api/clients/${id} [DELETE] unreachable, deleting in local store:`, err.message)
      let list = loadLocalClients()
      list = list.filter((c) => String(c.id) !== String(id))
      saveLocalClients(list)
      return { success: true }
    }
  },
}

export default clientService

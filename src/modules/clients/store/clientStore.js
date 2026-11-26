import { create } from 'zustand'
import { toast } from 'react-hot-toast'
import clientService from '../services/clientService'
import { createNewClientModel } from '../utils/clientHelpers'

export const useClientStore = create((set, get) => ({
  // Collection state
  clients: [],
  selectedClientIds: [],
  filters: {
    search: '',
    status: 'all',
    country: 'all',
    sortBy: 'name',
    sortDirection: 'asc',
  },
  currentPage: 1,
  pageSize: 8,

  // Single active client
  currentClient: null,

  // Status flags
  isLoading: false,
  isSaving: false,
  error: null,

  // --- Collection Actions ---
  fetchClients: async (customParams = {}, options = {}) => {
    const isSilent = Boolean(options.silent)
    if (!isSilent) {
      set({ isLoading: true, error: null })
    }
    try {
      const params = { ...get().filters, ...customParams }
      const data = await clientService.getClients(params)
      set({ clients: Array.isArray(data) ? data : [], isLoading: false })
    } catch (err) {
      if (!isSilent) {
        set({
          error: err.message,
          clients: Array.isArray(get().clients) ? get().clients : [],
          isLoading: false,
        })
      }
    }
  },

  setFilters: (newFilters) => {
    const sanitized = { ...newFilters }
    if (sanitized.search !== undefined && typeof sanitized.search !== 'string') {
      sanitized.search = sanitized.search?.target?.value ?? ''
    }
    const updated = { ...get().filters, ...sanitized }
    set({ filters: updated, currentPage: 1 })
    get().fetchClients(updated)
  },

  setCurrentPage: (page) => {
    set({ currentPage: page })
  },

  setSelectedClientIds: (ids) => {
    set({ selectedClientIds: ids })
  },

  // --- Single Client Actions ---
  initNewClient: () => {
    const fresh = createNewClientModel()
    set({ currentClient: fresh, error: null })
    return fresh
  },

  loadClient: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const client = await clientService.getClient(id)
      set({ currentClient: client, isLoading: false })
      return client
    } catch (err) {
      set({ error: err.message, isLoading: false })
      throw err
    }
  },

  createClient: async (clientData) => {
    set({ isSaving: true, error: null })
    try {
      const created = await clientService.createClient(clientData)
      await get().fetchClients()
      set({ currentClient: created, isSaving: false })
      toast.success('Client created successfully')
      return created
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create client'
      toast.error(errorMsg)
      set({ error: errorMsg, isSaving: false })
      throw err
    }
  },

  updateClient: async (id, updates) => {
    set({ isSaving: true, error: null })
    try {
      const updated = await clientService.updateClient(id, updates)
      await get().fetchClients()
      set({ currentClient: updated, isSaving: false })
      toast.success('Client updated successfully')
      return updated
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update client'
      toast.error(errorMsg)
      set({ error: errorMsg, isSaving: false })
      throw err
    }
  },

  deleteClient: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await clientService.deleteClient(id)
      await get().fetchClients()
      set({
        selectedClientIds: get().selectedClientIds.filter((item) => item !== id),
        isLoading: false,
      })
      toast.success('Client deleted successfully')
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete client'
      toast.error(errorMsg)
      set({ error: errorMsg, isLoading: false })
      throw err
    }
  },

  updateClientStatus: async (id, status) => {
    try {
      await clientService.updateClientStatus(id, status)
      set((state) => ({
        clients: state.clients.map((c) =>
          String(c.id) === String(id) ? { ...c, status } : c
        ),
      }))
      toast.success(`Client marked as ${status}`)
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update client status'
      toast.error(errorMsg)
      set({ error: errorMsg })
      throw err
    }
  },

  updateClientStatus: async (id, status) => {
    try {
      await clientService.updateClientStatus(id, status)
      set((state) => ({
        clients: state.clients.map((c) =>
          String(c.id) === String(id) ? { ...c, status } : c
        ),
      }))
    } catch (err) {
      set({ error: err.message })
      throw err
    }
  },
}))

export default useClientStore

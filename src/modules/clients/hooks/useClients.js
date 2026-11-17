import { useMemo, useCallback } from 'react'
import useClientStore from '../store/clientStore'

export function useClients() {
  const store = useClientStore()

  // Filtered and sorted client list
  const filteredClients = useMemo(() => {
    let list = [...store.clients]
    const { search, status, country, sortBy, sortDirection } = store.filters

    // Search query
    if (search && search.trim()) {
      const q = search.toLowerCase().trim()
      list = list.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.companyName?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.city?.toLowerCase().includes(q) ||
          c.taxNumber?.toLowerCase().includes(q)
      )
    }

    // Status filter
    if (status && status !== 'all') {
      list = list.filter((c) => c.status === status)
    }

    // Country filter
    if (country && country !== 'all') {
      list = list.filter((c) => c.country === country)
    }

    // Sorting
    list.sort((a, b) => {
      let fieldA = a[sortBy] ?? ''
      let fieldB = b[sortBy] ?? ''

      if (typeof fieldA === 'string') {
        fieldA = fieldA.toLowerCase()
        fieldB = String(fieldB).toLowerCase()
        return sortDirection === 'asc'
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA)
      }

      return sortDirection === 'asc' ? fieldA - fieldB : fieldB - fieldA
    })

    return list
  }, [store.clients, store.filters])

  // Paginated clients slice
  const paginatedClients = useMemo(() => {
    const startIndex = (store.currentPage - 1) * store.pageSize
    return filteredClients.slice(startIndex, startIndex + store.pageSize)
  }, [filteredClients, store.currentPage, store.pageSize])

  // Total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredClients.length / store.pageSize))
  }, [filteredClients.length, store.pageSize])

  // KPI Metrics calculation
  const stats = useMemo(() => {
    let activeCount = 0
    let leadCount = 0
    let totalProposals = 0
    let totalRevenue = 0

    store.clients.forEach((c) => {
      if (c.status === 'active') activeCount += 1
      if (c.status === 'lead') leadCount += 1
      totalProposals += c.proposalsCount || 0
      totalRevenue += c.totalRevenue || 0
    })

    return {
      totalClients: store.clients.length,
      activeClients: activeCount,
      leads: leadCount,
      totalProposals,
      totalRevenue,
    }
  }, [store.clients])

  const handleSort = useCallback(
    (key, direction) => {
      store.setFilters({ sortBy: key, sortDirection: direction })
    },
    [store]
  )

  return {
    clients: store.clients,
    filteredClients,
    paginatedClients,
    totalPages,
    currentPage: store.currentPage,
    setCurrentPage: store.setCurrentPage,
    currentClient: store.currentClient,
    selectedClientIds: store.selectedClientIds,
    setSelectedClientIds: store.setSelectedClientIds,
    filters: store.filters,
    setFilters: store.setFilters,
    stats,
    isLoading: store.isLoading,
    isSaving: store.isSaving,
    error: store.error,
    handleSort,

    // Actions
    fetchClients: store.fetchClients,
    loadClient: store.loadClient,
    initNewClient: store.initNewClient,
    createClient: store.createClient,
    updateClient: store.updateClient,
    deleteClient: store.deleteClient,
  }
}

export default useClients

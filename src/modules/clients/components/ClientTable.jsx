import { useState, useEffect, useMemo, useCallback } from 'react'
import { Eye, Edit3, Trash2, FilePlus, Loader2 } from 'lucide-react'
import { DataTable } from '../../../components/common'
import { getClientInitials } from '../utils/clientHelpers'
import { clientService, normalizeClient } from '../../../services/client.service'
import useClientStore from '../store/clientStore'

export const ClientTable = ({
  clients: propClients,
  selectedIds: propSelectedIds,
  onSelectRow: propOnSelectRow,
  onSelectAll: propOnSelectAll,
  onView = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onCreateProposal = () => {},
  onToggleStatus: propOnToggleStatus,
  onSort: propOnSort,
  sortColumn: propSortColumn,
  sortDirection: propSortDirection,
  loading: propLoading,
  className = '',
}) => {
  const store = useClientStore()

  // Internal state for self-fetching when clients prop is not passed
  const [internalClients, setInternalClients] = useState([])
  const [internalLoading, setInternalLoading] = useState(false)
  const [internalSelectedIds, setInternalSelectedIds] = useState([])
  const [updatingClientIds, setUpdatingClientIds] = useState(new Set())
  const [localSortColumn, setLocalSortColumn] = useState('companyName')
  const [localSortDirection, setLocalSortDirection] = useState('asc')

  // Auto-fetch clients from API if propClients is not provided
  const shouldFetchSelf = propClients === undefined

  const fetchLiveClients = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setInternalLoading(true)
    try {
      const data = await clientService.getClients()
      setInternalClients(Array.isArray(data) ? data : [])
    } catch (err) {
      if (!silent) {
        console.error('Failed to load clients in ClientTable:', err)
        setInternalClients([])
      }
    } finally {
      if (!silent) setInternalLoading(false)
    }
  }, [])

  // Initial load and 5-second background refresh without triggering loading state
  useEffect(() => {
    if (!shouldFetchSelf) return

    fetchLiveClients()

    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return
      fetchLiveClients({ silent: true })
    }, 5000)

    return () => clearInterval(interval)
  }, [shouldFetchSelf, fetchLiveClients])

  // Extract raw list whether prop is an array or API payload object
  const rawList = useMemo(() => {
    if (propClients !== undefined) {
      if (Array.isArray(propClients)) return propClients
      if (Array.isArray(propClients?.data?.clients)) return propClients.data.clients
      if (Array.isArray(propClients?.clients)) return propClients.clients
      if (Array.isArray(propClients?.data)) return propClients.data
      return []
    }
    return internalClients
  }, [propClients, internalClients])

  // Normalize each client for both snake_case and camelCase compatibility
  const normalizedClients = useMemo(() => {
    return (rawList || []).map((c) => normalizeClient(c) || c)
  }, [rawList])

  // Selection handlers
  const selectedIds = propSelectedIds !== undefined ? propSelectedIds : internalSelectedIds

  const handleSelectRow = (id) => {
    if (propOnSelectRow) {
      propOnSelectRow(id)
    } else {
      setInternalSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      )
    }
  }

  const handleSelectAll = (ids) => {
    if (propOnSelectAll) {
      propOnSelectAll(ids)
    } else {
      setInternalSelectedIds(ids)
    }
  }

  // Toggle client status (PATCH /clients/:id/status)
  const handleToggleStatus = async (id, newStatus) => {
    setUpdatingClientIds((prev) => new Set(prev).add(id))
    try {
      if (propOnToggleStatus) {
        await propOnToggleStatus(id, newStatus)
      } else {
        await clientService.updateClientStatus(id, newStatus)
        // Update local state if self-fetching
        setInternalClients((prev) =>
          prev.map((c) =>
            String(c.id) === String(id) ? { ...c, status: newStatus } : c
          )
        )
        // Also update store if connected
        if (store.updateClientStatus) {
          store.updateClientStatus(id, newStatus).catch(() => {})
        }
      }
    } catch (err) {
      console.error(`Failed to update status for client ${id}:`, err)
    } finally {
      setUpdatingClientIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  // Sorting
  const sortColumn = propSortColumn !== undefined ? propSortColumn : localSortColumn
  const sortDirection = propSortDirection !== undefined ? propSortDirection : localSortDirection

  const handleSort = (colKey, direction) => {
    if (propOnSort) {
      propOnSort(colKey, direction)
    } else {
      setLocalSortColumn(colKey)
      setLocalSortDirection(direction)
    }
  }

  const columns = [
    {
      key: 'companyName',
      header: 'Company & Contact',
      title: 'Company & Contact',
      sortable: true,
      render: (row) => {
        const r = row && typeof row === 'object' ? row : {}
        const companyName = r.company_name || r.companyName || '—'
        const contactName = r.client_name || r.clientName || r.name || '—'
        const clientCode = r.client_code || r.clientCode
        const initials = getClientInitials(contactName, companyName)

        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-xs text-[#0055FF] shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-xs text-gray-900 block truncate group-hover:text-[#0055FF] transition-colors">
                  {companyName}
                </span>
                {clientCode && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 border border-gray-200">
                    {clientCode}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-gray-500 block truncate">
                {contactName}
              </span>
            </div>
          </div>
        )
      },
    },
    {
      key: 'email',
      header: 'Contact Details',
      title: 'Contact Details',
      sortable: true,
      render: (row) => {
        const r = row && typeof row === 'object' ? row : {}
        return (
          <div className="min-w-0 max-w-[200px]">
            <span className="text-xs text-gray-800 block truncate">
              {r.email || '—'}
            </span>
            {r.phone && (
              <span className="text-[11px] text-gray-400 block truncate">
                {r.phone}
              </span>
            )}
          </div>
        )
      },
    },
    {
      key: 'city',
      header: 'Location',
      title: 'Location',
      sortable: true,
      render: (row) => {
        const r = row && typeof row === 'object' ? row : {}
        const city = r.city || ''
        const state = r.state || ''
        const locationText = [city, state].filter(Boolean).join(', ') || '—'

        return (
          <div className="text-xs text-gray-600">
            <span>{locationText}</span>
            {r.country && (
              <span className="text-gray-400 text-[11px] block">
                {r.country}
              </span>
            )}
          </div>
        )
      },
    },
    {
      key: 'taxNumber',
      header: 'Tax ID / GSTIN',
      title: 'Tax ID / GSTIN',
      sortable: true,
      render: (row) => {
        const r = row && typeof row === 'object' ? row : {}
        return (
          <span className="font-mono text-xs text-gray-600">
            {r.tax_number || r.taxNumber || '—'}
          </span>
        )
      },
    },
    {
      key: 'proposalsCount',
      header: 'Proposals',
      title: 'Proposals',
      sortable: true,
      render: (row) => {
        const r = row && typeof row === 'object' ? row : {}
        const count =
          r.activity?.total_proposals ??
          r.proposalsCount ??
          r.proposals_count ??
          0

        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200">
            {count}
          </span>
        )
      },
    },
    {
      key: 'status',
      header: 'Status',
      title: 'Status',
      sortable: true,
      render: (row) => {
        const r = row && typeof row === 'object' ? row : {}
        const status = (r.status || 'active').toLowerCase()
        const isActive = status === 'active'
        const isUpdating = updatingClientIds.has(r.id)

        return (
          <div
            className="flex items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              role="switch"
              aria-checked={isActive}
              disabled={isUpdating}
              onClick={() =>
                handleToggleStatus(r.id, isActive ? 'inactive' : 'active')
              }
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 ${
                isActive ? 'bg-emerald-500' : 'bg-gray-300'
              } ${isUpdating ? 'opacity-60 cursor-wait' : ''}`}
              title={`Click to set status to ${isActive ? 'Inactive' : 'Active'}`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none flex items-center justify-center h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isActive ? 'translate-x-4' : 'translate-x-0'
                }`}
              >
                {isUpdating && (
                  <Loader2 className="w-2.5 h-2.5 text-gray-500 animate-spin" />
                )}
              </span>
            </button>
          </div>
        )
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      title: 'Actions',
      align: 'right',
      render: (row) => {
        const r = row && typeof row === 'object' ? row : {}

        return (
          <div
            className="flex items-center justify-end gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => onView(r)}
              className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              title="View Client Profile"
              aria-label="View Client Profile"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onEdit(r)}
              className="p-1.5 text-gray-500 hover:text-[#0055FF] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
              title="Edit Client"
              aria-label="Edit Client"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onCreateProposal(r)}
              className="p-1.5 text-gray-500 hover:text-[#0055FF] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
              title="Create Proposal for Client"
              aria-label="Create Proposal for Client"
            >
              <FilePlus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(r)}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Delete Client"
              aria-label="Delete Client"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )
      },
    },
  ]

  const isLoading = propLoading !== undefined ? propLoading : internalLoading

  return (
    <DataTable
      columns={columns}
      data={normalizedClients}
      rowKey="id"
      selectable={true}
      selectedRows={selectedIds}
      onSelectRow={handleSelectRow}
      onSelectAll={handleSelectAll}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      onSort={handleSort}
      loading={isLoading}
      emptyMessage="No clients found"
      emptyDescription="Add your first client to start creating professional proposals."
      onRowClick={(row) => onView(row)}
      className={className}
    />
  )
}

export default ClientTable

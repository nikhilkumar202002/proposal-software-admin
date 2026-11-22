import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Layers,
  Cpu,
  Plus,
  Search,
  Edit3,
  Trash2,
  Code2,
  Briefcase,
  Calendar,
  Sparkles,
  RotateCcw,
  Loader2,
} from 'lucide-react'
import {
  DataTable,
  Button,
  Modal,
  Input,
  ConfirmDialog,
  StatsCard,
  EmptyState,
} from '../../../components/common'
import {
  technologyService,
  serviceTypeService,
} from '../../../services/techservice.service'

export const TechServicesPage = () => {
  // Active Tab: 'services' | 'technologies'
  const [activeTab, setActiveTab] = useState('services')

  // Data states
  const [technologies, setTechnologies] = useState([])
  const [serviceTypes, setServiceTypes] = useState([])
  const [isLoadingTech, setIsLoadingTech] = useState(false)
  const [isLoadingServices, setIsLoadingServices] = useState(false)

  // Search states
  const [searchQuery, setSearchQuery] = useState('')

  // Modal states for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create') // 'create' | 'edit'
  const [editingItem, setEditingItem] = useState(null)
  const [itemName, setItemName] = useState('')
  const [itemError, setItemError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Delete confirmation modal states
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch Technologies
  const loadTechnologies = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setIsLoadingTech(true)
    try {
      const data = await technologyService.getTechnologies()
      setTechnologies(Array.isArray(data) ? data : [])
    } catch (err) {
      if (!silent) {
        console.error('Failed to load technologies:', err)
        setTechnologies([])
      }
    } finally {
      if (!silent) setIsLoadingTech(false)
    }
  }, [])

  // Fetch Service Types
  const loadServiceTypes = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setIsLoadingServices(true)
    try {
      const data = await serviceTypeService.getServiceTypes()
      setServiceTypes(Array.isArray(data) ? data : [])
    } catch (err) {
      if (!silent) {
        console.error('Failed to load service types:', err)
        setServiceTypes([])
      }
    } finally {
      if (!silent) setIsLoadingServices(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    loadTechnologies()
    loadServiceTypes()
  }, [loadTechnologies, loadServiceTypes])

  // 5-second silent background refresh without loading spinners
  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return
      loadTechnologies({ silent: true })
      loadServiceTypes({ silent: true })
    }, 5000)

    return () => clearInterval(interval)
  }, [loadTechnologies, loadServiceTypes])

  // Filtered lists based on search
  const filteredTechnologies = useMemo(() => {
    if (!searchQuery.trim()) return technologies
    const q = searchQuery.toLowerCase().trim()
    return technologies.filter((item) =>
      item.name?.toLowerCase().includes(q)
    )
  }, [technologies, searchQuery])

  const filteredServiceTypes = useMemo(() => {
    if (!searchQuery.trim()) return serviceTypes
    const q = searchQuery.toLowerCase().trim()
    return serviceTypes.filter((item) =>
      item.name?.toLowerCase().includes(q)
    )
  }, [serviceTypes, searchQuery])

  // Open modal for Create
  const handleOpenCreateModal = () => {
    setModalMode('create')
    setEditingItem(null)
    setItemName('')
    setItemError('')
    setIsModalOpen(true)
  }

  // Open modal for Edit
  const handleOpenEditModal = (item) => {
    setModalMode('edit')
    setEditingItem(item)
    setItemName(item.name || '')
    setItemError('')
    setIsModalOpen(true)
  }

  // Save (Create or Update)
  const handleSaveItem = async (e) => {
    e?.preventDefault()
    const trimmed = itemName.trim()
    if (!trimmed) {
      setItemError(`Please enter a valid ${activeTab === 'technologies' ? 'technology' : 'service type'} name`)
      return
    }

    setIsSaving(true)
    setItemError('')

    try {
      if (activeTab === 'technologies') {
        if (modalMode === 'create') {
          const created = await technologyService.createTechnology({ name: trimmed })
          setTechnologies((prev) => [created, ...prev])
        } else if (editingItem) {
          const updated = await technologyService.updateTechnology(editingItem.id, { name: trimmed })
          setTechnologies((prev) =>
            prev.map((t) => (t.id === editingItem.id ? updated : t))
          )
        }
      } else {
        if (modalMode === 'create') {
          const created = await serviceTypeService.createServiceType({ name: trimmed })
          setServiceTypes((prev) => [created, ...prev])
        } else if (editingItem) {
          const updated = await serviceTypeService.updateServiceType(editingItem.id, { name: trimmed })
          setServiceTypes((prev) =>
            prev.map((s) => (s.id === editingItem.id ? updated : s))
          )
        }
      }

      setIsModalOpen(false)
      setItemName('')
      setEditingItem(null)
    } catch (err) {
      console.error('Failed to save item:', err)
      const msg = err.response?.data?.message || err.message || 'Operation failed. Please try again.'
      setItemError(msg)
    } finally {
      setIsSaving(false)
    }
  }

  // Delete execution
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      if (activeTab === 'technologies') {
        await technologyService.deleteTechnology(deleteTarget.id)
        setTechnologies((prev) => prev.filter((t) => t.id !== deleteTarget.id))
      } else {
        await serviceTypeService.deleteServiceType(deleteTarget.id)
        setServiceTypes((prev) => prev.filter((s) => s.id !== deleteTarget.id))
      }
      setDeleteTarget(null)
    } catch (err) {
      console.error('Failed to delete item:', err)
      alert(err.response?.data?.message || 'Failed to delete. Please verify no active proposals depend on this.')
    } finally {
      setIsDeleting(false)
    }
  }

  // Date formatter
  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    try {
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return dateStr
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  // Columns for Technologies table
  const technologyColumns = [
    {
      key: 'id',
      header: 'ID',
      width: '80px',
      render: (row) => (
        <span className="font-mono text-xs text-gray-500">#{row.id}</span>
      ),
    },
    {
      key: 'name',
      header: 'Technology Name',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs shrink-0">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-xs text-gray-900 block truncate hover:text-[#0055FF] transition-colors">
              {row.name}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'created_at',
      header: 'Created Date',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span>{formatDate(row.createdAt || row.created_at)}</span>
        </div>
      ),
    },
    {
      key: 'updated_at',
      header: 'Last Updated',
      sortable: true,
      render: (row) => (
        <span className="text-xs text-gray-400">
          {formatDate(row.updatedAt || row.updated_at)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div
          className="flex items-center justify-end gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => handleOpenEditModal(row)}
            className="p-1.5 text-gray-500 hover:text-[#0055FF] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
            title="Edit Technology"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(row)}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Delete Technology"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  // Columns for Service Types table
  const serviceTypeColumns = [
    {
      key: 'id',
      header: 'ID',
      width: '80px',
      render: (row) => (
        <span className="font-mono text-xs text-gray-500">#{row.id}</span>
      ),
    },
    {
      key: 'name',
      header: 'Service Type Offering',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0055FF] font-bold text-xs shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-xs text-gray-900 block truncate hover:text-[#0055FF] transition-colors">
              {row.name}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'created_at',
      header: 'Created Date',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span>{formatDate(row.createdAt || row.created_at)}</span>
        </div>
      ),
    },
    {
      key: 'updated_at',
      header: 'Last Updated',
      sortable: true,
      render: (row) => (
        <span className="text-xs text-gray-400">
          {formatDate(row.updatedAt || row.updated_at)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div
          className="flex items-center justify-end gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => handleOpenEditModal(row)}
            className="p-1.5 text-gray-500 hover:text-[#0055FF] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
            title="Edit Service Type"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(row)}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Delete Service Type"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  const currentCount =
    activeTab === 'technologies'
      ? filteredTechnologies.length
      : filteredServiceTypes.length

  const isLoading =
    activeTab === 'technologies' ? isLoadingTech : isLoadingServices

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Service Types & Technologies
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Manage your organization's core service offerings, technical stack options, and proposal building blocks.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          icon={Plus}
          onClick={handleOpenCreateModal}
          className="shrink-0"
        >
          {activeTab === 'technologies' ? 'Add Technology' : 'Add Service Type'}
        </Button>
      </div>

      {/* KPI Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Service Offerings"
          value={serviceTypes.length}
          icon={Layers}
          description="Active service categories"
        />
        <StatsCard
          title="Technology Stack"
          value={technologies.length}
          icon={Cpu}
          description="Standard frameworks & libraries"
        />
        <StatsCard
          title="Scope Capabilities"
          value={serviceTypes.length + technologies.length}
          icon={Briefcase}
          description="Total catalog items"
        />
        <StatsCard
          title="Proposal Readiness"
          value="100%"
          icon={Sparkles}
          description="Synced with live proposals"
        />
      </div>

      {/* Tab Controls Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="inline-flex p-1 bg-gray-100/90 rounded-2xl border border-gray-200/70 shadow-2xs">
          <button
            type="button"
            onClick={() => {
              setActiveTab('services')
              setSearchQuery('')
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'services'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Layers className="w-4 h-4 text-[#0055FF]" />
            <span>Service Types</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'services'
                  ? 'bg-blue-50 text-[#0055FF]'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {serviceTypes.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('technologies')
              setSearchQuery('')
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'technologies'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Cpu className="w-4 h-4 text-indigo-600" />
            <span>Technologies</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'technologies'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {technologies.length}
            </span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab === 'technologies' ? 'technologies' : 'service types'}...`}
            className="w-full pl-9 pr-8 py-2 text-xs bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 focus:border-[#0055FF] transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Content */}
      {currentCount === 0 && !isLoading ? (
        <EmptyState
          icon={activeTab === 'technologies' ? Cpu : Layers}
          title={`No ${activeTab === 'technologies' ? 'technologies' : 'service types'} found`}
          description={
            searchQuery
              ? 'Try modifying your search keywords or clear the filter.'
              : `Get started by registering your first ${activeTab === 'technologies' ? 'technology' : 'service type'}.`
          }
          actionText={activeTab === 'technologies' ? 'Add Technology' : 'Add Service Type'}
          onAction={handleOpenCreateModal}
        />
      ) : activeTab === 'services' ? (
        <DataTable
          columns={serviceTypeColumns}
          data={filteredServiceTypes}
          rowKey="id"
          loading={isLoading}
          emptyMessage="No service types available"
        />
      ) : (
        <DataTable
          columns={technologyColumns}
          data={filteredTechnologies}
          rowKey="id"
          loading={isLoading}
          emptyMessage="No technologies available"
        />
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          modalMode === 'create'
            ? activeTab === 'technologies'
              ? 'Add New Technology'
              : 'Add New Service Type'
            : activeTab === 'technologies'
            ? 'Edit Technology'
            : 'Edit Service Type'
        }
        description={`Define the name of the ${
          activeTab === 'technologies' ? 'technology' : 'service type'
        } as it should appear in proposal documents.`}
        size="md"
      >
        <form onSubmit={handleSaveItem} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              {activeTab === 'technologies' ? 'Technology Name' : 'Service Type Name'}{' '}
              <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
                if (itemError) setItemError('')
              }}
              placeholder={
                activeTab === 'technologies'
                  ? 'e.g. TypeScript, React, Next.js, MySQL'
                  : 'e.g. AI Solutions Consulting, Web App Development'
              }
              autoFocus
              className="w-full"
            />
            {itemError && (
              <p className="text-[11px] text-red-600 mt-1 font-medium">{itemError}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSaving || !itemName.trim()}
              icon={isSaving ? Loader2 : Plus}
              className={isSaving ? 'cursor-wait' : ''}
            >
              {isSaving
                ? 'Saving...'
                : modalMode === 'create'
                ? activeTab === 'technologies'
                  ? 'Add Technology'
                  : 'Add Service Type'
                : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={`Delete ${activeTab === 'technologies' ? 'Technology' : 'Service Type'}`}
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText={isDeleting ? 'Deleting...' : 'Delete Item'}
        confirmVariant="danger"
        loading={isDeleting}
      />
    </div>
  )
}

export default TechServicesPage

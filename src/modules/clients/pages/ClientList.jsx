import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  Building2,
  FileText,
  UserCheck,
} from 'lucide-react'
import { useClients } from '../hooks/useClients'
import ClientTable from '../components/ClientTable'
import ClientCard from '../components/ClientCard'
import ClientSearch from '../components/ClientSearch'
import ClientActions from '../components/ClientActions'
import ClientDetails from '../components/ClientDetails'
import {
  StatsCard,
  Modal,
  ConfirmDialog,
  Pagination,
  EmptyState,
} from '../../../components/common'

export const ClientList = () => {
  const navigate = useNavigate()
  const {
    fetchClients,
    filteredClients,
    paginatedClients,
    totalPages,
    currentPage,
    setCurrentPage,
    selectedClientIds,
    setSelectedClientIds,
    filters,
    setFilters,
    stats,
    isLoading,
    deleteClient,
    handleSort,
  } = useClients()

  const [viewMode, setViewMode] = useState('table') // 'table' | 'grid'
  const [activeClientModal, setActiveClientModal] = useState(null)
  const [clientToDelete, setClientToDelete] = useState(null)

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  const handleDeleteConfirm = async () => {
    if (!clientToDelete) return
    await deleteClient(clientToDelete.id)
    setClientToDelete(null)
    if (activeClientModal?.id === clientToDelete.id) {
      setActiveClientModal(null)
    }
  }

  const handleBulkDelete = async () => {
    for (const id of selectedClientIds) {
      await deleteClient(id)
    }
    setSelectedClientIds([])
  }

  const handleCreateProposalForClient = (client) => {
    // Navigate to create proposal with prefilled client context
    navigate('/proposals/new', { state: { prefilledClient: client } })
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Client Directory & Accounts
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Manage your client organizations, authorized contacts, legal tax registrations, and proposal records.
          </p>
        </div>

        <ClientActions
          onNewClient={() => navigate('/clients/new')}
          selectedCount={selectedClientIds.length}
          onDeleteSelected={handleBulkDelete}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Clients"
          value={stats.totalClients}
          icon={Building2}
          description="Organizations registered"
        />
        <StatsCard
          title="Active Accounts"
          value={stats.activeClients}
          icon={UserCheck}
          description="Contracted partners"
        />
        <StatsCard
          title="Prospective Leads"
          value={stats.leads}
          icon={Users}
          description="Awaiting proposals"
        />
        <StatsCard
          title="Proposals Issued"
          value={stats.totalProposals}
          icon={FileText}
          description="Across all client accounts"
        />
      </div>

      {/* Filter & Search Bar */}
      <ClientSearch
        filters={filters}
        onChange={setFilters}
      />

      {/* Clients Display: Table vs Grid */}
      {filteredClients.length === 0 && !isLoading ? (
        <EmptyState
          icon={Building2}
          title="No clients found"
          description="Try modifying your search keywords or filter criteria, or add a new client to get started."
          actionText="Add New Client"
          onAction={() => navigate('/clients/new')}
        />
      ) : viewMode === 'table' ? (
        <ClientTable
          clients={paginatedClients}
          selectedIds={selectedClientIds}
          onSelectRow={(id) => {
            setSelectedClientIds(
              selectedClientIds.includes(id)
                ? selectedClientIds.filter((item) => item !== id)
                : [...selectedClientIds, id]
            )
          }}
          onSelectAll={(ids) => setSelectedClientIds(ids)}
          onView={(c) => setActiveClientModal(c)}
          onEdit={(c) => navigate(`/clients/${c.id}/edit`)}
          onDelete={(c) => setClientToDelete(c)}
          onCreateProposal={handleCreateProposalForClient}
          sortColumn={filters.sortBy}
          sortDirection={filters.sortDirection}
          onSort={handleSort}
          loading={isLoading}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedClients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onView={(c) => setActiveClientModal(c)}
              onEdit={(c) => navigate(`/clients/${c.id}/edit`)}
              onDelete={(c) => setClientToDelete(c)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredClients.length > 0 && totalPages > 1 && (
        <div className="flex justify-center pt-2">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Complete Client Details Modal */}
      <Modal
        isOpen={Boolean(activeClientModal)}
        onClose={() => setActiveClientModal(null)}
        title="Client Profile Details"
        description="Comprehensive organization details, contact information, and billing configuration."
        size="lg"
      >
        {activeClientModal && (
          <ClientDetails
            client={activeClientModal}
            onEdit={(c) => {
              setActiveClientModal(null)
              navigate(`/clients/${c.id}/edit`)
            }}
            onDelete={(c) => {
              setClientToDelete(c)
            }}
            onCreateProposal={(c) => {
              setActiveClientModal(null)
              handleCreateProposalForClient(c)
            }}
          />
        )}
      </Modal>

      {/* Delete Client Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(clientToDelete)}
        onClose={() => setClientToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Client Record"
        description={`Are you sure you want to delete "${clientToDelete?.companyName}" (${clientToDelete?.name})? All contact details will be removed.`}
        variant="danger"
        confirmText="Delete Client"
      />
    </div>
  )
}

export default ClientList

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  FileText,
  DollarSign,
  Clock,
  CheckCircle2,
} from 'lucide-react'
import useProposalStore from '../store/proposalStore'
import ProposalTable from '../components/ProposalTable'
import {
  Button,
  SearchInput,
  Select,
  StatsCard,
  ConfirmDialog,
  Pagination,
} from '../../../components/common'
import {
  PROPOSAL_STATUSES,
  calculateProposalTotals,
  formatCurrency,
} from '../utils/proposalHelpers'

export const ProposalList = () => {
  const navigate = useNavigate()
  const {
    proposals,
    isLoading,
    fetchProposals,
    deleteProposal,
    duplicateProposal,
    downloadPdf,
    updateProposalStatus,
    selectedProposalIds,
    setSelectedProposalIds,
    filters,
    setFilters,
  } = useProposalStore()

  const [proposalToDelete, setProposalToDelete] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8

  // Initial load and 5-second background refresh (without loading spinner)
  useEffect(() => {
    fetchProposals()

    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return
      fetchProposals({}, { silent: true })
    }, 5000)

    return () => clearInterval(interval)
  }, [fetchProposals])

  // Ensure proposals is safely an array excluding any deleted records
  const safeProposals = (Array.isArray(proposals) ? proposals : []).filter(
    (p) => p && typeof p === 'object' && !p.deleted_at && !p.deletedAt
  )

  // Aggregate stats across proposals
  const stats = (() => {
    let totalVal = 0
    let acceptedVal = 0
    let pendingCount = 0
    let acceptedCount = 0

    safeProposals.forEach((p) => {
      if (!p || typeof p !== 'object' || p.deleted_at || p.deletedAt) return
      const val = Number(
        p.grand_total ??
        p.grandTotal ??
        p.pricing?.grandTotal ??
        p.pricing?.grand_total ??
        calculateProposalTotals(p.pricing || p).grandTotal
      ) || 0
      totalVal += val
      const st = String(p.status || 'draft').toLowerCase().trim()
      if (['accepted', 'signed', 'approved'].includes(st)) {
        acceptedVal += val
        acceptedCount += 1
      } else if (['draft', 'sent', 'proposal_sent', 'viewed', 'under_review', 'need_time', 'new'].includes(st)) {
        pendingCount += 1
      }
    })

    const acceptanceRate =
      safeProposals.length > 0
        ? ((acceptedCount / safeProposals.length) * 100).toFixed(1)
        : '0.0'

    return {
      totalCount: safeProposals.length,
      pipelineValue: totalVal,
      acceptedValue: acceptedVal,
      acceptanceRate: `${acceptanceRate}%`,
      pendingCount,
    }
  })()

  // Filter proposals by search and status
  const filteredProposals = safeProposals.filter((p) => {
    if (!p || typeof p !== 'object' || p.deleted_at || p.deletedAt) return false
    const q = (filters?.search || '').toLowerCase().trim()
    const matchesSearch =
      !q ||
      p.title?.toLowerCase().includes(q) ||
      p.number?.toLowerCase().includes(q) ||
      p.proposal_number?.toLowerCase().includes(q) ||
      p.client?.name?.toLowerCase().includes(q) ||
      p.client?.client_name?.toLowerCase().includes(q) ||
      p.client?.companyName?.toLowerCase().includes(q) ||
      p.client?.company_name?.toLowerCase().includes(q)

    const targetStatus = (filters?.status || 'all').toLowerCase().trim()
    const pStatus = String(p.status || 'draft').toLowerCase().trim()
    const matchesStatus =
      !filters?.status ||
      targetStatus === 'all' ||
      pStatus === targetStatus ||
      (targetStatus === 'draft' && (pStatus === 'draft' || pStatus === 'new')) ||
      (targetStatus === 'sent' && (pStatus === 'sent' || pStatus === 'proposal_sent' || pStatus === 'proposal_send')) ||
      (targetStatus === 'proposal_sent' && (pStatus === 'sent' || pStatus === 'proposal_sent' || pStatus === 'proposal_send')) ||
      (targetStatus === 'viewed' && (pStatus === 'viewed' || pStatus === 'need_time' || pStatus === 'under_review')) ||
      (targetStatus === 'need_time' && (pStatus === 'viewed' || pStatus === 'need_time' || pStatus === 'under_review')) ||
      (targetStatus === 'accepted' && (pStatus === 'accepted' || pStatus === 'signed' || pStatus === 'approved')) ||
      (targetStatus === 'signed' && (pStatus === 'accepted' || pStatus === 'signed' || pStatus === 'approved')) ||
      (targetStatus === 'rejected' && (pStatus === 'rejected' || pStatus === 'declined' || pStatus === 'expired'))

    return matchesSearch && matchesStatus
  })

  // Paginate filtered items
  const maxPage = Math.max(1, Math.ceil(filteredProposals.length / pageSize))
  useEffect(() => {
    if (currentPage > maxPage) {
      setCurrentPage(maxPage)
    }
  }, [currentPage, maxPage])

  const paginatedProposals = filteredProposals.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const statusFilterOptions = [
    { value: 'all', label: 'All Statuses' },
    ...PROPOSAL_STATUSES.map((s) => ({ value: s.value, label: s.label })),
  ]

  const handleDeleteConfirm = async () => {
    if (!proposalToDelete) return
    await deleteProposal(proposalToDelete.id)
    setProposalToDelete(null)
  }

  const handleDuplicate = async (proposal) => {
    const clone = await duplicateProposal(proposal.id)
    navigate(`/proposals/${clone.id}/edit`)
  }

  return (
    <div className="space-y-6">
      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Proposals & Commercial Offers
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Author, itemize, review, track and export business proposals with exact A4 page formatting.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            onClick={() => navigate('/proposals/new')}
            icon={Plus}
            className="font-semibold"
          >
            Create Proposal
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Proposals"
          value={stats.totalCount}
          icon={FileText}
          description="Across all deal stages"
        />
        <StatsCard
          title="Active Pipeline Value"
          value={formatCurrency(stats.pipelineValue, 'INR')}
          icon={DollarSign}
          trend={{ value: '14.2%', positive: true }}
          description="Total proposal valuation"
        />
        <StatsCard
          title="Won / Signed Value"
          value={formatCurrency(stats.acceptedValue, 'INR')}
          icon={CheckCircle2}
          trend={{ value: `${stats.acceptanceRate} win rate`, positive: true }}
          description="Contracted revenue"
        />
        <StatsCard
          title="Awaiting Response"
          value={stats.pendingCount}
          icon={Clock}
          description="In review or draft"
        />
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-80">
          <SearchInput
            placeholder="Search proposals, numbers, clients..."
            value={typeof filters.search === 'string' ? filters.search : ''}
            onChange={(e) => {
              const val = typeof e === 'string' ? e : e?.target?.value ?? ''
              setFilters({ search: val })
            }}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs font-semibold text-gray-500 hidden sm:inline">
            Status:
          </span>
          <div className="w-48">
            <Select
              options={statusFilterOptions}
              value={filters.status || 'all'}
              onChange={(val) => setFilters({ status: val })}
              placeholder="Filter by status"
            />
          </div>
        </div>
      </div>

      {/* Proposals DataTable */}
      <ProposalTable
        proposals={paginatedProposals}
        selectedIds={selectedProposalIds}
        onSelectRow={(id) => {
          setSelectedProposalIds(
            selectedProposalIds.includes(id)
              ? selectedProposalIds.filter((item) => item !== id)
              : [...selectedProposalIds, id]
          )
        }}
        onSelectAll={(ids) => setSelectedProposalIds(ids)}
        onView={(p) => navigate(`/proposals/${p.id}/preview`)}
        onEdit={(p) => navigate(`/proposals/${p.id}/edit`)}
        onDuplicate={handleDuplicate}
        onDelete={(p) => setProposalToDelete(p)}
        onDownloadPdf={(p) => downloadPdf(p.id)}
        onStatusChange={async (id, newStatus) => {
          await updateProposalStatus(id, newStatus)
        }}
        loading={isLoading}
      />

      {/* Pagination */}
      {filteredProposals.length > 0 && (
        <div className="pt-2">
          <Pagination
            page={currentPage}
            pageSize={pageSize}
            total={filteredProposals.length}
            onPageChange={setCurrentPage}
            showPageSizeSelector={false}
          />
        </div>
      )}

      {/* Delete Proposal Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(proposalToDelete)}
        onClose={() => setProposalToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Proposal"
        description={`Are you sure you want to delete proposal "${proposalToDelete?.title}" (${proposalToDelete?.number})? This action cannot be reversed.`}
        variant="danger"
        confirmText="Delete Proposal"
      />
    </div>
  )
}

export default ProposalList

import { Eye, Edit3, Copy, FileDown, Trash2, Building2 } from 'lucide-react'
import { DataTable, StatusBadge, ActionMenu } from '../../../components/common'
import { formatCurrency, calculateProposalTotals } from '../utils/proposalHelpers'

export const ProposalTable = ({
  proposals = [],
  selectedIds = [],
  onSelectRow = () => {},
  onSelectAll = () => {},
  onView = () => {},
  onEdit = () => {},
  onDuplicate = () => {},
  onDelete = () => {},
  onDownloadPdf = () => {},
  loading = false,
  className = '',
}) => {
  const columns = [
    {
      key: 'number',
      header: 'Proposal #',
      sortable: true,
      render: (row) => {
        const r = row && typeof row === 'object' ? row : {}
        return (
          <div className="flex flex-col">
            <span className="font-mono font-bold text-xs text-gray-900 group-hover:text-[#FB6C00] transition-colors">
              {r.number || '—'}
            </span>
            <span className="text-[11px] text-gray-400">
              {r.date || 'No Date'}
            </span>
          </div>
        )
      },
    },
    {
      key: 'title',
      header: 'Proposal Title & Project',
      sortable: true,
      render: (row) => {
        const r = row && typeof row === 'object' ? row : {}
        return (
          <div className="max-w-[280px]">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-gray-900 truncate text-xs">
                {r.title || 'Untitled Proposal'}
              </span>
              <span
                className={`text-[9.5px] font-semibold px-1.5 py-0.5 rounded shrink-0 border ${
                  r.proposalType === 'b2b' || r.showCompanyLogo === false
                    ? 'bg-blue-50 text-[#0055FF] border-blue-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                {r.proposalType === 'b2b' || r.showCompanyLogo === false ? 'B2B' : 'Direct'}
              </span>
            </div>
            {r.projectName && (
              <span className="text-[11px] text-gray-400 block truncate">
                {r.projectName}
              </span>
            )}
          </div>
        )
      },
    },
    {
      key: 'client',
      header: 'Client / Organization',
      sortable: true,
      render: (row) => {
        const r = row && typeof row === 'object' ? row : {}
        return (
          <div className="flex items-center gap-2 max-w-[200px]">
            <div className="w-6 h-6 rounded-lg bg-blue-50 text-[#0055FF] flex items-center justify-center shrink-0">
              <Building2 className="w-3.5 h-3.5" />
            </div>
            <div className="truncate">
              <span className="text-xs font-semibold text-gray-800 block truncate">
                {r.client?.companyName || r.client?.name || 'N/A'}
              </span>
              {r.client?.name && r.client?.companyName && (
                <span className="text-[10px] text-gray-400 block truncate">
                  {r.client.name}
                </span>
              )}
            </div>
          </div>
        )
      },
    },
    {
      key: 'total',
      header: 'Value / Grand Total',
      sortable: true,
      render: (row) => {
        const r = row && typeof row === 'object' ? row : {}
        const totals = calculateProposalTotals(r.pricing || {})
        const currency = r.pricing?.currency || r.currency || 'INR'
        return (
          <span className="font-bold text-xs text-gray-900">
            {formatCurrency(totals.grandTotal, currency)}
          </span>
        )
      },
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => {
        const r = row && typeof row === 'object' ? row : {}
        return <StatusBadge status={r.status || 'draft'} />
      },
    },
    {
      key: 'validUntil',
      header: 'Valid Until',
      sortable: true,
      render: (row) => {
        const r = row && typeof row === 'object' ? row : {}
        return (
          <span className="text-xs text-gray-600">
            {r.validUntil || '—'}
          </span>
        )
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => {
        const r = row && typeof row === 'object' ? row : {}
        const actions = [
          {
            label: 'View A4 Preview',
            icon: Eye,
            onClick: () => onView(r),
          },
          {
            label: 'Edit Proposal',
            icon: Edit3,
            onClick: () => onEdit(r),
          },
          {
            label: 'Export PDF',
            icon: FileDown,
            onClick: () => onDownloadPdf(r),
          },
          {
            label: 'Duplicate',
            icon: Copy,
            onClick: () => onDuplicate(r),
          },
          {
            label: 'Delete',
            icon: Trash2,
            danger: true,
            onClick: () => onDelete(r),
          },
        ]

        return (
          <div
            className="flex items-center justify-end gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => onView(r)}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              title="Preview Proposal"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onEdit(r)}
              className="p-1.5 text-gray-400 hover:text-[#FB6C00] hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
              title="Edit Proposal"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <ActionMenu items={actions} align="right" />
          </div>
        )
      },
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={proposals}
      rowKey="id"
      selectable={true}
      selectedRows={selectedIds}
      onSelectRow={onSelectRow}
      onSelectAll={onSelectAll}
      loading={loading}
      emptyMessage="No proposals found"
      emptyDescription="Create your first proposal or adjust your filter parameters."
      onRowClick={(row) => onEdit(row)}
      className={className}
    />
  )
}

export default ProposalTable

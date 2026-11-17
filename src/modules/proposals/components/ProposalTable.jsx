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
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-mono font-bold text-xs text-gray-900 group-hover:text-[#FB6C00] transition-colors">
            {row.number}
          </span>
          <span className="text-[11px] text-gray-400">
            {row.date || 'No Date'}
          </span>
        </div>
      ),
    },
    {
      key: 'title',
      header: 'Proposal Title & Project',
      sortable: true,
      render: (row) => (
        <div className="max-w-[280px]">
          <span className="font-semibold text-gray-900 block truncate text-xs">
            {row.title}
          </span>
          {row.projectName && (
            <span className="text-[11px] text-gray-400 block truncate">
              {row.projectName}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'client',
      header: 'Client / Organization',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2 max-w-[200px]">
          <div className="w-6 h-6 rounded-lg bg-blue-50 text-[#0055FF] flex items-center justify-center shrink-0">
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <div className="truncate">
            <span className="text-xs font-semibold text-gray-800 block truncate">
              {row.client?.companyName || row.client?.name || 'N/A'}
            </span>
            {row.client?.name && row.client?.companyName && (
              <span className="text-[10px] text-gray-400 block truncate">
                {row.client.name}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'total',
      header: 'Value / Grand Total',
      sortable: true,
      render: (row) => {
        const totals = calculateProposalTotals(row.pricing || {})
        const currency = row.pricing?.currency || row.currency || 'INR'
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
      render: (row) => <StatusBadge status={row.status || 'draft'} />,
    },
    {
      key: 'validUntil',
      header: 'Valid Until',
      sortable: true,
      render: (row) => (
        <span className="text-xs text-gray-600">
          {row.validUntil || '—'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => {
        const actions = [
          {
            label: 'View A4 Preview',
            icon: Eye,
            onClick: () => onView(row),
          },
          {
            label: 'Edit Proposal',
            icon: Edit3,
            onClick: () => onEdit(row),
          },
          {
            label: 'Export PDF',
            icon: FileDown,
            onClick: () => onDownloadPdf(row),
          },
          {
            label: 'Duplicate',
            icon: Copy,
            onClick: () => onDuplicate(row),
          },
          {
            label: 'Delete',
            icon: Trash2,
            danger: true,
            onClick: () => onDelete(row),
          },
        ]

        return (
          <div
            className="flex items-center justify-end gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => onView(row)}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              title="Preview Proposal"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onEdit(row)}
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

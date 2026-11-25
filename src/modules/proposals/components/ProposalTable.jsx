import { Eye, Edit3, Copy, FileDown, Trash2, Building2 } from 'lucide-react'
import { DataTable } from '../../../components/common'
import { formatCurrency, calculateProposalTotals } from '../utils/proposalHelpers'
import { ProposalStatusDropdown } from './ProposalStatusDropdown'

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
  onStatusChange = () => {},
  loading = false,
  className = '',
}) => {
  const columns = [
    {
      key: 'number',
      header: 'Proposal #',
      title: 'Proposal #',
      sortable: true,
      render: (row) => {
        const r = row && typeof row === 'object' ? row : {}
        return (
          <div className="flex flex-col">
            <span className="font-mono font-bold text-xs text-gray-900 group-hover:text-[#0055FF] transition-colors">
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
      title: 'Proposal Title & Project',
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
                    ? 'bg-gray-100 text-gray-700 border-gray-200'
                    : 'bg-blue-50 text-[#0055FF] border-blue-200'
                }`}
              >
                {r.proposalType === 'b2b' || r.showCompanyLogo === false ? 'B2B (No Logo)' : 'Direct'}
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
      title: 'Client / Organization',
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
      title: 'Value / Grand Total',
      sortable: true,
      render: (row) => {
        const r = row && typeof row === 'object' ? row : {}
        const totals = calculateProposalTotals(r.pricing || r)
        const currency = r.currency || r.pricing?.currency || 'INR'
        const amount = Number(
          r.grand_total ??
          r.grandTotal ??
          r.pricing?.grandTotal ??
          r.pricing?.grand_total ??
          totals.grandTotal
        ) || 0
        return (
          <span className="font-bold text-xs text-gray-900">
            {formatCurrency(amount, currency)}
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
        return (
          <ProposalStatusDropdown
            status={r.status || 'draft'}
            onChange={(newStatus) => onStatusChange(r.id, newStatus)}
          />
        )
      },
    },
    {
      key: 'validUntil',
      header: 'Valid Until',
      title: 'Valid Until',
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
              title="Preview Proposal"
              aria-label="Preview Proposal"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onEdit(r)}
              className="p-1.5 text-gray-500 hover:text-[#0055FF] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
              title="Edit Proposal"
              aria-label="Edit Proposal"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDownloadPdf(r)}
              className="p-1.5 text-gray-500 hover:text-[#0055FF] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
              title="Download PDF"
              aria-label="Download PDF"
            >
              <FileDown className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDuplicate(r)}
              className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
              title="Duplicate Proposal"
              aria-label="Duplicate Proposal"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(r)}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Delete Proposal"
              aria-label="Delete Proposal"
            >
              <Trash2 className="w-4 h-4" />
            </button>
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

import { Eye, Edit3, Trash2, FilePlus } from 'lucide-react'
import { DataTable, Badge, ActionMenu } from '../../../components/common'
import { getClientInitials } from '../utils/clientHelpers'

export const ClientTable = ({
  clients = [],
  selectedIds = [],
  onSelectRow = () => {},
  onSelectAll = () => {},
  onView = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onCreateProposal = () => {},
  onSort,
  sortColumn,
  sortDirection,
  loading = false,
  className = '',
}) => {
  const columns = [
    {
      key: 'companyName',
      header: 'Company & Contact',
      title: 'Company & Contact',
      sortable: true,
      render: (row) => {
        const r = row && typeof row === 'object' ? row : {}
        const initials = getClientInitials(r.name, r.companyName)
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-xs text-[#0055FF] shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <span className="font-semibold text-xs text-gray-900 block truncate group-hover:text-[#0055FF] transition-colors">
                {r.companyName || '—'}
              </span>
              <span className="text-[11px] text-gray-500 block truncate">
                {r.name || '—'}
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
        return (
          <div className="text-xs text-gray-600">
            <span>{r.city || '—'}</span>
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
            {r.taxNumber || '—'}
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
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200">
            {r.proposalsCount || 0}
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
        const isLead = r.status === 'lead'
        const isInactive = r.status === 'inactive'
        return (
          <Badge
            variant={isLead ? 'warning' : isInactive ? 'neutral' : 'success'}
            size="sm"
          >
            {isLead ? 'Lead' : isInactive ? 'Inactive' : 'Active'}
          </Badge>
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
        const actions = [
          {
            label: 'View Profile',
            icon: Eye,
            onClick: () => onView(r),
          },
          {
            label: 'Edit Client',
            icon: Edit3,
            onClick: () => onEdit(r),
          },
          {
            label: 'Create Proposal',
            icon: FilePlus,
            onClick: () => onCreateProposal(r),
          },
          {
            label: 'Delete Client',
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
              title="View Client Profile"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onEdit(r)}
              className="p-1.5 text-gray-400 hover:text-[#0055FF] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
              title="Edit Client"
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
      data={clients}
      rowKey="id"
      selectable={true}
      selectedRows={selectedIds}
      onSelectRow={onSelectRow}
      onSelectAll={onSelectAll}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      onSort={onSort}
      loading={loading}
      emptyMessage="No clients found"
      emptyDescription="Add your first client to start creating professional proposals."
      onRowClick={(row) => onView(row)}
      className={className}
    />
  )
}

export default ClientTable

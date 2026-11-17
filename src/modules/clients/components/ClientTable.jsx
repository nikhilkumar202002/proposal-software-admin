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
      sortable: true,
      render: (row) => {
        const initials = getClientInitials(row.name, row.companyName)
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center font-bold text-xs text-[#FB6C00] shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <span className="font-semibold text-xs text-gray-900 block truncate group-hover:text-[#FB6C00] transition-colors">
                {row.companyName}
              </span>
              <span className="text-[11px] text-gray-500 block truncate">
                {row.name}
              </span>
            </div>
          </div>
        )
      },
    },
    {
      key: 'email',
      header: 'Contact Details',
      sortable: true,
      render: (row) => (
        <div className="min-w-0 max-w-[200px]">
          <span className="text-xs text-gray-800 block truncate">
            {row.email}
          </span>
          {row.phone && (
            <span className="text-[11px] text-gray-400 block truncate">
              {row.phone}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'city',
      header: 'Location',
      sortable: true,
      render: (row) => (
        <div className="text-xs text-gray-600">
          <span>{row.city || '—'}</span>
          {row.country && (
            <span className="text-gray-400 text-[11px] block">
              {row.country}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'taxNumber',
      header: 'Tax ID / GSTIN',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs text-gray-600">
          {row.taxNumber || '—'}
        </span>
      ),
    },
    {
      key: 'proposalsCount',
      header: 'Proposals',
      sortable: true,
      render: (row) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200">
          {row.proposalsCount || 0}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => {
        const isLead = row.status === 'lead'
        const isInactive = row.status === 'inactive'
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
      align: 'right',
      render: (row) => {
        const actions = [
          {
            label: 'View Profile',
            icon: Eye,
            onClick: () => onView(row),
          },
          {
            label: 'Edit Client',
            icon: Edit3,
            onClick: () => onEdit(row),
          },
          {
            label: 'Create Proposal',
            icon: FilePlus,
            onClick: () => onCreateProposal(row),
          },
          {
            label: 'Delete Client',
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
              title="View Client Profile"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onEdit(row)}
              className="p-1.5 text-gray-400 hover:text-[#FB6C00] hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
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

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  CheckCircle2,
  XCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  ArrowUpDown,
  SearchX,
} from 'lucide-react'
import UserAvatar from './UserAvatar'
import RoleBadge from './RoleBadge'
import UserStatusBadge from './UserStatusBadge'
import UserActions from './UserActions'
import DeleteUserModal from './DeleteUserModal'

export const UserTable = ({
  users = [],
  selectedIds = [],
  onToggleSelect = () => {},
  onSelectAll = () => {},
  onClearSelection = () => {},
  onDelete = () => {},
  onBulkDelete = () => {},
  onBulkUpdateStatus = () => {},
  onToggleStatus = () => {},
  currentPage = 1,
  pageSize = 6,
  onPageChange = () => {},
  onResetFilters = () => {},
  hasActiveFilters = false,
}) => {
  const navigate = useNavigate()
  const [userToDelete, setUserToDelete] = useState(null)
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false)

  const totalUsers = users.length
  const totalPages = Math.max(1, Math.ceil(totalUsers / pageSize))
  const startIndex = (currentPage - 1) * pageSize
  const paginatedUsers = users.slice(startIndex, startIndex + pageSize)

  const isAllPageSelected =
    paginatedUsers.length > 0 &&
    paginatedUsers.every((u) => selectedIds.includes(u.id))
  const isPartiallySelected =
    paginatedUsers.some((u) => selectedIds.includes(u.id)) && !isAllPageSelected

  const handleSelectAllOnPage = () => {
    if (isAllPageSelected) {
      // Unselect page items
      const pageIdSet = new Set(paginatedUsers.map((u) => u.id))
      const remaining = selectedIds.filter((id) => !pageIdSet.has(id))
      onSelectAll(remaining)
    } else {
      // Select all on page
      const combined = Array.from(
        new Set([...selectedIds, ...paginatedUsers.map((u) => u.id)])
      )
      onSelectAll(combined)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs overflow-hidden flex flex-col">
      {/* Bulk Action Bar (Visible when 1 or more users selected) */}
      {selectedIds.length > 0 && (
        <div className="bg-blue-50/90 border-b border-blue-100 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#0055FF] text-white text-[11px] font-bold flex items-center justify-center">
              {selectedIds.length}
            </span>
            <span className="text-xs font-semibold text-gray-900">
              {selectedIds.length === 1 ? '1 user selected' : `${selectedIds.length} users selected`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onBulkUpdateStatus(selectedIds, 'active')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer shadow-2xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Activate</span>
            </button>

            <button
              type="button"
              onClick={() => onBulkUpdateStatus(selectedIds, 'inactive')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-amber-200 text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer shadow-2xs"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Deactivate</span>
            </button>

            <button
              type="button"
              onClick={() => setIsBulkDeleteModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer shadow-2xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>

            <button
              type="button"
              onClick={onClearSelection}
              className="text-xs font-medium text-gray-500 hover:text-gray-800 px-2 py-1 transition-colors cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Responsive Table Container */}
      <div className="overflow-x-auto min-w-full">
        <table className="min-w-full divide-y divide-gray-200/80 text-left text-xs">
          <thead className="bg-gray-50/80 font-semibold text-gray-600 select-none">
            <tr>
              <th scope="col" className="w-10 px-4 py-3.5">
                <input
                  type="checkbox"
                  checked={isAllPageSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isPartiallySelected
                  }}
                  onChange={handleSelectAllOnPage}
                  className="rounded border-gray-300 text-[#0055FF] focus:ring-[#0055FF]/30 cursor-pointer w-3.5 h-3.5"
                  title="Select all on this page"
                />
              </th>
              <th scope="col" className="px-4 py-3.5 font-semibold text-gray-700">
                User
              </th>
              <th scope="col" className="px-4 py-3.5 font-semibold text-gray-700">
                Role
              </th>
              <th scope="col" className="px-4 py-3.5 font-semibold text-gray-700">
                Status
              </th>
              <th scope="col" className="px-4 py-3.5 font-semibold text-gray-700 hidden md:table-cell">
                Last Login
              </th>
              <th scope="col" className="px-4 py-3.5 font-semibold text-gray-700 hidden lg:table-cell">
                Created Date
              </th>
              <th scope="col" className="w-16 px-4 py-3.5 text-right font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => {
                const isSelected = selectedIds.includes(user.id)

                return (
                  <tr
                    key={user.id}
                    onClick={() => navigate(`/users/${user.id}`)}
                    className={`group hover:bg-gray-50/70 transition-colors cursor-pointer ${
                      isSelected ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td
                      className="px-4 py-3.5"
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleSelect(user.id)
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="rounded border-gray-300 text-[#0055FF] focus:ring-[#0055FF]/30 cursor-pointer w-3.5 h-3.5"
                      />
                    </td>

                    {/* User Info (Avatar, Name, Email) */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          src={user.avatar}
                          name={user.name}
                          email={user.email}
                          size="md"
                          status={user.status}
                        />
                        <div className="min-w-0">
                          <span className="block font-bold text-gray-900 group-hover:text-[#0055FF] transition-colors truncate">
                            {user.name}
                          </span>
                          <span className="block text-gray-400 text-[11px] truncate mt-0.5">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <RoleBadge role={user.role} size="sm" />
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <UserStatusBadge status={user.status} size="sm" />
                    </td>

                    {/* Last Login */}
                    <td className="px-4 py-3.5 whitespace-nowrap text-gray-500 hidden md:table-cell">
                      {user.lastLogin || 'Never'}
                    </td>

                    {/* Created Date */}
                    <td className="px-4 py-3.5 whitespace-nowrap text-gray-500 hidden lg:table-cell">
                      {user.createdAt}
                    </td>

                    {/* Actions Menu */}
                    <td
                      className="px-4 py-3.5 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <UserActions
                        user={user}
                        onDelete={(targetUser) => setUserToDelete(targetUser)}
                        onToggleStatus={onToggleStatus}
                      />
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center">
                  <div className="max-w-sm mx-auto flex flex-col items-center">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                      {hasActiveFilters ? (
                        <SearchX className="w-6 h-6" />
                      ) : (
                        <Users className="w-6 h-6" />
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-gray-900">
                      {hasActiveFilters ? 'No Matching Users Found' : 'No Team Members Yet'}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 max-w-xs">
                      {hasActiveFilters
                        ? 'Try modifying your search keywords or clear current filters.'
                        : 'Get started by inviting your first team member to collaborate.'}
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      {hasActiveFilters ? (
                        <button
                          type="button"
                          onClick={onResetFilters}
                          className="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                          Clear Filters
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => navigate('/users/create')}
                          className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#0055FF] text-white hover:bg-[#0044CC] cursor-pointer flex items-center gap-1.5"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Add New User</span>
                        </button>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {totalUsers > 0 && (
        <div className="px-4 py-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 bg-white">
          <span>
            Showing <strong className="text-gray-900 font-semibold">{startIndex + 1}</strong> to{' '}
            <strong className="text-gray-900 font-semibold">
              {Math.min(startIndex + pageSize, totalUsers)}
            </strong>{' '}
            of <strong className="text-gray-900 font-semibold">{totalUsers}</strong> team members
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  page === currentPage
                    ? 'bg-[#0055FF] text-white shadow-2xs'
                    : 'text-gray-600 hover:bg-gray-100 border border-transparent'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Single User Delete Confirmation Modal */}
      <DeleteUserModal
        isOpen={Boolean(userToDelete)}
        user={userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={() => {
          if (userToDelete) {
            onDelete(userToDelete.id)
            setUserToDelete(null)
          }
        }}
      />

      {/* Bulk Delete Confirmation Modal */}
      <DeleteUserModal
        isOpen={isBulkDeleteModalOpen}
        bulkCount={selectedIds.length}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={() => {
          onBulkDelete(selectedIds)
          setIsBulkDeleteModalOpen(false)
        }}
      />
    </div>
  )
}

export default UserTable

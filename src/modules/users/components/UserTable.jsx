import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  CheckCircle2,
  XCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  SearchX,
  Loader2,
  RefreshCw,
} from 'lucide-react'
import UserAvatar from './UserAvatar'
import RoleBadge from './RoleBadge'
import UserActions from './UserActions'
import DeleteUserModal from './DeleteUserModal'
import useUserStore from '../store/userStore'
import userService, { normalizeUser } from '../../../services/user.service'

export const UserTable = ({
  users: propUsers,
  selectedIds: propSelectedIds,
  onToggleSelect: propOnToggleSelect,
  onSelectAll: propOnSelectAll,
  onClearSelection: propOnClearSelection,
  onDelete: propOnDelete,
  onBulkDelete: propOnBulkDelete,
  onBulkUpdateStatus: propOnBulkUpdateStatus,
  onToggleStatus: propOnToggleStatus,
  currentPage: propCurrentPage,
  pageSize = 6,
  onPageChange: propOnPageChange,
  onResetFilters = () => {},
  hasActiveFilters = false,
  isLoading: propIsLoading,
  autoFetch = true,
}) => {
  const navigate = useNavigate()

  // Store access
  const store = useUserStore()

  // Internal state for standalone usage
  const [internalPage, setInternalPage] = useState(1)
  const [internalSelectedIds, setInternalSelectedIds] = useState([])
  const [internalLoading, setInternalLoading] = useState(false)
  const [updatingUserIds, setUpdatingUserIds] = useState(new Set())
  const [userToDelete, setUserToDelete] = useState(null)
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false)

  // Direct API fetch to /admin/users if users prop is not provided + 5s background refresh
  useEffect(() => {
    if (propUsers === undefined && autoFetch) {
      if (typeof store.fetchUsers === 'function') {
        store.fetchUsers()

        const interval = setInterval(() => {
          if (typeof document !== 'undefined' && document.hidden) return
          store.fetchUsers({}, { silent: true })
        }, 5000)

        return () => clearInterval(interval)
      } else {
        setInternalLoading(true)
        userService
          .getUsers()
          .catch((err) => {
            console.error('Failed to load users from /admin/users:', err)
          })
          .finally(() => {
            setInternalLoading(false)
          })
      }
    }
  }, [propUsers, autoFetch, store])

  // Normalize and unpack users (supports { data: { users: [...] } }, { users: [...] }, or raw API array)
  const normalizedUsers = useMemo(() => {
    let source = propUsers !== undefined ? propUsers : store.users

    // If source is a full Laravel API response object: { success: true, data: { users: [...] } }
    if (source && typeof source === 'object' && !Array.isArray(source)) {
      if (Array.isArray(source.data?.users)) {
        source = source.data.users
      } else if (Array.isArray(source.users)) {
        source = source.users
      } else if (Array.isArray(source.data)) {
        source = source.data
      }
    }

    if (!Array.isArray(source)) return []

    return source.map((item) => {
      if (!item) return null
      // If already normalized
      if (item.createdAt && item.role && item.lastLogin) return item
      // Normalize raw Laravel API user
      return normalizeUser(item)
    }).filter(Boolean)
  }, [propUsers, store.users])

  // Active selection
  const selectedIds =
    propSelectedIds !== undefined ? propSelectedIds : (store.selectedUserIds || internalSelectedIds)

  const isUserIdSelected = (id) =>
    selectedIds.some((sid) => String(sid) === String(id))

  // Pagination calculations
  const currentPage = propCurrentPage !== undefined ? propCurrentPage : internalPage
  const handlePageChange = propOnPageChange || setInternalPage

  const totalUsers = normalizedUsers.length
  const totalPages = Math.max(1, Math.ceil(totalUsers / pageSize))
  const startIndex = (currentPage - 1) * pageSize
  const paginatedUsers = normalizedUsers.slice(startIndex, startIndex + pageSize)

  const isAllPageSelected =
    paginatedUsers.length > 0 &&
    paginatedUsers.every((u) => isUserIdSelected(u.id))
  const isPartiallySelected =
    paginatedUsers.some((u) => isUserIdSelected(u.id)) && !isAllPageSelected

  // Selection handlers
  const handleToggleSelect = (id) => {
    if (propOnToggleSelect) {
      propOnToggleSelect(id)
    } else if (store.toggleSelectUser) {
      store.toggleSelectUser(id)
    } else {
      const idStr = String(id)
      setInternalSelectedIds((prev) =>
        prev.some((sid) => String(sid) === idStr)
          ? prev.filter((sid) => String(sid) !== idStr)
          : [...prev, id]
      )
    }
  }

  const handleSelectAll = (ids) => {
    if (propOnSelectAll) {
      propOnSelectAll(ids)
    } else if (store.selectAllUsers) {
      store.selectAllUsers(ids)
    } else {
      setInternalSelectedIds(ids)
    }
  }

  const handleClearSelection = () => {
    if (propOnClearSelection) {
      propOnClearSelection()
    } else if (store.clearSelection) {
      store.clearSelection()
    } else {
      setInternalSelectedIds([])
    }
  }

  const handleSelectAllOnPage = () => {
    if (isAllPageSelected) {
      const pageIdSet = new Set(paginatedUsers.map((u) => String(u.id)))
      const remaining = selectedIds.filter((id) => !pageIdSet.has(String(id)))
      handleSelectAll(remaining)
    } else {
      const combined = Array.from(
        new Set([...selectedIds, ...paginatedUsers.map((u) => u.id)])
      )
      handleSelectAll(combined)
    }
  }

  // Action handlers
  const handleDelete = (id) => {
    if (propOnDelete) {
      propOnDelete(id)
    } else if (store.deleteUser) {
      store.deleteUser(id)
    }
  }

  const handleBulkDelete = (ids) => {
    if (propOnBulkDelete) {
      propOnBulkDelete(ids)
    } else if (store.bulkDelete) {
      store.bulkDelete(ids)
    }
  }

  const handleBulkUpdateStatus = (ids, status) => {
    if (propOnBulkUpdateStatus) {
      propOnBulkUpdateStatus(ids, status)
    } else if (store.bulkUpdateStatus) {
      store.bulkUpdateStatus(ids, status)
    }
  }

  const handleToggleStatus = async (id, newStatus) => {
    setUpdatingUserIds((prev) => new Set(prev).add(id))
    try {
      if (propOnToggleStatus) {
        await propOnToggleStatus(id, newStatus)
      } else if (store.updateUserStatus) {
        await store.updateUserStatus(id, newStatus)
      } else {
        await userService.updateUserStatus(id, newStatus)
      }
    } finally {
      setUpdatingUserIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  const isLoading =
    propIsLoading !== undefined
      ? propIsLoading
      : (store.isLoading || internalLoading)

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs overflow-hidden flex flex-col">
      {/* Bulk Action Bar */}
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
              onClick={() => handleBulkUpdateStatus(selectedIds, 'active')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer shadow-2xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Activate</span>
            </button>

            <button
              type="button"
              onClick={() => handleBulkUpdateStatus(selectedIds, 'inactive')}
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
              onClick={handleClearSelection}
              className="text-xs font-medium text-gray-500 hover:text-gray-800 px-2 py-1 transition-colors cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Responsive Table */}
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
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Loader2 className="w-7 h-7 text-[#0055FF] animate-spin mb-2" />
                    <span className="text-xs text-gray-500 font-medium">Loading user list from API...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => {
                const isSelected = isUserIdSelected(user.id)
                const userRole = user.role || (Array.isArray(user.roles) ? user.roles[0] : 'viewer')

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
                        handleToggleSelect(user.id)
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
                      <RoleBadge role={userRole} size="sm" />
                    </td>

                    {/* Status with Toggle */}
                    <td
                      className="px-4 py-3.5 whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={user.status === 'active'}
                          disabled={updatingUserIds.has(user.id)}
                          onClick={() =>
                            handleToggleStatus(
                              user.id,
                              user.status === 'active' ? 'inactive' : 'active'
                            )
                          }
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 ${
                            user.status === 'active' ? 'bg-emerald-500' : 'bg-gray-300'
                          } ${updatingUserIds.has(user.id) ? 'opacity-60 cursor-wait' : ''}`}
                          title={`Click to set status to ${
                            user.status === 'active' ? 'Inactive' : 'Active'
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none flex items-center justify-center h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                              user.status === 'active' ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          >
                            {updatingUserIds.has(user.id) && (
                              <Loader2 className="w-2.5 h-2.5 text-gray-500 animate-spin" />
                            )}
                          </span>
                        </button>
                      </div>
                    </td>

                    {/* Last Login */}
                    <td className="px-4 py-3.5 whitespace-nowrap text-gray-500 hidden md:table-cell">
                      {user.lastLogin || 'Never'}
                    </td>

                    {/* Created Date */}
                    <td className="px-4 py-3.5 whitespace-nowrap text-gray-500 hidden lg:table-cell">
                      {user.createdAt || ''}
                    </td>

                    {/* Actions Menu */}
                    <td
                      className="px-4 py-3.5 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <UserActions
                        user={user}
                        onDelete={(targetUser) => setUserToDelete(targetUser)}
                        onToggleStatus={handleToggleStatus}
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
              onClick={() => handlePageChange(currentPage - 1)}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => handlePageChange(page)}
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
              onClick={() => handlePageChange(currentPage + 1)}
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
            handleDelete(userToDelete.id)
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
          handleBulkDelete(selectedIds)
          setIsBulkDeleteModalOpen(false)
        }}
      />
    </div>
  )
}

export default UserTable

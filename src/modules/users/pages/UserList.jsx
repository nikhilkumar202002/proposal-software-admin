import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, UserPlus, Users, CheckCircle2 } from 'lucide-react'
import useUserStore from '../store/userStore'
import UserStats from '../components/UserStats'
import UserSearch from '../components/UserSearch'
import UserFilters from '../components/UserFilters'
import UserTable from '../components/UserTable'

export const UserList = () => {
  const navigate = useNavigate()
  const {
    users,
    selectedUserIds,
    filters,
    currentPage,
    pageSize,
    isLoading,
    setFilters,
    resetFilters,
    setCurrentPage,
    fetchUsers,
    deleteUser,
    bulkDelete,
    bulkUpdateStatus,
    toggleSelectUser,
    selectAllUsers,
    clearSelection,
    updateUser,
    updateUserStatus,
  } = useUserStore()

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const [notification, setNotification] = useState(null)

  const showNotification = (message) => {
    setNotification(message)
    setTimeout(() => {
      setNotification(null)
    }, 3500)
  }

  // Filter & Sort logic
  const filteredUsers = useMemo(() => {
    let result = [...users]

    // 1. Search Query
    if (filters.search?.trim()) {
      const q = filters.search.toLowerCase().trim()
      result = result.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.phone?.toLowerCase().includes(q)
      )
    }

    // 2. Role Filter
    if (filters.role && filters.role !== 'all') {
      result = result.filter((u) => u.role === filters.role)
    }

    // 3. Status Filter
    if (filters.status && filters.status !== 'all') {
      result = result.filter((u) => u.status === filters.status)
    }

    // 4. Sorting
    result.sort((a, b) => {
      if (filters.sortBy === 'name') {
        const nameA = (a.name || '').toLowerCase()
        const nameB = (b.name || '').toLowerCase()
        return filters.sortDirection === 'asc'
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA)
      } else if (filters.sortBy === 'createdAt') {
        const dateA = new Date(a.createdAt || 0).getTime()
        const dateB = new Date(b.createdAt || 0).getTime()
        return filters.sortDirection === 'asc' ? dateA - dateB : dateB - dateA
      }
      return 0
    })

    return result
  }, [users, filters])

  const hasActiveFilters = Boolean(
    filters.search ||
      filters.role !== 'all' ||
      filters.status !== 'all' ||
      filters.sortBy !== 'name' ||
      filters.sortDirection !== 'asc'
  )

  const handleDeleteUser = async (id) => {
    await deleteUser(id)
    showNotification('User account deleted successfully.')
  }

  const handleBulkDelete = async (ids) => {
    await bulkDelete(ids)
    showNotification(`${ids.length} users deleted successfully.`)
  }

  const handleBulkUpdateStatus = async (ids, status) => {
    await bulkUpdateStatus(ids, status)
    showNotification(`${ids.length} users updated to ${status}.`)
  }

  const handleToggleStatus = async (id, newStatus) => {
    await updateUserStatus(id, newStatus)
    showNotification(`User marked as ${newStatus}.`)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-xl shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Page Heading & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-200/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              User Management
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0055FF] border border-blue-100 font-semibold">
              {users.length} members
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Manage team members, roles and access permissions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/users/create')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-[#0055FF] hover:bg-[#0044CC] text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer whitespace-nowrap"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <UserStats users={users} />

      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <UserSearch
          value={filters.search}
          onChange={(val) => setFilters({ search: val })}
          onClear={() => setFilters({ search: '' })}
        />

        <UserFilters
          role={filters.role}
          status={filters.status}
          sortBy={filters.sortBy}
          sortDirection={filters.sortDirection}
          onRoleChange={(r) => setFilters({ role: r })}
          onStatusChange={(s) => setFilters({ status: s })}
          onSortChange={(field, dir) =>
            setFilters({ sortBy: field, sortDirection: dir })
          }
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {/* Users Data Table */}
      <UserTable
        users={filteredUsers}
        selectedIds={selectedUserIds}
        onToggleSelect={toggleSelectUser}
        onSelectAll={selectAllUsers}
        onClearSelection={clearSelection}
        onDelete={handleDeleteUser}
        onBulkDelete={handleBulkDelete}
        onBulkUpdateStatus={handleBulkUpdateStatus}
        onToggleStatus={handleToggleStatus}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onResetFilters={resetFilters}
        hasActiveFilters={hasActiveFilters}
        isLoading={isLoading}
      />
    </div>
  )
}

export default UserList

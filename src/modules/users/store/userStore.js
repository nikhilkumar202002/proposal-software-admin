import { create } from 'zustand'
import { INITIAL_USERS, ROLES } from '../constants'
import userService, { ROLE_DISPLAY_NAMES } from '../../../services/user.service'

export const useUserStore = create((set, get) => ({
  users: INITIAL_USERS,
  selectedUserIds: [],
  filters: {
    search: '',
    role: 'all',
    status: 'all',
    sortBy: 'name', // 'name' | 'createdAt'
    sortDirection: 'asc', // 'asc' | 'desc'
  },
  currentPage: 1,
  pageSize: 6,
  isLoading: false,
  error: null,

  // --- Fetch Users from Backend (GET /admin/users) ---
  fetchUsers: async (customParams = {}, options = {}) => {
    const isSilent = Boolean(options.silent)
    if (!isSilent) {
      set({ isLoading: true, error: null })
    }
    try {
      const { search, role, status } = get().filters
      const queryParams = {}
      if (search?.trim()) queryParams.search = search.trim()
      if (role && role !== 'all') queryParams.role = role
      if (status && status !== 'all') queryParams.status = status
      Object.assign(queryParams, customParams)

      const apiUsers = await userService.getUsers(queryParams)
      if (Array.isArray(apiUsers)) {
        set({
          users: apiUsers,
          pagination: apiUsers.pagination || null,
          isLoading: false,
        })
        return apiUsers
      }
      set({ users: apiUsers || [], isLoading: false })
      return apiUsers
    } catch (err) {
      if (!isSilent) {
        console.warn('Backend GET /admin/users unavailable:', err.message)
        set({ isLoading: false, error: err.message, users: [] })
      }
      return []
    }
  },

  // --- Fetch Single User (GET /admin/users/:id) ---
  fetchUser: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const user = await userService.getUser(id)
      if (user) {
        set((state) => ({
          users: state.users.map((u) => (String(u.id) === String(id) ? user : u)),
          isLoading: false,
        }))
        return user
      }
    } catch (err) {
      console.warn(`Backend GET /admin/users/${id} unavailable:`, err.message)
      set({ isLoading: false, error: err.message })
    }
    return get().getUserById(id)
  },

  // Filters & Pagination
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      currentPage: 1,
    }))
  },

  resetFilters: () => {
    set({
      filters: {
        search: '',
        role: 'all',
        status: 'all',
        sortBy: 'name',
        sortDirection: 'asc',
      },
      currentPage: 1,
    })
  },

  setCurrentPage: (page) => set({ currentPage: page }),

  // --- Create User (POST /admin/users) ---
  addUser: async (userData) => {
    const roleConfig = ROLES[userData.role] || ROLES.editor
    set({ isLoading: true, error: null })

    try {
      const createdUser = await userService.createUser(userData)
      if (createdUser) {
        set((state) => ({
          users: [createdUser, ...state.users.filter((u) => String(u.id) !== String(createdUser.id))],
          isLoading: false,
        }))
        return createdUser
      }
    } catch (err) {
      console.warn('Backend POST /admin/users returned error, falling back to local creation:', err.message)
      set({ isLoading: false, error: err.message })
    }

    // Fallback local creation if backend not reachable
    const newUser = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: userData.name || 'New Team Member',
      email: userData.email || '',
      phone: userData.phone || '',
      avatar: userData.avatar || '',
      role: userData.role || 'editor',
      roles: Array.isArray(userData.roles) ? userData.roles : [ROLE_DISPLAY_NAMES[userData.role] || 'Editor'],
      status: userData.status || 'active',
      emailVerified: true,
      lastLogin: 'Never',
      createdAt: new Date().toISOString().split('T')[0],
      permissions: userData.permissions?.length ? userData.permissions : roleConfig.defaultPermissions,
      activityLog: [
        {
          id: `act-${Date.now()}`,
          event: `Account created with role ${roleConfig.name}`,
          timestamp: 'Just now',
          type: 'account',
        },
      ],
    }

    set((state) => ({
      users: [newUser, ...state.users],
      isLoading: false,
    }))

    return newUser
  },

  // --- Update User (PUT /admin/users/:id) ---
  updateUser: async (id, updatedFields) => {
    set({ isLoading: true, error: null })
    try {
      const updatedUser = await userService.updateUser(id, updatedFields)
      if (updatedUser) {
        set((state) => ({
          users: state.users.map((u) => (String(u.id) === String(id) ? updatedUser : u)),
          isLoading: false,
        }))
        return updatedUser
      }
    } catch (err) {
      console.warn(`Backend PUT /admin/users/${id} failed, applying local update:`, err.message)
      set({ isLoading: false, error: err.message })
    }

    // Local fallback
    set((state) => ({
      users: state.users.map((u) => {
        if (String(u.id) === String(id)) {
          const roleChanged = updatedFields.role && updatedFields.role !== u.role
          const statusChanged = updatedFields.status && updatedFields.status !== u.status
          const newActivities = [...(u.activityLog || [])]

          if (roleChanged) {
            newActivities.unshift({
              id: `act-${Date.now()}-role`,
              event: `Role updated to ${ROLES[updatedFields.role]?.name || updatedFields.role}`,
              timestamp: 'Just now',
              type: 'role',
            })
          }
          if (statusChanged) {
            newActivities.unshift({
              id: `act-${Date.now()}-status`,
              event: `Account status changed to ${updatedFields.status}`,
              timestamp: 'Just now',
              type: 'status',
            })
          }

          return {
            ...u,
            ...updatedFields,
            activityLog: newActivities,
          }
        }
        return u
      }),
      isLoading: false,
    }))
  },

  // --- Update Status (PATCH /admin/users/:id/status) ---
  updateUserStatus: async (id, status) => {
    try {
      const response = await userService.updateUserStatus(id, status)
      set((state) => ({
        users: state.users.map((u) =>
          String(u.id) === String(id) ? { ...u, status } : u
        ),
      }))
      return response
    } catch (err) {
      console.warn(`Backend PATCH /admin/users/${id}/status failed:`, err.message)
      throw err
    }
  },

  // --- Assign Roles (PUT /admin/users/:id/roles) ---
  assignUserRoles: async (id, roles) => {
    try {
      await userService.assignUserRoles(id, roles)
    } catch (err) {
      console.warn(`Backend PUT /admin/users/${id}/roles failed:`, err.message)
    }

    const firstRole = Array.isArray(roles) ? roles[0] : roles
    set((state) => ({
      users: state.users.map((u) =>
        String(u.id) === String(id)
          ? {
            ...u,
            role: String(firstRole).toLowerCase(),
            roles: Array.isArray(roles) ? roles : [roles],
          }
          : u
      ),
    }))
  },

  // --- Update Permissions (PUT /admin/users/:id/permissions) ---
  updateUserPermissions: async (id, permissions) => {
    try {
      await userService.updateUserPermissions(id, permissions)
    } catch (err) {
      console.warn(`Backend PUT /admin/users/${id}/permissions failed:`, err.message)
    }

    set((state) => ({
      users: state.users.map((u) =>
        String(u.id) === String(id) ? { ...u, permissions } : u
      ),
    }))
  },

  // --- Delete User (DELETE /admin/users/:id) ---
  deleteUser: async (id) => {
    try {
      await userService.deleteUser(id)
    } catch (err) {
      console.warn(`Backend DELETE /admin/users/${id} failed:`, err.message)
    }

    set((state) => ({
      users: state.users.filter((u) => String(u.id) !== String(id)),
      selectedUserIds: state.selectedUserIds.filter((uid) => String(uid) !== String(id)),
    }))
  },

  // --- Bulk Delete ---
  bulkDelete: async (ids = []) => {
    await Promise.allSettled(ids.map((id) => userService.deleteUser(id)))
    const idSet = new Set(ids.map(String))
    set((state) => ({
      users: state.users.filter((u) => !idSet.has(String(u.id))),
      selectedUserIds: state.selectedUserIds.filter((uid) => !idSet.has(String(uid))),
    }))
  },

  // --- Bulk Update Status ---
  bulkUpdateStatus: async (ids = [], newStatus = 'active') => {
    await Promise.allSettled(
      ids.map((id) => userService.updateUserStatus(id, newStatus))
    )
    const idSet = new Set(ids.map(String))
    set((state) => ({
      users: state.users.map((u) => {
        if (idSet.has(String(u.id))) {
          const newActivities = [...(u.activityLog || [])]
          newActivities.unshift({
            id: `act-${Date.now()}-bulk`,
            event: `Status changed to ${newStatus} via bulk action`,
            timestamp: 'Just now',
            type: 'status',
          })
          return {
            ...u,
            status: newStatus,
            activityLog: newActivities,
          }
        }
        return u
      }),
      selectedUserIds: [],
    }))
  },

  // Selection
  toggleSelectUser: (id) => {
    set((state) => {
      const idStr = String(id)
      const exists = state.selectedUserIds.some((uid) => String(uid) === idStr)
      return {
        selectedUserIds: exists
          ? state.selectedUserIds.filter((uid) => String(uid) !== idStr)
          : [...state.selectedUserIds, id],
      }
    })
  },

  selectAllUsers: (ids = []) => {
    set({ selectedUserIds: ids })
  },

  clearSelection: () => {
    set({ selectedUserIds: [] })
  },

  // Helpers
  getUserById: (id) => {
    return get().users.find((u) => String(u.id) === String(id))
  },
}))

export default useUserStore

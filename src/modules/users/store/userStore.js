import { create } from 'zustand'
import { INITIAL_USERS, ROLES } from '../data/usersData'

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

  // User Actions
  addUser: (userData) => {
    const roleConfig = ROLES[userData.role] || ROLES.editor
    const newUser = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: userData.name || 'New Team Member',
      email: userData.email || '',
      phone: userData.phone || '',
      avatar: userData.avatar || '',
      role: userData.role || 'editor',
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
    }))

    return newUser
  },

  updateUser: (id, updatedFields) => {
    set((state) => ({
      users: state.users.map((u) => {
        if (u.id === id) {
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
    }))
  },

  deleteUser: (id) => {
    set((state) => ({
      users: state.users.filter((u) => u.id !== id),
      selectedUserIds: state.selectedUserIds.filter((uid) => uid !== id),
    }))
  },

  bulkDelete: (ids = []) => {
    const idSet = new Set(ids)
    set((state) => ({
      users: state.users.filter((u) => !idSet.has(u.id)),
      selectedUserIds: state.selectedUserIds.filter((uid) => !idSet.has(uid)),
    }))
  },

  bulkUpdateStatus: (ids = [], newStatus = 'active') => {
    const idSet = new Set(ids)
    set((state) => ({
      users: state.users.map((u) => {
        if (idSet.has(u.id)) {
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
      const exists = state.selectedUserIds.includes(id)
      return {
        selectedUserIds: exists
          ? state.selectedUserIds.filter((uid) => uid !== id)
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
    return get().users.find((u) => u.id === id)
  },
}))

export default useUserStore

import { create } from 'zustand'
import { toast } from 'react-hot-toast'
import authService from '../services/auth.service'

// Helper to get initials from name
export const getInitials = (name = '') => {
  if (!name) return 'U'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// Retrieve cached user from localStorage (auth.service or legacy session)
const getInitialUser = () => {
  if (!authService.isSessionValid()) {
    authService.purgeSession()
    return null
  }

  const fromAuthService = authService.getUser()
  if (fromAuthService) return fromAuthService

  try {
    const fromSession = localStorage.getItem('proposalos_session')
    if (fromSession) {
      const parsed = JSON.parse(fromSession)
      if (parsed?.user) return parsed.user
    }
  } catch {
    // fallback
  }

  return null
}

export const useAuthStore = create((set, get) => ({
  user: getInitialUser(),
  isLoading: false,
  error: null,

  fetchCurrentUser: async () => {
    // Only attempt fetch if token exists or in normal flow
    set({ isLoading: true, error: null })
    try {
      const data = await authService.getCurrentUser()
      const userData = data?.user || data
      if (userData && typeof userData === 'object') {
        set({ user: userData, isLoading: false })
        return userData
      }
    } catch (err) {
      // If 401 or network error, keep current cached user without breaking UI
      console.warn('Could not fetch logged-in user profile from /user:', err.message)
      set({ error: err.message, isLoading: false })
    }
    return get().user
  },

  setUser: (user) => {
    authService.setUser(user)
    set({ user })
  },

  updateProfile: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authService.updateProfile(data)
      const updatedUser = response?.data?.user || response?.data || response
      if (updatedUser && typeof updatedUser === 'object') {
        authService.setUser(updatedUser)
        set({ user: updatedUser, isLoading: false })
      } else {
        set({ isLoading: false })
      }
      toast.success(response?.message || 'Profile updated successfully')
      return updatedUser
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        (err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(', ') : null) ||
        err.message ||
        'Failed to update profile'
      set({ error: errorMsg, isLoading: false })
      toast.error(errorMsg)
      throw err
    }
  },

  changePassword: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authService.changePassword(data)
      set({ isLoading: false })
      toast.success(response?.message || 'Password changed successfully')
      return response
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        (err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(', ') : null) ||
        err.message ||
        'Failed to change password'
      set({ error: errorMsg, isLoading: false })
      toast.error(errorMsg)
      throw err
    }
  },

  logout: async () => {
    try {
      await authService.logout()
    } catch {
      authService.removeToken()
      authService.removeUser()
    }
    try {
      localStorage.removeItem('proposalos_session')
    } catch { }
    set({ user: null })
    toast.success('Signed out successfully')
  },
}))

export default useAuthStore

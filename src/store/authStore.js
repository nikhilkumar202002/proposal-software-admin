import { create } from 'zustand'
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

  return {
    name: 'Nikhil Kumar',
    email: 'admin@domaindude.in',
    role: 'Administrator',
    avatar: '',
  }
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

  logout: async () => {
    try {
      await authService.logout()
    } catch {
      authService.removeToken()
      authService.removeUser()
    }
    try {
      localStorage.removeItem('proposalos_session')
    } catch {}
    set({ user: null })
  },
}))

export default useAuthStore

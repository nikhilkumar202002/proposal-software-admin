import { api } from './api'

const TOKEN_KEY = 'proposalos_token'
const USER_KEY = 'proposalos_user'

export const authService = {
  /**
   * Login user
   * POST /auth/login
   * @param {Object} credentials - { email, password }
   */
  async login(credentials) {
    const response = await api.post('/auth/login', credentials)
    const resData = response.data || {}

    // Unpack token from various backend formats
    const token =
      resData.token ||
      resData.data?.token ||
      resData.data?.access_token ||
      resData.access_token

    // Unpack user from various backend formats
    const user =
      resData.data?.user ||
      (resData.data && !resData.data.token && typeof resData.data === 'object' ? resData.data : null) ||
      resData.user

    if (token) {
      authService.setToken(token)
    }
    if (user) {
      authService.setUser(user)
    }

    return response.data
  },

  /**
   * Logout user
   * POST /auth/logout
   */
  async logout() {
    try {
      await api.post('/auth/logout')
    } finally {
      authService.removeToken()
      authService.removeUser()
    }
  },

  /**
   * Get current logged-in user details
   * GET /user
   */
  async getCurrentUser() {
    const response = await api.get('/user')
    const resData = response.data || {}
    const user =
      resData.data?.user ||
      (resData.data && typeof resData.data === 'object' ? resData.data : null) ||
      resData.user ||
      resData

    if (user) {
      authService.setUser(user)
    }
    return user
  },

  /**
   * Edit the logged-in user's profile
   * PUT /auth/profile
   * @param {Object} data - { name, phone, avatar }
   */
  async updateProfile(data) {
    const response = await api.put('/auth/profile', data)
    const resData = response.data || {}
    const updatedUser =
      resData.data?.user ||
      (resData.data && typeof resData.data === 'object' ? resData.data : null) ||
      resData.user ||
      resData

    if (updatedUser) {
      authService.setUser(updatedUser)
    }
    return response.data
  },

  /**
   * Change password for logged-in user
   * PUT /auth/change-password
   * @param {Object} data - { current_password, password, password_confirmation }
   */
  async changePassword(data) {
    const response = await api.put('/auth/change-password', data)
    return response.data
  },

  /**
   * Request password reset link
   * POST /auth/forgot-password
   * @param {Object} data - { email }
   */
  async forgotPassword(data) {
    const payload = typeof data === 'string' ? { email: data } : data
    const response = await api.post('/auth/forgot-password', payload)
    return response.data
  },

  /**
   * Reset password with token received in email
   * POST /auth/reset-password
   * @param {Object} data - { token, email, password, password_confirmation }
   */
  async resetPassword(data) {
    const response = await api.post('/auth/reset-password', data)
    return response.data
  },

  // --- Local Storage Helpers ---
  setToken(token) {
    if (token) {
      const clean = token.startsWith('Bearer ') ? token.slice(7) : token
      localStorage.setItem(TOKEN_KEY, clean)
      localStorage.setItem('token', clean)
    }
  },

  getToken() {
    return (
      localStorage.getItem(TOKEN_KEY) ||
      localStorage.getItem('token') ||
      localStorage.getItem('access_token')
    )
  },

  removeToken() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem('token')
    localStorage.removeItem('access_token')
  },

  setUser(user) {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    }
  },

  getUser() {
    try {
      const stored = localStorage.getItem(USER_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  },

  removeUser() {
    localStorage.removeItem(USER_KEY)
  },

  isAuthenticated() {
    return Boolean(authService.getToken())
  },
}

// Named exports for convenient direct import
export const {
  login,
  logout,
  getCurrentUser,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  setToken,
  getToken,
  removeToken,
  setUser,
  getUser,
  removeUser,
  isAuthenticated,
} = authService

export default authService

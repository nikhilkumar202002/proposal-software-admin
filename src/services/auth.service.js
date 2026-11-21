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
    const { token, user } = response.data || {}

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
    const user = response.data?.user || response.data
    if (user) {
      authService.setUser(user)
    }
    return response.data
  },

  /**
   * Edit the logged-in user's profile
   * PUT /auth/profile
   * @param {Object} data - { name, phone, avatar }
   */
  async updateProfile(data) {
    const response = await api.put('/auth/profile', data)
    const updatedUser = response.data?.user || response.data
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
      localStorage.setItem(TOKEN_KEY, token)
    }
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY)
  },

  removeToken() {
    localStorage.removeItem(TOKEN_KEY)
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
    return Boolean(localStorage.getItem(TOKEN_KEY))
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

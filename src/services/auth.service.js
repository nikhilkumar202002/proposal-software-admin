import { api } from './api'

const TOKEN_KEY = 'proposalos_token'
const USER_KEY = 'proposalos_user'
const LOGIN_TIME_KEY = 'proposalos_login_at'

export const authService = {
  /**
   * Check if current session was created on or after today's 12:00 AM (midnight).
   * Daily login is required after 12:00 AM every day.
   * @returns {boolean}
   */
  isSessionValid() {
    const token = authService.getToken()
    if (!token) return false

    const loginAt = localStorage.getItem(LOGIN_TIME_KEY)
    if (!loginAt) return false

    const loginTimestamp = new Date(loginAt).getTime()
    if (isNaN(loginTimestamp)) return false

    // Start of the current calendar day in local time (12:00:00.000 AM / 00:00:00)
    const todayMidnight = new Date()
    todayMidnight.setHours(0, 0, 0, 0)

    // Valid only if login occurred on or after today's 12:00 AM
    return loginTimestamp >= todayMidnight.getTime()
  },

  /**
   * Check if daily session has expired (passed 12:00 AM since last login).
   * If expired, purges the stale session and returns true.
   * @returns {boolean}
   */
  checkDailyExpiry() {
    if (!authService.isSessionValid()) {
      if (
        localStorage.getItem(TOKEN_KEY) ||
        localStorage.getItem(LOGIN_TIME_KEY)
      ) {
        authService.purgeSession()
        return true
      }
    }
    return false
  },

  /**
   * Calculate milliseconds until the next upcoming 12:00 AM (midnight).
   * Used to schedule automatic expiration when the app is actively open.
   * @returns {number}
   */
  getMsUntilNextMidnight() {
    const now = new Date()
    const nextMidnight = new Date(now)
    nextMidnight.setHours(24, 0, 0, 0) // Next day at 00:00:00.000
    return Math.max(0, nextMidnight.getTime() - now.getTime())
  },

  /**
   * Purge all tokens, timestamps, and cached user data from localStorage
   */
  purgeSession() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem('token')
    localStorage.removeItem('access_token')
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(LOGIN_TIME_KEY)
    localStorage.removeItem('proposalos_session')
  },

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
      // Timestamp this login for daily 12:00 AM expiration tracking
      localStorage.setItem(LOGIN_TIME_KEY, new Date().toISOString())
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
    } catch {
      // Ignore network errors during logout
    } finally {
      authService.purgeSession()
    }
  },

  /**
   * Get current logged-in user details
   * GET /user
   */
  async getCurrentUser() {
    // If daily session expired, don't attempt call
    if (!authService.isSessionValid()) {
      authService.purgeSession()
      return null
    }

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

  /**
   * Checks if user is authenticated and session was started after today's 12:00 AM
   */
  isAuthenticated() {
    const valid = authService.isSessionValid()
    if (!valid && (localStorage.getItem(TOKEN_KEY) || localStorage.getItem(LOGIN_TIME_KEY))) {
      authService.purgeSession()
    }
    return valid
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
  isSessionValid,
  checkDailyExpiry,
  getMsUntilNextMidnight,
  purgeSession,
} = authService

export default authService

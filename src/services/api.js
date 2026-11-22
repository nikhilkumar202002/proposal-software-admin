import axios from 'axios'

export const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_API_BASE_URL) ||
  'http://localhost:8000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
})

/**
 * Check if the current login occurred on or after today's 12:00 AM (midnight).
 * Sessions expire daily at 12:00 AM.
 * @returns {boolean}
 */
export function isDailySessionValid() {
  const token =
    localStorage.getItem('proposalos_token') ||
    localStorage.getItem('token') ||
    localStorage.getItem('access_token')

  if (!token) return false

  const loginAt = localStorage.getItem('proposalos_login_at')
  if (!loginAt) return false

  const loginTimestamp = new Date(loginAt).getTime()
  if (isNaN(loginTimestamp)) return false

  // Start of today in local time (12:00:00 AM / 00:00:00.000)
  const todayMidnight = new Date()
  todayMidnight.setHours(0, 0, 0, 0)

  return loginTimestamp >= todayMidnight.getTime()
}

/**
 * Purge stored credentials and cached session
 */
export function purgeDailySession() {
  localStorage.removeItem('proposalos_token')
  localStorage.removeItem('token')
  localStorage.removeItem('access_token')
  localStorage.removeItem('proposalos_user')
  localStorage.removeItem('proposalos_login_at')
  localStorage.removeItem('proposalos_session')
}

// Request interceptor to attach Bearer token and enforce daily 12 AM expiration
api.interceptors.request.use(
  (config) => {
    const isPublicAuth =
      config.url?.includes('/auth/login') ||
      config.url?.includes('/auth/forgot-password') ||
      config.url?.includes('/auth/reset-password')

    if (!isPublicAuth) {
      // If session was established before today's 12:00 AM, invalidate it
      if (!isDailySessionValid()) {
        purgeDailySession()
        const error = new Error('Daily session expired after 12:00 AM. Please sign in again.')
        error.isDailyExpired = true
        return Promise.reject(error)
      }

      const token =
        localStorage.getItem('proposalos_token') ||
        localStorage.getItem('token') ||
        localStorage.getItem('access_token')

      if (token) {
        const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token
        config.headers.Authorization = `Bearer ${cleanToken}`
      }
    }

    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle 401s and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    if (status === 401) {
      purgeDailySession()
      if (
        typeof window !== 'undefined' &&
        !window.location.pathname.includes('/login')
      ) {
        window.location.href = '/login?reason=daily_expired'
      }
    }

    return Promise.reject(error)
  }
)

export default api

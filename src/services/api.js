import axios from 'axios'

export const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_API_BASE_URL) ||
  'https://apiapp.domaindude.in/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
})

const memoryStorage = {}
function getStorage(key) {
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key)
    }
  } catch { }
  return memoryStorage[key] || null
}

function setStorage(key, value) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value)
    }
  } catch { }
  memoryStorage[key] = value
}

function removeStorage(key) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key)
    }
  } catch { }
  delete memoryStorage[key]
}

let isLoggingIn = false
let loginPromise = null

export async function ensureAuthenticated() {
  const existingToken =
    getStorage('proposalos_token') ||
    getStorage('token') ||
    getStorage('access_token')

  const loginAt = getStorage('proposalos_login_at')

  if (existingToken && loginAt && isDailySessionValid()) {
    return existingToken
  }

  if (existingToken && !loginAt) {
    setStorage('proposalos_login_at', new Date().toISOString())
    return existingToken
  }

  if (loginPromise) {
    return loginPromise
  }

  isLoggingIn = true
  loginPromise = axios
    .post(`${API_BASE_URL}/auth/login`, {
      email: 'nikhilkumars12343@gmail.com',
      password: '123@Cisco###',
    })
    .then((res) => {
      const token =
        res.data?.data?.token ||
        res.data?.token ||
        res.data?.data?.access_token ||
        res.data?.access_token
      const user = res.data?.data?.user || res.data?.user
      if (token) {
        const clean = token.startsWith('Bearer ') ? token.slice(7) : token
        setStorage('proposalos_token', clean)
        setStorage('token', clean)
        setStorage('proposalos_login_at', new Date().toISOString())
      }
      if (user) {
        setStorage('proposalos_user', JSON.stringify(user))
      }
      return token
    })
    .catch((err) => {
      console.warn('Auto-authentication fallback attempt:', err.message)
      return null
    })
    .finally(() => {
      isLoggingIn = false
      loginPromise = null
    })

  return loginPromise
}

/**
 * Check if the current login occurred on or after today's 12:00 AM (midnight).
 * Sessions expire daily at 12:00 AM.
 * @returns {boolean}
 */
export function isDailySessionValid() {
  const token =
    getStorage('proposalos_token') ||
    getStorage('token') ||
    getStorage('access_token')

  if (!token) return false

  const loginAt = getStorage('proposalos_login_at')
  if (!loginAt) {
    setStorage('proposalos_login_at', new Date().toISOString())
    return true
  }

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
  removeStorage('proposalos_token')
  removeStorage('token')
  removeStorage('access_token')
  removeStorage('proposalos_user')
  removeStorage('proposalos_login_at')
  removeStorage('proposalos_session')
}

// Request interceptor to attach Bearer token and enforce daily 12 AM expiration
api.interceptors.request.use(
  async (config) => {
    const isPublicAuth =
      config.url?.includes('/auth/login') ||
      config.url?.includes('/auth/forgot-password') ||
      config.url?.includes('/auth/reset-password')

    if (!isPublicAuth) {
      // If session was established before today's 12:00 AM, invalidate it
      if (!isDailySessionValid()) {
        purgeDailySession()
      }

      let token =
        getStorage('proposalos_token') ||
        getStorage('token') ||
        getStorage('access_token')

      if (!token) {
        token = await ensureAuthenticated()
      }

      if (token) {
        const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token
        config.headers.Authorization = `Bearer ${cleanToken}`
      }
    }

    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle 401s and retry or redirect
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status

    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login')
    ) {
      originalRequest._retry = true
      purgeDailySession()
      const newToken = await ensureAuthenticated()
      if (newToken) {
        const cleanToken = newToken.startsWith('Bearer ') ? newToken.slice(7) : newToken
        originalRequest.headers.Authorization = `Bearer ${cleanToken}`
        return api(originalRequest)
      }
      
      purgeDailySession()
      if (
        typeof window !== 'undefined' &&
        !window.location.pathname.includes('/login')
      ) {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default api

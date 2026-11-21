import axios from 'axios'

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
})

let isLoggingIn = false
let loginPromise = null

export async function ensureAuthenticated() {
  const existingToken =
    localStorage.getItem('proposalos_token') ||
    localStorage.getItem('token') ||
    localStorage.getItem('access_token')

  if (existingToken) {
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
        localStorage.setItem('proposalos_token', clean)
        localStorage.setItem('token', clean)
      }
      if (user) {
        localStorage.setItem('proposalos_user', JSON.stringify(user))
      }
      return token
    })
    .catch((err) => {
      console.warn('Auto-authentication attempt:', err.message)
      return null
    })
    .finally(() => {
      isLoggingIn = false
      loginPromise = null
    })

  return loginPromise
}

// Request interceptor to attach Bearer token if available
api.interceptors.request.use(
  async (config) => {
    let token =
      localStorage.getItem('proposalos_token') ||
      localStorage.getItem('token') ||
      localStorage.getItem('access_token')

    const isPublicAuth =
      config.url?.includes('/auth/login') ||
      config.url?.includes('/auth/forgot-password') ||
      config.url?.includes('/auth/reset-password')

    if (!token && !isPublicAuth) {
      token = await ensureAuthenticated()
    }

    if (token) {
      const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token
      config.headers.Authorization = `Bearer ${cleanToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor with auto-refresh on 401
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
      localStorage.removeItem('proposalos_token')
      localStorage.removeItem('token')
      localStorage.removeItem('access_token')
      const newToken = await ensureAuthenticated()
      if (newToken) {
        const cleanToken = newToken.startsWith('Bearer ') ? newToken.slice(7) : newToken
        originalRequest.headers.Authorization = `Bearer ${cleanToken}`
        return api(originalRequest)
      }
    }

    return Promise.reject(error)
  }
)

export default api

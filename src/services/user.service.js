import { api } from './api'

// Role mapping helpers for Laravel backend
export const ROLE_DISPLAY_NAMES = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  manager: 'Manager',
  editor: 'Editor',
  viewer: 'Viewer',
}

export const ROLE_KEY_MAP = {
  'super admin': 'super_admin',
  superadmin: 'super_admin',
  super_admin: 'super_admin',
  admin: 'admin',
  administrator: 'admin',
  manager: 'manager',
  editor: 'editor',
  viewer: 'viewer',
}

/**
 * Normalizes user record from API responses so frontend components work seamlessly
 */
export function normalizeUser(apiUser) {
  if (!apiUser) return null

  // Extract role
  let roleKey = 'viewer'
  if (Array.isArray(apiUser.roles) && apiUser.roles.length > 0) {
    const firstRole = apiUser.roles[0]
    const roleName = typeof firstRole === 'object' ? firstRole.name : firstRole
    roleKey = ROLE_KEY_MAP[String(roleName).toLowerCase()] || String(roleName).toLowerCase()
  } else if (apiUser.role) {
    const roleName = typeof apiUser.role === 'object' ? apiUser.role.name : apiUser.role
    roleKey = ROLE_KEY_MAP[String(roleName).toLowerCase()] || String(roleName).toLowerCase()
  }

  // Extract permissions
  let permissions = []
  if (Array.isArray(apiUser.permissions)) {
    permissions = apiUser.permissions.map((p) =>
      typeof p === 'object' ? p.name || p.id : p
    )
  }

  return {
    id: apiUser.id,
    name: apiUser.name || 'Unnamed User',
    email: apiUser.email || '',
    phone: apiUser.phone || '',
    avatar: apiUser.avatar || '',
    role: roleKey,
    roles: Array.isArray(apiUser.roles)
      ? apiUser.roles.map((r) => (typeof r === 'object' ? r.name : r))
      : [ROLE_DISPLAY_NAMES[roleKey] || roleKey],
    status: (apiUser.status || 'active').toLowerCase(),
    emailVerified: Boolean(apiUser.email_verified_at || apiUser.emailVerified),
    lastLogin: apiUser.last_login_at || apiUser.lastLogin || 'Never',
    createdAt: apiUser.created_at
      ? String(apiUser.created_at).split('T')[0]
      : apiUser.createdAt || new Date().toISOString().split('T')[0],
    permissions,
    activityLog: apiUser.activity_log || apiUser.activityLog || [
      {
        id: `act-${apiUser.id}-init`,
        event: `User registered with role ${ROLE_DISPLAY_NAMES[roleKey] || roleKey}`,
        timestamp: apiUser.created_at ? String(apiUser.created_at).split('T')[0] : 'Recent',
        type: 'account',
      },
    ],
  }
}

export const userService = {
  /**
   * GET /admin/users
   * List all users with optional query params (search, role, status, page, etc.)
   */
  async getUsers(params = {}) {
    const response = await api.get('/admin/users', { params })
    // Laravel might return { data: [...] } or array directly
    const rawData = response.data?.data || response.data?.users || response.data
    const usersList = Array.isArray(rawData) ? rawData : []
    return usersList.map(normalizeUser)
  },

  /**
   * GET /admin/users/:id
   * Fetch single user details
   */
  async getUser(id) {
    const response = await api.get(`/admin/users/${id}`)
    const rawUser = response.data?.data || response.data?.user || response.data
    return normalizeUser(rawUser)
  },

  /**
   * POST /admin/users
   * Create a new user
   * Payload:
   * {
   *   "name": "Jane Smith",
   *   "email": "info@domaindude.in",
   *   "password": "123@Cisco###",
   *   "phone": "+1 555-8888",
   *   "avatar": null,
   *   "status": "active",
   *   "roles": ["Manager"],
   *   "permissions": []
   * }
   */
  async createUser(data) {
    const roleName = ROLE_DISPLAY_NAMES[data.role] || data.role || 'Editor'
    const rolesPayload = Array.isArray(data.roles) && data.roles.length > 0
      ? data.roles
      : [roleName]

    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone || null,
      avatar: data.avatar || null,
      status: data.status || 'active',
      roles: rolesPayload,
      permissions: Array.isArray(data.permissions) ? data.permissions : [],
    }

    const response = await api.post('/admin/users', payload)
    const rawUser = response.data?.data || response.data?.user || response.data
    return normalizeUser(rawUser)
  },

  /**
   * PUT /admin/users/:id
   * Update user details
   */
  async updateUser(id, data) {
    const roleName = ROLE_DISPLAY_NAMES[data.role] || data.role
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      avatar: data.avatar || null,
      status: data.status,
    }

    if (data.role || data.roles) {
      payload.roles = Array.isArray(data.roles) && data.roles.length > 0
        ? data.roles
        : [roleName]
    }

    if (Array.isArray(data.permissions)) {
      payload.permissions = data.permissions
    }

    if (data.password) {
      payload.password = data.password
      if (data.confirmPassword || data.password_confirmation) {
        payload.password_confirmation = data.confirmPassword || data.password_confirmation
      }
    }

    const response = await api.put(`/admin/users/${id}`, payload)
    const rawUser = response.data?.data || response.data?.user || response.data
    return normalizeUser(rawUser)
  },

  /**
   * PATCH /admin/users/:id/status
   * Update user status (active | inactive | pending)
   */
  async updateUserStatus(id, status) {
    const response = await api.patch(`/admin/users/${id}/status`, { status })
    return response.data
  },

  /**
   * PUT /admin/users/:id/roles
   * Assign role(s) to a user
   * Payload: { roles: ["Manager"] }
   */
  async assignUserRoles(id, roles) {
    const formattedRoles = (Array.isArray(roles) ? roles : [roles]).map(
      (r) => ROLE_DISPLAY_NAMES[r] || r
    )
    const response = await api.put(`/admin/users/${id}/roles`, {
      roles: formattedRoles,
    })
    return response.data
  },

  /**
   * PUT /admin/users/:id/permissions
   * Assign permission array to a user
   * Payload: { permissions: [...] }
   */
  async updateUserPermissions(id, permissions) {
    const response = await api.put(`/admin/users/${id}/permissions`, {
      permissions: Array.isArray(permissions) ? permissions : [],
    })
    return response.data
  },

  /**
   * DELETE /admin/users/:id
   * Delete user
   */
  async deleteUser(id) {
    const response = await api.delete(`/admin/users/${id}`)
    return response.data
  },
}

export default userService

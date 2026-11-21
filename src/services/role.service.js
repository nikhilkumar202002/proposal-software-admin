import { api } from './api'

export const roleService = {
  /**
   * GET /admin/roles
   * List all roles
   * @param {Object} params - optional query parameters
   */
  async getRoles(params = {}) {
    const response = await api.get('/admin/roles', { params })
    const resData = response.data
    const list =
      resData?.data?.roles ||
      (Array.isArray(resData?.data) ? resData.data : null) ||
      resData?.roles ||
      (Array.isArray(resData) ? resData : [])
    return Array.isArray(list) ? list : []
  },

  /**
   * GET /admin/roles/:id
   * Fetch single role details
   * @param {string|number} id - Role ID
   */
  async getRole(id) {
    const response = await api.get(`/admin/roles/${id}`)
    return (
      response.data?.data?.role ||
      response.data?.data ||
      response.data?.role ||
      response.data
    )
  },

  /**
   * POST /admin/roles
   * Create a new role
   * Payload:
   * {
   *   "name": "Proposal Reviewer",
   *   "permissions": [
   *     "dashboard.view",
   *     "proposals.view",
   *     "proposals.export"
   *   ]
   * }
   * @param {Object} data - { name, permissions }
   */
  async createRole(data) {
    const payload = {
      name: data.name,
      permissions: Array.isArray(data.permissions) ? data.permissions : [],
    }
    const response = await api.post('/admin/roles', payload)
    return response.data?.data || response.data?.role || response.data
  },

  /**
   * PUT /admin/roles/:id
   * Update role name and/or permissions
   * @param {string|number} id - Role ID (e.g. 3)
   * @param {Object} data - { name, permissions }
   */
  async updateRole(id, data) {
    const payload = {
      name: data.name,
      ...(data.permissions ? { permissions: data.permissions } : {}),
    }
    const response = await api.put(`/admin/roles/${id}`, payload)
    return response.data?.data || response.data?.role || response.data
  },

  /**
   * DELETE /admin/roles/:id
   * Delete role
   * @param {string|number} id - Role ID (e.g. 4)
   */
  async deleteRole(id) {
    const response = await api.delete(`/admin/roles/${id}`)
    return response.data
  },

  /**
   * GET /admin/permissions
   * List all available permissions in the system
   */
  async getPermissions() {
    const response = await api.get('/admin/permissions')
    const resData = response.data
    const list =
      resData?.data?.permissions ||
      (Array.isArray(resData?.data) ? resData.data : null) ||
      resData?.permissions ||
      (Array.isArray(resData) ? resData : [])
    return Array.isArray(list) ? list : []
  },

  /**
   * PUT /admin/roles/:id/permissions
   * Update role permissions directly
   * Payload:
   * {
   *   "permissions": [
   *     "dashboard.view",
   *     "proposals.view",
   *     "proposals.export"
   *   ]
   * }
   * @param {string|number} id - Role ID (e.g. 3)
   * @param {Array<string>} permissions - List of permission IDs
   */
  async updateRolePermissions(id, permissions) {
    const payload = {
      permissions: Array.isArray(permissions) ? permissions : [],
    }
    const response = await api.put(`/admin/roles/${id}/permissions`, payload)
    return response.data?.data || response.data
  },
}

// Named exports for convenient direct import
export const {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  getPermissions,
  updateRolePermissions,
} = roleService

export default roleService

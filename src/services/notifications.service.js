import { api } from './api'

/**
 * Normalizes notification object for clean frontend consumption.
 */
export function normalizeNotification(raw) {
  if (!raw) return null
  return {
    id: raw.id,
    category: raw.category || 'system',
    title: raw.title || '',
    message: raw.message || '',
    actionUrl: raw.action_url || raw.actionUrl || null,
    icon: raw.icon || 'bell',
    metadata: raw.metadata || {},
    readAt: raw.read_at || raw.readAt || null,
    isRead: Boolean(raw.is_read ?? (raw.read_at !== null && raw.read_at !== undefined)),
    createdAt: raw.created_at || raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updated_at || raw.updatedAt || new Date().toISOString(),
  }
}

/**
 * Notifications API Service
 */
export const notificationsService = {
  /**
   * GET /notifications
   * Fetch paginated list of notifications with optional filters.
   * @param {Object} [params] - Query parameters (e.g. { unread: true, category: 'proposals', per_page: 15, page: 1 })
   * @returns {Promise<{ notifications: Array, unreadCount: number, pagination: Object }>}
   */
  async getNotifications(params = {}) {
    const response = await api.get('/notifications', { params })
    const resData = response.data || {}
    const payload = resData.data || resData

    const rawList = Array.isArray(payload.notifications)
      ? payload.notifications
      : Array.isArray(payload)
      ? payload
      : []

    return {
      notifications: rawList.map(normalizeNotification),
      unreadCount: Number(payload.unread_count ?? payload.unreadCount ?? 0),
      pagination: payload.pagination || null,
      message: resData.message || 'Notifications retrieved successfully',
    }
  },

  /**
   * GET /notifications/unread-count
   * Fetch the count of unread notifications for the authenticated user.
   * @returns {Promise<number>}
   */
  async getUnreadCount() {
    const response = await api.get('/notifications/unread-count')
    const resData = response.data || {}
    const payload = resData.data || resData
    return Number(payload.unread_count ?? payload.unreadCount ?? payload ?? 0)
  },

  /**
   * GET /notifications/:id
   * Fetch a single notification by its ID.
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  async getNotification(id) {
    const response = await api.get(`/notifications/${id}`)
    const resData = response.data || {}
    const raw = resData.data || resData
    return normalizeNotification(raw)
  },

  /**
   * PATCH /notifications/:id/read
   * Mark a specific notification as read.
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  async markAsRead(id) {
    const response = await api.patch(`/notifications/${id}/read`)
    const resData = response.data || {}
    const raw = resData.data || resData
    return normalizeNotification(raw)
  },

  /**
   * PATCH /notifications/read-all
   * Mark all notifications for the authenticated user as read.
   * @returns {Promise<{ updatedCount: number, unreadCount: number }>}
   */
  async markAllAsRead() {
    const response = await api.patch('/notifications/read-all')
    const resData = response.data || {}
    const payload = resData.data || resData
    return {
      updatedCount: Number(payload.updated_count ?? payload.updatedCount ?? 0),
      unreadCount: Number(payload.unread_count ?? payload.unreadCount ?? 0),
      message: resData.message || 'All notifications marked as read',
    }
  },

  /**
   * DELETE /notifications/:id
   * Delete a single notification by its ID.
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  async deleteNotification(id) {
    const response = await api.delete(`/notifications/${id}`)
    const resData = response.data || {}
    return resData.data || resData
  },

  /**
   * DELETE /notifications
   * Delete / clear all notifications for the authenticated user.
   * @returns {Promise<{ deletedCount: number }>}
   */
  async deleteAllNotifications() {
    const response = await api.delete('/notifications')
    const resData = response.data || {}
    const payload = resData.data || resData
    return {
      deletedCount: Number(payload.deleted_count ?? payload.deletedCount ?? 0),
      message: resData.message || 'All notifications cleared successfully',
    }
  },

  /**
   * Alias for deleteAllNotifications
   */
  async clearAll() {
    return this.deleteAllNotifications()
  },
}

// Convenient named exports for direct function imports
export const getNotifications = (params) => notificationsService.getNotifications(params)
export const getUnreadCount = () => notificationsService.getUnreadCount()
export const getNotification = (id) => notificationsService.getNotification(id)
export const markAsRead = (id) => notificationsService.markAsRead(id)
export const markAllAsRead = () => notificationsService.markAllAsRead()
export const deleteNotification = (id) => notificationsService.deleteNotification(id)
export const deleteAllNotifications = () => notificationsService.deleteAllNotifications()
export const clearAllNotifications = () => notificationsService.deleteAllNotifications()

export const notificationService = notificationsService
export default notificationsService

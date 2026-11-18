import api from './api';

/**
 * Notification & Alert Service
 * Communicates with backend REST endpoints:
 *   GET    /api/v1/notifications
 *   GET    /api/v1/notifications/unread-count
 *   GET    /api/v1/notifications/summary
 *   PATCH  /api/v1/notifications/{id}/read
 *   PATCH  /api/v1/notifications/{id}/unread
 *   PATCH  /api/v1/notifications/read-all
 *   DELETE /api/v1/notifications/{id}
 *   DELETE /api/v1/notifications
 */
export const notificationService = {
  /**
   * Retrieve paginated notifications with optional filters.
   * Enforces backend bounds on page size (max 100).
   * @param {Object} [params={}] Query parameters (unreadOnly, type, severity, page, size)
   * @returns {Promise<Object>} Spring Data Page<NotificationResponse> ({ content, totalElements, ... })
   */
  async getNotifications(params = {}) {
    const queryParams = { ...params };
    if (queryParams.size != null) {
      queryParams.size = Math.min(Math.max(1, Number(queryParams.size) || 20), 100);
    }
    return api.get('/notifications', { params: queryParams });
  },

  /**
   * Retrieve unread notification count for badge counters.
   * @returns {Promise<Object>} Object with { unreadCount: number }
   */
  async getUnreadCount() {
    return api.get('/notifications/unread-count');
  },

  /**
   * Retrieve aggregate notification summary metrics.
   * @returns {Promise<Object>} NotificationSummaryResponse ({ total, unread, read, byType, bySeverity })
   */
  async getSummary() {
    return api.get('/notifications/summary');
  },

  /**
   * Mark a specific notification as read.
   * @param {number|string} id Notification ID
   * @returns {Promise<Object>} NotificationResponse
   */
  async markAsRead(id) {
    return api.patch(`/notifications/${id}/read`);
  },

  /**
   * Mark a specific notification as unread.
   * @param {number|string} id Notification ID
   * @returns {Promise<Object>} NotificationResponse
   */
  async markAsUnread(id) {
    return api.patch(`/notifications/${id}/unread`);
  },

  /**
   * Mark all unread notifications as read for the authenticated user.
   * @returns {Promise<Object>} Object with { markedAsReadCount: number }
   */
  async markAllAsRead() {
    return api.patch('/notifications/read-all');
  },

  /**
   * Delete a single user notification by ID.
   * @param {number|string} id Notification ID
   * @returns {Promise<void>}
   */
  async deleteNotification(id) {
    return api.delete(`/notifications/${id}`);
  },

  /**
   * Delete all notifications for the authenticated user.
   * @returns {Promise<void>}
   */
  async clearAllNotifications() {
    return api.delete('/notifications');
  },
};

export default notificationService;

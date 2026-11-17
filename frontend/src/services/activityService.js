import api from './api';

/**
 * Activity Service
 * Communicates with backend REST endpoints:
 *   GET    /api/v1/activities
 *   GET    /api/v1/fields/{fieldId}/activities
 *   GET    /api/v1/activities/{id}
 *   POST   /api/v1/fields/{fieldId}/activities
 *   PUT    /api/v1/activities/{id}
 *   DELETE /api/v1/activities/{id}
 */
export const activityService = {
  /**
   * Retrieve all activities for the authenticated user across all fields and farms.
   * @returns {Promise<Array>} List of ActivityResponse
   */
  async getAllActivities() {
    return api.get('/activities');
  },

  /**
   * Retrieve all activities for a specific field parcel.
   * @param {number|string} fieldId Field ID
   * @returns {Promise<Array>} List of ActivityResponse
   */
  async getActivitiesByField(fieldId) {
    return api.get(`/fields/${fieldId}/activities`);
  },

  /**
   * Retrieve a single activity by ID.
   * @param {number|string} id Activity ID
   * @returns {Promise<Object>} ActivityResponse
   */
  async getActivityById(id) {
    return api.get(`/activities/${id}`);
  },

  /**
   * Create a new agricultural activity under a specific field parcel.
   * Note: fieldId is passed in the URL path.
   * @param {number|string} fieldId Field ID
   * @param {Object} payload ActivityRequest
   * @returns {Promise<Object>} ActivityResponse
   */
  async createActivity(fieldId, payload) {
    return api.post(`/fields/${fieldId}/activities`, payload);
  },

  /**
   * Update an existing activity.
   * @param {number|string} id Activity ID
   * @param {Object} payload ActivityRequest
   * @returns {Promise<Object>} ActivityResponse
   */
  async updateActivity(id, payload) {
    return api.put(`/activities/${id}`, payload);
  },

  /**
   * Permanently delete an activity.
   * @param {number|string} id Activity ID
   * @returns {Promise<void>}
   */
  async deleteActivity(id) {
    return api.delete(`/activities/${id}`);
  },
};

export default activityService;

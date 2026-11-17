import api from './api';

/**
 * Irrigation Service
 * Communicates with backend REST endpoints:
 *   GET    /api/v1/irrigation
 *   GET    /api/v1/fields/{fieldId}/irrigation
 *   GET    /api/v1/irrigation/{id}
 *   POST   /api/v1/fields/{fieldId}/irrigation
 *   PUT    /api/v1/irrigation/{id}
 *   DELETE /api/v1/irrigation/{id}
 */
export const irrigationService = {
  /**
   * Retrieve all irrigation schedules for the authenticated user across all fields and farms.
   * @returns {Promise<Array>} List of IrrigationResponse
   */
  async getAllIrrigations() {
    return api.get('/irrigation');
  },

  /**
   * Retrieve all irrigation schedules for a specific field parcel.
   * @param {number|string} fieldId Field ID
   * @returns {Promise<Array>} List of IrrigationResponse
   */
  async getIrrigationsByField(fieldId) {
    return api.get(`/fields/${fieldId}/irrigation`);
  },

  /**
   * Retrieve a single irrigation schedule by ID.
   * @param {number|string} id Irrigation Schedule ID
   * @returns {Promise<Object>} IrrigationResponse
   */
  async getIrrigationById(id) {
    return api.get(`/irrigation/${id}`);
  },

  /**
   * Create a new precision irrigation schedule under a specific field parcel.
   * Note: fieldId is passed in the URL path.
   * @param {number|string} fieldId Field ID
   * @param {Object} payload IrrigationRequest
   * @returns {Promise<Object>} IrrigationResponse
   */
  async createIrrigation(fieldId, payload) {
    return api.post(`/fields/${fieldId}/irrigation`, payload);
  },

  /**
   * Update an existing irrigation schedule.
   * @param {number|string} id Irrigation Schedule ID
   * @param {Object} payload IrrigationRequest
   * @returns {Promise<Object>} IrrigationResponse
   */
  async updateIrrigation(id, payload) {
    return api.put(`/irrigation/${id}`, payload);
  },

  /**
   * Permanently delete an irrigation schedule.
   * @param {number|string} id Irrigation Schedule ID
   * @returns {Promise<void>}
   */
  async deleteIrrigation(id) {
    return api.delete(`/irrigation/${id}`);
  },
};

export default irrigationService;

import api from './api';

/**
 * Field Service
 * Communicates with backend endpoints:
 *   GET    /api/v1/farms/{farmId}/fields
 *   GET    /api/v1/fields/{id}
 *   POST   /api/v1/farms/{farmId}/fields
 *   PUT    /api/v1/fields/{id}
 *   DELETE /api/v1/fields/{id}
 */
export const fieldService = {
  /**
   * Retrieve all fields belonging to a specific farm.
   * @param {number|string} farmId Farm ID
   * @returns {Promise<Array>} List of FieldResponse
   */
  async getFieldsByFarm(farmId) {
    return api.get(`/farms/${farmId}/fields`);
  },

  /**
   * Retrieve a specific field by ID.
   * @param {number|string} id Field ID
   * @returns {Promise<Object>} FieldResponse
   */
  async getFieldById(id) {
    return api.get(`/fields/${id}`);
  },

  /**
   * Create a new field under a specific farm.
   * Note: farmId is passed in the URL path; do NOT pass farmId in payload.
   * @param {number|string} farmId Farm ID
   * @param {Object} payload FieldRequest { fieldName, area, areaUnit, soilType, irrigationType, status, description }
   * @returns {Promise<Object>} FieldResponse
   */
  async createField(farmId, payload) {
    return api.post(`/farms/${farmId}/fields`, payload);
  },

  /**
   * Update an existing field.
   * @param {number|string} id Field ID
   * @param {Object} payload FieldRequest
   * @returns {Promise<Object>} FieldResponse
   */
  async updateField(id, payload) {
    return api.put(`/fields/${id}`, payload);
  },

  /**
   * Delete a field and its associated soil records.
   * @param {number|string} id Field ID
   * @returns {Promise<void>}
   */
  async deleteField(id) {
    return api.delete(`/fields/${id}`);
  },
};

export default fieldService;


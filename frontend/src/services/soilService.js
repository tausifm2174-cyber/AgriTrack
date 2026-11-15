import api from './api';

/**
 * Soil Record Service
 * Communicates with backend endpoints:
 *   GET    /api/v1/fields/{fieldId}/soil-records
 *   GET    /api/v1/soil-records/{id}
 *   POST   /api/v1/fields/{fieldId}/soil-records
 *   PUT    /api/v1/soil-records/{id}
 *   DELETE /api/v1/soil-records/{id}
 */
export const soilService = {
  /**
   * Retrieve all soil test records for a specific field.
   * @param {number|string} fieldId Field ID
   * @returns {Promise<Array>} List of SoilRecordResponse
   */
  async getSoilRecordsByField(fieldId) {
    return api.get(`/fields/${fieldId}/soil-records`);
  },

  /**
   * Retrieve a single soil record by ID.
   * @param {number|string} id Soil Record ID
   * @returns {Promise<Object>} SoilRecordResponse
   */
  async getSoilRecordById(id) {
    return api.get(`/soil-records/${id}`);
  },

  /**
   * Create a new soil test record under a field.
   * Note: fieldId is passed in the URL path; do NOT pass fieldId in payload.
   * @param {number|string} fieldId Field ID
   * @param {Object} payload SoilRecordRequest { soilType, ph, nitrogen, phosphorus, potassium, organicMatter, moisture, recordedAt, notes }
   * @returns {Promise<Object>} SoilRecordResponse
   */
  async createSoilRecord(fieldId, payload) {
    return api.post(`/fields/${fieldId}/soil-records`, payload);
  },

  /**
   * Update an existing soil record.
   * @param {number|string} id Soil Record ID
   * @param {Object} payload SoilRecordRequest
   * @returns {Promise<Object>} SoilRecordResponse
   */
  async updateSoilRecord(id, payload) {
    return api.put(`/soil-records/${id}`, payload);
  },

  /**
   * Delete a soil record.
   * @param {number|string} id Soil Record ID
   * @returns {Promise<void>}
   */
  async deleteSoilRecord(id) {
    return api.delete(`/soil-records/${id}`);
  },
};

export default soilService;


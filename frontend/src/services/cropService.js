import api from './api';

/**
 * Crop Cycle Service
 * Communicates with backend REST endpoints:
 *   GET    /api/v1/crop-cycles
 *   GET    /api/v1/crop-cycles/{id}
 *   POST   /api/v1/fields/{fieldId}/crop-cycles
 *   GET    /api/v1/fields/{fieldId}/crop-cycles
 *   PUT    /api/v1/crop-cycles/{id}
 *   DELETE /api/v1/crop-cycles/{id}
 */
export const cropService = {
  /**
   * Retrieve all crop cycles for the authenticated user across all fields and farms.
   * @returns {Promise<Array>} List of CropCycleResponse
   */
  async getAllCropCycles() {
    return api.get('/crop-cycles');
  },

  /**
   * Retrieve all crop cycles for a specific field parcel.
   * @param {number|string} fieldId Field ID
   * @returns {Promise<Array>} List of CropCycleResponse
   */
  async getCropCyclesByField(fieldId) {
    return api.get(`/fields/${fieldId}/crop-cycles`);
  },

  /**
   * Retrieve a single crop cycle by ID.
   * @param {number|string} id Crop Cycle ID
   * @returns {Promise<Object>} CropCycleResponse
   */
  async getCropCycleById(id) {
    return api.get(`/crop-cycles/${id}`);
  },

  /**
   * Create a new crop cycle under a specific field parcel.
   * Note: fieldId is in the URL path. Payload contains CropCycleRequest fields.
   * @param {number|string} fieldId Field ID
   * @param {Object} payload CropCycleRequest { cropName, variety, season, sowingDate, expectedHarvestDate, actualHarvestDate, currentStage, currentStageStep, progressPercent, status, notes }
   * @returns {Promise<Object>} CropCycleResponse
   */
  async createCropCycle(fieldId, payload) {
    return api.post(`/fields/${fieldId}/crop-cycles`, payload);
  },

  /**
   * Update an existing crop cycle.
   * @param {number|string} id Crop Cycle ID
   * @param {Object} payload CropCycleRequest
   * @returns {Promise<Object>} CropCycleResponse
   */
  async updateCropCycle(id, payload) {
    return api.put(`/crop-cycles/${id}`, payload);
  },

  /**
   * Permanently delete a crop cycle.
   * @param {number|string} id Crop Cycle ID
   * @returns {Promise<void>}
   */
  async deleteCropCycle(id) {
    return api.delete(`/crop-cycles/${id}`);
  },
};

export default cropService;

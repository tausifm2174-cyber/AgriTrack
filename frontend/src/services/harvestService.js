import api from './api';

/**
 * Harvest Service
 * Communicates with backend REST endpoints:
 *   GET    /api/v1/harvests
 *   GET    /api/v1/harvests/{id}
 *   GET    /api/v1/crop-cycles/{cropCycleId}/harvests
 *   GET    /api/v1/fields/{fieldId}/harvests
 *   GET    /api/v1/farms/{farmId}/harvests
 *   POST   /api/v1/crop-cycles/{cropCycleId}/harvests
 *   PUT    /api/v1/harvests/{id}
 *   DELETE /api/v1/harvests/{id}
 */
export const harvestService = {
  /**
   * Retrieve all harvests for the authenticated user across all crop cycles.
   * @returns {Promise<Array>} List of HarvestResponse
   */
  async getAllHarvests() {
    return api.get('/harvests');
  },

  /**
   * Retrieve a single harvest by ID.
   * @param {number|string} id Harvest ID
   * @returns {Promise<Object>} HarvestResponse
   */
  async getHarvestById(id) {
    return api.get(`/harvests/${id}`);
  },

  /**
   * Retrieve all harvests for a specific crop cycle.
   * @param {number|string} cropCycleId Crop Cycle ID
   * @returns {Promise<Array>} List of HarvestResponse
   */
  async getHarvestsByCropCycle(cropCycleId) {
    return api.get(`/crop-cycles/${cropCycleId}/harvests`);
  },

  /**
   * Retrieve all harvests for a specific field parcel.
   * @param {number|string} fieldId Field ID
   * @returns {Promise<Array>} List of HarvestResponse
   */
  async getHarvestsByField(fieldId) {
    return api.get(`/fields/${fieldId}/harvests`);
  },

  /**
   * Retrieve all harvests for a specific farm holding.
   * @param {number|string} farmId Farm ID
   * @returns {Promise<Array>} List of HarvestResponse
   */
  async getHarvestsByFarm(farmId) {
    return api.get(`/farms/${farmId}/harvests`);
  },

  /**
   * Create a new harvest intake against a specific crop cycle.
   * Note: cropCycleId is passed in the URL path.
   * @param {number|string} cropCycleId Crop Cycle ID
   * @param {Object} payload HarvestRequest
   * @returns {Promise<Object>} HarvestResponse
   */
  async createHarvest(cropCycleId, payload) {
    return api.post(`/crop-cycles/${cropCycleId}/harvests`, payload);
  },

  /**
   * Update an existing harvest record and adjust inventory distribution.
   * @param {number|string} id Harvest ID
   * @param {Object} payload HarvestRequest
   * @returns {Promise<Object>} HarvestResponse
   */
  async updateHarvest(id, payload) {
    return api.put(`/harvests/${id}`, payload);
  },

  /**
   * Delete a harvest record.
   * Note: Blocked on backend if recorded commercial sales exist.
   * @param {number|string} id Harvest ID
   * @returns {Promise<void>}
   */
  async deleteHarvest(id) {
    return api.delete(`/harvests/${id}`);
  },
};

export default harvestService;

import api from './api';

/**
 * Farm Service
 * Communicates with backend endpoints:
 *   GET    /api/v1/farms
 *   GET    /api/v1/farms/{id}
 *   POST   /api/v1/farms
 *   PUT    /api/v1/farms/{id}
 *   DELETE /api/v1/farms/{id}
 */
export const farmService = {
  /**
   * Retrieve all farms for the authenticated user.
   * @returns {Promise<Array>} List of FarmResponse
   */
  async getAllFarms() {
    return api.get('/farms');
  },

  /**
   * Retrieve a specific farm by ID.
   * @param {number|string} id Farm ID
   * @returns {Promise<Object>} FarmResponse
   */
  async getFarmById(id) {
    return api.get(`/farms/${id}`);
  },

  /**
   * Create a new farm.
   * @param {Object} payload FarmRequest { farmName, location, totalArea, areaUnit, description, status }
   * @returns {Promise<Object>} FarmResponse
   */
  async createFarm(payload) {
    return api.post('/farms', payload);
  },

  /**
   * Update an existing farm.
   * @param {number|string} id Farm ID
   * @param {Object} payload FarmRequest
   * @returns {Promise<Object>} FarmResponse
   */
  async updateFarm(id, payload) {
    return api.put(`/farms/${id}`, payload);
  },

  /**
   * Delete a farm and all associated fields/soil records.
   * @param {number|string} id Farm ID
   * @returns {Promise<void>}
   */
  async deleteFarm(id) {
    return api.delete(`/farms/${id}`);
  },
};

export default farmService;


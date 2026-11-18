import api from './api';

const VALID_ADVISORY_STATUSES = ['ACKNOWLEDGED', 'DISMISSED'];

/**
 * Agronomic Advisory Service
 * Communicates with backend REST endpoints:
 *   GET   /api/v1/farms/{farmId}/advisories
 *   POST  /api/v1/farms/{farmId}/advisories/evaluate
 *   GET   /api/v1/advisories
 *   PATCH /api/v1/advisories/{id}/status
 */
export const advisoryService = {
  /**
   * Retrieve all agronomic advisories for a specific farm holding.
   * @param {number|string} farmId Farm holding ID
   * @param {Object} [params={}] Query parameters (e.g. { status: 'ACTIVE' })
   * @returns {Promise<Array>} List of AdvisoryResponse
   */
  async getFarmAdvisories(farmId, params = {}) {
    return api.get(`/farms/${farmId}/advisories`, { params });
  },

  /**
   * Explicitly evaluate the advisory rule engine against current farm snapshot and standing crops.
   * @param {number|string} farmId Farm holding ID
   * @returns {Promise<Array>} List of newly evaluated AdvisoryResponse
   */
  async evaluateFarmAdvisories(farmId) {
    return api.post(`/farms/${farmId}/advisories/evaluate`);
  },

  /**
   * Retrieve all agronomic advisories across all user farm holdings.
   * @param {Object} [params={}] Query parameters (e.g. { status: 'ACTIVE' })
   * @returns {Promise<Array>} List of AdvisoryResponse
   */
  async getAllAdvisories(params = {}) {
    return api.get('/advisories', { params });
  },

  /**
   * Update the status of an advisory (e.g., ACKNOWLEDGED or DISMISSED).
   * @param {number|string} id Advisory ID
   * @param {'ACKNOWLEDGED'|'DISMISSED'} status Target status
   * @returns {Promise<Object>} AdvisoryResponse
   */
  async updateStatus(id, status) {
    if (!VALID_ADVISORY_STATUSES.includes(status)) {
      throw new Error(
        `Invalid advisory status: "${status}". Must be one of: ${VALID_ADVISORY_STATUSES.join(', ')}`
      );
    }
    return api.patch(`/advisories/${id}/status`, { status });
  },
};

export default advisoryService;

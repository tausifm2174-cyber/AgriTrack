import api from './api';

/**
 * Sale Service
 * Communicates with backend REST endpoints:
 *   GET    /api/v1/sales
 *   GET    /api/v1/sales/{id}
 *   GET    /api/v1/harvests/{harvestId}/sales
 *   POST   /api/v1/harvests/{harvestId}/sales
 *   PUT    /api/v1/sales/{id}
 *   DELETE /api/v1/sales/{id}
 */
export const saleService = {
  /**
   * Retrieve all commercial sales records for the authenticated user.
   * @returns {Promise<Array>} List of SaleResponse
   */
  async getAllSales() {
    return api.get('/sales');
  },

  /**
   * Retrieve a single sale record by ID.
   * @param {number|string} id Sale ID
   * @returns {Promise<Object>} SaleResponse
   */
  async getSaleById(id) {
    return api.get(`/sales/${id}`);
  },

  /**
   * Retrieve all sales linked to a specific harvest lot.
   * @param {number|string} harvestId Harvest ID
   * @returns {Promise<Array>} List of SaleResponse
   */
  async getSalesByHarvest(harvestId) {
    return api.get(`/harvests/${harvestId}/sales`);
  },

  /**
   * Create a commercial sale transaction against a harvest lot.
   * Note: harvestId is passed in the URL path.
   * @param {number|string} harvestId Harvest ID
   * @param {Object} payload SaleRequest
   * @returns {Promise<Object>} SaleResponse
   */
  async createSale(harvestId, payload) {
    return api.post(`/harvests/${harvestId}/sales`, payload);
  },

  /**
   * Update an existing sale transaction and reconcile inventory differences.
   * @param {number|string} id Sale ID
   * @param {Object} payload SaleRequest
   * @returns {Promise<Object>} SaleResponse
   */
  async updateSale(id, payload) {
    return api.put(`/sales/${id}`, payload);
  },

  /**
   * Delete a sale transaction and automatically refund sold inventory to the harvest lot.
   * @param {number|string} id Sale ID
   * @returns {Promise<void>}
   */
  async deleteSale(id) {
    return api.delete(`/sales/${id}`);
  },
};

export default saleService;

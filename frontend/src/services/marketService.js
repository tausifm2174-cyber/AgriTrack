import api from './api';

/**
 * Market Price Service
 * Communicates with backend REST endpoints:
 *   GET /api/v1/market-prices
 *   GET /api/v1/market-prices/{id}
 */
export const marketService = {
  /**
   * Retrieve official APMC mandi market benchmark prices with optional filters.
   * @param {Object} [params={}] Filter parameters: crop, market, trend, date, dateFrom, dateTo
   * @returns {Promise<Array>} List of MarketPriceResponse
   */
  async getMarketPrices(params = {}) {
    return api.get('/market-prices', { params });
  },

  /**
   * Retrieve a single APMC market price benchmark record by ID.
   * @param {number|string} id Market price ID
   * @returns {Promise<Object>} MarketPriceResponse
   */
  async getMarketPriceById(id) {
    return api.get(`/market-prices/${id}`);
  },
};

export default marketService;

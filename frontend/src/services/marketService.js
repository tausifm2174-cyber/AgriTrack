import api from './api';

/**
 * Market Price Service
 * Communicates with backend REST endpoints:
 *   GET /api/v1/market-prices
 *   GET /api/v1/market-prices/{id}
 *   GET /api/v1/market-prices/markets?state=...
 *   GET /api/v1/market-prices/history?state=...&crop=...&market=...&from=...&to=...
 */
export const marketService = {
  /**
   * Retrieve official APMC mandi market benchmark prices with optional filters.
   * @param {Object} [params={}] Filter parameters: state, district, crop, market, trend, date, dateFrom, dateTo
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

  /**
   * Retrieve available APMC markets for a specific state from the live Mandi provider.
   * @param {string} state State name (e.g. "Karnataka")
   * @returns {Promise<Array>} List of { market: string, district: string }
   */
  async getMarkets(state) {
    return api.get('/market-prices/markets', { params: { state } });
  },

  /**
   * Retrieve historical price series for an APMC commodity from the live Mandi provider.
   * @param {Object} params { state, crop, market, from, to }
   * @returns {Promise<Array>} List of { date: string, price: number, minPrice: number, maxPrice: number }
   */
  async getPriceHistory(params = {}) {
    return api.get('/market-prices/history', { params });
  },
};

export default marketService;

import api from './api';

/**
 * Financial Analytics Service
 * Communicates with backend REST endpoints:
 *   GET /api/v1/financials/profit-loss
 *   GET /api/v1/financials/monthly-trend
 */
export const financialService = {
  /**
   * Retrieve aggregate Profit & Loss (P&L) summary metrics,
   * crop-wise performance, farm performance, category breakdown, and monthly trends.
   * @param {Object} [params={}] Filter parameters (farmId, cropCycleId, startDate, endDate)
   * @returns {Promise<Object>} ProfitLossSummaryResponse
   */
  async getProfitLossSummary(params = {}) {
    return api.get('/financials/profit-loss', { params });
  },

  /**
   * Retrieve monthly revenue, expense, and net profit trends for a specific year and farm scope.
   * @param {Object} [params={}] Filter parameters (year, farmId, startDate, endDate)
   * @returns {Promise<Array>} List of MonthlyFinancialSummary
   */
  async getMonthlyTrend(params = {}) {
    return api.get('/financials/monthly-trend', { params });
  },
};

export default financialService;

import api from './api';

/**
 * Canonical Constants for Operational Expenses (matching backend ExpenseService)
 */
export const CANONICAL_CATEGORIES = [
  'Seeds',
  'Fertilizer',
  'Pesticides',
  'Irrigation',
  'Labour',
  'Machinery',
  'Fuel',
  'Transport',
  'Soil Testing',
  'Other',
];

export const CANONICAL_PAYMENT_METHODS = [
  'CASH',
  'UPI',
  'BANK_TRANSFER',
  'CHEQUE',
];

export const CANONICAL_PAYMENT_STATUSES = [
  'PAID',
  'PENDING',
];

/**
 * Expense Service
 * Communicates with backend REST endpoints:
 *   POST   /api/v1/expenses
 *   GET    /api/v1/expenses
 *   GET    /api/v1/expenses/summary
 *   GET    /api/v1/expenses/{id}
 *   PUT    /api/v1/expenses/{id}
 *   DELETE /api/v1/expenses/{id}
 */
export const expenseService = {
  /**
   * Retrieve all operational expenses with optional multi-criteria filters.
   * @param {Object} [params={}] Filter parameters (farmId, fieldId, cropCycleId, category, paymentStatus, startDate, endDate)
   * @returns {Promise<Array>} List of ExpenseResponse
   */
  async getAllExpenses(params = {}) {
    return api.get('/expenses', { params });
  },

  /**
   * Retrieve aggregate expense summary metrics and category distribution.
   * @param {Object} [params={}] Filter parameters (farmId, cropCycleId, startDate, endDate)
   * @returns {Promise<Object>} ExpenseSummaryResponse
   */
  async getExpenseSummary(params = {}) {
    return api.get('/expenses/summary', { params });
  },

  /**
   * Retrieve a single expense voucher by ID.
   * @param {number|string} id Expense ID
   * @returns {Promise<Object>} ExpenseResponse
   */
  async getExpenseById(id) {
    return api.get(`/expenses/${id}`);
  },

  /**
   * Record a new operational expenditure voucher.
   * @param {Object} payload ExpenseRequest
   * @returns {Promise<Object>} ExpenseResponse
   */
  async createExpense(payload) {
    return api.post('/expenses', payload);
  },

  /**
   * Update an existing operational expenditure voucher.
   * @param {number|string} id Expense ID
   * @param {Object} payload ExpenseRequest
   * @returns {Promise<Object>} ExpenseResponse
   */
  async updateExpense(id, payload) {
    return api.put(`/expenses/${id}`, payload);
  },

  /**
   * Delete an operational expenditure voucher by ID.
   * @param {number|string} id Expense ID
   * @returns {Promise<void>}
   */
  async deleteExpense(id) {
    return api.delete(`/expenses/${id}`);
  },
};

export default expenseService;

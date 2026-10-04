/**
 * Utility helpers for AgriTrack (Indian Agricultural Context)
 */

/**
 * Formats a numeric value into Indian Rupee currency format (₹)
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats area in Acres
 * @param {number} acres
 * @returns {string}
 */
export function formatAcres(acres) {
  if (!acres && acres !== 0) return '0.00 Acres';
  return `${Number(acres).toFixed(2)} Acres`;
}

/**
 * Formats weights in Quintals or Kg
 * @param {number} qty
 * @param {'quintal' | 'kg'} [unit='quintal']
 * @returns {string}
 */
export function formatWeight(qty, unit = 'quintal') {
  if (!qty && qty !== 0) return `0 ${unit === 'quintal' ? 'q' : 'kg'}`;
  return `${Number(qty).toLocaleString('en-IN')} ${unit === 'quintal' ? 'q' : 'kg'}`;
}

/**
 * Formats a percentage value
 * @param {number} val
 * @param {number} [decimals=1]
 * @returns {string}
 */
export function formatPercentage(val, decimals = 1) {
  if (val === undefined || val === null || isNaN(val)) return '0.0%';
  return `${Number(val).toFixed(decimals)}%`;
}

/**
 * Utility helpers for AgriTrack (Indian Agricultural Context)
 */

/**
 * Formats a numeric value into Indian Rupee currency format (₹)
 * Always maintains Indian Rupees (INR) across all languages
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
 * Formats area in Acres with optional translation function
 * @param {number} acres
 * @param {Function} [t]
 * @returns {string}
 */
export function formatAcres(acres, t) {
  const unitLabel = t ? t('units.acres', 'Acres') : 'Acres';
  if (!acres && acres !== 0) return `0.00 ${unitLabel}`;
  return `${Number(acres).toFixed(2)} ${unitLabel}`;
}

/**
 * Formats weights in Quintals or Kg
 * @param {number} qty
 * @param {'quintal' | 'kg'} [unit='quintal']
 * @param {Function} [t]
 * @returns {string}
 */
export function formatWeight(qty, unit = 'quintal', t) {
  const unitLabel = t
    ? (unit === 'quintal' ? t('units.q', 'q') : t('units.kg', 'kg'))
    : (unit === 'quintal' ? 'q' : 'kg');
  if (!qty && qty !== 0) return `0 ${unitLabel}`;
  return `${Number(qty).toLocaleString('en-IN')} ${unitLabel}`;
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

/**
 * Formats a date string into Indian or localized date format
 * @param {string|Date} date
 * @param {string} [lang='en-IN']
 * @returns {string}
 */
export function formatDate(date, lang = 'en-IN') {
  if (!date) return '';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return String(date);
    return new Intl.DateTimeFormat(lang || 'en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return String(date);
  }
}

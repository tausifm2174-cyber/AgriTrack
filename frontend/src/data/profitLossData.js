/**
 * AgriTrack Profit & Loss Analysis Demo Data (Phase 8)
 * Connects directly to Revenue (Sales) and Expense records.
 * Provides monthly comparisons and project PPT benchmark references.
 */

export const FINANCIAL_DATA_DISCLAIMER =
  'Demo Financial Data: Figures displayed here are sample operational values for demonstration and do not represent actual certified accounting or banking accounts.';

/**
 * Illustrative PPT Case Reference
 * Revenue: ₹50,000 | Expenses: ₹32,000 | Net Profit: ₹18,000 | Margin: 36.0%
 */
export const PPT_FINANCIAL_REFERENCE = {
  label: 'PPT Project Benchmark Model',
  revenue: 50000,
  expenses: 32000,
  netProfit: 18000,
  netMargin: 36.0,
};

/**
 * Monthly trend series (derived from Kharif/Rabi demo cycles)
 */
export const monthlyProfitTrend = [
  { month: 'Jun 2026', revenue: 18000, expenses: 14500, profit: 3500, margin: 19.4 },
  { month: 'Jul 2026', revenue: 22000, expenses: 16800, profit: 5200, margin: 23.6 },
  { month: 'Aug 2026', revenue: 31000, expenses: 21500, profit: 9500, margin: 30.6 },
  { month: 'Sep 2026', revenue: 47800, expenses: 31200, profit: 16600, margin: 34.7 },
  { month: 'Oct 2026', revenue: 168500, expenses: 98900, profit: 69600, margin: 41.3 },
];

/**
 * AgriTrack Financial Calculation Engine (Phase 8)
 * Pure deterministic calculations for Expenses, Revenue, and Profit & Loss.
 * Keeps business logic decoupled from UI presentation.
 */

/**
 * Filter sales records by farm, crop, market, and date range.
 * Rule: completed/confirmed sales count towards recognized gross revenue.
 * Cancelled sales are excluded.
 */
export function filterSales(sales = [], { farmId = 'ALL', crop = 'ALL', market = 'ALL', status = 'ALL', period = 'ALL' } = {}) {
  return sales.filter((sale) => {
    if (sale.status === 'CANCELLED') return false;
    if (status !== 'ALL' && sale.status !== status) return false;
    if (farmId !== 'ALL' && sale.farmId !== farmId) return false;
    if (crop !== 'ALL' && sale.cropName?.toLowerCase() !== crop.toLowerCase()) return false;
    if (market !== 'ALL' && sale.market !== market) return false;

    if (period !== 'ALL') {
      const saleDate = sale.saleDate;
      if (period === 'THIS_MONTH') {
        if (!saleDate.startsWith('2026-10')) return false;
      } else if (period === 'PREVIOUS_MONTH') {
        if (!saleDate.startsWith('2026-09')) return false;
      }
    }
    return true;
  });
}

/**
 * Filter expense records by farm, field, crop, category, status, and period.
 */
export function filterExpenses(expenses = [], { farmId = 'ALL', fieldId = 'ALL', crop = 'ALL', category = 'ALL', status = 'ALL', period = 'ALL', search = '' } = {}) {
  return expenses.filter((exp) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchId = exp.id?.toLowerCase().includes(q);
      const matchDesc = exp.description?.toLowerCase().includes(q);
      const matchVendor = exp.vendor?.toLowerCase().includes(q);
      const matchFarm = exp.farmName?.toLowerCase().includes(q);
      const matchField = exp.fieldName?.toLowerCase().includes(q);
      const matchCrop = exp.cropName?.toLowerCase().includes(q);
      if (!matchId && !matchDesc && !matchVendor && !matchFarm && !matchField && !matchCrop) {
        return false;
      }
    }

    if (farmId !== 'ALL' && exp.farmId !== farmId) return false;
    if (fieldId !== 'ALL' && exp.fieldId !== fieldId) return false;
    if (crop !== 'ALL' && exp.cropName?.toLowerCase() !== crop.toLowerCase()) return false;
    if (category !== 'ALL' && exp.category !== category) return false;
    if (status !== 'ALL' && exp.status !== status) return false;

    if (period !== 'ALL') {
      const expDate = exp.date;
      if (period === 'THIS_MONTH') {
        if (!expDate.startsWith('2026-10')) return false;
      } else if (period === 'PREVIOUS_MONTH') {
        if (!expDate.startsWith('2026-09')) return false;
      }
    }
    return true;
  });
}

/**
 * Calculate total revenue from a list of sales.
 */
export function calculateTotalRevenue(sales = []) {
  return sales.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
}

/**
 * Calculate total collected amount from a list of sales.
 */
export function calculateCollectedRevenue(sales = []) {
  return sales.reduce((acc, curr) => acc + (curr.paidAmount || 0), 0);
}

/**
 * Calculate total pending balance from a list of sales.
 */
export function calculatePendingRevenue(sales = []) {
  return sales.reduce((acc, curr) => acc + (curr.balanceDue || 0), 0);
}

/**
 * Calculate total expenses from an array of expense records.
 */
export function calculateTotalExpenses(expenses = []) {
  return expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);
}

/**
 * Calculate paid expenses.
 */
export function calculatePaidExpenses(expenses = []) {
  return expenses
    .filter((e) => e.status === 'PAID')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);
}

/**
 * Calculate pending expenses.
 */
export function calculatePendingExpenses(expenses = []) {
  return expenses
    .filter((e) => e.status === 'PENDING')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);
}

/**
 * Core P&L: Net Profit = Total Revenue - Total Expenses
 */
export function calculateNetProfit(totalRevenue, totalExpenses) {
  return totalRevenue - totalExpenses;
}

/**
 * Core P&L: Net Margin = (Net Profit / Total Revenue) * 100
 */
export function calculateNetMargin(totalRevenue, netProfit) {
  if (!totalRevenue || totalRevenue <= 0) return 0;
  return Number(((netProfit / totalRevenue) * 100).toFixed(1));
}

/**
 * Cost per Quintal = Total Expenses / Total Harvest Yield in Quintals
 */
export function calculateCostPerQuintal(totalExpenses, harvestYieldKg) {
  const yieldQuintals = harvestYieldKg / 100;
  if (!yieldQuintals || yieldQuintals <= 0) return 0;
  return Math.round(totalExpenses / yieldQuintals);
}

/**
 * Aggregates expenses by category.
 * Returns array of: { category, amount, count, percentage }
 */
export function calculateExpensesByCategory(expenses = []) {
  const total = calculateTotalExpenses(expenses);
  const map = {};

  expenses.forEach((e) => {
    const cat = e.category || 'Other';
    if (!map[cat]) {
      map[cat] = { category: cat, amount: 0, count: 0 };
    }
    map[cat].amount += e.amount || 0;
    map[cat].count += 1;
  });

  return Object.values(map)
    .map((item) => ({
      ...item,
      percentage: total > 0 ? Number(((item.amount / total) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}

/**
 * Aggregates revenue and sales quantity by crop.
 */
export function calculateRevenueByCrop(sales = []) {
  const map = {};

  sales.forEach((s) => {
    const crop = s.cropName || 'Unknown';
    if (!map[crop]) {
      map[crop] = { crop, revenue: 0, quantityKg: 0, salesCount: 0 };
    }
    map[crop].revenue += s.totalAmount || 0;
    map[crop].quantityKg += s.quantityKg || 0;
    map[crop].salesCount += 1;
  });

  return Object.values(map).sort((a, b) => b.revenue - a.revenue);
}

/**
 * Comprehensive Crop-level P&L.
 * Matches sales and expenses for each crop.
 */
export function calculateProfitByCrop(sales = [], expenses = []) {
  const crops = new Set([
    ...sales.map((s) => s.cropName),
    ...expenses.map((e) => e.cropName),
  ].filter(Boolean));

  return Array.from(crops).map((crop) => {
    const cropSales = sales.filter((s) => s.cropName?.toLowerCase() === crop.toLowerCase());
    const cropExpenses = expenses.filter((e) => e.cropName?.toLowerCase() === crop.toLowerCase());

    const revenue = calculateTotalRevenue(cropSales);
    const expense = calculateTotalExpenses(cropExpenses);
    const profit = revenue - expense;
    const margin = revenue > 0 ? Number(((profit / revenue) * 100).toFixed(1)) : 0;
    const quantityKg = cropSales.reduce((acc, c) => acc + (c.quantityKg || 0), 0);

    return {
      crop,
      revenue,
      expense,
      profit,
      margin,
      quantityKg,
      salesCount: cropSales.length,
      expenseCount: cropExpenses.length,
    };
  }).sort((a, b) => b.profit - a.profit);
}

/**
 * Comprehensive Farm-level P&L.
 */
export function calculateProfitByFarm(sales = [], expenses = [], farms = []) {
  const farmList = farms.length > 0 ? farms : [
    { id: 'farm-1', name: 'Green Valley Farm' },
    { id: 'farm-2', name: 'Sunrise Agricultural Holding' },
    { id: 'farm-3', name: 'Riverbank Farm' },
  ];

  return farmList.map((farm) => {
    const farmSales = sales.filter((s) => s.farmId === farm.id);
    const farmExpenses = expenses.filter((e) => e.farmId === farm.id);

    const revenue = calculateTotalRevenue(farmSales);
    const expense = calculateTotalExpenses(farmExpenses);
    const profit = revenue - expense;
    const margin = revenue > 0 ? Number(((profit / revenue) * 100).toFixed(1)) : 0;

    return {
      farmId: farm.id,
      farmName: farm.name,
      revenue,
      expense,
      profit,
      margin,
      salesCount: farmSales.length,
      expenseCount: farmExpenses.length,
    };
  }).sort((a, b) => b.profit - a.profit);
}

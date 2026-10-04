/**
 * AgriTrack Revenue Management Demo Data (Phase 8)
 * Grounded directly in Phase 7 Sales Records.
 * Ensures 100% mathematical consistency across Sales, Revenue, and Profit & Loss.
 */

import { salesRecords } from './salesData.js';

/**
 * Returns revenue entries mapped directly from commercial sales records.
 * Revenue = Quantity x Realized Sale Price
 */
export const getRevenueFromSales = (sales = salesRecords) => {
  return sales.map((s) => ({
    id: `REV-${s.id}`,
    saleId: s.id,
    invoiceNumber: s.invoiceNumber,
    saleDate: s.saleDate,
    cropId: s.cropId,
    cropName: s.cropName,
    variety: s.variety,
    farmId: s.farmId,
    farmName: s.farmName,
    fieldId: s.fieldId,
    fieldName: s.fieldName,
    buyerName: s.buyerName,
    market: s.market,
    quantityKg: s.quantityKg,
    pricePerKg: s.pricePerKg,
    pricePerQuintal: s.pricePerQuintal,
    grossRevenue: s.totalAmount,
    amountReceived: s.paidAmount,
    balanceDue: s.balanceDue,
    paymentStatus: s.paymentStatus,
    saleStatus: s.status,
    paymentMethod: s.paymentMethod,
    referenceMarketPricePerQ: s.referenceMarketPricePerQ,
    notes: s.notes,
  }));
};

export const initialRevenueRecords = getRevenueFromSales(salesRecords);

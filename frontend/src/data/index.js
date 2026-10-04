// AgriTrack mock and demo data modules
export { dashboardData } from './dashboardData';
export { farmData } from './farmData';
export { fieldData } from './fieldData';
export { soilData } from './soilData';
export {
  cropCycles,
  cropTypes,
  cropLifecycleStages,
  cropCalendarEvents,
} from './cropData';
export {
  currentWeather,
  farmWeather,
  weatherForecast,
  weatherAlerts,
} from './weatherData';
export {
  cropRecommendationRules,
  weatherAdvisoryRules,
} from './recommendationRules';
export { harvestRecords } from './harvestData';
export { salesRecords } from './salesData';
export {
  marketPriceRecords,
  MARKET_DATA_DISCLAIMER,
} from './marketPriceData';
export { expenseRecords, EXPENSE_CATEGORIES } from './expenseData';
export { getRevenueFromSales, initialRevenueRecords } from './revenueData';
export {
  FINANCIAL_DATA_DISCLAIMER,
  PPT_FINANCIAL_REFERENCE,
  monthlyProfitTrend,
} from './profitLossData';
export {
  NOTIFICATION_TYPES,
  NOTIFICATION_SEVERITIES,
  initialNotificationData,
  getNotificationSummary,
} from './notificationData';
export {
  ACTIVITY_TYPES,
  ACTIVITY_STATUSES,
  initialActivities,
  getActivitySummary,
} from './activityData';
export {
  IRRIGATION_METHODS,
  IRRIGATION_STATUSES,
  IRRIGATION_PRIORITIES,
  initialIrrigationRecords,
  getIrrigationSummary,
} from './irrigationData';

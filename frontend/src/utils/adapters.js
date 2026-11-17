/**
 * Entity Adapters for AgriTrack (Phase 22.2)
 * Cleanly maps backend DTOs to the UI component properties and formats.
 * Preserves backend authority without fabricating future domain data.
 */

/**
 * Adapt a backend FarmResponse to UI model.
 * @param {Object} farm Backend FarmResponse
 * @param {Array} [fields=[]] Optional list of Field entities to count
 * @returns {Object} UI Farm Model
 */
export function adaptFarm(farm, fields = []) {
  if (!farm) return null;

  const farmId = farm.id;
  const childFields = Array.isArray(fields)
    ? fields.filter((f) => String(f.farmId) === String(farmId))
    : [];

  return {
    id: farmId,
    name: farm.farmName || farm.name || 'Unnamed Farm',
    code: farm.code || `FRM-${String(farmId).padStart(3, '0')}`,
    location: farm.location || 'Location Not Specified',
    totalArea: farm.totalArea != null ? Number(farm.totalArea) : 0,
    areaAcres: farm.totalArea != null ? Number(farm.totalArea) : (farm.areaAcres != null ? Number(farm.areaAcres) : 0),
    areaUnit: farm.areaUnit || 'Acres',
    status: farm.status || 'Active',
    statusVariant: (farm.status || 'Active').toLowerCase() === 'active' ? 'success' : 'neutral',
    description: farm.description || '',
    notes: farm.description || farm.notes || '',
    fieldsCount: childFields.length,
    fieldIds: childFields.map((f) => f.id),
    primaryCrops: [],
    soilSummary: farm.soilSummary || '',
    irrigationSummary: farm.irrigationSummary || '',
    waterSource: farm.waterSource || '',
    owner: 'Farmer',
    createdAt: farm.createdAt,
    updatedAt: farm.updatedAt,
  };
}

/**
 * Adapt a backend FieldResponse to UI model.
 * @param {Object} field Backend FieldResponse
 * @param {Array} [cropCycles=[]] Optional list of CropCycle entities to associate standing crop
 * @returns {Object} UI Field Model
 */
export function adaptField(field, cropCycles = []) {
  if (!field) return null;

  const fieldId = field.id;
  const isIrrigated = Boolean(
    field.irrigationType &&
    field.irrigationType.toLowerCase() !== 'rainfed' &&
    field.irrigationType.toLowerCase() !== 'none'
  );

  const activeCrop = Array.isArray(cropCycles)
    ? cropCycles.find((c) => String(c.fieldId) === String(fieldId) && c.status !== 'Completed' && c.status !== 'Inactive')
    : null;

  return {
    id: fieldId,
    farmId: field.farmId,
    farmName: field.farmName || '',
    name: field.fieldName || field.name || `Field #${fieldId}`,
    code: field.code || `FLD-${fieldId}`,
    area: field.area != null ? Number(field.area) : 0,
    areaAcres: field.area != null ? Number(field.area) : (field.areaAcres != null ? Number(field.areaAcres) : 0),
    areaUnit: field.areaUnit || 'Acres',
    soilType: field.soilType || 'Not specified',
    irrigationType: field.irrigationType || 'Rainfed',
    irrigationMethod: field.irrigationType || field.irrigationMethod || 'Rainfed',
    isIrrigated,
    status: field.status || 'Active',
    healthStatus: field.status || 'Active',
    healthVariant: (field.status || 'Active').toLowerCase() === 'active' ? 'success' : 'neutral',
    description: field.description || '',
    notes: field.description || field.notes || '',
    currentCrop: activeCrop ? activeCrop.cropName : null,
    cropVariety: activeCrop ? activeCrop.variety : '',
    cropSeason: activeCrop ? activeCrop.season : '',
    cropStage: activeCrop ? activeCrop.currentStage : '',
    cropProgress: activeCrop?.progressPercent != null ? Number(activeCrop.progressPercent) : null,
    soilHealthStatus: 'Good',
    soilHealthVariant: 'success',
    createdAt: field.createdAt,
    updatedAt: field.updatedAt,
  };
}

/**
 * Adapt a backend SoilRecordResponse to UI model.
 * @param {Object} record Backend SoilRecordResponse
 * @returns {Object} UI Soil Record Model
 */
export function adaptSoilRecord(record) {
  if (!record) return null;

  const phVal = record.ph != null ? Number(record.ph) : null;
  const nVal = record.nitrogen != null ? Number(record.nitrogen) : null;
  const pVal = record.phosphorus != null ? Number(record.phosphorus) : null;
  const kVal = record.potassium != null ? Number(record.potassium) : null;
  const ocVal = record.organicMatter != null ? Number(record.organicMatter) : (record.organicCarbon != null ? Number(record.organicCarbon) : null);
  const moistVal = record.moisture != null ? Number(record.moisture) : (record.moisturePercent != null ? Number(record.moisturePercent) : null);

  // Compute display status based on agronomic thresholds
  let computedStatus = 'Good';
  let computedVariant = 'success';
  if (phVal !== null && (phVal < 6.0 || phVal > 8.0)) {
    computedStatus = 'Needs Attention';
    computedVariant = 'danger';
  } else if (phVal !== null && (phVal < 6.5 || phVal > 7.5)) {
    computedStatus = 'Moderate';
    computedVariant = 'warning';
  }

  return {
    id: record.id,
    fieldId: record.fieldId,
    fieldName: record.fieldName || `Field #${record.fieldId}`,
    farmId: record.farmId || '',
    farmName: record.farmName || '',
    testDate: record.recordedAt || record.testDate || '',
    testedDaysAgo: record.recordedAt || 'Logged',
    soilType: record.soilType || 'Not specified',
    ph: phVal,
    phRating: phVal != null ? (phVal >= 6.5 && phVal <= 7.5 ? 'Neutral (Optimal)' : phVal < 6.5 ? 'Acidic' : 'Alkaline') : 'Unspecified',
    phStatus: computedVariant,
    nitrogen: nVal,
    nitrogenRating: nVal != null ? (nVal >= 280 ? 'High' : nVal >= 200 ? 'Medium' : 'Low') : 'Unspecified',
    nitrogenBenchmark: '280–560 kg/ha',
    phosphorus: pVal,
    phosphorusRating: pVal != null ? (pVal >= 20 ? 'High' : pVal >= 12 ? 'Medium' : 'Low') : 'Unspecified',
    phosphorusBenchmark: '11–22 kg/ha',
    potassium: kVal,
    potassiumRating: kVal != null ? (kVal >= 280 ? 'High' : kVal >= 180 ? 'Medium' : 'Low') : 'Unspecified',
    potassiumBenchmark: '140–280 kg/ha',
    organicCarbon: ocVal,
    organicCarbonRating: ocVal != null ? (ocVal >= 0.75 ? 'High' : ocVal >= 0.5 ? 'Medium' : 'Low') : 'Unspecified',
    moisturePercent: moistVal,
    moistureRating: moistVal != null ? (moistVal >= 35 ? 'Optimal' : 'Low') : 'Unspecified',
    status: computedStatus,
    statusVariant: computedVariant,
    recommendations: record.notes || '',
    sampleId: `SOIL-${record.id}`,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

/**
 * Adapt a backend CropCycleResponse to UI model.
 * @param {Object} cycle Backend CropCycleResponse
 * @param {Object} [field=null] Optional matching Field model to derive acreage, soil type, and irrigation
 * @returns {Object} UI Crop Cycle Model
 */
export function adaptCropCycle(cycle, field = null) {
  if (!cycle) return null;

  const cycleId = cycle.id;
  const stageStep = cycle.currentStageStep != null ? Number(cycle.currentStageStep) : 1;
  const progressPercent = cycle.progressPercent != null ? Number(cycle.progressPercent) : null;
  const status = cycle.status || 'Active';

  // Evaluate status variant
  let statusVariant = 'success';
  const lowerStatus = status.toLowerCase();
  if (lowerStatus.includes('near') || lowerStatus.includes('harvest') || lowerStatus.includes('warning')) {
    statusVariant = 'warning';
  } else if (lowerStatus.includes('completed') || lowerStatus.includes('done')) {
    statusVariant = 'info';
  } else if (lowerStatus.includes('inactive') || lowerStatus.includes('failed') || lowerStatus.includes('cancelled')) {
    statusVariant = 'neutral';
  }

  // Derive field-level attributes from field if provided
  const areaAcres = field?.areaAcres != null ? Number(field.areaAcres) : (field?.area != null ? Number(field.area) : 0);
  const soilType = field?.soilType || null;
  const irrigationMethod = field?.irrigationType || field?.irrigationMethod || '';

  // Display-only 5-stage stepper array without fabricating historical dates
  const stageHistory = [
    { stage: 'Sowing', date: cycle.sowingDate || '', status: stageStep > 1 ? 'Completed' : (stageStep === 1 ? 'In Progress' : 'Upcoming'), notes: '' },
    { stage: 'Vegetative Growth', date: '', status: stageStep > 2 ? 'Completed' : (stageStep === 2 ? 'In Progress' : 'Upcoming'), notes: '' },
    { stage: 'Flowering', date: '', status: stageStep > 3 ? 'Completed' : (stageStep === 3 ? 'In Progress' : 'Upcoming'), notes: '' },
    { stage: 'Ripening', date: '', status: stageStep > 4 ? 'Completed' : (stageStep === 4 ? 'In Progress' : 'Upcoming'), notes: '' },
    { stage: 'Harvest Readiness', date: cycle.expectedHarvestDate || '', status: stageStep === 5 ? 'In Progress' : 'Upcoming', notes: '' },
  ];

  return {
    id: cycleId,
    cropName: cycle.cropName || 'Unnamed Crop',
    variety: cycle.variety || '',
    category: cycle.category ?? field?.cropCategory ?? null,
    farmId: cycle.farmId || field?.farmId || '',
    farmName: cycle.farmName || field?.farmName || '',
    fieldId: cycle.fieldId || field?.id || '',
    fieldName: cycle.fieldName || field?.name || (cycle.fieldId ? `Field #${cycle.fieldId}` : ''),
    areaAcres,
    season: cycle.season || '',
    soilType,
    sowingDate: cycle.sowingDate || '',
    expectedHarvestDate: cycle.expectedHarvestDate || '',
    actualHarvestDate: cycle.actualHarvestDate || '',
    currentStage: cycle.currentStage || 'Sowing',
    currentStageStep: stageStep,
    progressPercent,
    status,
    statusVariant,
    irrigationMethod,
    upcomingMilestone: cycle.currentStage === 'Harvest Readiness' ? 'Harvesting' : (cycle.currentStage ? `${cycle.currentStage} Monitoring` : ''),
    upcomingMilestoneDate: cycle.expectedHarvestDate || '',
    yieldEstimate: null,
    notes: cycle.notes || '',
    stageHistory,
    createdAt: cycle.createdAt,
    updatedAt: cycle.updatedAt,
  };
}

/**
 * Adapt a backend ActivityResponse to UI model.
 * @param {Object} activity Backend ActivityResponse
 * @param {Object} [fieldsMap={}] Optional field lookup map
 * @param {Object} [farmsMap={}] Optional farm lookup map
 * @returns {Object} UI Activity Model
 */
export function adaptActivity(activity, fieldsMap = {}, farmsMap = {}) {
  if (!activity) return null;

  const fieldId = activity.fieldId ?? null;
  const farmId = activity.farmId ?? fieldsMap[fieldId]?.farmId ?? null;
  const farmName = activity.farmName || farmsMap[farmId]?.name || '';
  const fieldName = activity.fieldName || fieldsMap[fieldId]?.name || '';
  const cropCycleId = activity.cropCycleId ?? null;
  const cropName = activity.cropName || '';
  const duration = activity.durationHours != null ? Number(activity.durationHours) : null;
  const quantity = activity.quantity != null ? Number(activity.quantity) : null;

  return {
    id: activity.id,
    activityType: activity.activityType || 'Other',
    title: activity.title || '',
    status: activity.status || 'Planned',
    priority: activity.priority || 'Medium',
    date: activity.activityDate || '',
    activityDate: activity.activityDate || '',
    time: activity.activityTime || '',
    activityTime: activity.activityTime || '',
    duration,
    durationHours: duration,
    operator: activity.operator || '',
    quantity,
    quantityUnit: activity.quantityUnit || '',
    description: activity.description || '',
    notes: activity.notes || '',
    farmId,
    farmName,
    fieldId,
    fieldName,
    cropCycleId,
    cropId: cropCycleId,
    cropName,
    createdAt: activity.createdAt,
    updatedAt: activity.updatedAt,
  };
}

/**
 * Adapt a backend IrrigationResponse to UI model.
 * @param {Object} schedule Backend IrrigationResponse
 * @param {Object} [fieldsMap={}] Optional field lookup map
 * @param {Object} [farmsMap={}] Optional farm lookup map
 * @returns {Object} UI Irrigation Schedule Model
 */
export function adaptIrrigation(schedule, fieldsMap = {}, farmsMap = {}) {
  if (!schedule) return null;

  const fieldId = schedule.fieldId ?? null;
  const farmId = schedule.farmId ?? fieldsMap[fieldId]?.farmId ?? null;
  const farmName = schedule.farmName || farmsMap[farmId]?.name || '';
  const fieldName = schedule.fieldName || fieldsMap[fieldId]?.name || '';
  const cropCycleId = schedule.cropCycleId ?? null;
  const cropName = schedule.cropName || '';
  const durationMinutes = schedule.durationMinutes != null ? Number(schedule.durationMinutes) : null;
  const waterVolumeLitres = schedule.waterVolumeLitres != null ? Number(schedule.waterVolumeLitres) : null;
  const soilMoisture = schedule.soilMoisture != null ? Number(schedule.soilMoisture) : null;
  const rainfallExpected = schedule.rainfallExpected != null ? Number(schedule.rainfallExpected) : null;

  return {
    id: schedule.id,
    title: schedule.title || '',
    irrigationMethod: schedule.irrigationMethod || 'Drip',
    status: schedule.status || 'Scheduled',
    priority: schedule.priority || 'Medium',
    scheduledDate: schedule.scheduledDate || '',
    scheduledTime: schedule.scheduledTime || '',
    durationMinutes,
    waterVolumeLitres,
    soilMoisture,
    weatherCondition: schedule.weatherCondition || '',
    rainfallExpected,
    completedAt: schedule.completedAt || null,
    notes: schedule.notes || '',
    farmId,
    farmName,
    fieldId,
    fieldName,
    cropCycleId,
    cropId: cropCycleId,
    cropName,
    createdAt: schedule.createdAt,
    updatedAt: schedule.updatedAt,
  };
}

/**
 * Adapt a backend HarvestResponse to UI model.
 * @param {Object} harvest Backend HarvestResponse
 * @param {Object} [cropCyclesMap={}] Optional crop cycle lookup map
 * @param {Object} [fieldsMap={}] Optional field lookup map
 * @param {Object} [farmsMap={}] Optional farm lookup map
 * @returns {Object} UI Harvest Model
 */
export function adaptHarvest(harvest, cropCyclesMap = {}, fieldsMap = {}, farmsMap = {}) {
  if (!harvest) return null;

  const cycleId = harvest.cropCycleId ?? null;
  const cycle = cropCyclesMap[cycleId] || {};
  const fieldId = harvest.fieldId ?? cycle.fieldId ?? null;
  const farmId = harvest.farmId ?? cycle.farmId ?? fieldsMap[fieldId]?.farmId ?? null;

  const cropName = harvest.cropName || cycle.cropName || '';
  const variety = harvest.variety || cycle.variety || '';
  const farmName = harvest.farmName || farmsMap[farmId]?.name || '';
  const fieldName = harvest.fieldName || fieldsMap[fieldId]?.name || '';
  const season = cycle.season || '';

  const harvestedQuantityKg = harvest.harvestedQuantityKg != null ? Number(harvest.harvestedQuantityKg) : 0;
  const availableQuantityKg = harvest.availableQuantityKg != null ? Number(harvest.availableQuantityKg) : 0;
  const soldQuantityKg = harvest.soldQuantityKg != null ? Number(harvest.soldQuantityKg) : 0;
  const expectedYieldKg = harvest.expectedYieldKg != null ? Number(harvest.expectedYieldKg) : 0;
  const qualityScore = harvest.qualityScore != null ? Number(harvest.qualityScore) : null;
  const moisturePercent = harvest.moisturePercent != null ? Number(harvest.moisturePercent) : null;

  return {
    id: harvest.id,
    cropCycleId: cycleId,
    cropName,
    variety,
    season,
    farmId,
    farmName,
    fieldId,
    fieldName,
    harvestDate: harvest.harvestDate || '',
    expectedYieldKg,
    harvestedQuantityKg,
    availableQuantityKg,
    soldQuantityKg,
    qualityGrade: harvest.qualityGrade || 'A',
    qualityScore,
    moisturePercent,
    status: harvest.status || 'HARVESTED',
    storageLocation: harvest.storageLocation || '',
    notes: harvest.notes || '',
    createdAt: harvest.createdAt,
    updatedAt: harvest.updatedAt,
  };
}

/**
 * Adapt a backend SaleResponse to UI model.
 * @param {Object} sale Backend SaleResponse
 * @param {Object} [harvestsMap={}] Optional harvest lookup map
 * @returns {Object} UI Sale Model
 */
export function adaptSale(sale, harvestsMap = {}) {
  if (!sale) return null;

  const harvestId = sale.harvestId ?? null;
  const harvest = harvestsMap[harvestId] || {};

  const quantityKg = sale.quantityKg != null ? Number(sale.quantityKg) : 0;
  const pricePerKg = sale.pricePerKg != null ? Number(sale.pricePerKg) : 0;
  const pricePerQuintal = sale.pricePerQuintal != null ? Number(sale.pricePerQuintal) : (pricePerKg > 0 ? Number((pricePerKg * 100).toFixed(2)) : 0);
  const totalAmount = sale.totalAmount != null ? Number(sale.totalAmount) : 0;
  const paidAmount = sale.paidAmount != null ? Number(sale.paidAmount) : 0;
  const balanceDue = sale.balanceDue != null ? Number(sale.balanceDue) : 0;
  const referenceMarketPricePerQ = sale.referenceMarketPricePerQ != null ? Number(sale.referenceMarketPricePerQ) : null;

  return {
    id: sale.id,
    harvestId,
    cropCycleId: sale.cropCycleId ?? harvest.cropCycleId ?? null,
    cropName: sale.cropName || harvest.cropName || '',
    variety: sale.variety || harvest.variety || '',
    farmId: sale.farmId ?? harvest.farmId ?? null,
    farmName: sale.farmName || harvest.farmName || '',
    fieldId: sale.fieldId ?? harvest.fieldId ?? null,
    fieldName: sale.fieldName || harvest.fieldName || '',
    buyerName: sale.buyerName || '',
    saleDate: sale.saleDate || '',
    quantityKg,
    pricePerKg,
    pricePerQuintal,
    totalAmount,
    market: sale.market || '',
    status: sale.status || 'COMPLETED',
    paymentStatus: sale.paymentStatus || 'PENDING',
    paidAmount,
    balanceDue,
    paymentMethod: sale.paymentMethod || '',
    invoiceNumber: sale.invoiceNumber || '',
    referenceMarketPricePerQ,
    notes: sale.notes || '',
    createdAt: sale.createdAt,
    updatedAt: sale.updatedAt,
  };
}

/**
 * Adapt a backend MarketPriceResponse to UI model.
 * @param {Object} record Backend MarketPriceResponse
 * @param {Array} [historyRecords=[]] Optional historical records for the same crop & market
 * @returns {Object} UI Market Price Model
 */
export function adaptMarketPrice(record, historyRecords = []) {
  if (!record) return null;

  const pricePerQuintal = record.pricePerQuintal != null ? Number(record.pricePerQuintal) : 0;
  const pricePerKg = record.pricePerKg != null ? Number(record.pricePerKg) : (pricePerQuintal > 0 ? pricePerQuintal / 100 : 0);
  const previousPrice = record.previousPrice != null ? Number(record.previousPrice) : pricePerQuintal;
  const change = record.priceChange != null ? Number(record.priceChange) : 0;
  const changePercent = record.changePercent != null ? Number(record.changePercent) : 0;

  const arrivalVolumeQ = record.arrivalVolumeQuintals != null ? Number(record.arrivalVolumeQuintals) : null;
  const minPrice = record.minPrice != null ? Number(record.minPrice) : null;
  const maxPrice = record.maxPrice != null ? Number(record.maxPrice) : null;

  const history = Array.isArray(historyRecords) && historyRecords.length > 0
    ? historyRecords
    : [];

  return {
    id: record.id,
    crop: record.cropName || '',
    cropName: record.cropName || '',
    variety: record.variety || '',
    market: record.marketName || '',
    marketName: record.marketName || '',
    location: record.location || '',
    pricePerQuintal,
    pricePerKg,
    previousPrice,
    change,
    changePercent,
    trend: record.trend || 'STABLE',
    qualityGrade: record.qualityGrade || 'A',
    date: record.priceDate || '',
    priceDate: record.priceDate || '',
    source: record.source || '',
    arrivalVolumeQ,
    arrivalVolumeQuintals: arrivalVolumeQ,
    minPrice,
    maxPrice,
    history,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

/**
 * Adapt a backend ExpenseResponse to UI model.
 * Preserves backend authority while providing backward-compatible aliases.
 * @param {Object} record Backend ExpenseResponse
 * @returns {Object} UI Expense Model
 */
export function adaptExpense(record) {
  if (!record) return null;

  const amount = record.amount != null ? Number(record.amount) : 0;
  const paymentStatus = record.paymentStatus || 'PAID';

  return {
    id: record.id,
    farmId: record.farmId,
    farmName: record.farmName || '',
    fieldId: record.fieldId ?? null,
    fieldName: record.fieldName || '',
    cropCycleId: record.cropCycleId ?? null,
    cropId: record.cropCycleId ?? null,
    cropName: record.cropName || '',
    category: record.category || 'Other',
    description: record.description || '',
    title: record.description || '',
    amount,
    expenseDate: record.expenseDate || '',
    date: record.expenseDate || '',
    vendorName: record.vendorName || '',
    vendor: record.vendorName || '',
    paymentMethod: record.paymentMethod || 'CASH',
    paymentStatus,
    status: paymentStatus,
    receiptNumber: record.receiptNumber || '',
    voucherNumber: record.receiptNumber || '',
    notes: record.notes || '',
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

/**
 * Adapt a backend CategoryExpenseSummary to UI model.
 * @param {Object} item Backend CategoryExpenseSummary
 * @returns {Object} UI Category Summary
 */
export function adaptExpenseCategorySummary(item) {
  if (!item) return null;
  const totalAmount = item.totalAmount != null ? Number(item.totalAmount) : (item.amount != null ? Number(item.amount) : 0);
  const percentage = item.percentageOfExpenses != null ? Number(item.percentageOfExpenses) : (item.percentage != null ? Number(item.percentage) : 0);

  return {
    category: item.category || 'Other',
    totalAmount,
    amount: totalAmount,
    percentageOfExpenses: percentage,
    percentage,
    count: item.count != null ? Number(item.count) : 0,
  };
}

/**
 * Adapt a backend ExpenseSummaryResponse to UI model.
 * @param {Object} summary Backend ExpenseSummaryResponse
 * @returns {Object} UI Expense Summary Model
 */
export function adaptExpenseSummary(summary) {
  if (!summary) {
    return {
      totalExpenses: 0,
      paidExpenses: 0,
      pendingExpenses: 0,
      expenseCount: 0,
      categoryBreakdown: [],
    };
  }

  return {
    totalExpenses: summary.totalExpenses != null ? Number(summary.totalExpenses) : 0,
    paidExpenses: summary.paidExpenses != null ? Number(summary.paidExpenses) : 0,
    pendingExpenses: summary.pendingExpenses != null ? Number(summary.pendingExpenses) : 0,
    expenseCount: summary.expenseCount != null ? Number(summary.expenseCount) : 0,
    categoryBreakdown: Array.isArray(summary.categoryBreakdown)
      ? summary.categoryBreakdown.map(adaptExpenseCategorySummary)
      : [],
  };
}

/**
 * Adapt a backend CropFinancialSummary to UI model.
 * @param {Object} item Backend CropFinancialSummary
 * @returns {Object} UI Crop Financial Model
 */
export function adaptCropFinancialSummary(item) {
  if (!item) return null;
  const revenue = item.revenue != null ? Number(item.revenue) : 0;
  const expenses = item.expenses != null ? Number(item.expenses) : 0;
  const netProfit = item.netProfit != null ? Number(item.netProfit) : 0;
  const netMarginPercent = item.netMarginPercent != null ? Number(item.netMarginPercent) : 0;
  const harvestYieldKg = item.harvestYieldKg != null ? Number(item.harvestYieldKg) : 0;
  const costPerQuintal = item.costPerQuintal != null ? Number(item.costPerQuintal) : 0;

  return {
    cropCycleId: item.cropCycleId,
    cropName: item.cropName || '',
    crop: item.cropName || '',
    variety: item.variety || '',
    season: item.season || '',
    revenue,
    expenses,
    expense: expenses,
    netProfit,
    profit: netProfit,
    netMarginPercent,
    margin: netMarginPercent,
    harvestYieldKg,
    costPerQuintal,
    salesCount: item.salesCount != null ? Number(item.salesCount) : 0,
    expenseCount: item.expenseCount != null ? Number(item.expenseCount) : 0,
  };
}

/**
 * Adapt a backend FarmFinancialSummary to UI model.
 * @param {Object} item Backend FarmFinancialSummary
 * @returns {Object} UI Farm Financial Model
 */
export function adaptFarmFinancialSummary(item) {
  if (!item) return null;
  const revenue = item.revenue != null ? Number(item.revenue) : 0;
  const expenses = item.expenses != null ? Number(item.expenses) : 0;
  const netProfit = item.netProfit != null ? Number(item.netProfit) : 0;
  const netMarginPercent = item.netMarginPercent != null ? Number(item.netMarginPercent) : 0;

  return {
    farmId: item.farmId,
    farmName: item.farmName || '',
    revenue,
    expenses,
    expense: expenses,
    netProfit,
    profit: netProfit,
    netMarginPercent,
    margin: netMarginPercent,
    salesCount: item.salesCount != null ? Number(item.salesCount) : 0,
    expenseCount: item.expenseCount != null ? Number(item.expenseCount) : 0,
  };
}

/**
 * Adapt a backend MonthlyFinancialSummary to UI model.
 * @param {Object} item Backend MonthlyFinancialSummary
 * @returns {Object} UI Monthly Financial Trend Model
 */
export function adaptMonthlyFinancialSummary(item) {
  if (!item) return null;
  const revenue = item.revenue != null ? Number(item.revenue) : 0;
  const expenses = item.expenses != null ? Number(item.expenses) : 0;
  const netProfit = item.netProfit != null ? Number(item.netProfit) : 0;

  return {
    year: item.year != null ? Number(item.year) : null,
    month: item.monthLabel || (item.month != null ? String(item.month) : ''),
    monthNumber: item.month != null ? Number(item.month) : null,
    monthLabel: item.monthLabel || '',
    revenue,
    expenses,
    netProfit,
    profit: netProfit,
  };
}

/**
 * Adapt a backend ProfitLossSummaryResponse to UI model.
 * Backend is authoritative for all aggregate and breakdown financial figures.
 * @param {Object} summary Backend ProfitLossSummaryResponse
 * @returns {Object} UI Profit & Loss Model
 */
export function adaptProfitLossSummary(summary) {
  if (!summary) {
    return {
      totalRevenue: 0,
      totalExpenses: 0,
      netProfit: 0,
      profitMarginPercent: 0,
      netMargin: 0,
      cropSummaries: [],
      farmSummaries: [],
      categoryBreakdown: [],
      monthlyTrends: [],
    };
  }

  const profitMarginPercent = summary.profitMarginPercent != null ? Number(summary.profitMarginPercent) : 0;

  return {
    totalRevenue: summary.totalRevenue != null ? Number(summary.totalRevenue) : 0,
    totalExpenses: summary.totalExpenses != null ? Number(summary.totalExpenses) : 0,
    netProfit: summary.netProfit != null ? Number(summary.netProfit) : 0,
    profitMarginPercent,
    netMargin: profitMarginPercent,
    cropSummaries: Array.isArray(summary.cropSummaries)
      ? summary.cropSummaries.map(adaptCropFinancialSummary)
      : [],
    farmSummaries: Array.isArray(summary.farmSummaries)
      ? summary.farmSummaries.map(adaptFarmFinancialSummary)
      : [],
    categoryBreakdown: Array.isArray(summary.categoryBreakdown)
      ? summary.categoryBreakdown.map(adaptExpenseCategorySummary)
      : [],
    monthlyTrends: Array.isArray(summary.monthlyTrends)
      ? summary.monthlyTrends.map(adaptMonthlyFinancialSummary)
      : [],
  };
}


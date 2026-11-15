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
 * @returns {Object} UI Field Model
 */
export function adaptField(field) {
  if (!field) return null;

  const fieldId = field.id;
  const isIrrigated = Boolean(
    field.irrigationType &&
    field.irrigationType.toLowerCase() !== 'rainfed' &&
    field.irrigationType.toLowerCase() !== 'none'
  );

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
    currentCrop: null, // Neutral until Phase 22.3 Crop integration
    cropVariety: '',
    cropSeason: '',
    cropStage: '',
    cropProgress: 0,
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


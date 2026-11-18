import i18n from '../i18n';

/**
 * AgriTrack Display Label Translation Helpers (Phase 12)
 * Ensures separation of internal business identifiers from localized user-facing display values.
 * Internal constants remain unchanged, while displayed labels dynamically reflect the active language.
 */

/**
 * Translates crop name for display while preserving internal identifiers.
 * Handles single names ("Wheat") and composite names ("Wheat (Sharbati)").
 * @param {string} crop
 * @param {Function} t - i18next translate function
 * @returns {string} Localized crop name
 */
export function translateCrop(crop, t) {
  if (!crop || !t) return crop || '';

  // Handle composite like "Wheat (Sharbati)"
  const compositeMatch = crop.match(/^([^(]+)\s*\(([^)]+)\)$/);
  if (compositeMatch) {
    const baseCrop = compositeMatch[1].trim();
    const variety = compositeMatch[2].trim();
    const translatedBase = t(`crops.names.${baseCrop}`, baseCrop);
    const translatedVar = t(`crops.varieties.${variety}`, variety);
    return `${translatedBase} (${translatedVar})`;
  }

  return t(`crops.names.${crop.trim()}`, crop);
}

/**
 * Translates crop variety / hybrid label
 * @param {string} variety
 * @param {Function} t
 * @returns {string}
 */
export function translateVariety(variety, t) {
  if (!variety || !t) return variety || '';
  return t(`crops.varieties.${variety.trim()}`, variety);
}

/**
 * Translates crop season (Rabi, Kharif, Zaid)
 * @param {string} season
 * @param {Function} t
 * @returns {string}
 */
export function translateSeason(season, t) {
  if (!season || !t) return season || '';
  return t(`crops.seasons.${season.trim()}`, season);
}

/**
 * Translates developmental growth stage
 * @param {string} stage
 * @param {Function} t
 * @returns {string}
 */
export function translateStage(stage, t) {
  if (!stage || !t) return stage || '';
  const stageMap = {
    'sowing': 'stages.sowing',
    'vegetative': 'stages.vegetative',
    'vegetative growth': 'stages.vegetative',
    'flowering': 'stages.flowering',
    'ripening': 'stages.ripening',
    'harvest readiness': 'stages.harvestReadiness',
    'harvested': 'stages.harvested',
  };
  const key = stageMap[stage.toLowerCase().trim()];
  return key ? t(key, stage) : stage;
}

/**
 * Translates status enums cleanly without modifying internal business values
 * @param {string} status
 * @param {Function} t
 * @returns {string}
 */
export function translateStatus(status, t) {
  if (!status || !t) return status || '';
  const statusMap = {
    active: 'status.active',
    inactive: 'status.inactive',
    completed: 'status.completed',
    pending: 'status.pending',
    in_progress: 'status.inProgress',
    'in progress': 'status.inProgress',
    scheduled: 'status.scheduled',
    optimal: 'status.optimal',
    good: 'status.good',
    moderate: 'status.moderate',
    needs_attention: 'status.needsAttention',
    'needs attention': 'status.needsAttention',
    warning: 'status.warning',
    critical: 'status.critical',
    danger: 'status.danger',
    info: 'status.info',
    high: 'status.high',
    medium: 'status.medium',
    low: 'status.low',
    paid: 'status.paid',
    unpaid: 'status.unpaid',
    partially_paid: 'status.partiallyPaid',
    'partially paid': 'status.partiallyPaid',
    received: 'status.received',
    dispatched: 'status.dispatched',
    contracted: 'status.contracted',
    confirmed: 'status.confirmed',
    upcoming: 'status.upcoming',
    near_harvest: 'status.nearHarvest',
    'near harvest': 'status.nearHarvest',
    ready_for_harvest: 'status.readyForHarvest',
    'ready for harvest': 'status.readyForHarvest',
  };
  const key = statusMap[status.toLowerCase().trim()];
  return key ? t(key, status) : status;
}

/**
 * Translates soil type for display
 * @param {string} soilType
 * @param {Function} t
 * @returns {string}
 */
export function translateSoilType(soilType, t) {
  if (!soilType || !t) return soilType || '';
  const s = soilType.toLowerCase();
  if (s.includes('alluvial')) return t('soil.types.alluvialLoam', soilType);
  if (s.includes('sandy')) return t('soil.types.sandyLoam', soilType);
  if (s.includes('clay')) return t('soil.types.clayLoam', soilType);
  if (s.includes('black')) return t('soil.types.blackSoil', soilType);
  if (s.includes('red')) return t('soil.types.redLoam', soilType);
  return soilType;
}

/**
 * Translates irrigation method for display
 * @param {string} method
 * @param {Function} t
 * @returns {string}
 */
export function translateIrrigationMethod(method, t) {
  if (!method || !t) return method || '';
  const m = method.toLowerCase();
  if (m.includes('drip')) return t('irrigation.methods.drip', method);
  if (m.includes('sprinkler')) return t('irrigation.methods.sprinkler', method);
  if (m.includes('canal') || m.includes('flood') || m.includes('rainfed')) return t('irrigation.methods.flood', method);
  if (m.includes('furrow')) return t('irrigation.methods.furrow', method);
  return method;
}

/**
 * Formats field name preserving parcel identifiers like '1A', '2B' while translating 'Field'
 * Example: 'Field 1A' -> '{t("fields.field")} 1A'
 * @param {string} fieldName
 * @param {Function} t
 * @returns {string}
 */
export function formatFieldName(fieldName, t) {
  if (!fieldName || !t) return fieldName || '';
  const match = fieldName.match(/^Field\s+([0-9]+[A-Za-z]*)$/i);
  if (match) {
    return `${t('fields.field', 'Field')} ${match[1]}`;
  }
  return fieldName;
}

const WEEKDAY_DATES = {
  mon: new Date('2026-10-05T12:00:00Z'),
  tue: new Date('2026-10-06T12:00:00Z'),
  wed: new Date('2026-10-07T12:00:00Z'),
  thu: new Date('2026-10-08T12:00:00Z'),
  fri: new Date('2026-10-09T12:00:00Z'),
  sat: new Date('2026-10-10T12:00:00Z'),
  sun: new Date('2026-10-11T12:00:00Z'),
};

/**
 * Translates time words and relative timestamps
 * Example: 'Today' -> '{t("common.today")}', 'Yesterday, 04:30 PM' -> '{t("common.yesterday")}, 04:30 PM'
 * @param {string} timeStr
 * @param {Function} t
 * @returns {string}
 */
export function translateTime(timeStr, t) {
  if (!timeStr || !t) return timeStr || '';
  if (timeStr === 'Today') return t('common.today', 'Today');
  if (timeStr === 'Yesterday') return t('common.yesterday', 'Yesterday');
  if (timeStr === 'Tomorrow') return t('common.tomorrow', 'Tomorrow');
  if (timeStr === '2 days ago') return t('common.twoDaysAgo', '2 days ago');
  if (timeStr === '3 days ago') return t('common.threeDaysAgo', '3 days ago');
  if (timeStr === '4 days ago') return t('common.fourDaysAgo', '4 days ago');

  const lower = timeStr.toLowerCase().trim();
  if (WEEKDAY_DATES[lower]) {
    try {
      const lang = i18n?.language || 'en-IN';
      return new Intl.DateTimeFormat(lang, { weekday: 'short' }).format(WEEKDAY_DATES[lower]);
    } catch {
      return timeStr;
    }
  }

  if (timeStr.startsWith('Today,')) {
    return `${t('common.today', 'Today')}${timeStr.slice(5)}`;
  }
  if (timeStr.startsWith('Yesterday,')) {
    return `${t('common.yesterday', 'Yesterday')}${timeStr.slice(9)}`;
  }
  if (timeStr.startsWith('Tomorrow,')) {
    return `${t('common.tomorrow', 'Tomorrow')}${timeStr.slice(8)}`;
  }
  return timeStr;
}

/**
 * Translates weather conditions
 * @param {string} condition
 * @param {Function} t
 * @returns {string}
 */
export function translateWeatherCondition(condition, t) {
  if (!condition || !t) return condition || '';
  const condMap = {
    'partly cloudy': 'weather.conditions.partlyCloudy',
    'sunny': 'weather.conditions.sunny',
    'rainy': 'weather.conditions.rainy',
    'clear': 'weather.conditions.clear',
    'overcast': 'weather.conditions.overcast',
    'thunderstorm': 'weather.conditions.thunderstorm',
    'windy': 'weather.conditions.windy',
    'humid': 'weather.conditions.humid',
  };
  const key = condMap[condition.toLowerCase().trim()];
  return key ? t(key, condition) : condition;
}

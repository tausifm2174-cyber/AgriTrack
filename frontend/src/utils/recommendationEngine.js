import { cropRecommendationRules } from '../data/recommendationRules';

/**
 * Deterministic Rule-Based Agronomic Recommendation Engine (Phase 6)
 * 
 * Evaluates field soil chemistry, climate and seasonal parameters against
 * transparent heuristic rules to produce ranked, explainable crop suggestions.
 * 
 * NOTE: This is NOT machine learning or AI. It is deterministic heuristic evaluation.
 */

/**
 * Evaluates crop suitability based on user or field inputs.
 * 
 * @param {Object} inputs
 * @param {string} inputs.season - 'Rabi' | 'Kharif' | 'Zaid'
 * @param {string} inputs.soilType - e.g. 'Alluvial Loam', 'Deep Black Soil'
 * @param {number|string} inputs.soilPh - pH value (e.g. 6.8)
 * @param {number|string} [inputs.nitrogen] - kg/ha
 * @param {number|string} [inputs.phosphorus] - kg/ha
 * @param {number|string} [inputs.potassium] - kg/ha
 * @param {number|string} [inputs.temperature] - Mean temp in °C
 * @param {number|string} [inputs.rainfall] - Expected seasonal rainfall in mm
 * @returns {Array<Object>} Ranked crop recommendation results with detailed evaluation
 */
export function evaluateCropRecommendations(inputs = {}) {
  const {
    season = 'Rabi',
    soilType = 'Alluvial Loam',
    soilPh = 6.8,
    nitrogen = 250,
    phosphorus = 18,
    potassium = 240,
    temperature = 24,
    rainfall = 45,
  } = inputs;

  const numPh = parseFloat(soilPh) || 7.0;
  const numN = parseFloat(nitrogen) || 200;
  const numP = parseFloat(phosphorus) || 16;
  const numK = parseFloat(potassium) || 200;
  const numTemp = parseFloat(temperature) || 25;
  const numRain = parseFloat(rainfall) || 50;

  const results = cropRecommendationRules.map((rule) => {
    let score = 0;
    const checks = [];
    const warnings = [];

    // 1. Season Evaluation (Weight: 30 pts)
    const isSeasonMatch = rule.seasons.includes(season);
    if (isSeasonMatch) {
      score += 30;
      checks.push({
        parameter: 'Season',
        status: 'pass',
        label: `Compatible with ${season} season cultivation`,
      });
    } else {
      checks.push({
        parameter: 'Season',
        status: 'fail',
        label: `Off-season: Typically cultivated in ${rule.seasons.join(', ')}`,
      });
      warnings.push(`Current selected season (${season}) does not match primary cycle (${rule.seasons.join('/')}).`);
    }

    // 2. Soil Type Evaluation (Weight: 25 pts)
    const normalizedInputSoil = (soilType || '').toLowerCase();
    const isExactSoilMatch = rule.soilTypes.some(
      (st) => st.toLowerCase() === normalizedInputSoil
    );
    const isPartialSoilMatch = rule.soilTypes.some(
      (st) =>
        normalizedInputSoil.includes('loam') && st.toLowerCase().includes('loam') ||
        normalizedInputSoil.includes('black') && st.toLowerCase().includes('black') ||
        normalizedInputSoil.includes('sand') && st.toLowerCase().includes('sand') ||
        normalizedInputSoil.includes('clay') && st.toLowerCase().includes('clay')
    );

    if (isExactSoilMatch) {
      score += 25;
      checks.push({
        parameter: 'Soil Type',
        status: 'pass',
        label: `Ideal match for ${soilType}`,
      });
    } else if (isPartialSoilMatch) {
      score += 18;
      checks.push({
        parameter: 'Soil Type',
        status: 'pass',
        label: `Moderately adaptable to ${soilType}`,
      });
    } else {
      score += 5;
      checks.push({
        parameter: 'Soil Type',
        status: 'fail',
        label: `Prefers ${rule.soilTypes.join(' or ')}`,
      });
      warnings.push(`Soil classification (${soilType}) may require extra organic amendment.`);
    }

    // 3. Soil pH Evaluation (Weight: 20 pts)
    if (numPh >= rule.minPh && numPh <= rule.maxPh) {
      const diffFromOpt = Math.abs(numPh - rule.optimalPh);
      const phScore = diffFromOpt <= 0.3 ? 20 : 16;
      score += phScore;
      checks.push({
        parameter: 'Soil pH',
        status: 'pass',
        label: `pH ${numPh} is within optimal range (${rule.minPh}–${rule.maxPh})`,
      });
    } else if (numPh < rule.minPh) {
      const phScore = Math.max(0, 20 - Math.round((rule.minPh - numPh) * 15));
      score += phScore;
      checks.push({
        parameter: 'Soil pH',
        status: 'warning',
        label: `pH ${numPh} is acidic for this crop (minimum ${rule.minPh})`,
      });
      warnings.push(`Soil is moderately acidic for ${rule.crop}. Consider agricultural lime amendment.`);
    } else {
      const phScore = Math.max(0, 20 - Math.round((numPh - rule.maxPh) * 15));
      score += phScore;
      checks.push({
        parameter: 'Soil pH',
        status: 'warning',
        label: `pH ${numPh} is alkaline for this crop (maximum ${rule.maxPh})`,
      });
      warnings.push(`Soil is alkaline (pH ${numPh}). Gypsum application recommended.`);
    }

    // 4. Temperature Evaluation (Weight: 15 pts)
    if (numTemp >= rule.minTemp && numTemp <= rule.maxTemp) {
      score += 15;
      checks.push({
        parameter: 'Temperature',
        status: 'pass',
        label: `${numTemp}°C is within growth thermal window (${rule.minTemp}°C–${rule.maxTemp}°C)`,
      });
    } else {
      const tempDiff = numTemp < rule.minTemp ? rule.minTemp - numTemp : numTemp - rule.maxTemp;
      const tempScore = Math.max(0, 15 - Math.round(tempDiff * 2));
      score += tempScore;
      checks.push({
        parameter: 'Temperature',
        status: 'warning',
        label: `${numTemp}°C deviates from preferred window (${rule.minTemp}°C–${rule.maxTemp}°C)`,
      });
      warnings.push(`Ambient temperatures may cause vegetative stalling or early bolting.`);
    }

    // 5. NPK Nutrients Evaluation (Weight: 10 pts)
    let npkMatches = 0;
    if (numN >= rule.minN) npkMatches += 4;
    else warnings.push(`Low available Nitrogen (${numN} kg/ha). Top-dressing with urea/compost advised.`);

    if (numP >= rule.minP) npkMatches += 3;
    else warnings.push(`Phosphorus level (${numP} kg/ha) is below ${rule.crop} benchmark.`);

    if (numK >= rule.minK) npkMatches += 3;
    else warnings.push(`Potassium (${numK} kg/ha) is low. Potash supplement recommended.`);

    score += npkMatches;
    checks.push({
      parameter: 'Nutrients (NPK)',
      status: npkMatches >= 7 ? 'pass' : 'warning',
      label: `N: ${numN}, P: ${numP}, K: ${numK} kg/ha (${npkMatches >= 7 ? 'Adequate' : 'Needs Supplement'})`,
    });

    // 6. Rainfall Evaluation
    const isRainAcceptable = numRain >= (rule.minRainfallMm || 10) && numRain <= (rule.maxRainfallMm || 300);
    checks.push({
      parameter: 'Expected Rainfall',
      status: isRainAcceptable ? 'pass' : 'warning',
      label: `${numRain} mm (${isRainAcceptable ? 'Compatible seasonal rainfall' : 'Supplemental irrigation required'})`,
    });

    // Determine Suitability Tier
    let matchTier = 'Highly Recommended';
    let matchVariant = 'success';
    if (score < 45 || !isSeasonMatch) {
      matchTier = 'Not Recommended';
      matchVariant = 'neutral';
    } else if (score < 65) {
      matchTier = 'Conditional / Marginal';
      matchVariant = 'warning';
    } else if (score < 80) {
      matchTier = 'Moderately Suitable';
      matchVariant = 'info';
    }

    return {
      ruleId: rule.id,
      crop: rule.crop,
      variety: rule.variety,
      category: rule.category,
      score: Math.min(100, Math.max(0, score)),
      matchTier,
      matchVariant,
      checks,
      warnings,
      sowingWindow: rule.sowingWindow,
      maturityDays: rule.maturityDays,
      waterRequirement: rule.waterRequirement,
      description: rule.description,
      seasonRequired: rule.seasons.join(', '),
      soilTypesPreferred: rule.soilTypes.join(', '),
      phRange: `${rule.minPh} – ${rule.maxPh}`,
      tempRange: `${rule.minTemp}°C – ${rule.maxTemp}°C`,
    };
  });

  // Sort by score descending (highest suitability first)
  return results.sort((a, b) => b.score - a.score);
}

/**
 * Generates rule-based weather advisories from current meteorological metrics
 * 
 * @param {Object} weatherObj - Weather object with current and forecast metrics
 * @param {string} [farmName] - Target farm name
 * @returns {Array<Object>} Generated active farm advisories
 */
export function evaluateWeatherAdvisories(weatherObj = {}, farmName = 'Green Valley Farm') {
  const current = weatherObj.current || weatherObj;
  const forecast = weatherObj.forecast || [];

  const advisories = [];

  // 1. Check Rainfall Forecast (> 25mm in forecast)
  const maxRainDay = forecast.reduce(
    (max, day) => (day.rainMm > (max.rainMm || 0) ? day : max),
    { rainMm: current.rainfallMm || 0 }
  );

  if (maxRainDay.rainMm > 25) {
    advisories.push({
      id: `adv-rain-${Date.now()}`,
      title: 'Heavy Rainfall Advisory (> 25mm)',
      category: 'Water Management',
      type: 'irrigation',
      severity: 'Warning',
      severityVariant: 'warning',
      triggerCondition: `Forecast rainfall reaches ${maxRainDay.rainMm}mm on ${maxRainDay.day || 'upcoming day'}`,
      recommendedAction: 'Suspend scheduled irrigation events across all open fields. Verify perimeter drainage trenches.',
      farmName,
      time: maxRainDay.day ? `Target: ${maxRainDay.day}` : 'Immediate',
      icon: 'CloudRain',
    });
  }

  // 2. Check High Humidity (> 85%)
  const hasHighHumidity = (current.humidity || 0) > 85 || forecast.some((d) => d.humidity > 85);
  if (hasHighHumidity) {
    const humidVal = current.humidity > 85 ? current.humidity : 88;
    advisories.push({
      id: `adv-humid-${Date.now()}`,
      title: 'High Humidity & Fungal Blight Risk (> 85%)',
      category: 'Crop Protection',
      type: 'disease',
      severity: 'Danger',
      severityVariant: 'danger',
      triggerCondition: `Atmospheric humidity at ${humidVal}% creates favorable spores germination environment`,
      recommendedAction: 'Monitor potato, mustard and pulse foliage for early blight lesions. Schedule prophylactic bio-fungicide.',
      farmName,
      time: 'Active Alert',
      icon: 'AlertTriangle',
    });
  }

  // 3. Normal / General Conditions
  if (advisories.length === 0) {
    advisories.push({
      id: `adv-normal-${Date.now()}`,
      title: 'Optimal Operational Conditions',
      category: 'General Field Conditions',
      type: 'normal',
      severity: 'Normal',
      severityVariant: 'success',
      triggerCondition: 'No adverse precipitation or thermal thresholds breached',
      recommendedAction: 'Proceed with scheduled fertigation, weeding, and crop calendar milestones.',
      farmName,
      time: 'Current',
      icon: 'CheckCircle',
    });
  }

  return advisories;
}

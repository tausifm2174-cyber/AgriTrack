import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { farmData } from '../data/farmData';
import { fieldData } from '../data/fieldData';
import { soilData } from '../data/soilData';
import { farmWeather } from '../data/weatherData';
import { evaluateCropRecommendations, evaluateWeatherAdvisories } from '../utils/recommendationEngine';
import {
  RecommendationHeader,
  RecommendationInputPanel,
  RecommendationSummary,
  RecommendationList,
  AdvisoryCard,
} from '../components/recommendations';
import '../components/recommendations/recommendations.css';

/**
 * RecommendationsPage (Phase 6 — Rule-Based Crop Recommendations & Advisory)
 * Deterministic agronomic evaluation engine that matches soil parameters, climate,
 * and seasonal conditions to crops, providing explainable rationale and real-time advisories.
 */
export default function RecommendationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFieldId = searchParams.get('fieldId') || 'field-1a';
  const initialFarmId = searchParams.get('farmId') || 'farm-1';

  const [farms] = useState(farmData.farms);
  const [fields] = useState(fieldData.fields);

  // Helper to get soil params for a field
  const getSoilParamsForField = (fieldId) => {
    const soilRec = soilData.records.find((s) => s.fieldId === fieldId);
    const fieldRec = fields.find((f) => f.id === fieldId);
    return {
      soilType: soilRec?.soilType || fieldRec?.soilType || 'Alluvial Loam',
      soilPh: soilRec?.ph || fieldRec?.phLevel || 6.8,
      nitrogen: soilRec?.nitrogen || 250,
      phosphorus: soilRec?.phosphorus || 18,
      potassium: soilRec?.potassium || 240,
      season: fieldRec?.cropSeason || 'Rabi',
    };
  };

  // Agronomic inputs state
  const [inputs, setInputs] = useState(() => {
    const initialSoil = getSoilParamsForField(initialFieldId);
    return {
      farmId: initialFarmId,
      fieldId: initialFieldId,
      soilType: initialSoil.soilType,
      soilPh: initialSoil.soilPh,
      nitrogen: initialSoil.nitrogen,
      phosphorus: initialSoil.phosphorus,
      potassium: initialSoil.potassium,
      season: initialSoil.season,
      temperature: 24,
      rainfall: 45,
    };
  });

  // Handle single input changes
  const handleInputChange = (name, value) => {
    setInputs((prev) => {
      const next = { ...prev, [name]: value };
      // If farm changed, switch field to first field in that farm
      if (name === 'farmId') {
        const farmFields = fields.filter((f) => f.farmId === value);
        if (farmFields.length > 0) {
          const firstFieldId = farmFields[0].id;
          next.fieldId = firstFieldId;
          const soilParams = getSoilParamsForField(firstFieldId);
          next.soilType = soilParams.soilType;
          next.soilPh = soilParams.soilPh;
          next.nitrogen = soilParams.nitrogen;
          next.phosphorus = soilParams.phosphorus;
          next.potassium = soilParams.potassium;
          next.season = soilParams.season;
        }
      }
      return next;
    });
  };

  // Handle field selection: auto-load soil params from Phase 4 records
  const handleFieldSelect = (fieldId) => {
    const soilParams = getSoilParamsForField(fieldId);
    const matchedField = fields.find((f) => f.id === fieldId);

    setInputs((prev) => ({
      ...prev,
      farmId: matchedField ? matchedField.farmId : prev.farmId,
      fieldId,
      soilType: soilParams.soilType,
      soilPh: soilParams.soilPh,
      nitrogen: soilParams.nitrogen,
      phosphorus: soilParams.phosphorus,
      potassium: soilParams.potassium,
      season: soilParams.season,
    }));

    if (matchedField) {
      setSearchParams({ fieldId, farmId: matchedField.farmId });
    }
  };

  // Reset inputs back to default Field 1A profile
  const handleReset = () => {
    const defaultSoil = getSoilParamsForField('field-1a');
    setInputs({
      farmId: 'farm-1',
      fieldId: 'field-1a',
      soilType: defaultSoil.soilType,
      soilPh: defaultSoil.soilPh,
      nitrogen: defaultSoil.nitrogen,
      phosphorus: defaultSoil.phosphorus,
      potassium: defaultSoil.potassium,
      season: 'Rabi',
      temperature: 24,
      rainfall: 45,
    });
    setSearchParams({});
  };

  // Deterministic evaluation of crop recommendations based on current inputs
  const evaluatedRecommendations = useMemo(() => {
    return evaluateCropRecommendations(inputs);
  }, [inputs]);

  // Current active advisories for selected farm
  const currentAdvisories = useMemo(() => {
    const farmWeatherObj = farmWeather[inputs.farmId] || farmWeather['farm-1'];
    const activeFarm = farms.find((f) => f.id === inputs.farmId);
    return evaluateWeatherAdvisories(farmWeatherObj, activeFarm?.name || 'Green Valley Farm');
  }, [inputs.farmId, farms]);

  const activeFarm = farms.find((f) => f.id === inputs.farmId) || farms[0];

  return (
    <div className="agri-recommendations-page">
      {/* 1. Header with Deterministic Heuristic Disclaimer & Reset Action */}
      <RecommendationHeader onResetInputs={handleReset} />

      {/* 2. Agronomic Input Panel with Auto-Population */}
      <RecommendationInputPanel
        inputs={inputs}
        onInputChange={handleInputChange}
        onFieldSelect={handleFieldSelect}
        farms={farms}
        fields={fields}
        onReset={handleReset}
      />

      {/* 3. High-Level Recommendation Summary Cards */}
      <RecommendationSummary
        recommendations={evaluatedRecommendations}
        inputs={inputs}
      />

      {/* 4. Current Farm Advisories (Rainfall, Humidity, Operational) */}
      <AdvisoryCard
        advisories={currentAdvisories}
        farmName={activeFarm.name}
      />

      {/* 5. Ranked Crop Recommendations List with Transparent Rule Checklists */}
      <RecommendationList
        recommendations={evaluatedRecommendations}
        targetFieldId={inputs.fieldId}
      />
    </div>
  );
}

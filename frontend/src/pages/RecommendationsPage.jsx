import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import farmService from '../services/farmService';
import fieldService from '../services/fieldService';
import soilService from '../services/soilService';
import advisoryService from '../services/advisoryService';
import { adaptFarm, adaptField, adaptSoilRecord, adaptAdvisory } from '../utils/adapters';
import { evaluateCropRecommendations } from '../utils/recommendationEngine';
import {
  RecommendationHeader,
  RecommendationInputPanel,
  RecommendationSummary,
  RecommendationList,
  AdvisoryCard,
} from '../components/recommendations';
import '../components/recommendations/recommendations.css';

/**
 * RecommendationsPage (Phase 22.7 — Rule-Based Crop Recommendations & Advisory)
 * Deterministic agronomic evaluation engine that matches soil parameters, climate,
 * and seasonal conditions to crops, combined with live backend agronomic hazard advisories.
 */
export default function RecommendationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFieldId = searchParams.get('fieldId');
  const initialFarmId = searchParams.get('farmId');

  const [farms, setFarms] = useState([]);
  const [fields, setFields] = useState([]);
  const [soilRecords, setSoilRecords] = useState([]);
  const [advisories, setAdvisories] = useState([]);

  // Helper to get soil params for a field
  const getSoilParamsForField = useCallback((fieldId, currentFields = fields, currentSoil = soilRecords) => {
    const soilRec = currentSoil.find((s) => String(s.fieldId) === String(fieldId));
    const fieldRec = currentFields.find((f) => String(f.id) === String(fieldId));
    return {
      soilType: soilRec?.soilType || fieldRec?.soilType || 'Alluvial Loam',
      soilPh: soilRec?.ph || fieldRec?.phLevel || 6.8,
      nitrogen: soilRec?.nitrogen || 250,
      phosphorus: soilRec?.phosphorus || 18,
      potassium: soilRec?.potassium || 240,
      season: fieldRec?.cropSeason || 'Rabi',
    };
  }, [fields, soilRecords]);

  // Agronomic inputs state
  const [inputs, setInputs] = useState({
    farmId: initialFarmId || '',
    fieldId: initialFieldId || '',
    soilType: 'Alluvial Loam',
    soilPh: 6.8,
    nitrogen: 250,
    phosphorus: 18,
    potassium: 240,
    season: 'Rabi',
    temperature: 24,
    rainfall: 45,
  });

  // Load farms, fields, and soil records on mount
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [rawFarms, rawFields, rawSoil] = await Promise.allSettled([
          farmService.getAllFarms(),
          fieldService.getAllFields(),
          soilService.getAllSoilRecords(),
        ]);

        if (isMounted) {
          const adaptedFarms = rawFarms.status === 'fulfilled' && Array.isArray(rawFarms.value)
            ? rawFarms.value.map((f) => adaptFarm(f))
            : [];
          const adaptedFields = rawFields.status === 'fulfilled' && Array.isArray(rawFields.value)
            ? rawFields.value.map((f) => adaptField(f))
            : [];
          const adaptedSoil = rawSoil.status === 'fulfilled' && Array.isArray(rawSoil.value)
            ? rawSoil.value.map((s) => adaptSoilRecord(s))
            : [];

          setFarms(adaptedFarms);
          setFields(adaptedFields);
          setSoilRecords(adaptedSoil);

          const defaultFarm = adaptedFarms.find((f) => String(f.id) === String(initialFarmId)) || adaptedFarms[0];
          const farmFields = defaultFarm ? adaptedFields.filter((f) => String(f.farmId) === String(defaultFarm.id)) : adaptedFields;
          const defaultField = farmFields.find((f) => String(f.id) === String(initialFieldId)) || farmFields[0];

          if (defaultFarm) {
            const soilParams = defaultField ? getSoilParamsForField(defaultField.id, adaptedFields, adaptedSoil) : {};
            setInputs((prev) => ({
              ...prev,
              farmId: defaultFarm.id,
              fieldId: defaultField ? defaultField.id : '',
              soilType: soilParams.soilType || prev.soilType,
              soilPh: soilParams.soilPh || prev.soilPh,
              nitrogen: soilParams.nitrogen || prev.nitrogen,
              phosphorus: soilParams.phosphorus || prev.phosphorus,
              potassium: soilParams.potassium || prev.potassium,
              season: soilParams.season || prev.season,
            }));
          }
        }
      } catch {
        // ignore load errors
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [initialFarmId, initialFieldId, getSoilParamsForField]);

  // Fetch live advisories when farm changes
  useEffect(() => {
    let isMounted = true;
    async function fetchAdvisories() {
      if (!inputs.farmId) return;
      try {
        const rawAdvisories = await advisoryService.getFarmAdvisories(inputs.farmId);
        if (isMounted && Array.isArray(rawAdvisories)) {
          setAdvisories(rawAdvisories.map(adaptAdvisory).filter(Boolean));
        }
      } catch {
        if (isMounted) {
          setAdvisories([]);
        }
      }
    }
    fetchAdvisories();
    return () => { isMounted = false; };
  }, [inputs.farmId]);

  // Handle single input changes
  const handleInputChange = (name, value) => {
    setInputs((prev) => {
      const next = { ...prev, [name]: value };
      // If farm changed, switch field to first field in that farm
      if (name === 'farmId') {
        const farmFields = fields.filter((f) => String(f.farmId) === String(value));
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

  // Handle field selection: auto-load soil params
  const handleFieldSelect = (fieldId) => {
    const soilParams = getSoilParamsForField(fieldId);
    const matchedField = fields.find((f) => String(f.id) === String(fieldId));

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

  // Reset inputs back to first available field profile
  const handleReset = () => {
    const defaultFarm = farms[0];
    const defaultFields = defaultFarm ? fields.filter((f) => String(f.farmId) === String(defaultFarm.id)) : fields;
    const defaultField = defaultFields[0];
    const defaultSoil = defaultField ? getSoilParamsForField(defaultField.id) : {};

    setInputs({
      farmId: defaultFarm ? defaultFarm.id : '',
      fieldId: defaultField ? defaultField.id : '',
      soilType: defaultSoil.soilType || 'Alluvial Loam',
      soilPh: defaultSoil.soilPh || 6.8,
      nitrogen: defaultSoil.nitrogen || 250,
      phosphorus: defaultSoil.phosphorus || 18,
      potassium: defaultSoil.potassium || 240,
      season: defaultSoil.season || 'Rabi',
      temperature: 24,
      rainfall: 45,
    });
    setSearchParams({});
  };

  // Status update handler for live advisories (ACKNOWLEDGED / DISMISSED)
  const handleUpdateAdvisoryStatus = async (id, newStatus) => {
    try {
      const updated = await advisoryService.updateStatus(id, newStatus);
      if (updated) {
        setAdvisories((prev) =>
          prev.map((adv) => (String(adv.id) === String(id) ? { ...adv, status: newStatus } : adv))
        );
      }
    } catch {
      // ignore
    }
  };

  // Deterministic evaluation of crop recommendations based on current inputs
  const evaluatedRecommendations = useMemo(() => {
    return evaluateCropRecommendations(inputs);
  }, [inputs]);

  const activeFarm = farms.find((f) => String(f.id) === String(inputs.farmId)) || farms[0] || { name: 'Farm Holding' };

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
        advisories={advisories}
        farmName={activeFarm.name}
        onUpdateStatus={handleUpdateAdvisoryStatus}
      />

      {/* 5. Ranked Crop Recommendations List with Transparent Rule Checklists */}
      <RecommendationList
        recommendations={evaluatedRecommendations}
        targetFieldId={inputs.fieldId}
      />
    </div>
  );
}

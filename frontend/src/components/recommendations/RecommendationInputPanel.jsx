import { useTranslation } from 'react-i18next';
import { Warehouse, FlaskConical, Thermometer, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { Button } from '../common';

/**
 * RecommendationInputPanel component
 * Provides interactive agronomic parameter inputs with auto-population from field & soil records.
 */
export default function RecommendationInputPanel({
  inputs,
  onInputChange,
  onFieldSelect,
  farms = [],
  fields = [],
  onReset,
}) {
  const { t } = useTranslation();
  const availableFields = inputs.farmId
    ? fields.filter((f) => f.farmId === inputs.farmId)
    : fields;

  return (
    <div className="agri-recom-panel-card" role="region" aria-label={t('recommendations.evaluationParams', 'Agronomic Evaluation Parameters')}>
      <div className="agri-recom-panel-card__header">
        <div className="agri-recom-panel-card__title-group">
          <SlidersHorizontal size={18} className="text-primary" aria-hidden="true" />
          <h2 className="agri-recom-panel-card__title">{t('recommendations.evaluationParams', 'Agronomic Evaluation Parameters')}</h2>
        </div>
        <span className="agri-recom-panel-card__sub">
          {t('recommendations.autoPopulatedDesc', 'Auto-populated from field soil tests or customized to test planting scenarios')}
        </span>
      </div>

      <div className="agri-recom-panel-grid">
        {/* Section 1: Target Location */}
        <div className="agri-recom-section">
          <h3 className="agri-recom-section__title">
            <Warehouse size={15} aria-hidden="true" />
            <span>{t('recommendations.targetLocation', 'Target Location')}</span>
          </h3>

          <div className="agri-form-grid--2 agri-form-grid">
            <div className="agri-form-group">
              <label htmlFor="recom-farm" className="agri-form-label">
                {t('farms.farm', 'Farm Holding')}
              </label>
              <select
                id="recom-farm"
                name="farmId"
                className="agri-form-select"
                value={inputs.farmId}
                onChange={(e) => onInputChange('farmId', e.target.value)}
              >
                {farms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="agri-form-group">
              <label htmlFor="recom-field" className="agri-form-label">
                {t('recommendations.fieldParcel', 'Field Parcel (Auto-loads Soil)')}
              </label>
              <select
                id="recom-field"
                name="fieldId"
                className="agri-form-select"
                value={inputs.fieldId}
                onChange={(e) => onFieldSelect(e.target.value)}
              >
                {availableFields.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.soilType})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Soil Chemistry Parameters */}
        <div className="agri-recom-section">
          <h3 className="agri-recom-section__title">
            <FlaskConical size={15} aria-hidden="true" />
            <span>{t('recommendations.soilCharacteristics', 'Soil Characteristics')}</span>
          </h3>

          <div className="agri-form-grid--2 agri-form-grid">
            <div className="agri-form-group">
              <label htmlFor="recom-soil-type" className="agri-form-label">
                {t('soil.soilType', 'Soil Type')}
              </label>
              <select
                id="recom-soil-type"
                name="soilType"
                className="agri-form-select"
                value={inputs.soilType}
                onChange={(e) => onInputChange('soilType', e.target.value)}
              >
                <option value="Alluvial Loam">{t('soil.types.alluvialLoam', 'Alluvial Loam')}</option>
                <option value="Loamy Soil">{t('soil.types.loamySoil', 'Loamy Soil')}</option>
                <option value="Deep Black Soil">{t('soil.types.deepBlackSoil', 'Deep Black Soil')}</option>
                <option value="Medium Black Soil">{t('soil.types.mediumBlackSoil', 'Medium Black Soil')}</option>
                <option value="Sandy Loam">{t('soil.types.sandyLoam', 'Sandy Loam')}</option>
                <option value="Red Sandy Loam">{t('soil.types.redSandyLoam', 'Red Sandy Loam')}</option>
                <option value="Clay Loam">{t('soil.types.clayLoam', 'Clay Loam')}</option>
                <option value="Silty Clay">{t('soil.types.siltyClay', 'Silty Clay')}</option>
              </select>
            </div>


            <div className="agri-form-group">
              <label htmlFor="recom-ph" className="agri-form-label">
                {t('soil.ph', 'Soil pH')} ({inputs.soilPh})
              </label>
              <input
                id="recom-ph"
                name="soilPh"
                type="number"
                step="0.1"
                min="4.5"
                max="9.5"
                className="agri-form-input"
                value={inputs.soilPh}
                onChange={(e) => onInputChange('soilPh', e.target.value)}
              />
            </div>
          </div>

          {/* Macronutrients N-P-K */}
          <div className="agri-form-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem', marginTop: '0.65rem' }}>
            <div className="agri-form-group">
              <label htmlFor="recom-n" className="agri-form-label">
                {t('soil.nitrogen', 'Nitrogen (N)')}
              </label>
              <input
                id="recom-n"
                name="nitrogen"
                type="number"
                min="50"
                max="600"
                className="agri-form-input"
                value={inputs.nitrogen}
                onChange={(e) => onInputChange('nitrogen', e.target.value)}
              />
              <span className="agri-form-hint">kg/ha</span>
            </div>

            <div className="agri-form-group">
              <label htmlFor="recom-p" className="agri-form-label">
                {t('soil.phosphorus', 'Phosphorus (P)')}
              </label>
              <input
                id="recom-p"
                name="phosphorus"
                type="number"
                min="5"
                max="80"
                className="agri-form-input"
                value={inputs.phosphorus}
                onChange={(e) => onInputChange('phosphorus', e.target.value)}
              />
              <span className="agri-form-hint">kg/ha</span>
            </div>

            <div className="agri-form-group">
              <label htmlFor="recom-k" className="agri-form-label">
                {t('soil.potassium', 'Potassium (K)')}
              </label>
              <input
                id="recom-k"
                name="potassium"
                type="number"
                min="50"
                max="500"
                className="agri-form-input"
                value={inputs.potassium}
                onChange={(e) => onInputChange('potassium', e.target.value)}
              />
              <span className="agri-form-hint">kg/ha</span>
            </div>
          </div>
        </div>

        {/* Section 3: Season & Climate Context */}
        <div className="agri-recom-section">
          <h3 className="agri-recom-section__title">
            <Thermometer size={15} aria-hidden="true" />
            <span>{t('recommendations.seasonClimateContext', 'Season & Climate Context')}</span>
          </h3>

          <div className="agri-form-grid--3 agri-form-grid">
            <div className="agri-form-group">
              <label htmlFor="recom-season" className="agri-form-label">
                {t('recommendations.targetSeason', 'Target Season')}
              </label>
              <select
                id="recom-season"
                name="season"
                className="agri-form-select"
                value={inputs.season}
                onChange={(e) => onInputChange('season', e.target.value)}
              >
                <option value="Rabi">{t('crops.rabi', 'Rabi')} (Winter/Spring)</option>
                <option value="Kharif">{t('crops.kharif', 'Kharif')} (Monsoon/Autumn)</option>
                <option value="Zaid">{t('crops.zaid', 'Zaid')} (Summer)</option>
              </select>
            </div>

            <div className="agri-form-group">
              <label htmlFor="recom-temp" className="agri-form-label">
                {t('recommendations.meanTemp', 'Mean Temp (°C)')}
              </label>
              <input
                id="recom-temp"
                name="temperature"
                type="number"
                min="5"
                max="48"
                className="agri-form-input"
                value={inputs.temperature}
                onChange={(e) => onInputChange('temperature', e.target.value)}
              />
            </div>

            <div className="agri-form-group">
              <label htmlFor="recom-rain" className="agri-form-label">
                {t('recommendations.expectedRain', 'Expected Rain (mm)')}
              </label>
              <input
                id="recom-rain"
                name="rainfall"
                type="number"
                min="0"
                max="600"
                className="agri-form-input"
                value={inputs.rainfall}
                onChange={(e) => onInputChange('rainfall', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="agri-recom-panel-footer">
        <span className="agri-recom-panel-status">
          {t('recommendations.autoEvaluating', 'Auto-evaluating 7 crops based on selected parameters')}
        </span>
        <Button
          variant="ghost"
          size="sm"
          icon={<RefreshCw size={13} aria-hidden="true" />}
          onClick={onReset}
        >
          {t('recommendations.resetDefaults', 'Reset to Defaults')}
        </Button>
      </div>
    </div>
  );
}

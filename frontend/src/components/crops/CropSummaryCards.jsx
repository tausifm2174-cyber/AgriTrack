import { useTranslation } from 'react-i18next';
import { Sprout, Grid3X3, Clock, Layers } from 'lucide-react';

/**
 * CropSummaryCards component
 * Displays high-level agronomic KPIs:
 * 1. Active Crop Cycles
 * 2. Fields Under Cultivation
 * 3. Crops Near Harvest
 * 4. Different Crop Types
 *
 * @param {Object} props
 * @param {Object} props.summary
 */
export default function CropSummaryCards({ summary = {} }) {
  const { t } = useTranslation();
  const {
    activeCycles = 0,
    fieldsUnderCultivation = 0,
    totalAreaAcres = 0,
    cropsNearHarvest = 0,
    differentCropTypes = 0,
  } = summary;

  return (
    <section className="agri-crop-summary-grid" aria-label={t('crops.title', 'Crop Management Summary Metrics')}>
      {/* 1. Active Crop Cycles */}
      <div className="agri-crop-summary-card">
        <div className="agri-crop-summary-icon agri-crop-summary-icon--green">
          <Sprout size={22} aria-hidden="true" />
        </div>
        <div className="agri-crop-summary-info">
          <span className="agri-crop-summary-label">{t('dashboard.activeCrops', 'Active Crop Cycles')}</span>
          <span className="agri-crop-summary-value">{activeCycles}</span>
          <span className="agri-crop-summary-sub">{t('farms.title', 'Farm holdings')}</span>
        </div>
      </div>

      {/* 2. Fields Under Cultivation */}
      <div className="agri-crop-summary-card">
        <div className="agri-crop-summary-icon agri-crop-summary-icon--blue">
          <Grid3X3 size={22} aria-hidden="true" />
        </div>
        <div className="agri-crop-summary-info">
          <span className="agri-crop-summary-label">{t('dashboard.activeFields', 'Fields Under Cultivation')}</span>
          <span className="agri-crop-summary-value">{fieldsUnderCultivation}</span>
          <span className="agri-crop-summary-sub">{totalAreaAcres} {t('units.acres', 'Acres')}</span>
        </div>
      </div>

      {/* 3. Crops Near Harvest */}
      <div className="agri-crop-summary-card">
        <div className="agri-crop-summary-icon agri-crop-summary-icon--amber">
          <Clock size={22} aria-hidden="true" />
        </div>
        <div className="agri-crop-summary-info">
          <span className="agri-crop-summary-label">{t('crops.expectedHarvest', 'Crops Near Harvest')}</span>
          <span className="agri-crop-summary-value">{cropsNearHarvest}</span>
          <span className="agri-crop-summary-sub">{t('stages.harvestReadiness', 'Harvest Readiness')}</span>
        </div>
      </div>

      {/* 4. Different Crop Types */}
      <div className="agri-crop-summary-card">
        <div className="agri-crop-summary-icon agri-crop-summary-icon--purple">
          <Layers size={22} aria-hidden="true" />
        </div>
        <div className="agri-crop-summary-info">
          <span className="agri-crop-summary-label">{t('crops.variety', 'Different Crop Types')}</span>
          <span className="agri-crop-summary-value">{differentCropTypes}</span>
          <span className="agri-crop-summary-sub">{t('crops.season', 'Active varieties')}</span>
        </div>
      </div>
    </section>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CloudRain, AlertTriangle, CheckCircle, ExternalLink, Cloud, Droplet, RefreshCw } from 'lucide-react';

// Live services & adapters
import weatherService from '../../services/weatherService';
import advisoryService from '../../services/advisoryService';
import { adaptWeatherSnapshot, adaptAdvisory } from '../../utils/adapters';

/**
 * IrrigationAdvisory Component
 * Weather-aware irrigation advice grounded in live backend weather and advisory data.
 * 
 * @param {Object} props
 * @param {string} [props.selectedFarmId]
 * @param {Object} [props.farmsMap]
 */
export default function IrrigationAdvisory({ selectedFarmId, farmsMap = {} }) {
  const { t } = useTranslation();

  // Resolve target farm without hardcoded fallbacks
  const availableFarmIds = Object.keys(farmsMap);
  const targetFarmId = selectedFarmId || (availableFarmIds.length > 0 ? availableFarmIds[0] : null);
  const farmName = targetFarmId && farmsMap[targetFarmId] ? farmsMap[targetFarmId].name : 'Farm Holding';

  const [weatherSnapshot, setWeatherSnapshot] = useState(null);
  const [advisories, setAdvisories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadLiveData() {
      if (!targetFarmId) {
        if (isMounted) {
          setWeatherSnapshot(null);
          setAdvisories([]);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      try {
        const [weatherRes, advisoriesRes] = await Promise.allSettled([
          weatherService.getCurrentWeather(targetFarmId),
          advisoryService.getFarmAdvisories(targetFarmId, { status: 'ACTIVE' }),
        ]);

        if (!isMounted) return;

        if (weatherRes.status === 'fulfilled' && weatherRes.value) {
          setWeatherSnapshot(adaptWeatherSnapshot(weatherRes.value, farmName));
        } else {
          setWeatherSnapshot(null);
        }

        if (advisoriesRes.status === 'fulfilled' && Array.isArray(advisoriesRes.value)) {
          setAdvisories(advisoriesRes.value.map(adaptAdvisory).filter(Boolean));
        } else {
          setAdvisories([]);
        }
      } catch {
        if (isMounted) {
          setWeatherSnapshot(null);
          setAdvisories([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadLiveData();

    return () => {
      isMounted = false;
    };
  }, [targetFarmId, farmName]);

  if (!targetFarmId) {
    return (
      <div className="agri-irrigation-advisory-card">
        <div className="agri-irrigation-alert-banner agri-irrigation-alert-banner--info">
          <Cloud size={18} aria-hidden="true" />
          <span>{t('farms.noFarms', 'No farm holdings available for weather advisory.')}</span>
        </div>
      </div>
    );
  }

  // Active irrigation or rainfall advisory from backend rule engine
  const irrigationAlert = advisories.find(
    (a) => a.category === 'IRRIGATION' || a.category === 'RAINFALL' || (a.status === 'ACTIVE' && a.severity === 'CRITICAL')
  ) || advisories[0] || null;

  // Determine presentation banner based on backend advisory data
  let bannerVariant = 'optimal';
  let bannerIcon = CheckCircle;
  let advisoryHeading = `${t('status.optimal', 'Optimal')} — ${t('irrigation.advisory', 'Irrigation Advisory')}`;
  let advisoryText = t('irrigation.optimalConditions', 'Weather conditions are favorable for scheduled irrigation.');

  if (irrigationAlert) {
    bannerVariant = irrigationAlert.severity === 'CRITICAL' ? 'danger' : 'warning';
    bannerIcon = AlertTriangle;
    advisoryHeading = `${irrigationAlert.title || t('irrigation.advisory', 'Irrigation Advisory')} (${irrigationAlert.severity || 'ACTIVE'})`;
    advisoryText = irrigationAlert.message || irrigationAlert.recommendation || t('irrigation.suspendNotice', 'Advisory in effect for this parcel.');
  }

  const BannerIconComponent = bannerIcon;
  const tempDisplay = weatherSnapshot?.temperature != null ? `${Math.round(weatherSnapshot.temperature)}°C` : '--';
  const humidityDisplay = weatherSnapshot?.humidity != null ? `${weatherSnapshot.humidity}%` : '--';
  const precipitationDisplay = weatherSnapshot?.precipitation != null ? `${weatherSnapshot.precipitation} mm` : '--';
  const conditionDisplay = weatherSnapshot?.condition || t('weather.noData', 'Clear');

  return (
    <div className="agri-irrigation-advisory-card" role="region" aria-label={t('irrigation.advisory', 'Irrigation Advisory')}>
      <div className="agri-irrigation-advisory-header">
        <div className="agri-irrigation-advisory-title">
          <CloudRain size={18} style={{ color: 'var(--primary-600)' }} aria-hidden="true" />
          <span>{t('irrigation.advisory', 'Irrigation Advisory')} — {farmName}</span>
        </div>
        <Link
          to="/weather"
          className="agri-card-action-link"
          style={{ fontSize: '0.8rem', fontWeight: 600 }}
          title={t('weather.forecast', 'View Forecast')}
        >
          <span>{t('weather.forecast', 'View Forecast')}</span>
          <ExternalLink size={13} aria-hidden="true" />
        </Link>
      </div>

      <div className="agri-irrigation-advisory-content">
        {/* Main Advisory Banner */}
        {isLoading ? (
          <div className="agri-irrigation-alert-banner agri-irrigation-alert-banner--info">
            <RefreshCw size={18} className="agri-spin" aria-hidden="true" />
            <span>{t('common.loading', 'Synchronizing weather advisory...')}</span>
          </div>
        ) : (
          <div className={`agri-irrigation-alert-banner agri-irrigation-alert-banner--${bannerVariant}`}>
            <BannerIconComponent size={20} style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
            <div>
              <strong style={{ display: 'block', marginBottom: '0.2rem' }}>
                {advisoryHeading}
              </strong>
              <span>{advisoryText}</span>
            </div>
          </div>
        )}

        {/* Quick Live Weather Signals */}
        <div className="agri-irrigation-weather-metrics">
          <div className="agri-irrigation-metric-row">
            <span>{t('weather.currentWeather', 'Current Weather')}:</span>
            <strong>{conditionDisplay} ({tempDisplay})</strong>
          </div>
          <div className="agri-irrigation-metric-row">
            <span>{t('dashboard.humidity', 'Humidity')}:</span>
            <strong>{humidityDisplay}</strong>
          </div>
          <div className="agri-irrigation-metric-row">
            <span>{t('dashboard.rainfall', 'Precipitation')}:</span>
            <strong>{precipitationDisplay}</strong>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--slate-400)', marginTop: '0.25rem', textAlign: 'right' }}>
            <Droplet size={10} style={{ display: 'inline', marginRight: '3px' }} aria-hidden="true" />
            {t('navigation.weather', 'Live Open-Meteo Feed')}
          </div>
        </div>
      </div>
    </div>
  );
}

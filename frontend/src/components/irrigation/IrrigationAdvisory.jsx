import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CloudRain, AlertTriangle, CheckCircle, ExternalLink, Cloud, Droplet } from 'lucide-react';
import { farmWeather } from '../../data/weatherData';

/**
 * IrrigationAdvisory Component
 * Weather-aware irrigation advice grounded in AgriTrack meteorological data.
 * Evaluates rainfall threshold (> 25 mm triggers suspension) and high humidity (> 85%).
 * 
 * @param {Object} props
 * @param {string} [props.selectedFarmId]
 * @param {Object} [props.farmsMap]
 */
export default function IrrigationAdvisory({ selectedFarmId, farmsMap = {} }) {
  const { t } = useTranslation();

  // Determine target weather data
  const targetFarmId = selectedFarmId || 'farm-2'; // Default to Sunrise Holding (Field 2B context)
  const weather = farmWeather[targetFarmId];
  const farmName = farmsMap[targetFarmId]?.name || weather?.farmName || 'Karnal Farm Area';

  if (!weather) {
    return (
      <div className="agri-irrigation-advisory-card">
        <div className="agri-irrigation-alert-banner agri-irrigation-alert-banner--info">
          <Cloud size={18} aria-hidden="true" />
          <span>{t('common.noData')}</span>
        </div>
      </div>
    );
  }

  // Find heavy rain in 7-day forecast (> 25 mm)
  const forecastDays = weather.forecast || [];
  const heavyRainEvent = forecastDays.find((f) => (f.rainMm || 0) >= 25);
  const highHumidityEvent = forecastDays.find((f) => (f.humidity || 0) >= 85);
  const currentRainfall = weather.current?.rainfallMm || 0;
  const currentHumidity = weather.current?.humidity || 60;

  // Determine advisory level
  let bannerVariant = 'optimal';
  let bannerIcon = CheckCircle;
  let advisoryHeading = `${t('status.optimal')} — ${t('irrigation.advisory')}`;
  let advisoryText = `${t('dashboard.rainfall')}: ${currentRainfall} mm, ${t('dashboard.humidity')}: ${currentHumidity}%. ${t('status.normal')}.`;

  if (heavyRainEvent) {
    bannerVariant = 'warning';
    bannerIcon = AlertTriangle;
    advisoryHeading = `${t('weather.advisories.heavyRain')}: ${t('weather.advisories.suspendIrrigation')} (${heavyRainEvent.day}, ${heavyRainEvent.date})`;
    advisoryText = `${t('irrigation.suspendNotice')} (${heavyRainEvent.rainMm} mm ${t('units.mm')}).`;
  } else if (highHumidityEvent || currentHumidity > 85) {
    bannerVariant = 'warning';
    bannerIcon = CloudRain;
    advisoryHeading = `${t('weather.advisories.highHumidity')} (${heavyRainEvent ? heavyRainEvent.humidity : currentHumidity}%)`;
    advisoryText = `${t('weather.advisories.highHumidity')}.`;
  }

  const BannerIconComponent = bannerIcon;

  return (
    <div className="agri-irrigation-advisory-card" role="region" aria-label={t('irrigation.advisory')}>
      <div className="agri-irrigation-advisory-header">
        <div className="agri-irrigation-advisory-title">
          <CloudRain size={18} style={{ color: 'var(--primary-600)' }} aria-hidden="true" />
          <span>{t('irrigation.advisory')} — {farmName}</span>
        </div>
        <Link
          to="/weather"
          className="agri-card-action-link"
          style={{ fontSize: '0.8rem', fontWeight: 600 }}
          title={t('weather.forecast')}
        >
          <span>{t('weather.forecast')}</span>
          <ExternalLink size={13} aria-hidden="true" />
        </Link>
      </div>

      <div className="agri-irrigation-advisory-content">
        {/* Main Advisory Banner */}
        <div className={`agri-irrigation-alert-banner agri-irrigation-alert-banner--${bannerVariant}`}>
          <BannerIconComponent size={20} style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
          <div>
            <strong style={{ display: 'block', marginBottom: '0.2rem' }}>
              {advisoryHeading}
            </strong>
            <span>{advisoryText}</span>
          </div>
        </div>

        {/* Quick Weather Signals */}
        <div className="agri-irrigation-weather-metrics">
          <div className="agri-irrigation-metric-row">
            <span>{t('weather.currentWeather')}:</span>
            <strong>{weather.current?.condition} ({weather.current?.temperature}°C)</strong>
          </div>
          <div className="agri-irrigation-metric-row">
            <span>{t('dashboard.humidity')}:</span>
            <strong>{weather.current?.humidity}%</strong>
          </div>
          <div className="agri-irrigation-metric-row">
            <span>{t('dashboard.rainfall')}:</span>
            <strong>
              {heavyRainEvent ? `${heavyRainEvent.rainMm} mm (${heavyRainEvent.day})` : `0–12 mm (${t('status.low')})`}
            </strong>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--slate-400)', marginTop: '0.25rem', textAlign: 'right' }}>
            <Droplet size={10} style={{ display: 'inline', marginRight: '3px' }} aria-hidden="true" />
            {t('navigation.weather')}
          </div>
        </div>
      </div>
    </div>
  );
}

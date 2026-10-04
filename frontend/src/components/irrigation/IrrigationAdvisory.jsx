import { Link } from 'react-router-dom';
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
  // Determine target weather data
  const targetFarmId = selectedFarmId || 'farm-2'; // Default to Sunrise Holding (Field 2B context)
  const weather = farmWeather[targetFarmId];
  const farmName = farmsMap[targetFarmId]?.name || weather?.farmName || 'Karnal Farm Area';

  if (!weather) {
    return (
      <div className="agri-irrigation-advisory-card">
        <div className="agri-irrigation-alert-banner agri-irrigation-alert-banner--info">
          <Cloud size={18} aria-hidden="true" />
          <span>Weather data unavailable for this farm holding.</span>
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
  let advisoryHeading = 'Optimal Irrigation Conditions';
  let advisoryText = `Rainfall is minimal (${currentRainfall} mm) and atmospheric humidity is ${currentHumidity}%. Soil evapotranspiration is normal; proceed with precision drip and sprinkler delivery according to planned schedule.`;

  if (heavyRainEvent) {
    bannerVariant = 'warning';
    bannerIcon = AlertTriangle;
    advisoryHeading = `Heavy Rainfall Expected: Suspend Irrigation (${heavyRainEvent.day}, ${heavyRainEvent.date})`;
    advisoryText = `AgriTrack Meteorological Advisory: Forecast predicts ${heavyRainEvent.rainMm} mm of heavy rainfall (> 25 mm critical threshold) on ${heavyRainEvent.day} (${heavyRainEvent.fullDate}). Suspend scheduled irrigation for open fields (e.g. Field 2B Maize) to prevent waterlogging, soil erosion, and nutrient leaching.`;
  } else if (highHumidityEvent || currentHumidity > 85) {
    bannerVariant = 'warning';
    bannerIcon = CloudRain;
    advisoryHeading = 'High Humidity Alert — Restrict Foliar Wetting';
    advisoryText = `Atmospheric relative humidity exceeds 85% (${heavyRainEvent ? heavyRainEvent.humidity : currentHumidity}%). Prefer ground drip irrigation over overhead sprinklers to prevent foliar fungal spore germination (powdery mildew / blight).`;
  }

  const BannerIconComponent = bannerIcon;

  return (
    <div className="agri-irrigation-advisory-card" role="region" aria-label="Irrigation Weather Advisory">
      <div className="agri-irrigation-advisory-header">
        <div className="agri-irrigation-advisory-title">
          <CloudRain size={18} style={{ color: 'var(--primary-600)' }} aria-hidden="true" />
          <span>Weather-Aware Irrigation Advisory — {farmName}</span>
        </div>
        <Link
          to="/weather"
          className="agri-card-action-link"
          style={{ fontSize: '0.8rem', fontWeight: 600 }}
          title="Open comprehensive 7-day weather forecast"
        >
          <span>View 7-Day Forecast</span>
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
            <span>Current Condition:</span>
            <strong>{weather.current?.condition} ({weather.current?.temperature}°C)</strong>
          </div>
          <div className="agri-irrigation-metric-row">
            <span>Relative Humidity:</span>
            <strong>{weather.current?.humidity}%</strong>
          </div>
          <div className="agri-irrigation-metric-row">
            <span>Forecast Max Rain:</span>
            <strong>
              {heavyRainEvent ? `${heavyRainEvent.rainMm} mm (${heavyRainEvent.day})` : '0–12 mm (Low)'}
            </strong>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--slate-400)', marginTop: '0.25rem', textAlign: 'right' }}>
            <Droplet size={10} style={{ display: 'inline', marginRight: '3px' }} aria-hidden="true" />
            Deterministic Weather Model • Demo Karnal
          </div>
        </div>
      </div>
    </div>
  );
}

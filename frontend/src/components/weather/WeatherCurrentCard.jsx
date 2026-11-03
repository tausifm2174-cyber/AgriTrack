import { useTranslation } from 'react-i18next';
import {
  CloudSun,
  Sun,
  CloudRain,
  Cloud,
  Droplets,
  Wind,
  Umbrella,
  Eye,
  Gauge,
  ShieldCheck,
  MapPin,
} from 'lucide-react';
import { translateWeatherCondition } from '../../utils/displayLabels';

/**
 * WeatherCurrentCard component
 * Displays prominent live-style current meteorological reading for the selected farm holding.
 */
export default function WeatherCurrentCard({
  weather = {},
  farmName = 'Green Valley Farm',
  location = 'Karnal, Haryana',
}) {
  const { t } = useTranslation();
  const {
    temperature = 28,
    unit = '°C',
    condition = 'Partly Cloudy',
    conditionCode = 'partly-cloudy',
    feelsLike = 30,
    humidity = 62,
    windSpeed = '12 km/h',
    windDirection = 'NW',
    rainChance = '10%',
    visibility = '9 km',
    pressure = '1012 hPa',
    dewPoint = '19°C',
    uvIndex = '6 (Moderate)',
    airQuality = 'Satisfactory',
  } = weather;

  const renderWeatherIcon = (code) => {
    switch (code) {
      case 'sunny':
      case 'clear':
        return <Sun size={56} className="agri-cur-weather__glyph agri-cur-weather__glyph--sunny" aria-hidden="true" />;
      case 'rainy':
      case 'heavy-rain':
        return <CloudRain size={56} className="agri-cur-weather__glyph agri-cur-weather__glyph--rainy" aria-hidden="true" />;
      case 'cloudy':
        return <Cloud size={56} className="agri-cur-weather__glyph agri-cur-weather__glyph--cloudy" aria-hidden="true" />;
      default:
        return <CloudSun size={56} className="agri-cur-weather__glyph agri-cur-weather__glyph--partly" aria-hidden="true" />;
    }
  };

  return (
    <article className="agri-cur-weather-card" aria-label={t('weather.currentWeather', 'Current Weather Conditions')}>
      {/* Top Banner with Farm Location */}
      <div className="agri-cur-weather-card__header">
        <div className="agri-cur-weather-card__loc-group">
          <div className="agri-cur-weather-card__loc-badge">
            <MapPin size={13} aria-hidden="true" />
            <span>{farmName}</span>
          </div>
          <span className="agri-cur-weather-card__loc-sub">{location}</span>
        </div>
        <span className="agri-cur-weather-card__condition-tag">
          {translateWeatherCondition(conditionCode || condition, t)}
        </span>
      </div>

      {/* Main Display: Temperature & Primary Icon */}
      <div className="agri-cur-weather-card__hero">
        <div className="agri-cur-weather-card__temp-group">
          <span className="agri-cur-weather-card__temp-num">
            {temperature}
          </span>
          <span className="agri-cur-weather-card__temp-unit">{unit}</span>
        </div>

        <div className="agri-cur-weather-card__glyph-wrap">
          {renderWeatherIcon(conditionCode)}
        </div>
      </div>

      {/* Secondary Subtext */}
      <div className="agri-cur-weather-card__feels-row">
        <span>{t('weather.feelsLike', 'Feels like')} <strong>{feelsLike}°C</strong></span>
        <span className="agri-cur-weather-card__dot">•</span>
        <span>{t('weather.dewPoint', 'Dew Point')}: {dewPoint}</span>
        <span className="agri-cur-weather-card__dot">•</span>
        <span>{t('weather.uvIndex', 'UV Index')}: {uvIndex}</span>
      </div>

      {/* Metrics Grid */}
      <div className="agri-cur-weather-card__metrics-grid">
        <div className="agri-cur-weather-card__metric-item">
          <span className="agri-cur-weather-card__metric-label">
            <Droplets size={14} className="text-info" aria-hidden="true" />
            {t('weather.humidity', 'Humidity')}
          </span>
          <span className="agri-cur-weather-card__metric-val">{humidity}%</span>
        </div>

        <div className="agri-cur-weather-card__metric-item">
          <span className="agri-cur-weather-card__metric-label">
            <Wind size={14} className="text-primary" aria-hidden="true" />
            {t('weather.wind', 'Wind')}
          </span>
          <span className="agri-cur-weather-card__metric-val">{windSpeed} {windDirection}</span>
        </div>

        <div className="agri-cur-weather-card__metric-item">
          <span className="agri-cur-weather-card__metric-label">
            <Umbrella size={14} className="text-warning" aria-hidden="true" />
            {t('weather.rainChance', 'Rain Probability')}
          </span>
          <span className="agri-cur-weather-card__metric-val">{rainChance}</span>
        </div>

        <div className="agri-cur-weather-card__metric-item">
          <span className="agri-cur-weather-card__metric-label">
            <Eye size={14} aria-hidden="true" />
            {t('weather.visibility', 'Visibility')}
          </span>
          <span className="agri-cur-weather-card__metric-val">{visibility}</span>
        </div>

        <div className="agri-cur-weather-card__metric-item">
          <span className="agri-cur-weather-card__metric-label">
            <Gauge size={14} aria-hidden="true" />
            {t('weather.pressure', 'Pressure')}
          </span>
          <span className="agri-cur-weather-card__metric-val">{pressure}</span>
        </div>

        <div className="agri-cur-weather-card__metric-item">
          <span className="agri-cur-weather-card__metric-label">
            <ShieldCheck size={14} className="text-success" aria-hidden="true" />
            {t('weather.airQuality', 'Air Quality')}
          </span>
          <span className="agri-cur-weather-card__metric-val">{airQuality}</span>
        </div>
      </div>
    </article>
  );
}

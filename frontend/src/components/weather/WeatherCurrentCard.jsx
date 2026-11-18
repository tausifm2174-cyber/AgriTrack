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
  farmName = '',
  location = '',
}) {
  const { t } = useTranslation();
  const {
    temperature = null,
    unit = '°C',
    condition = null,
    conditionCode = null,
    feelsLike = null,
    humidity = null,
    windSpeed = null,
    windDirection = '',
    rainChance = null,
    visibility = null,
    pressure = null,
    dewPoint = null,
    uvIndex = null,
    airQuality = null,
  } = weather || {};

  const displayTemp = temperature != null ? temperature : '--';
  const displayFeelsLike = feelsLike != null ? `${feelsLike}°C` : '--';
  const displayDewPoint = dewPoint != null ? dewPoint : t('common.notAvailable', 'N/A');
  const displayUvIndex = uvIndex != null ? uvIndex : t('common.notAvailable', 'N/A');
  const displayVisibility = visibility != null ? visibility : t('common.notAvailable', 'N/A');
  const displayRainChance = rainChance != null ? rainChance : t('common.notAvailable', 'N/A');
  const displayPressure = pressure != null ? pressure : t('common.notAvailable', 'N/A');
  const displayAirQuality = airQuality != null ? airQuality : t('common.notAvailable', 'N/A');
  const displayWind = windSpeed ? `${windSpeed} ${windDirection || ''}`.trim() : t('common.notAvailable', 'N/A');
  const displayHumidity = humidity != null ? `${humidity}%` : t('common.notAvailable', 'N/A');

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
            <span>{farmName || t('farms.farm', 'Farm')}</span>
          </div>
          {location && <span className="agri-cur-weather-card__loc-sub">{location}</span>}
        </div>
        <span className="agri-cur-weather-card__condition-tag">
          {translateWeatherCondition(conditionCode || condition, t)}
        </span>
      </div>

      {/* Main Display: Temperature & Primary Icon */}
      <div className="agri-cur-weather-card__hero">
        <div className="agri-cur-weather-card__temp-group">
          <span className="agri-cur-weather-card__temp-num">
            {displayTemp}
          </span>
          <span className="agri-cur-weather-card__temp-unit">{unit}</span>
        </div>

        <div className="agri-cur-weather-card__glyph-wrap">
          {renderWeatherIcon(conditionCode)}
        </div>
      </div>

      {/* Secondary Subtext */}
      <div className="agri-cur-weather-card__feels-row">
        <span>{t('weather.feelsLike', 'Feels like')} <strong>{displayFeelsLike}</strong></span>
        {dewPoint != null && (
          <>
            <span className="agri-cur-weather-card__dot">•</span>
            <span>{t('weather.dewPoint', 'Dew Point')}: {displayDewPoint}</span>
          </>
        )}
        {uvIndex != null && (
          <>
            <span className="agri-cur-weather-card__dot">•</span>
            <span>{t('weather.uvIndex', 'UV Index')}: {displayUvIndex}</span>
          </>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="agri-cur-weather-card__metrics-grid">
        <div className="agri-cur-weather-card__metric-item">
          <span className="agri-cur-weather-card__metric-label">
            <Droplets size={14} className="text-info" aria-hidden="true" />
            {t('weather.humidity', 'Humidity')}
          </span>
          <span className="agri-cur-weather-card__metric-val">{displayHumidity}</span>
        </div>

        <div className="agri-cur-weather-card__metric-item">
          <span className="agri-cur-weather-card__metric-label">
            <Wind size={14} className="text-primary" aria-hidden="true" />
            {t('weather.wind', 'Wind')}
          </span>
          <span className="agri-cur-weather-card__metric-val">{displayWind}</span>
        </div>

        <div className="agri-cur-weather-card__metric-item">
          <span className="agri-cur-weather-card__metric-label">
            <Umbrella size={14} className="text-warning" aria-hidden="true" />
            {t('weather.rainChance', 'Rain Probability')}
          </span>
          <span className="agri-cur-weather-card__metric-val">{displayRainChance}</span>
        </div>

        <div className="agri-cur-weather-card__metric-item">
          <span className="agri-cur-weather-card__metric-label">
            <Eye size={14} aria-hidden="true" />
            {t('weather.visibility', 'Visibility')}
          </span>
          <span className="agri-cur-weather-card__metric-val">{displayVisibility}</span>
        </div>

        <div className="agri-cur-weather-card__metric-item">
          <span className="agri-cur-weather-card__metric-label">
            <Gauge size={14} aria-hidden="true" />
            {t('weather.pressure', 'Pressure')}
          </span>
          <span className="agri-cur-weather-card__metric-val">{displayPressure}</span>
        </div>

        <div className="agri-cur-weather-card__metric-item">
          <span className="agri-cur-weather-card__metric-label">
            <ShieldCheck size={14} className="text-success" aria-hidden="true" />
            {t('weather.airQuality', 'Air Quality')}
          </span>
          <span className="agri-cur-weather-card__metric-val">{displayAirQuality}</span>
        </div>
      </div>
    </article>
  );
}

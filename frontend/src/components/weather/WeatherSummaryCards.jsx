import { useTranslation } from 'react-i18next';
import { Thermometer, Droplets, Umbrella, Wind } from 'lucide-react';

/**
 * WeatherSummaryCards component
 * Displays 4 quick KPI summary cards for Temperature, Humidity, Rain Probability, and Wind Speed.
 */
export default function WeatherSummaryCards({ weather = {} }) {
  const { t } = useTranslation();
  const {
    temperature = 28,
    unit = '°C',
    feelsLike = 30,
    humidity = 62,
    rainChance = '10%',
    rainfallMm = 0,
    windSpeed = '12 km/h',
    windDirection = 'NW',
  } = weather;

  return (
    <section className="agri-weather-summary-grid" aria-label={t('weather.summaryMetrics', 'Weather Summary Metrics')}>
      {/* 1. Temperature */}
      <div className="agri-weather-summary-card">
        <div className="agri-weather-summary-icon agri-weather-summary-icon--amber">
          <Thermometer size={22} aria-hidden="true" />
        </div>
        <div className="agri-weather-summary-info">
          <span className="agri-weather-summary-label">{t('weather.meanTemp', 'Mean Temperature')}</span>
          <span className="agri-weather-summary-value">{temperature}{unit}</span>
          <span className="agri-weather-summary-sub">{t('weather.feelsLike', 'Feels like')} {feelsLike}°C</span>
        </div>
      </div>

      {/* 2. Humidity */}
      <div className="agri-weather-summary-card">
        <div className="agri-weather-summary-icon agri-weather-summary-icon--blue">
          <Droplets size={22} aria-hidden="true" />
        </div>
        <div className="agri-weather-summary-info">
          <span className="agri-weather-summary-label">{t('weather.relativeHumidity', 'Relative Humidity')}</span>
          <span className="agri-weather-summary-value">{humidity}%</span>
          <span className="agri-weather-summary-sub">
            {humidity > 80
              ? t('weather.highFungalAlert', 'High (Fungal alert)')
              : humidity < 40
              ? t('weather.dryAir', 'Dry air')
              : t('weather.optimalMoisture', 'Optimal moisture')}
          </span>
        </div>
      </div>

      {/* 3. Rain Probability */}
      <div className="agri-weather-summary-card">
        <div className="agri-weather-summary-icon agri-weather-summary-icon--green">
          <Umbrella size={22} aria-hidden="true" />
        </div>
        <div className="agri-weather-summary-info">
          <span className="agri-weather-summary-label">{t('weather.rainProbability', 'Rain Probability')}</span>
          <span className="agri-weather-summary-value">{rainChance}</span>
          <span className="agri-weather-summary-sub">
            {rainfallMm > 0
              ? `${rainfallMm} ${t('units.mm', 'mm')} ${t('weather.recorded', 'recorded')}`
              : t('weather.noRainRecorded', 'No rain recorded today')}
          </span>
        </div>
      </div>

      {/* 4. Wind Speed */}
      <div className="agri-weather-summary-card">
        <div className="agri-weather-summary-icon agri-weather-summary-icon--purple">
          <Wind size={22} aria-hidden="true" />
        </div>
        <div className="agri-weather-summary-info">
          <span className="agri-weather-summary-label">{t('weather.windVelocity', 'Wind Velocity')}</span>
          <span className="agri-weather-summary-value">{windSpeed}</span>
          <span className="agri-weather-summary-sub">{windDirection} • {t('weather.favorableSpray', 'Favorable for spray')}</span>
        </div>
      </div>
    </section>
  );
}

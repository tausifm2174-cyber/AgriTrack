import { Thermometer, Droplets, Umbrella, Wind } from 'lucide-react';

/**
 * WeatherSummaryCards component
 * Displays 4 quick KPI summary cards for Temperature, Humidity, Rain Probability, and Wind Speed.
 *
 * @param {Object} props
 * @param {Object} props.weather - Current weather metrics
 */
export default function WeatherSummaryCards({ weather = {} }) {
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
    <section className="agri-weather-summary-grid" aria-label="Weather Summary Metrics">
      {/* 1. Temperature */}
      <div className="agri-weather-summary-card">
        <div className="agri-weather-summary-icon agri-weather-summary-icon--amber">
          <Thermometer size={22} aria-hidden="true" />
        </div>
        <div className="agri-weather-summary-info">
          <span className="agri-weather-summary-label">Mean Temperature</span>
          <span className="agri-weather-summary-value">{temperature}{unit}</span>
          <span className="agri-weather-summary-sub">Feels like {feelsLike}°C</span>
        </div>
      </div>

      {/* 2. Humidity */}
      <div className="agri-weather-summary-card">
        <div className="agri-weather-summary-icon agri-weather-summary-icon--blue">
          <Droplets size={22} aria-hidden="true" />
        </div>
        <div className="agri-weather-summary-info">
          <span className="agri-weather-summary-label">Relative Humidity</span>
          <span className="agri-weather-summary-value">{humidity}%</span>
          <span className="agri-weather-summary-sub">
            {humidity > 80 ? 'High (Fungal alert)' : humidity < 40 ? 'Dry air' : 'Optimal moisture'}
          </span>
        </div>
      </div>

      {/* 3. Rain Probability */}
      <div className="agri-weather-summary-card">
        <div className="agri-weather-summary-icon agri-weather-summary-icon--green">
          <Umbrella size={22} aria-hidden="true" />
        </div>
        <div className="agri-weather-summary-info">
          <span className="agri-weather-summary-label">Rain Probability</span>
          <span className="agri-weather-summary-value">{rainChance}</span>
          <span className="agri-weather-summary-sub">
            {rainfallMm > 0 ? `${rainfallMm} mm recorded` : 'No rain recorded today'}
          </span>
        </div>
      </div>

      {/* 4. Wind Speed */}
      <div className="agri-weather-summary-card">
        <div className="agri-weather-summary-icon agri-weather-summary-icon--purple">
          <Wind size={22} aria-hidden="true" />
        </div>
        <div className="agri-weather-summary-info">
          <span className="agri-weather-summary-label">Wind Velocity</span>
          <span className="agri-weather-summary-value">{windSpeed}</span>
          <span className="agri-weather-summary-sub">{windDirection} • Favorable for spray</span>
        </div>
      </div>
    </section>
  );
}

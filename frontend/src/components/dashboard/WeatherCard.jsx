import { Link } from 'react-router-dom';
import { CloudSun, Droplets, Wind, Umbrella, MapPin, ArrowRight } from 'lucide-react';

/**
 * WeatherCard Component
 * Prominent weather overview card for AgriTrack dashboard.
 * @param {Object} props
 * @param {Object} props.weather
 */
export default function WeatherCard({ weather }) {
  const {
    temperature = 28,
    unit = '°C',
    condition = 'Partly Cloudy',
    location = 'Farm Area',
    subtext = "Today's weather",
    humidity = 62,
    windSpeed = '12 km/h',
    rainChance = '10%',
  } = weather || {};

  return (
    <div className="agri-weather-card">
      <div>
        <div className="agri-weather-card__header">
          <div>
            <div className="agri-weather-card__location-badge">
              <MapPin size={13} aria-hidden="true" />
              <span>{location}</span>
            </div>
            <p className="agri-weather-card__subtext">{subtext}</p>
          </div>
          <div className="agri-weather-card__icon-box" title={condition}>
            <CloudSun size={28} aria-hidden="true" />
          </div>
        </div>

        <div className="agri-weather-card__main">
          <span className="agri-weather-card__temp">
            {temperature}{unit}
          </span>
          <div className="agri-weather-card__condition-wrap">
            <span className="agri-weather-card__condition">{condition}</span>
            <span className="text-muted" style={{ fontSize: '0.725rem' }}>Demo Weather</span>
          </div>
        </div>

        <div className="agri-weather-card__details">
          <div className="agri-weather-card__detail-item">
            <span className="agri-weather-card__detail-label">
              <Droplets size={11} style={{ display: 'inline', marginRight: '2px' }} aria-hidden="true" />
              Humidity
            </span>
            <span className="agri-weather-card__detail-val">{humidity}%</span>
          </div>
          <div className="agri-weather-card__detail-item">
            <span className="agri-weather-card__detail-label">
              <Wind size={11} style={{ display: 'inline', marginRight: '2px' }} aria-hidden="true" />
              Wind
            </span>
            <span className="agri-weather-card__detail-val">{windSpeed}</span>
          </div>
          <div className="agri-weather-card__detail-item">
            <span className="agri-weather-card__detail-label">
              <Umbrella size={11} style={{ display: 'inline', marginRight: '2px' }} aria-hidden="true" />
              Rain
            </span>
            <span className="agri-weather-card__detail-val">{rainChance}</span>
          </div>
        </div>
      </div>

      <Link to="/weather" className="agri-weather-card__link">
        <span>View weather insights</span>
        <ArrowRight size={13} aria-hidden="true" />
      </Link>
    </div>
  );
}

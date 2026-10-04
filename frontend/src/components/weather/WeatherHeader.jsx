import { useNavigate } from 'react-router-dom';
import { CloudSun, Clock, Compass, Info } from 'lucide-react';
import { Button } from '../common';
import FarmWeatherSelector from './FarmWeatherSelector';

/**
 * WeatherHeader component
 * Displays meteorological page title, demo data disclaimer, farm selector, and quick link to recommendations.
 *
 * @param {Object} props
 * @param {string} props.selectedFarmId - ID of active farm
 * @param {Function} props.onSelectFarm - Handler to change active farm
 * @param {Array} props.farms - List of farms
 * @param {string} [props.lastUpdated] - Timestamp string
 */
export default function WeatherHeader({
  selectedFarmId,
  onSelectFarm,
  farms = [],
  lastUpdated = 'Just now (Demo)',
}) {
  const navigate = useNavigate();

  return (
    <header className="agri-weather-header">
      <div className="agri-weather-header__left">
        <div className="agri-weather-header__badges">
          <span className="agri-weather-badge agri-weather-badge--demo">
            <Info size={12} aria-hidden="true" />
            <span>Demo Weather Data</span>
          </span>
          <span className="agri-weather-badge agri-weather-badge--time">
            <Clock size={12} aria-hidden="true" />
            <span>Updated: {lastUpdated}</span>
          </span>
        </div>

        <h1 className="agri-weather-header__title">
          <CloudSun size={28} className="agri-weather-header__icon text-primary" aria-hidden="true" />
          <span>Weather & Farm Insights</span>
        </h1>

        <p className="agri-weather-header__desc">
          Monitor weather conditions and understand their impact on farm operations.
        </p>
      </div>

      <div className="agri-weather-header__actions">
        <FarmWeatherSelector
          selectedFarmId={selectedFarmId}
          onSelectFarm={onSelectFarm}
          farms={farms}
        />

        <Button
          variant="outline"
          icon={<Compass size={15} aria-hidden="true" />}
          onClick={() => navigate('/recommendations')}
        >
          Crop Advisory
        </Button>
      </div>
    </header>
  );
}

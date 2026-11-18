import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CloudSun, Clock, Compass, Info, RefreshCw } from 'lucide-react';
import { Button } from '../common';
import FarmWeatherSelector from './FarmWeatherSelector';

/**
 * WeatherHeader component
 * Displays meteorological page title, sync action, farm selector, and quick link to recommendations.
 */
export default function WeatherHeader({
  selectedFarmId,
  onSelectFarm,
  farms = [],
  lastUpdated,
  isSyncing = false,
  onSyncWeather,
  isCached = false,
  provider,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const displayLastUpdated = lastUpdated || t('common.justNow', 'Just now');

  return (
    <header className="agri-weather-header">
      <div className="agri-weather-header__left">
        <div className="agri-weather-header__badges">
          <span className="agri-weather-badge agri-weather-badge--demo" title={isCached ? t('weather.cachedNotice', 'Cached data (auto-refreshes every 30 mins)') : provider || ''}>
            <Info size={12} aria-hidden="true" />
            <span>{isCached ? t('weather.cachedFeed', 'Cached (30m)') : (provider ? `${provider}` : t('weather.liveFeed', 'Live Feed'))}</span>
          </span>
          <span className="agri-weather-badge agri-weather-badge--time">
            <Clock size={12} aria-hidden="true" />
            <span>{t('weather.updated', 'Updated')}: {displayLastUpdated}</span>
          </span>
        </div>

        <h1 className="agri-weather-header__title">
          <CloudSun size={28} className="agri-weather-header__icon text-primary" aria-hidden="true" />
          <span>{t('weather.title', 'Weather & Farm Insights')}</span>
        </h1>

        <p className="agri-weather-header__desc">
          {t('weather.subtitle', 'Monitor weather conditions and understand their impact on farm operations.')}
        </p>
      </div>

      <div className="agri-weather-header__actions">
        <FarmWeatherSelector
          selectedFarmId={selectedFarmId}
          onSelectFarm={onSelectFarm}
          farms={farms}
        />

        {onSyncWeather && (
          <Button
            variant="outline"
            icon={<RefreshCw size={15} className={isSyncing ? 'agri-spin' : ''} aria-hidden="true" />}
            onClick={onSyncWeather}
            disabled={isSyncing || !selectedFarmId}
          >
            {isSyncing ? t('weather.syncing', 'Syncing...') : t('weather.syncWeather', 'Sync Weather')}
          </Button>
        )}

        <Button
          variant="outline"
          icon={<Compass size={15} aria-hidden="true" />}
          onClick={() => navigate(selectedFarmId ? `/recommendations?farmId=${selectedFarmId}` : '/recommendations')}
        >
          {t('weather.cropAdvisory', 'Crop Advisory')}
        </Button>
      </div>
    </header>
  );
}

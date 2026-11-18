import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertCircle, AlertTriangle, RefreshCw, Warehouse } from 'lucide-react';
import farmService from '../services/farmService';
import weatherService from '../services/weatherService';
import advisoryService from '../services/advisoryService';
import { adaptFarm, adaptWeatherSnapshot, adaptWeatherForecast, adaptAdvisory } from '../utils/adapters';
import {
  WeatherHeader,
  WeatherCurrentCard,
  WeatherSummaryCards,
  WeatherForecast,
  WeatherTrendChart,
  WeatherAlerts,
} from '../components/weather';
import '../components/weather/weather.css';

/**
 * WeatherPage (Phase 22.7 — Weather & Farm Insights)
 * Centralizes live micro-climate tracking, 7-day meteorological forecasts,
 * high/low temperature trend charts, and automated rule-based agronomic alerts.
 */
export default function WeatherPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const farmParam = searchParams.get('farmId');

  const [farms, setFarms] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState(null);
  const [weatherSnapshot, setWeatherSnapshot] = useState(null);
  const [weatherForecast, setWeatherForecast] = useState([]);
  const [advisories, setAdvisories] = useState([]);
  const [isLoadingFarms, setIsLoadingFarms] = useState(true);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [isSyncingWeather, setIsSyncingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState(null);
  const [locationWarning, setLocationWarning] = useState(null);

  // 1. Load user's farms on mount
  useEffect(() => {
    let isMounted = true;
    async function loadFarms() {
      setIsLoadingFarms(true);
      try {
        const rawFarms = await farmService.getAllFarms();
        if (isMounted) {
          const adapted = Array.isArray(rawFarms) ? rawFarms.map((f) => adaptFarm(f)) : [];
          setFarms(adapted);
          if (adapted.length > 0) {
            const initialId = farmParam && adapted.some((f) => String(f.id) === String(farmParam))
              ? farmParam
              : adapted[0].id;
            setSelectedFarmId(initialId);
          }
        }
      } catch (err) {
        if (isMounted) {
          setWeatherError(err.message || 'Failed to load farms');
        }
      } finally {
        if (isMounted) {
          setIsLoadingFarms(false);
        }
      }
    }
    loadFarms();
    return () => { isMounted = false; };
  }, [farmParam]);

  // Active farm object
  const activeFarm = useMemo(() => {
    return farms.find((f) => String(f.id) === String(selectedFarmId)) || farms[0] || null;
  }, [farms, selectedFarmId]);

  // 2. Fetch live weather & advisories whenever selectedFarmId changes
  const fetchWeatherData = useCallback(async (farmId) => {
    if (!farmId) return;
    setIsLoadingWeather(true);
    setWeatherError(null);
    setLocationWarning(null);

    const [snapshotResult, forecastResult, advisoriesResult] = await Promise.allSettled([
      weatherService.getCurrentWeather(farmId),
      weatherService.getForecast(farmId),
      advisoryService.getFarmAdvisories(farmId),
    ]);

    // Check for missing farm location error
    const errors = [snapshotResult, forecastResult].filter((r) => r.status === 'rejected');
    if (errors.length > 0) {
      const firstErrMsg = errors[0].reason?.message || '';
      if (firstErrMsg.toLowerCase().includes('location') || firstErrMsg.includes('Farm location is not set')) {
        setLocationWarning(firstErrMsg);
      } else {
        setWeatherError(firstErrMsg || 'Failed to retrieve weather data');
      }
    }

    if (snapshotResult.status === 'fulfilled' && snapshotResult.value) {
      setWeatherSnapshot(adaptWeatherSnapshot(snapshotResult.value));
    } else if (snapshotResult.status === 'rejected') {
      setWeatherSnapshot(null);
    }

    if (forecastResult.status === 'fulfilled' && forecastResult.value) {
      setWeatherForecast(adaptWeatherForecast(forecastResult.value));
    } else {
      setWeatherForecast([]);
    }

    if (advisoriesResult.status === 'fulfilled' && advisoriesResult.value) {
      const rawAdv = Array.isArray(advisoriesResult.value) ? advisoriesResult.value : [];
      setAdvisories(rawAdv.map(adaptAdvisory).filter(Boolean));
    } else {
      setAdvisories([]);
    }

    setIsLoadingWeather(false);
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (selectedFarmId) {
      Promise.resolve().then(() => {
        if (isMounted) {
          fetchWeatherData(selectedFarmId);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [selectedFarmId, fetchWeatherData]);

  // 3. Handle explicit Sync Weather
  const handleSyncWeather = async () => {
    if (!selectedFarmId || isSyncingWeather) return;
    setIsSyncingWeather(true);
    setWeatherError(null);
    setLocationWarning(null);

    try {
      const syncResult = await weatherService.syncWeather(selectedFarmId);
      if (syncResult) {
        if (syncResult.current) {
          setWeatherSnapshot(adaptWeatherSnapshot(syncResult.current));
        }
        if (syncResult.forecast) {
          setWeatherForecast(adaptWeatherForecast(syncResult.forecast));
        }
      }
      // Re-fetch advisories that were generated by the rule engine
      const updatedAdvisories = await advisoryService.getFarmAdvisories(selectedFarmId);
      if (Array.isArray(updatedAdvisories)) {
        setAdvisories(updatedAdvisories.map(adaptAdvisory).filter(Boolean));
      }
    } catch (err) {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('location') || msg.includes('Farm location is not set')) {
        setLocationWarning(msg);
      } else {
        setWeatherError(msg || 'Failed to sync weather');
      }
    } finally {
      setIsSyncingWeather(false);
    }
  };

  // Handle farm change
  const handleFarmChange = (farmId) => {
    setSelectedFarmId(farmId);
    setSearchParams({ farmId });
  };

  if (isLoadingFarms) {
    return (
      <div className="agri-weather-page" style={{ padding: '3rem', textAlign: 'center' }}>
        <RefreshCw size={32} className="agri-spin" style={{ margin: '0 auto 1rem', color: 'var(--primary-600)' }} aria-hidden="true" />
        <p style={{ color: 'var(--slate-600)', fontSize: '0.875rem' }}>{t('common.loading', 'Loading farm data...')}</p>
      </div>
    );
  }

  if (farms.length === 0) {
    return (
      <div className="agri-weather-page">
        <div style={{ padding: '4rem 2rem', textAlign: 'center', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid var(--slate-200)', marginTop: '2rem' }}>
          <Warehouse size={48} style={{ margin: '0 auto 1rem', color: 'var(--primary-600)' }} aria-hidden="true" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--slate-800)', marginBottom: '0.5rem' }}>
            {t('weather.noFarmsTitle', 'No Farm Holdings Found')}
          </h2>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem', marginBottom: '1.5rem', maxWidth: '440px', margin: '0 auto 1.5rem' }}>
            {t('weather.noFarmsDesc', 'Register a farm holding to monitor micro-climate conditions and automated agronomic weather alerts.')}
          </p>
          <Link to="/farms" className="agri-btn agri-btn--primary">
            {t('farms.createHolding', 'Register Farm Holding')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="agri-weather-page">
      {/* 1. Weather Header with Farm Selector & Sync Action */}
      <WeatherHeader
        selectedFarmId={selectedFarmId}
        onSelectFarm={handleFarmChange}
        farms={farms}
        lastUpdated={weatherSnapshot?.lastUpdated}
        isSyncing={isSyncingWeather || isLoadingWeather}
        onSyncWeather={handleSyncWeather}
        isCached={weatherSnapshot?.cached}
        provider={weatherSnapshot?.provider}
      />

      {/* Location Warning Alert Banner */}
      {locationWarning && (
        <div className="agri-alert agri-alert--warning" role="alert" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', borderRadius: '8px', backgroundColor: '#fef3c7', border: '1px solid #fde68a', color: '#92400e' }}>
          <AlertTriangle size={20} style={{ flexShrink: 0 }} aria-hidden="true" />
          <div style={{ flex: 1, fontSize: '0.875rem' }}>
            <strong>{t('weather.missingLocationTitle', 'Farm Location Required')}: </strong>
            <span>{locationWarning} </span>
            <Link to="/farms" style={{ fontWeight: 600, color: '#b45309', textDecoration: 'underline' }}>
              {t('farms.updateHolding', 'Update Farm in Holdings')} →
            </Link>
          </div>
        </div>
      )}

      {/* General Error Banner */}
      {weatherError && !locationWarning && (
        <div className="agri-alert agri-alert--danger" role="alert" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', borderRadius: '8px', backgroundColor: '#fee2e2', border: '1px solid #fecaca', color: '#991b1b' }}>
          <AlertCircle size={20} style={{ flexShrink: 0 }} aria-hidden="true" />
          <div style={{ flex: 1, fontSize: '0.875rem' }}>
            <span>{weatherError} </span>
            <button
              type="button"
              onClick={() => fetchWeatherData(selectedFarmId)}
              style={{ fontWeight: 600, background: 'none', border: 'none', color: '#991b1b', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
            >
              {t('common.retry', 'Retry')}
            </button>
          </div>
        </div>
      )}

      {/* 2. Prominent Current Weather Card */}
      <WeatherCurrentCard
        weather={weatherSnapshot || {}}
        farmName={activeFarm?.name || ''}
        location={activeFarm?.location || ''}
      />

      {/* 3. 4 Meteorological Summary KPI Cards */}
      <WeatherSummaryCards weather={weatherSnapshot || {}} />

      {/* 4. 7-Day Forecast & Temperature Trend Chart Grid */}
      <div className="agri-weather-two-col">
        <WeatherForecast forecast={weatherForecast} />
        <WeatherTrendChart forecast={weatherForecast} />
      </div>

      {/* 5. Rule-Based Weather Advisories & Operational Alerts */}
      <WeatherAlerts
        alerts={advisories}
        farmName={activeFarm?.name || ''}
      />
    </div>
  );
}

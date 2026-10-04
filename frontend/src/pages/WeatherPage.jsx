import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { farmData } from '../data/farmData';
import { farmWeather, weatherAlerts } from '../data/weatherData';
import { evaluateWeatherAdvisories } from '../utils/recommendationEngine';
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
 * WeatherPage (Phase 6 — Weather & Farm Insights)
 * Centralizes micro-climate tracking, 7-day meteorological forecasts,
 * high/low temperature trend charts, and automated rule-based agronomic alerts.
 */
export default function WeatherPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const farmParam = searchParams.get('farmId');

  const [farms] = useState(farmData.farms);
  const [selectedFarmId, setSelectedFarmId] = useState(
    farmParam && farmWeather[farmParam] ? farmParam : 'farm-1'
  );

  // Retrieve weather data for selected farm
  const activeWeatherData = useMemo(() => {
    return farmWeather[selectedFarmId] || farmWeather['farm-1'];
  }, [selectedFarmId]);

  const activeFarmObj = useMemo(() => {
    return farms.find((f) => f.id === selectedFarmId) || farms[0];
  }, [farms, selectedFarmId]);

  // Combine curated alerts with dynamic rule-based evaluated alerts for this farm
  const activeAlerts = useMemo(() => {
    const dynamicAdvisories = evaluateWeatherAdvisories(
      activeWeatherData,
      activeFarmObj.name
    );

    // Filter static alerts relevant to this farm or general
    const relevantStatic = weatherAlerts.filter(
      (a) => a.farmId === selectedFarmId || !a.farmId
    );

    // Merge without duplicate titles
    const seen = new Set();
    const merged = [];

    [...relevantStatic, ...dynamicAdvisories].forEach((item) => {
      const key = (item.title || '').toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(item);
      }
    });

    return merged;
  }, [activeWeatherData, activeFarmObj, selectedFarmId]);

  // Handle farm change
  const handleFarmChange = (farmId) => {
    setSelectedFarmId(farmId);
    setSearchParams({ farmId });
  };

  return (
    <div className="agri-weather-page">
      {/* 1. Weather Header with Demo disclaimer & Farm Selector */}
      <WeatherHeader
        selectedFarmId={selectedFarmId}
        onSelectFarm={handleFarmChange}
        farms={farms}
        lastUpdated={activeWeatherData.current?.lastUpdated || 'Just now'}
      />

      {/* 2. Prominent Current Weather Card */}
      <WeatherCurrentCard
        weather={activeWeatherData.current}
        farmName={activeFarmObj.name}
        location={`${activeFarmObj.location}, ${activeFarmObj.district}`}
      />

      {/* 3. 4 Meteorological Summary KPI Cards */}
      <WeatherSummaryCards weather={activeWeatherData.current} />

      {/* 4. 7-Day Forecast & Temperature Trend Chart Grid */}
      <div className="agri-weather-two-col">
        <WeatherForecast forecast={activeWeatherData.forecast} />
        <WeatherTrendChart forecast={activeWeatherData.forecast} />
      </div>

      {/* 5. Rule-Based Weather Advisories & Operational Alerts */}
      <WeatherAlerts
        alerts={activeAlerts}
        farmName={activeFarmObj.name}
      />
    </div>
  );
}

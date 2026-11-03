import { useTranslation } from 'react-i18next';
import { Warehouse } from 'lucide-react';

/**
 * FarmWeatherSelector component
 * Allows selecting which farm holding's micro-climate weather data to display.
 */
export default function FarmWeatherSelector({
  selectedFarmId,
  onSelectFarm,
  farms = [],
}) {
  const { t } = useTranslation();

  return (
    <div className="agri-weather-farm-selector" role="group" aria-label={t('weather.selectHolding', 'Select Farm Holding')}>
      <label htmlFor="weather-farm-select" className="agri-weather-farm-label">
        <Warehouse size={15} aria-hidden="true" />
        <span>{t('weather.holding', 'Holding')}:</span>
      </label>
      <select
        id="weather-farm-select"
        className="agri-weather-farm-dropdown"
        value={selectedFarmId}
        onChange={(e) => onSelectFarm(e.target.value)}
        aria-label={t('weather.selectHoldingAria', 'Select farm holding to view weather insights')}
      >
        {farms.map((farm) => (
          <option key={farm.id} value={farm.id}>
            {farm.name} ({farm.district})
          </option>
        ))}
      </select>
    </div>
  );
}

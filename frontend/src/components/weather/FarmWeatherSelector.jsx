import { Warehouse } from 'lucide-react';

/**
 * FarmWeatherSelector component
 * Allows selecting which farm holding's micro-climate weather data to display.
 *
 * @param {Object} props
 * @param {string} props.selectedFarmId - Currently selected farm ID
 * @param {Function} props.onSelectFarm - Callback when farm changes
 * @param {Array} props.farms - List of farms
 */
export default function FarmWeatherSelector({
  selectedFarmId,
  onSelectFarm,
  farms = [],
}) {
  return (
    <div className="agri-weather-farm-selector" role="group" aria-label="Select Farm Holding">
      <label htmlFor="weather-farm-select" className="agri-weather-farm-label">
        <Warehouse size={15} aria-hidden="true" />
        <span>Holding:</span>
      </label>
      <select
        id="weather-farm-select"
        className="agri-weather-farm-dropdown"
        value={selectedFarmId}
        onChange={(e) => onSelectFarm(e.target.value)}
        aria-label="Select farm holding to view weather insights"
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

import api from './api';

/**
 * Weather Service
 * Communicates with backend REST endpoints:
 *   GET  /api/v1/farms/{farmId}/weather/current
 *   GET  /api/v1/farms/{farmId}/weather/forecast
 *   POST /api/v1/farms/{farmId}/weather/sync
 */
export const weatherService = {
  /**
   * Retrieve the current meteorological snapshot for a specific farm holding.
   * Serves fresh cached data if available; otherwise synchronizes automatically on backend.
   * @param {number|string} farmId Farm holding ID
   * @returns {Promise<Object>} WeatherSnapshotResponse
   */
  async getCurrentWeather(farmId) {
    return api.get(`/farms/${farmId}/weather/current`);
  },

  /**
   * Retrieve the 7-day meteorological forecast for a specific farm holding.
   * Serves fresh cached data if available; otherwise synchronizes automatically on backend.
   * @param {number|string} farmId Farm holding ID
   * @returns {Promise<Array>} List of WeatherForecastResponse
   */
  async getForecast(farmId) {
    return api.get(`/farms/${farmId}/weather/forecast`);
  },

  /**
   * Explicitly triggers meteorological synchronization for a farm holding,
   * refreshing snapshots, 7-day forecast, and executing the backend advisory rule engine.
   * @param {number|string} farmId Farm holding ID
   * @returns {Promise<Object>} WeatherSyncResponse
   */
  async syncWeather(farmId) {
    return api.post(`/farms/${farmId}/weather/sync`);
  },
};

export default weatherService;

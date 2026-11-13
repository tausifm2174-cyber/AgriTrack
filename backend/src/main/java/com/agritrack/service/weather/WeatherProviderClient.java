package com.agritrack.service.weather;

public interface WeatherProviderClient {

    /**
     * Fetches current meteorological observations and 7-day forecast for the given geographic location.
     *
     * @param location Farm location (e.g. "Nashik, Maharashtra" or coordinates)
     * @return WeatherPayload containing current snapshot and forecast days
     */
    WeatherPayload fetchWeatherData(String location);

    /**
     * Identifier of the provider (e.g. "OPEN_WEATHER" or "SIMULATION").
     */
    String getProviderName();
}


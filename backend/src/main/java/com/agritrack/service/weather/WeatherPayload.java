package com.agritrack.service.weather;

import java.util.List;

public class WeatherPayload {
    private CurrentWeatherData current;
    private List<ForecastDayData> forecast;
    private String provider;

    public WeatherPayload() {
    }

    public WeatherPayload(CurrentWeatherData current, List<ForecastDayData> forecast, String provider) {
        this.current = current;
        this.forecast = forecast;
        this.provider = provider;
    }

    public CurrentWeatherData getCurrent() {
        return current;
    }

    public void setCurrent(CurrentWeatherData current) {
        this.current = current;
    }

    public List<ForecastDayData> getForecast() {
        return forecast;
    }

    public void setForecast(List<ForecastDayData> forecast) {
        this.forecast = forecast;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }
}


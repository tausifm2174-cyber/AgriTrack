package com.agritrack.dto;

import java.time.LocalDateTime;
import java.util.List;

public class WeatherSyncResponse {

    private WeatherSnapshotResponse current;
    private List<WeatherForecastResponse> forecast;
    private String provider;
    private LocalDateTime syncedAt;
    private LocalDateTime cacheExpiresAt;

    public WeatherSyncResponse() {
    }

    public WeatherSyncResponse(WeatherSnapshotResponse current, List<WeatherForecastResponse> forecast,
                               String provider, LocalDateTime syncedAt, LocalDateTime cacheExpiresAt) {
        this.current = current;
        this.forecast = forecast;
        this.provider = provider;
        this.syncedAt = syncedAt;
        this.cacheExpiresAt = cacheExpiresAt;
    }

    public WeatherSnapshotResponse getCurrent() {
        return current;
    }

    public void setCurrent(WeatherSnapshotResponse current) {
        this.current = current;
    }

    public List<WeatherForecastResponse> getForecast() {
        return forecast;
    }

    public void setForecast(List<WeatherForecastResponse> forecast) {
        this.forecast = forecast;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public LocalDateTime getSyncedAt() {
        return syncedAt;
    }

    public void setSyncedAt(LocalDateTime syncedAt) {
        this.syncedAt = syncedAt;
    }

    public LocalDateTime getCacheExpiresAt() {
        return cacheExpiresAt;
    }

    public void setCacheExpiresAt(LocalDateTime cacheExpiresAt) {
        this.cacheExpiresAt = cacheExpiresAt;
    }
}


package com.agritrack.dto;

import com.agritrack.entity.WeatherSnapshot;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class WeatherSnapshotResponse {

    private Long id;
    private Long farmId;
    private String farmName;
    private String location;
    private BigDecimal temperature;
    private BigDecimal feelsLike;
    private Integer humidity;
    private BigDecimal windSpeedKmh;
    private String windDirection;
    private BigDecimal rainfallMm;
    private BigDecimal pressureHpa;
    private String conditionText;
    private String conditionCode;
    private BigDecimal uvIndex;
    private Integer airQualityIndex;
    private LocalDateTime observedAt;
    private String provider;
    private Boolean cached;

    public WeatherSnapshotResponse() {
    }

    public static WeatherSnapshotResponse fromEntity(WeatherSnapshot snapshot, boolean cached) {
        WeatherSnapshotResponse dto = new WeatherSnapshotResponse();
        dto.setId(snapshot.getId());
        if (snapshot.getFarm() != null) {
            dto.setFarmId(snapshot.getFarm().getId());
            dto.setFarmName(snapshot.getFarm().getFarmName());
            dto.setLocation(snapshot.getFarm().getLocation());
        }
        dto.setTemperature(snapshot.getTemperature());
        dto.setFeelsLike(snapshot.getFeelsLike());
        dto.setHumidity(snapshot.getHumidity());
        dto.setWindSpeedKmh(snapshot.getWindSpeedKmh());
        dto.setWindDirection(snapshot.getWindDirection());
        dto.setRainfallMm(snapshot.getRainfallMm());
        dto.setPressureHpa(snapshot.getPressureHpa());
        dto.setConditionText(snapshot.getConditionText());
        dto.setConditionCode(snapshot.getConditionCode());
        dto.setUvIndex(snapshot.getUvIndex());
        dto.setAirQualityIndex(snapshot.getAirQualityIndex());
        dto.setObservedAt(snapshot.getObservedAt());
        dto.setProvider(snapshot.getProvider());
        dto.setCached(cached);
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getFarmId() {
        return farmId;
    }

    public void setFarmId(Long farmId) {
        this.farmId = farmId;
    }

    public String getFarmName() {
        return farmName;
    }

    public void setFarmName(String farmName) {
        this.farmName = farmName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public BigDecimal getTemperature() {
        return temperature;
    }

    public void setTemperature(BigDecimal temperature) {
        this.temperature = temperature;
    }

    public BigDecimal getFeelsLike() {
        return feelsLike;
    }

    public void setFeelsLike(BigDecimal feelsLike) {
        this.feelsLike = feelsLike;
    }

    public Integer getHumidity() {
        return humidity;
    }

    public void setHumidity(Integer humidity) {
        this.humidity = humidity;
    }

    public BigDecimal getWindSpeedKmh() {
        return windSpeedKmh;
    }

    public void setWindSpeedKmh(BigDecimal windSpeedKmh) {
        this.windSpeedKmh = windSpeedKmh;
    }

    public String getWindDirection() {
        return windDirection;
    }

    public void setWindDirection(String windDirection) {
        this.windDirection = windDirection;
    }

    public BigDecimal getRainfallMm() {
        return rainfallMm;
    }

    public void setRainfallMm(BigDecimal rainfallMm) {
        this.rainfallMm = rainfallMm;
    }

    public BigDecimal getPressureHpa() {
        return pressureHpa;
    }

    public void setPressureHpa(BigDecimal pressureHpa) {
        this.pressureHpa = pressureHpa;
    }

    public String getConditionText() {
        return conditionText;
    }

    public void setConditionText(String conditionText) {
        this.conditionText = conditionText;
    }

    public String getConditionCode() {
        return conditionCode;
    }

    public void setConditionCode(String conditionCode) {
        this.conditionCode = conditionCode;
    }

    public BigDecimal getUvIndex() {
        return uvIndex;
    }

    public void setUvIndex(BigDecimal uvIndex) {
        this.uvIndex = uvIndex;
    }

    public Integer getAirQualityIndex() {
        return airQualityIndex;
    }

    public void setAirQualityIndex(Integer airQualityIndex) {
        this.airQualityIndex = airQualityIndex;
    }

    public LocalDateTime getObservedAt() {
        return observedAt;
    }

    public void setObservedAt(LocalDateTime observedAt) {
        this.observedAt = observedAt;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public Boolean getCached() {
        return cached;
    }

    public void setCached(Boolean cached) {
        this.cached = cached;
    }
}


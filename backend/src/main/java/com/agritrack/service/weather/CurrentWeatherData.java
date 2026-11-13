package com.agritrack.service.weather;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CurrentWeatherData {
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

    public CurrentWeatherData() {
    }

    public CurrentWeatherData(BigDecimal temperature, BigDecimal feelsLike, Integer humidity,
                              BigDecimal windSpeedKmh, String windDirection, BigDecimal rainfallMm,
                              BigDecimal pressureHpa, String conditionText, String conditionCode,
                              BigDecimal uvIndex, Integer airQualityIndex, LocalDateTime observedAt) {
        this.temperature = temperature;
        this.feelsLike = feelsLike;
        this.humidity = humidity;
        this.windSpeedKmh = windSpeedKmh;
        this.windDirection = windDirection;
        this.rainfallMm = rainfallMm;
        this.pressureHpa = pressureHpa;
        this.conditionText = conditionText;
        this.conditionCode = conditionCode;
        this.uvIndex = uvIndex;
        this.airQualityIndex = airQualityIndex;
        this.observedAt = observedAt;
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
}


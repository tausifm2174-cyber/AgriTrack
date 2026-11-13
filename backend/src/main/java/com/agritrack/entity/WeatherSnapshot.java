package com.agritrack.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * JPA Entity representing a point-in-time meteorological observation snapshot for a Farm.
 */
@Entity
@Table(name = "weather_snapshots")
public class WeatherSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "farm_id", nullable = false)
    private Farm farm;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal temperature;

    @Column(name = "feels_like", nullable = false, precision = 5, scale = 2)
    private BigDecimal feelsLike;

    @Column(nullable = false)
    private Integer humidity;

    @Column(name = "wind_speed_kmh", nullable = false, precision = 5, scale = 2)
    private BigDecimal windSpeedKmh;

    @Column(name = "wind_direction", length = 20)
    private String windDirection;

    @Column(name = "rainfall_mm", nullable = false, precision = 6, scale = 2)
    private BigDecimal rainfallMm = BigDecimal.ZERO;

    @Column(name = "pressure_hpa", precision = 6, scale = 2)
    private BigDecimal pressureHpa;

    @Column(name = "condition_text", nullable = false, length = 100)
    private String conditionText;

    @Column(name = "condition_code", nullable = false, length = 50)
    private String conditionCode;

    @Column(name = "uv_index", precision = 4, scale = 1)
    private BigDecimal uvIndex;

    @Column(name = "air_quality_index")
    private Integer airQualityIndex;

    @Column(name = "observed_at", nullable = false)
    private LocalDateTime observedAt;

    @Column(nullable = false, length = 50)
    private String provider;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public WeatherSnapshot() {
    }

    public WeatherSnapshot(Farm farm, BigDecimal temperature, BigDecimal feelsLike,
                           Integer humidity, BigDecimal windSpeedKmh, String windDirection,
                           BigDecimal rainfallMm, BigDecimal pressureHpa, String conditionText,
                           String conditionCode, BigDecimal uvIndex, Integer airQualityIndex,
                           LocalDateTime observedAt, String provider) {
        this.farm = farm;
        this.temperature = temperature;
        this.feelsLike = feelsLike;
        this.humidity = humidity;
        this.windSpeedKmh = windSpeedKmh;
        this.windDirection = windDirection;
        this.rainfallMm = rainfallMm != null ? rainfallMm : BigDecimal.ZERO;
        this.pressureHpa = pressureHpa;
        this.conditionText = conditionText;
        this.conditionCode = conditionCode;
        this.uvIndex = uvIndex;
        this.airQualityIndex = airQualityIndex;
        this.observedAt = observedAt;
        this.provider = provider;
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.rainfallMm == null) {
            this.rainfallMm = BigDecimal.ZERO;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Farm getFarm() {
        return farm;
    }

    public void setFarm(Farm farm) {
        this.farm = farm;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}


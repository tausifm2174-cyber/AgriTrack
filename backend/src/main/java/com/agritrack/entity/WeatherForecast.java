package com.agritrack.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * JPA Entity representing daily forecast weather data for a Farm.
 */
@Entity
@Table(name = "weather_forecasts", uniqueConstraints = {
    @UniqueConstraint(name = "uk_farm_forecast_date", columnNames = {"farm_id", "forecast_date"})
})
public class WeatherForecast {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "farm_id", nullable = false)
    private Farm farm;

    @Column(name = "forecast_date", nullable = false)
    private LocalDate forecastDate;

    @Column(name = "day_label", nullable = false, length = 20)
    private String dayLabel;

    @Column(name = "min_temp", nullable = false, precision = 5, scale = 2)
    private BigDecimal minTemp;

    @Column(name = "max_temp", nullable = false, precision = 5, scale = 2)
    private BigDecimal maxTemp;

    @Column(nullable = false)
    private Integer humidity;

    @Column(name = "rain_chance_percent", nullable = false)
    private Integer rainChancePercent = 0;

    @Column(name = "rain_mm", nullable = false, precision = 6, scale = 2)
    private BigDecimal rainMm = BigDecimal.ZERO;

    @Column(name = "wind_speed_kmh", nullable = false, precision = 5, scale = 2)
    private BigDecimal windSpeedKmh;

    @Column(name = "condition_text", nullable = false, length = 100)
    private String conditionText;

    @Column(name = "condition_code", nullable = false, length = 50)
    private String conditionCode;

    @Column(name = "fetched_at", nullable = false)
    private LocalDateTime fetchedAt;

    public WeatherForecast() {
    }

    public WeatherForecast(Farm farm, LocalDate forecastDate, String dayLabel,
                           BigDecimal minTemp, BigDecimal maxTemp, Integer humidity,
                           Integer rainChancePercent, BigDecimal rainMm, BigDecimal windSpeedKmh,
                           String conditionText, String conditionCode, LocalDateTime fetchedAt) {
        this.farm = farm;
        this.forecastDate = forecastDate;
        this.dayLabel = dayLabel;
        this.minTemp = minTemp;
        this.maxTemp = maxTemp;
        this.humidity = humidity;
        this.rainChancePercent = rainChancePercent != null ? rainChancePercent : 0;
        this.rainMm = rainMm != null ? rainMm : BigDecimal.ZERO;
        this.windSpeedKmh = windSpeedKmh;
        this.conditionText = conditionText;
        this.conditionCode = conditionCode;
        this.fetchedAt = fetchedAt != null ? fetchedAt : LocalDateTime.now();
    }

    @PrePersist
    @PreUpdate
    protected void onSave() {
        if (this.fetchedAt == null) {
            this.fetchedAt = LocalDateTime.now();
        }
        if (this.rainChancePercent == null) {
            this.rainChancePercent = 0;
        }
        if (this.rainMm == null) {
            this.rainMm = BigDecimal.ZERO;
        }
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

    public LocalDate getForecastDate() {
        return forecastDate;
    }

    public void setForecastDate(LocalDate forecastDate) {
        this.forecastDate = forecastDate;
    }

    public String getDayLabel() {
        return dayLabel;
    }

    public void setDayLabel(String dayLabel) {
        this.dayLabel = dayLabel;
    }

    public BigDecimal getMinTemp() {
        return minTemp;
    }

    public void setMinTemp(BigDecimal minTemp) {
        this.minTemp = minTemp;
    }

    public BigDecimal getMaxTemp() {
        return maxTemp;
    }

    public void setMaxTemp(BigDecimal maxTemp) {
        this.maxTemp = maxTemp;
    }

    public Integer getHumidity() {
        return humidity;
    }

    public void setHumidity(Integer humidity) {
        this.humidity = humidity;
    }

    public Integer getRainChancePercent() {
        return rainChancePercent;
    }

    public void setRainChancePercent(Integer rainChancePercent) {
        this.rainChancePercent = rainChancePercent;
    }

    public BigDecimal getRainMm() {
        return rainMm;
    }

    public void setRainMm(BigDecimal rainMm) {
        this.rainMm = rainMm;
    }

    public BigDecimal getWindSpeedKmh() {
        return windSpeedKmh;
    }

    public void setWindSpeedKmh(BigDecimal windSpeedKmh) {
        this.windSpeedKmh = windSpeedKmh;
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

    public LocalDateTime getFetchedAt() {
        return fetchedAt;
    }

    public void setFetchedAt(LocalDateTime fetchedAt) {
        this.fetchedAt = fetchedAt;
    }
}


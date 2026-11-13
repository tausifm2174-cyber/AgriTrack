package com.agritrack.dto;

import com.agritrack.entity.WeatherForecast;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class WeatherForecastResponse {

    private Long id;
    private Long farmId;
    private LocalDate forecastDate;
    private String dayLabel;
    private BigDecimal minTemp;
    private BigDecimal maxTemp;
    private Integer humidity;
    private Integer rainChancePercent;
    private BigDecimal rainMm;
    private BigDecimal windSpeedKmh;
    private String conditionText;
    private String conditionCode;
    private LocalDateTime fetchedAt;

    public WeatherForecastResponse() {
    }

    public static WeatherForecastResponse fromEntity(WeatherForecast forecast) {
        WeatherForecastResponse dto = new WeatherForecastResponse();
        dto.setId(forecast.getId());
        if (forecast.getFarm() != null) {
            dto.setFarmId(forecast.getFarm().getId());
        }
        dto.setForecastDate(forecast.getForecastDate());
        dto.setDayLabel(forecast.getDayLabel());
        dto.setMinTemp(forecast.getMinTemp());
        dto.setMaxTemp(forecast.getMaxTemp());
        dto.setHumidity(forecast.getHumidity());
        dto.setRainChancePercent(forecast.getRainChancePercent());
        dto.setRainMm(forecast.getRainMm());
        dto.setWindSpeedKmh(forecast.getWindSpeedKmh());
        dto.setConditionText(forecast.getConditionText());
        dto.setConditionCode(forecast.getConditionCode());
        dto.setFetchedAt(forecast.getFetchedAt());
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


package com.agritrack.service.weather;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ForecastDayData {
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

    public ForecastDayData() {
    }

    public ForecastDayData(LocalDate forecastDate, String dayLabel, BigDecimal minTemp,
                           BigDecimal maxTemp, Integer humidity, Integer rainChancePercent,
                           BigDecimal rainMm, BigDecimal windSpeedKmh, String conditionText,
                           String conditionCode) {
        this.forecastDate = forecastDate;
        this.dayLabel = dayLabel;
        this.minTemp = minTemp;
        this.maxTemp = maxTemp;
        this.humidity = humidity;
        this.rainChancePercent = rainChancePercent;
        this.rainMm = rainMm;
        this.windSpeedKmh = windSpeedKmh;
        this.conditionText = conditionText;
        this.conditionCode = conditionCode;
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
}


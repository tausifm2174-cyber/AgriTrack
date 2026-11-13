package com.agritrack.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Request payload for creating or updating an APMC market price benchmark record.
 */
public class MarketPriceRequest {

    @NotBlank(message = "Crop name is required")
    @Size(max = 100, message = "Crop name cannot exceed 100 characters")
    private String cropName;

    @NotBlank(message = "Variety is required")
    @Size(max = 100, message = "Variety cannot exceed 100 characters")
    private String variety;

    @NotBlank(message = "Market name is required")
    @Size(max = 150, message = "Market name cannot exceed 150 characters")
    private String marketName;

    @NotBlank(message = "Location is required")
    @Size(max = 150, message = "Location cannot exceed 150 characters")
    private String location;

    @NotNull(message = "Price per quintal is required")
    @DecimalMin(value = "0.01", message = "Price per quintal must be greater than 0")
    private BigDecimal pricePerQuintal;

    @DecimalMin(value = "0.01", message = "Price per kg must be greater than 0")
    private BigDecimal pricePerKg;

    @DecimalMin(value = "0.0", message = "Previous price must be non-negative")
    private BigDecimal previousPrice;

    private BigDecimal priceChange;

    private BigDecimal changePercent;

    @Pattern(regexp = "^(RISING|FALLING|STABLE)$", message = "Trend must be one of: RISING, FALLING, STABLE")
    private String trend;

    @Size(max = 10, message = "Quality grade cannot exceed 10 characters")
    private String qualityGrade;

    @NotNull(message = "Price date is required")
    private LocalDate priceDate;

    @Size(max = 100, message = "Source description cannot exceed 100 characters")
    private String source;

    @DecimalMin(value = "0.0", message = "Arrival volume must be non-negative")
    private BigDecimal arrivalVolumeQuintals;

    @DecimalMin(value = "0.0", message = "Minimum price must be non-negative")
    private BigDecimal minPrice;

    @DecimalMin(value = "0.0", message = "Maximum price must be non-negative")
    private BigDecimal maxPrice;

    // Getters and Setters

    public String getCropName() {
        return cropName;
    }

    public void setCropName(String cropName) {
        this.cropName = cropName;
    }

    public String getVariety() {
        return variety;
    }

    public void setVariety(String variety) {
        this.variety = variety;
    }

    public String getMarketName() {
        return marketName;
    }

    public void setMarketName(String marketName) {
        this.marketName = marketName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public BigDecimal getPricePerQuintal() {
        return pricePerQuintal;
    }

    public void setPricePerQuintal(BigDecimal pricePerQuintal) {
        this.pricePerQuintal = pricePerQuintal;
    }

    public BigDecimal getPricePerKg() {
        return pricePerKg;
    }

    public void setPricePerKg(BigDecimal pricePerKg) {
        this.pricePerKg = pricePerKg;
    }

    public BigDecimal getPreviousPrice() {
        return previousPrice;
    }

    public void setPreviousPrice(BigDecimal previousPrice) {
        this.previousPrice = previousPrice;
    }

    public BigDecimal getPriceChange() {
        return priceChange;
    }

    public void setPriceChange(BigDecimal priceChange) {
        this.priceChange = priceChange;
    }

    public BigDecimal getChangePercent() {
        return changePercent;
    }

    public void setChangePercent(BigDecimal changePercent) {
        this.changePercent = changePercent;
    }

    public String getTrend() {
        return trend;
    }

    public void setTrend(String trend) {
        this.trend = trend;
    }

    public String getQualityGrade() {
        return qualityGrade;
    }

    public void setQualityGrade(String qualityGrade) {
        this.qualityGrade = qualityGrade;
    }

    public LocalDate getPriceDate() {
        return priceDate;
    }

    public void setPriceDate(LocalDate priceDate) {
        this.priceDate = priceDate;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public BigDecimal getArrivalVolumeQuintals() {
        return arrivalVolumeQuintals;
    }

    public void setArrivalVolumeQuintals(BigDecimal arrivalVolumeQuintals) {
        this.arrivalVolumeQuintals = arrivalVolumeQuintals;
    }

    public BigDecimal getMinPrice() {
        return minPrice;
    }

    public void setMinPrice(BigDecimal minPrice) {
        this.minPrice = minPrice;
    }

    public BigDecimal getMaxPrice() {
        return maxPrice;
    }

    public void setMaxPrice(BigDecimal maxPrice) {
        this.maxPrice = maxPrice;
    }
}

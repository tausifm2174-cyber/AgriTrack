package com.agritrack.dto;

import com.agritrack.entity.MarketPrice;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Response payload representing an APMC market price benchmark record.
 */
public class MarketPriceResponse {

    private Long id;
    private String cropName;
    private String variety;
    private String marketName;
    private String location;
    private BigDecimal pricePerQuintal;
    private BigDecimal pricePerKg;
    private BigDecimal previousPrice;
    private BigDecimal priceChange;
    private BigDecimal changePercent;
    private String trend;
    private String qualityGrade;
    private LocalDate priceDate;
    private String source;
    private BigDecimal arrivalVolumeQuintals;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public MarketPriceResponse() {
    }

    public static MarketPriceResponse fromEntity(MarketPrice entity) {
        if (entity == null) {
            return null;
        }

        MarketPriceResponse response = new MarketPriceResponse();
        response.setId(entity.getId());
        response.setCropName(entity.getCropName());
        response.setVariety(entity.getVariety());
        response.setMarketName(entity.getMarketName());
        response.setLocation(entity.getLocation());
        response.setPricePerQuintal(entity.getPricePerQuintal());
        response.setPricePerKg(entity.getPricePerKg());
        response.setPreviousPrice(entity.getPreviousPrice());
        response.setPriceChange(entity.getPriceChange());
        response.setChangePercent(entity.getChangePercent());
        response.setTrend(entity.getTrend());
        response.setQualityGrade(entity.getQualityGrade());
        response.setPriceDate(entity.getPriceDate());
        response.setSource(entity.getSource());
        response.setArrivalVolumeQuintals(entity.getArrivalVolumeQuintals());
        response.setMinPrice(entity.getMinPrice());
        response.setMaxPrice(entity.getMaxPrice());
        response.setCreatedAt(entity.getCreatedAt());
        response.setUpdatedAt(entity.getUpdatedAt());

        return response;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

package com.agritrack.dto;

import com.agritrack.entity.CropCycle;
import com.agritrack.entity.Field;
import com.agritrack.entity.Farm;
import com.agritrack.entity.Harvest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Response payload representing a Harvest record with derived contextual metadata.
 */
public class HarvestResponse {

    private Long id;
    private Long cropCycleId;
    private String cropName;
    private String variety;
    private Long fieldId;
    private String fieldName;
    private Long farmId;
    private String farmName;
    private LocalDate harvestDate;
    private BigDecimal expectedYieldKg;
    private BigDecimal harvestedQuantityKg;
    private BigDecimal availableQuantityKg;
    private BigDecimal soldQuantityKg;
    private String qualityGrade;
    private Integer qualityScore;
    private BigDecimal moisturePercent;
    private String status;
    private String storageLocation;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public HarvestResponse() {
    }

    public static HarvestResponse fromEntity(Harvest harvest) {
        if (harvest == null) {
            return null;
        }

        HarvestResponse response = new HarvestResponse();
        response.setId(harvest.getId());
        response.setHarvestDate(harvest.getHarvestDate());
        response.setExpectedYieldKg(harvest.getExpectedYieldKg());
        response.setHarvestedQuantityKg(harvest.getHarvestedQuantityKg());
        response.setAvailableQuantityKg(harvest.getAvailableQuantityKg());
        response.setSoldQuantityKg(harvest.getSoldQuantityKg());
        response.setQualityGrade(harvest.getQualityGrade());
        response.setQualityScore(harvest.getQualityScore());
        response.setMoisturePercent(harvest.getMoisturePercent());
        response.setStatus(harvest.getStatus());
        response.setStorageLocation(harvest.getStorageLocation());
        response.setNotes(harvest.getNotes());
        response.setCreatedAt(harvest.getCreatedAt());
        response.setUpdatedAt(harvest.getUpdatedAt());

        CropCycle cycle = harvest.getCropCycle();
        if (cycle != null) {
            response.setCropCycleId(cycle.getId());
            response.setCropName(cycle.getCropName());
            response.setVariety(cycle.getVariety());

            Field field = cycle.getField();
            if (field != null) {
                response.setFieldId(field.getId());
                response.setFieldName(field.getFieldName());

                Farm farm = field.getFarm();
                if (farm != null) {
                    response.setFarmId(farm.getId());
                    response.setFarmName(farm.getFarmName());
                }
            }
        }

        return response;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCropCycleId() {
        return cropCycleId;
    }

    public void setCropCycleId(Long cropCycleId) {
        this.cropCycleId = cropCycleId;
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

    public Long getFieldId() {
        return fieldId;
    }

    public void setFieldId(Long fieldId) {
        this.fieldId = fieldId;
    }

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
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

    public LocalDate getHarvestDate() {
        return harvestDate;
    }

    public void setHarvestDate(LocalDate harvestDate) {
        this.harvestDate = harvestDate;
    }

    public BigDecimal getExpectedYieldKg() {
        return expectedYieldKg;
    }

    public void setExpectedYieldKg(BigDecimal expectedYieldKg) {
        this.expectedYieldKg = expectedYieldKg;
    }

    public BigDecimal getHarvestedQuantityKg() {
        return harvestedQuantityKg;
    }

    public void setHarvestedQuantityKg(BigDecimal harvestedQuantityKg) {
        this.harvestedQuantityKg = harvestedQuantityKg;
    }

    public BigDecimal getAvailableQuantityKg() {
        return availableQuantityKg;
    }

    public void setAvailableQuantityKg(BigDecimal availableQuantityKg) {
        this.availableQuantityKg = availableQuantityKg;
    }

    public BigDecimal getSoldQuantityKg() {
        return soldQuantityKg;
    }

    public void setSoldQuantityKg(BigDecimal soldQuantityKg) {
        this.soldQuantityKg = soldQuantityKg;
    }

    public String getQualityGrade() {
        return qualityGrade;
    }

    public void setQualityGrade(String qualityGrade) {
        this.qualityGrade = qualityGrade;
    }

    public Integer getQualityScore() {
        return qualityScore;
    }

    public void setQualityScore(Integer qualityScore) {
        this.qualityScore = qualityScore;
    }

    public BigDecimal getMoisturePercent() {
        return moisturePercent;
    }

    public void setMoisturePercent(BigDecimal moisturePercent) {
        this.moisturePercent = moisturePercent;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStorageLocation() {
        return storageLocation;
    }

    public void setStorageLocation(String storageLocation) {
        this.storageLocation = storageLocation;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
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

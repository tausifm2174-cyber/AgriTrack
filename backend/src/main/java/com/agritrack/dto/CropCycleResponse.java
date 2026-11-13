package com.agritrack.dto;

import com.agritrack.entity.CropCycle;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Response DTO representing Crop Cycle details.
 */
public class CropCycleResponse {

    private Long id;
    private Long fieldId;
    private String fieldName;
    private Long farmId;
    private String farmName;
    private String cropName;
    private String variety;
    private String season;
    private LocalDate sowingDate;
    private LocalDate expectedHarvestDate;
    private LocalDate actualHarvestDate;
    private String currentStage;
    private Integer currentStageStep;
    private Integer progressPercent;
    private String status;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public CropCycleResponse() {
    }

    public static CropCycleResponse fromEntity(CropCycle cycle) {
        CropCycleResponse response = new CropCycleResponse();
        response.setId(cycle.getId());
        if (cycle.getField() != null) {
            response.setFieldId(cycle.getField().getId());
            response.setFieldName(cycle.getField().getFieldName());
            if (cycle.getField().getFarm() != null) {
                response.setFarmId(cycle.getField().getFarm().getId());
                response.setFarmName(cycle.getField().getFarm().getFarmName());
            }
        }
        response.setCropName(cycle.getCropName());
        response.setVariety(cycle.getVariety());
        response.setSeason(cycle.getSeason());
        response.setSowingDate(cycle.getSowingDate());
        response.setExpectedHarvestDate(cycle.getExpectedHarvestDate());
        response.setActualHarvestDate(cycle.getActualHarvestDate());
        response.setCurrentStage(cycle.getCurrentStage());
        response.setCurrentStageStep(cycle.getCurrentStageStep());
        response.setProgressPercent(cycle.getProgressPercent());
        response.setStatus(cycle.getStatus());
        response.setNotes(cycle.getNotes());
        response.setCreatedAt(cycle.getCreatedAt());
        response.setUpdatedAt(cycle.getUpdatedAt());
        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getSeason() {
        return season;
    }

    public void setSeason(String season) {
        this.season = season;
    }

    public LocalDate getSowingDate() {
        return sowingDate;
    }

    public void setSowingDate(LocalDate sowingDate) {
        this.sowingDate = sowingDate;
    }

    public LocalDate getExpectedHarvestDate() {
        return expectedHarvestDate;
    }

    public void setExpectedHarvestDate(LocalDate expectedHarvestDate) {
        this.expectedHarvestDate = expectedHarvestDate;
    }

    public LocalDate getActualHarvestDate() {
        return actualHarvestDate;
    }

    public void setActualHarvestDate(LocalDate actualHarvestDate) {
        this.actualHarvestDate = actualHarvestDate;
    }

    public String getCurrentStage() {
        return currentStage;
    }

    public void setCurrentStage(String currentStage) {
        this.currentStage = currentStage;
    }

    public Integer getCurrentStageStep() {
        return currentStageStep;
    }

    public void setCurrentStageStep(Integer currentStageStep) {
        this.currentStageStep = currentStageStep;
    }

    public Integer getProgressPercent() {
        return progressPercent;
    }

    public void setProgressPercent(Integer progressPercent) {
        this.progressPercent = progressPercent;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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


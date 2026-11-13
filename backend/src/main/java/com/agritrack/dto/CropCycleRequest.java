package com.agritrack.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

/**
 * Request DTO for creating or updating a Crop Cycle.
 */
public class CropCycleRequest {

    @NotBlank(message = "Crop name is required")
    @Size(max = 100, message = "Crop name cannot exceed 100 characters")
    private String cropName;

    @NotBlank(message = "Variety is required")
    @Size(max = 100, message = "Variety cannot exceed 100 characters")
    private String variety;

    @NotBlank(message = "Season is required")
    @Size(max = 30, message = "Season cannot exceed 30 characters")
    private String season;

    @NotNull(message = "Sowing date is required")
    private LocalDate sowingDate;

    @NotNull(message = "Expected harvest date is required")
    private LocalDate expectedHarvestDate;

    private LocalDate actualHarvestDate;

    @Size(max = 50, message = "Current stage cannot exceed 50 characters")
    private String currentStage;

    @Min(value = 1, message = "Current stage step must be at least 1")
    @Max(value = 5, message = "Current stage step cannot exceed 5")
    private Integer currentStageStep;

    @Min(value = 0, message = "Progress percent cannot be less than 0")
    @Max(value = 100, message = "Progress percent cannot exceed 100")
    private Integer progressPercent;

    @Size(max = 30, message = "Status cannot exceed 30 characters")
    private String status;

    private String notes;

    public CropCycleRequest() {
    }

    public CropCycleRequest(String cropName, String variety, String season, LocalDate sowingDate,
                            LocalDate expectedHarvestDate, LocalDate actualHarvestDate, String currentStage,
                            Integer currentStageStep, Integer progressPercent, String status, String notes) {
        this.cropName = cropName;
        this.variety = variety;
        this.season = season;
        this.sowingDate = sowingDate;
        this.expectedHarvestDate = expectedHarvestDate;
        this.actualHarvestDate = actualHarvestDate;
        this.currentStage = currentStage;
        this.currentStageStep = currentStageStep;
        this.progressPercent = progressPercent;
        this.status = status;
        this.notes = notes;
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
}


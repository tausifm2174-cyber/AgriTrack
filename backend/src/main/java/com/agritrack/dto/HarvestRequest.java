package com.agritrack.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Request payload for creating or updating a Harvest record.
 */
public class HarvestRequest {

    @NotNull(message = "Harvest date is required")
    private LocalDate harvestDate;

    @DecimalMin(value = "0.0", message = "Expected yield must be non-negative")
    private BigDecimal expectedYieldKg;

    @NotNull(message = "Harvested quantity is required")
    @DecimalMin(value = "0.0", message = "Harvested quantity must be non-negative")
    private BigDecimal harvestedQuantityKg;

    @DecimalMin(value = "0.0", message = "Available quantity must be non-negative")
    private BigDecimal availableQuantityKg;

    @DecimalMin(value = "0.0", message = "Sold quantity must be non-negative")
    private BigDecimal soldQuantityKg;

    @Pattern(regexp = "^(A|B|C)$", message = "Quality grade must be one of: A, B, C")
    private String qualityGrade;

    @Min(value = 0, message = "Quality score must be between 0 and 100")
    @Max(value = 100, message = "Quality score must be between 0 and 100")
    private Integer qualityScore;

    @DecimalMin(value = "0.0", message = "Moisture percent must be between 0 and 100")
    @DecimalMax(value = "100.0", message = "Moisture percent must be between 0 and 100")
    private BigDecimal moisturePercent;

    @Pattern(regexp = "^(PLANNED|HARVESTED|PARTIALLY_SOLD|SOLD_OUT)$",
            message = "Status must be one of: PLANNED, HARVESTED, PARTIALLY_SOLD, SOLD_OUT")
    private String status;

    @Size(max = 150, message = "Storage location cannot exceed 150 characters")
    private String storageLocation;

    private String notes;

    // Getters and Setters

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
}

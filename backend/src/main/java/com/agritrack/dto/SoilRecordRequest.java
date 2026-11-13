package com.agritrack.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Request DTO for creating or updating a Soil Record.
 */
public class SoilRecordRequest {

    @Size(max = 100, message = "Soil type cannot exceed 100 characters")
    private String soilType;

    @DecimalMin(value = "0.00", message = "pH cannot be negative")
    @DecimalMax(value = "14.00", message = "pH cannot exceed 14.00")
    private BigDecimal ph;

    @DecimalMin(value = "0.00", message = "Nitrogen cannot be negative")
    private BigDecimal nitrogen;

    @DecimalMin(value = "0.00", message = "Phosphorus cannot be negative")
    private BigDecimal phosphorus;

    @DecimalMin(value = "0.00", message = "Potassium cannot be negative")
    private BigDecimal potassium;

    @DecimalMin(value = "0.00", message = "Organic matter cannot be negative")
    @DecimalMax(value = "100.00", message = "Organic matter cannot exceed 100%")
    private BigDecimal organicMatter;

    @DecimalMin(value = "0.00", message = "Moisture cannot be negative")
    @DecimalMax(value = "100.00", message = "Moisture cannot exceed 100%")
    private BigDecimal moisture;

    @NotNull(message = "Recorded date is required")
    private LocalDate recordedAt;

    private String notes;

    public SoilRecordRequest() {
    }

    public SoilRecordRequest(String soilType, BigDecimal ph, BigDecimal nitrogen, BigDecimal phosphorus, BigDecimal potassium, BigDecimal organicMatter, BigDecimal moisture, LocalDate recordedAt, String notes) {
        this.soilType = soilType;
        this.ph = ph;
        this.nitrogen = nitrogen;
        this.phosphorus = phosphorus;
        this.potassium = potassium;
        this.organicMatter = organicMatter;
        this.moisture = moisture;
        this.recordedAt = recordedAt;
        this.notes = notes;
    }

    public String getSoilType() {
        return soilType;
    }

    public void setSoilType(String soilType) {
        this.soilType = soilType;
    }

    public BigDecimal getPh() {
        return ph;
    }

    public void setPh(BigDecimal ph) {
        this.ph = ph;
    }

    public BigDecimal getNitrogen() {
        return nitrogen;
    }

    public void setNitrogen(BigDecimal nitrogen) {
        this.nitrogen = nitrogen;
    }

    public BigDecimal getPhosphorus() {
        return phosphorus;
    }

    public void setPhosphorus(BigDecimal phosphorus) {
        this.phosphorus = phosphorus;
    }

    public BigDecimal getPotassium() {
        return potassium;
    }

    public void setPotassium(BigDecimal potassium) {
        this.potassium = potassium;
    }

    public BigDecimal getOrganicMatter() {
        return organicMatter;
    }

    public void setOrganicMatter(BigDecimal organicMatter) {
        this.organicMatter = organicMatter;
    }

    public BigDecimal getMoisture() {
        return moisture;
    }

    public void setMoisture(BigDecimal moisture) {
        this.moisture = moisture;
    }

    public LocalDate getRecordedAt() {
        return recordedAt;
    }

    public void setRecordedAt(LocalDate recordedAt) {
        this.recordedAt = recordedAt;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}


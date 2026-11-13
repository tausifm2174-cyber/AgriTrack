package com.agritrack.dto;

import com.agritrack.entity.SoilRecord;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Response DTO representing Soil Record details.
 */
public class SoilRecordResponse {

    private Long id;
    private Long fieldId;
    private String fieldName;
    private String soilType;
    private BigDecimal ph;
    private BigDecimal nitrogen;
    private BigDecimal phosphorus;
    private BigDecimal potassium;
    private BigDecimal organicMatter;
    private BigDecimal moisture;
    private LocalDate recordedAt;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public SoilRecordResponse() {
    }

    public static SoilRecordResponse fromEntity(SoilRecord record) {
        SoilRecordResponse response = new SoilRecordResponse();
        response.setId(record.getId());
        if (record.getField() != null) {
            response.setFieldId(record.getField().getId());
            response.setFieldName(record.getField().getFieldName());
        }
        response.setSoilType(record.getSoilType());
        response.setPh(record.getPh());
        response.setNitrogen(record.getNitrogen());
        response.setPhosphorus(record.getPhosphorus());
        response.setPotassium(record.getPotassium());
        response.setOrganicMatter(record.getOrganicMatter());
        response.setMoisture(record.getMoisture());
        response.setRecordedAt(record.getRecordedAt());
        response.setNotes(record.getNotes());
        response.setCreatedAt(record.getCreatedAt());
        response.setUpdatedAt(record.getUpdatedAt());
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


package com.agritrack.dto;

import com.agritrack.entity.Field;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Response DTO representing Field details.
 */
public class FieldResponse {

    private Long id;
    private Long farmId;
    private String farmName;
    private String fieldName;
    private BigDecimal area;
    private String areaUnit;
    private String soilType;
    private String irrigationType;
    private String status;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public FieldResponse() {
    }

    public static FieldResponse fromEntity(Field field) {
        FieldResponse response = new FieldResponse();
        response.setId(field.getId());
        if (field.getFarm() != null) {
            response.setFarmId(field.getFarm().getId());
            response.setFarmName(field.getFarm().getFarmName());
        }
        response.setFieldName(field.getFieldName());
        response.setArea(field.getArea());
        response.setAreaUnit(field.getAreaUnit());
        response.setSoilType(field.getSoilType());
        response.setIrrigationType(field.getIrrigationType());
        response.setStatus(field.getStatus());
        response.setDescription(field.getDescription());
        response.setCreatedAt(field.getCreatedAt());
        response.setUpdatedAt(field.getUpdatedAt());
        return response;
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

    public String getFarmName() {
        return farmName;
    }

    public void setFarmName(String farmName) {
        this.farmName = farmName;
    }

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    public BigDecimal getArea() {
        return area;
    }

    public void setArea(BigDecimal area) {
        this.area = area;
    }

    public String getAreaUnit() {
        return areaUnit;
    }

    public void setAreaUnit(String areaUnit) {
        this.areaUnit = areaUnit;
    }

    public String getSoilType() {
        return soilType;
    }

    public void setSoilType(String soilType) {
        this.soilType = soilType;
    }

    public String getIrrigationType() {
        return irrigationType;
    }

    public void setIrrigationType(String irrigationType) {
        this.irrigationType = irrigationType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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


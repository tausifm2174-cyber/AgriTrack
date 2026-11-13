package com.agritrack.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

/**
 * Request DTO for creating or updating a Field.
 */
public class FieldRequest {

    @NotBlank(message = "Field name is required")
    @Size(max = 150, message = "Field name cannot exceed 150 characters")
    private String fieldName;

    @NotNull(message = "Area is required")
    @DecimalMin(value = "0.01", message = "Area must be greater than 0")
    private BigDecimal area;

    @Size(max = 20, message = "Area unit cannot exceed 20 characters")
    private String areaUnit;

    @Size(max = 100, message = "Soil type cannot exceed 100 characters")
    private String soilType;

    @Size(max = 100, message = "Irrigation type cannot exceed 100 characters")
    private String irrigationType;

    @Size(max = 30, message = "Status cannot exceed 30 characters")
    private String status;

    private String description;

    public FieldRequest() {
    }

    public FieldRequest(String fieldName, BigDecimal area, String areaUnit, String soilType, String irrigationType, String status, String description) {
        this.fieldName = fieldName;
        this.area = area;
        this.areaUnit = areaUnit;
        this.soilType = soilType;
        this.irrigationType = irrigationType;
        this.status = status;
        this.description = description;
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
}


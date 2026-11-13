package com.agritrack.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

/**
 * Request DTO for creating or updating a Farm.
 */
public class FarmRequest {

    @NotBlank(message = "Farm name is required")
    @Size(max = 150, message = "Farm name cannot exceed 150 characters")
    private String farmName;

    @NotBlank(message = "Location is required")
    @Size(max = 255, message = "Location cannot exceed 255 characters")
    private String location;

    @NotNull(message = "Total area is required")
    @DecimalMin(value = "0.01", message = "Total area must be greater than 0")
    private BigDecimal totalArea;

    @Size(max = 20, message = "Area unit cannot exceed 20 characters")
    private String areaUnit;

    private String description;

    @Size(max = 30, message = "Status cannot exceed 30 characters")
    private String status;

    public FarmRequest() {
    }

    public FarmRequest(String farmName, String location, BigDecimal totalArea, String areaUnit, String description, String status) {
        this.farmName = farmName;
        this.location = location;
        this.totalArea = totalArea;
        this.areaUnit = areaUnit;
        this.description = description;
        this.status = status;
    }

    public String getFarmName() {
        return farmName;
    }

    public void setFarmName(String farmName) {
        this.farmName = farmName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public BigDecimal getTotalArea() {
        return totalArea;
    }

    public void setTotalArea(BigDecimal totalArea) {
        this.totalArea = totalArea;
    }

    public String getAreaUnit() {
        return areaUnit;
    }

    public void setAreaUnit(String areaUnit) {
        this.areaUnit = areaUnit;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}


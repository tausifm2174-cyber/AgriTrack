package com.agritrack.dto;

import com.agritrack.entity.Farm;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Response DTO representing Farm details.
 */
public class FarmResponse {

    private Long id;
    private Long userId;
    private String farmName;
    private String location;
    private BigDecimal totalArea;
    private String areaUnit;
    private String description;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public FarmResponse() {
    }

    public static FarmResponse fromEntity(Farm farm) {
        FarmResponse response = new FarmResponse();
        response.setId(farm.getId());
        response.setUserId(farm.getUser() != null ? farm.getUser().getId() : null);
        response.setFarmName(farm.getFarmName());
        response.setLocation(farm.getLocation());
        response.setTotalArea(farm.getTotalArea());
        response.setAreaUnit(farm.getAreaUnit());
        response.setDescription(farm.getDescription());
        response.setStatus(farm.getStatus());
        response.setCreatedAt(farm.getCreatedAt());
        response.setUpdatedAt(farm.getUpdatedAt());
        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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


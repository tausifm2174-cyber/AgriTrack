package com.agritrack.dto;

import com.agritrack.entity.Activity;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Response DTO representing Activity details.
 */
public class ActivityResponse {

    private Long id;
    private Long fieldId;
    private String fieldName;
    private Long farmId;
    private String farmName;
    private Long cropCycleId;
    private String cropName;
    private String title;
    private String activityType;
    private String status;
    private String priority;
    private LocalDate activityDate;
    private String activityTime;
    private BigDecimal durationHours;
    private String operator;
    private BigDecimal quantity;
    private String quantityUnit;
    private String description;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ActivityResponse() {
    }

    public static ActivityResponse fromEntity(Activity activity) {
        ActivityResponse response = new ActivityResponse();
        response.setId(activity.getId());
        if (activity.getField() != null) {
            response.setFieldId(activity.getField().getId());
            response.setFieldName(activity.getField().getFieldName());
            if (activity.getField().getFarm() != null) {
                response.setFarmId(activity.getField().getFarm().getId());
                response.setFarmName(activity.getField().getFarm().getFarmName());
            }
        }
        if (activity.getCropCycle() != null) {
            response.setCropCycleId(activity.getCropCycle().getId());
            response.setCropName(activity.getCropCycle().getCropName());
        }
        response.setTitle(activity.getTitle());
        response.setActivityType(activity.getActivityType());
        response.setStatus(activity.getStatus());
        response.setPriority(activity.getPriority());
        response.setActivityDate(activity.getActivityDate());
        response.setActivityTime(activity.getActivityTime());
        response.setDurationHours(activity.getDurationHours());
        response.setOperator(activity.getOperator());
        response.setQuantity(activity.getQuantity());
        response.setQuantityUnit(activity.getQuantityUnit());
        response.setDescription(activity.getDescription());
        response.setNotes(activity.getNotes());
        response.setCreatedAt(activity.getCreatedAt());
        response.setUpdatedAt(activity.getUpdatedAt());
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getActivityType() {
        return activityType;
    }

    public void setActivityType(String activityType) {
        this.activityType = activityType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public LocalDate getActivityDate() {
        return activityDate;
    }

    public void setActivityDate(LocalDate activityDate) {
        this.activityDate = activityDate;
    }

    public String getActivityTime() {
        return activityTime;
    }

    public void setActivityTime(String activityTime) {
        this.activityTime = activityTime;
    }

    public BigDecimal getDurationHours() {
        return durationHours;
    }

    public void setDurationHours(BigDecimal durationHours) {
        this.durationHours = durationHours;
    }

    public String getOperator() {
        return operator;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public String getQuantityUnit() {
        return quantityUnit;
    }

    public void setQuantityUnit(String quantityUnit) {
        this.quantityUnit = quantityUnit;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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


package com.agritrack.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Request DTO for creating or updating an agricultural Activity.
 */
public class ActivityRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 150, message = "Title cannot exceed 150 characters")
    private String title;

    @NotBlank(message = "Activity type is required")
    @Pattern(
        regexp = "^(Sowing|Fertilizing|Spraying|Weeding|Irrigation|Soil Testing|Crop Inspection|Harvest Preparation|Other)$",
        message = "Activity type must be one of: Sowing, Fertilizing, Spraying, Weeding, Irrigation, Soil Testing, Crop Inspection, Harvest Preparation, Other"
    )
    private String activityType;

    @Pattern(
        regexp = "^(Planned|In Progress|Completed|Cancelled)$",
        message = "Status must be one of: Planned, In Progress, Completed, Cancelled"
    )
    private String status = "Planned";

    @Pattern(
        regexp = "^(Low|Medium|High)$",
        message = "Priority must be one of: Low, Medium, High"
    )
    private String priority = "Medium";

    @NotNull(message = "Activity date is required")
    private LocalDate activityDate;

    @Size(max = 20, message = "Activity time cannot exceed 20 characters")
    private String activityTime;

    @DecimalMin(value = "0.0", message = "Duration hours must be greater than or equal to 0")
    private BigDecimal durationHours;

    @Size(max = 100, message = "Operator name cannot exceed 100 characters")
    private String operator;

    @DecimalMin(value = "0.0", message = "Quantity must be greater than or equal to 0")
    private BigDecimal quantity;

    @Size(max = 30, message = "Quantity unit cannot exceed 30 characters")
    private String quantityUnit;

    private String description;

    private String notes;

    private Long cropCycleId;

    public ActivityRequest() {
    }

    public ActivityRequest(String title, String activityType, String status, String priority, LocalDate activityDate,
                           String activityTime, BigDecimal durationHours, String operator, BigDecimal quantity,
                           String quantityUnit, String description, String notes, Long cropCycleId) {
        this.title = title;
        this.activityType = activityType;
        this.status = (status != null && !status.isBlank()) ? status : "Planned";
        this.priority = (priority != null && !priority.isBlank()) ? priority : "Medium";
        this.activityDate = activityDate;
        this.activityTime = activityTime;
        this.durationHours = durationHours;
        this.operator = operator;
        this.quantity = quantity;
        this.quantityUnit = quantityUnit;
        this.description = description;
        this.notes = notes;
        this.cropCycleId = cropCycleId;
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

    public Long getCropCycleId() {
        return cropCycleId;
    }

    public void setCropCycleId(Long cropCycleId) {
        this.cropCycleId = cropCycleId;
    }
}


package com.agritrack.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Request DTO for creating or updating an Irrigation Schedule.
 */
public class IrrigationRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 150, message = "Title cannot exceed 150 characters")
    private String title;

    @NotBlank(message = "Irrigation method is required")
    @Pattern(
        regexp = "^(Drip|Sprinkler|Flood)$",
        message = "Irrigation method must be one of: Drip, Sprinkler, Flood"
    )
    private String irrigationMethod = "Drip";

    @Pattern(
        regexp = "^(Scheduled|In Progress|Completed|Skipped|Cancelled)$",
        message = "Status must be one of: Scheduled, In Progress, Completed, Skipped, Cancelled"
    )
    private String status = "Scheduled";

    @Pattern(
        regexp = "^(Low|Medium|High)$",
        message = "Priority must be one of: Low, Medium, High"
    )
    private String priority = "Medium";

    @NotNull(message = "Scheduled date is required")
    private LocalDate scheduledDate;

    @Size(max = 20, message = "Scheduled time cannot exceed 20 characters")
    private String scheduledTime;

    @NotNull(message = "Duration in minutes is required")
    @Min(value = 1, message = "Duration must be at least 1 minute")
    private Integer durationMinutes = 45;

    @DecimalMin(value = "0.0", message = "Water volume must be greater than or equal to 0")
    private BigDecimal waterVolumeLitres;

    @DecimalMin(value = "0.0", message = "Soil moisture must be greater than or equal to 0")
    @DecimalMax(value = "100.0", message = "Soil moisture cannot exceed 100")
    private BigDecimal soilMoisture;

    @Size(max = 100, message = "Weather condition cannot exceed 100 characters")
    private String weatherCondition;

    @DecimalMin(value = "0.0", message = "Rainfall expected must be greater than or equal to 0")
    private BigDecimal rainfallExpected;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime completedAt;

    private String notes;

    private Long cropCycleId;

    public IrrigationRequest() {
    }

    public IrrigationRequest(String title, String irrigationMethod, String status, String priority,
                             LocalDate scheduledDate, String scheduledTime, Integer durationMinutes,
                             BigDecimal waterVolumeLitres, BigDecimal soilMoisture, String weatherCondition,
                             BigDecimal rainfallExpected, LocalDateTime completedAt, String notes, Long cropCycleId) {
        this.title = title;
        this.irrigationMethod = (irrigationMethod != null && !irrigationMethod.isBlank()) ? irrigationMethod : "Drip";
        this.status = (status != null && !status.isBlank()) ? status : "Scheduled";
        this.priority = (priority != null && !priority.isBlank()) ? priority : "Medium";
        this.scheduledDate = scheduledDate;
        this.scheduledTime = scheduledTime;
        this.durationMinutes = durationMinutes != null ? durationMinutes : 45;
        this.waterVolumeLitres = waterVolumeLitres;
        this.soilMoisture = soilMoisture;
        this.weatherCondition = weatherCondition;
        this.rainfallExpected = rainfallExpected;
        this.completedAt = completedAt;
        this.notes = notes;
        this.cropCycleId = cropCycleId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getIrrigationMethod() {
        return irrigationMethod;
    }

    public void setIrrigationMethod(String irrigationMethod) {
        this.irrigationMethod = irrigationMethod;
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

    public LocalDate getScheduledDate() {
        return scheduledDate;
    }

    public void setScheduledDate(LocalDate scheduledDate) {
        this.scheduledDate = scheduledDate;
    }

    public String getScheduledTime() {
        return scheduledTime;
    }

    public void setScheduledTime(String scheduledTime) {
        this.scheduledTime = scheduledTime;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public BigDecimal getWaterVolumeLitres() {
        return waterVolumeLitres;
    }

    public void setWaterVolumeLitres(BigDecimal waterVolumeLitres) {
        this.waterVolumeLitres = waterVolumeLitres;
    }

    public BigDecimal getSoilMoisture() {
        return soilMoisture;
    }

    public void setSoilMoisture(BigDecimal soilMoisture) {
        this.soilMoisture = soilMoisture;
    }

    public String getWeatherCondition() {
        return weatherCondition;
    }

    public void setWeatherCondition(String weatherCondition) {
        this.weatherCondition = weatherCondition;
    }

    public BigDecimal getRainfallExpected() {
        return rainfallExpected;
    }

    public void setRainfallExpected(BigDecimal rainfallExpected) {
        this.rainfallExpected = rainfallExpected;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
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


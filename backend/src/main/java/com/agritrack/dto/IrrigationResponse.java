package com.agritrack.dto;

import com.agritrack.entity.IrrigationSchedule;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Response DTO representing Irrigation Schedule details.
 */
public class IrrigationResponse {

    private Long id;
    private Long fieldId;
    private String fieldName;
    private Long farmId;
    private String farmName;
    private Long cropCycleId;
    private String cropName;
    private String title;
    private String irrigationMethod;
    private String status;
    private String priority;
    private LocalDate scheduledDate;
    private String scheduledTime;
    private Integer durationMinutes;
    private BigDecimal waterVolumeLitres;
    private BigDecimal soilMoisture;
    private String weatherCondition;
    private BigDecimal rainfallExpected;
    private LocalDateTime completedAt;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public IrrigationResponse() {
    }

    public static IrrigationResponse fromEntity(IrrigationSchedule schedule) {
        IrrigationResponse response = new IrrigationResponse();
        response.setId(schedule.getId());
        if (schedule.getField() != null) {
            response.setFieldId(schedule.getField().getId());
            response.setFieldName(schedule.getField().getFieldName());
            if (schedule.getField().getFarm() != null) {
                response.setFarmId(schedule.getField().getFarm().getId());
                response.setFarmName(schedule.getField().getFarm().getFarmName());
            }
        }
        if (schedule.getCropCycle() != null) {
            response.setCropCycleId(schedule.getCropCycle().getId());
            response.setCropName(schedule.getCropCycle().getCropName());
        }
        response.setTitle(schedule.getTitle());
        response.setIrrigationMethod(schedule.getIrrigationMethod());
        response.setStatus(schedule.getStatus());
        response.setPriority(schedule.getPriority());
        response.setScheduledDate(schedule.getScheduledDate());
        response.setScheduledTime(schedule.getScheduledTime());
        response.setDurationMinutes(schedule.getDurationMinutes());
        response.setWaterVolumeLitres(schedule.getWaterVolumeLitres());
        response.setSoilMoisture(schedule.getSoilMoisture());
        response.setWeatherCondition(schedule.getWeatherCondition());
        response.setRainfallExpected(schedule.getRainfallExpected());
        response.setCompletedAt(schedule.getCompletedAt());
        response.setNotes(schedule.getNotes());
        response.setCreatedAt(schedule.getCreatedAt());
        response.setUpdatedAt(schedule.getUpdatedAt());
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


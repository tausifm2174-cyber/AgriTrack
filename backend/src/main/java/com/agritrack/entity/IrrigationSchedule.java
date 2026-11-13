package com.agritrack.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * JPA Entity representing a scheduled or executed precision irrigation event.
 */
@Entity
@Table(name = "irrigation_schedules")
public class IrrigationSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "field_id", nullable = false)
    private Field field;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "crop_cycle_id")
    private CropCycle cropCycle;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(name = "irrigation_method", nullable = false, length = 50)
    private String irrigationMethod = "Drip";

    @Column(nullable = false, length = 30)
    private String status = "Scheduled";

    @Column(nullable = false, length = 20)
    private String priority = "Medium";

    @Column(name = "scheduled_date", nullable = false)
    private LocalDate scheduledDate;

    @Column(name = "scheduled_time", length = 20)
    private String scheduledTime;

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes = 45;

    @Column(name = "water_volume_litres", precision = 12, scale = 2)
    private BigDecimal waterVolumeLitres;

    @Column(name = "soil_moisture", precision = 5, scale = 2)
    private BigDecimal soilMoisture;

    @Column(name = "weather_condition", length = 100)
    private String weatherCondition;

    @Column(name = "rainfall_expected", precision = 5, scale = 2)
    private BigDecimal rainfallExpected = BigDecimal.ZERO;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public IrrigationSchedule() {
    }

    public IrrigationSchedule(Field field, CropCycle cropCycle, String title, String irrigationMethod,
                              String status, String priority, LocalDate scheduledDate, String scheduledTime,
                              Integer durationMinutes, BigDecimal waterVolumeLitres, BigDecimal soilMoisture,
                              String weatherCondition, BigDecimal rainfallExpected, LocalDateTime completedAt,
                              String notes) {
        this.field = field;
        this.cropCycle = cropCycle;
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
        this.rainfallExpected = rainfallExpected != null ? rainfallExpected : BigDecimal.ZERO;
        this.completedAt = completedAt;
        this.notes = notes;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.irrigationMethod == null || this.irrigationMethod.isBlank()) {
            this.irrigationMethod = "Drip";
        }
        if (this.status == null || this.status.isBlank()) {
            this.status = "Scheduled";
        }
        if (this.priority == null || this.priority.isBlank()) {
            this.priority = "Medium";
        }
        if (this.durationMinutes == null) {
            this.durationMinutes = 45;
        }
        if (this.rainfallExpected == null) {
            this.rainfallExpected = BigDecimal.ZERO;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Field getField() {
        return field;
    }

    public void setField(Field field) {
        this.field = field;
    }

    public CropCycle getCropCycle() {
        return cropCycle;
    }

    public void setCropCycle(CropCycle cropCycle) {
        this.cropCycle = cropCycle;
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


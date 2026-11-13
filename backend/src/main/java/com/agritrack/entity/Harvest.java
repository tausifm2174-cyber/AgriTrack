package com.agritrack.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * JPA Entity representing a Harvest record associated with a CropCycle.
 * Tracks planned vs actual yield, quality assessments, and inventory distribution.
 */
@Entity
@Table(name = "harvests")
public class Harvest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "crop_cycle_id", nullable = false)
    private CropCycle cropCycle;

    @Column(name = "harvest_date", nullable = false)
    private LocalDate harvestDate;

    @Column(name = "expected_yield_kg", nullable = false, precision = 12, scale = 2)
    private BigDecimal expectedYieldKg = BigDecimal.ZERO;

    @Column(name = "harvested_quantity_kg", nullable = false, precision = 12, scale = 2)
    private BigDecimal harvestedQuantityKg = BigDecimal.ZERO;

    @Column(name = "available_quantity_kg", nullable = false, precision = 12, scale = 2)
    private BigDecimal availableQuantityKg = BigDecimal.ZERO;

    @Column(name = "sold_quantity_kg", nullable = false, precision = 12, scale = 2)
    private BigDecimal soldQuantityKg = BigDecimal.ZERO;

    @Column(name = "quality_grade", nullable = false, length = 10)
    private String qualityGrade = "A";

    @Column(name = "quality_score", nullable = false)
    private Integer qualityScore = 85;

    @Column(name = "moisture_percent", precision = 5, scale = 2)
    private BigDecimal moisturePercent;

    @Column(nullable = false, length = 30)
    private String status = "HARVESTED";

    @Column(name = "storage_location", length = 150)
    private String storageLocation;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CropCycle getCropCycle() {
        return cropCycle;
    }

    public void setCropCycle(CropCycle cropCycle) {
        this.cropCycle = cropCycle;
    }

    public LocalDate getHarvestDate() {
        return harvestDate;
    }

    public void setHarvestDate(LocalDate harvestDate) {
        this.harvestDate = harvestDate;
    }

    public BigDecimal getExpectedYieldKg() {
        return expectedYieldKg;
    }

    public void setExpectedYieldKg(BigDecimal expectedYieldKg) {
        this.expectedYieldKg = expectedYieldKg;
    }

    public BigDecimal getHarvestedQuantityKg() {
        return harvestedQuantityKg;
    }

    public void setHarvestedQuantityKg(BigDecimal harvestedQuantityKg) {
        this.harvestedQuantityKg = harvestedQuantityKg;
    }

    public BigDecimal getAvailableQuantityKg() {
        return availableQuantityKg;
    }

    public void setAvailableQuantityKg(BigDecimal availableQuantityKg) {
        this.availableQuantityKg = availableQuantityKg;
    }

    public BigDecimal getSoldQuantityKg() {
        return soldQuantityKg;
    }

    public void setSoldQuantityKg(BigDecimal soldQuantityKg) {
        this.soldQuantityKg = soldQuantityKg;
    }

    public String getQualityGrade() {
        return qualityGrade;
    }

    public void setQualityGrade(String qualityGrade) {
        this.qualityGrade = qualityGrade;
    }

    public Integer getQualityScore() {
        return qualityScore;
    }

    public void setQualityScore(Integer qualityScore) {
        this.qualityScore = qualityScore;
    }

    public BigDecimal getMoisturePercent() {
        return moisturePercent;
    }

    public void setMoisturePercent(BigDecimal moisturePercent) {
        this.moisturePercent = moisturePercent;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStorageLocation() {
        return storageLocation;
    }

    public void setStorageLocation(String storageLocation) {
        this.storageLocation = storageLocation;
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

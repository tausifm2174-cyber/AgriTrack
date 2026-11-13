package com.agritrack.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * JPA Entity representing a soil test record associated with a specific Field.
 */
@Entity
@Table(name = "soil_records")
public class SoilRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "field_id", nullable = false)
    private Field field;

    @Column(name = "soil_type", length = 100)
    private String soilType;

    @Column(precision = 4, scale = 2)
    private BigDecimal ph;

    @Column(precision = 8, scale = 2)
    private BigDecimal nitrogen;

    @Column(precision = 8, scale = 2)
    private BigDecimal phosphorus;

    @Column(precision = 8, scale = 2)
    private BigDecimal potassium;

    @Column(name = "organic_matter", precision = 5, scale = 2)
    private BigDecimal organicMatter;

    @Column(precision = 5, scale = 2)
    private BigDecimal moisture;

    @Column(name = "recorded_at", nullable = false)
    private LocalDate recordedAt;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public SoilRecord() {
    }

    public SoilRecord(Field field, String soilType, BigDecimal ph, BigDecimal nitrogen, BigDecimal phosphorus, BigDecimal potassium, BigDecimal organicMatter, BigDecimal moisture, LocalDate recordedAt, String notes) {
        this.field = field;
        this.soilType = soilType;
        this.ph = ph;
        this.nitrogen = nitrogen;
        this.phosphorus = phosphorus;
        this.potassium = potassium;
        this.organicMatter = organicMatter;
        this.moisture = moisture;
        this.recordedAt = recordedAt;
        this.notes = notes;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.recordedAt == null) {
            this.recordedAt = LocalDate.now();
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

    public String getSoilType() {
        return soilType;
    }

    public void setSoilType(String soilType) {
        this.soilType = soilType;
    }

    public BigDecimal getPh() {
        return ph;
    }

    public void setPh(BigDecimal ph) {
        this.ph = ph;
    }

    public BigDecimal getNitrogen() {
        return nitrogen;
    }

    public void setNitrogen(BigDecimal nitrogen) {
        this.nitrogen = nitrogen;
    }

    public BigDecimal getPhosphorus() {
        return phosphorus;
    }

    public void setPhosphorus(BigDecimal phosphorus) {
        this.phosphorus = phosphorus;
    }

    public BigDecimal getPotassium() {
        return potassium;
    }

    public void setPotassium(BigDecimal potassium) {
        this.potassium = potassium;
    }

    public BigDecimal getOrganicMatter() {
        return organicMatter;
    }

    public void setOrganicMatter(BigDecimal organicMatter) {
        this.organicMatter = organicMatter;
    }

    public BigDecimal getMoisture() {
        return moisture;
    }

    public void setMoisture(BigDecimal moisture) {
        this.moisture = moisture;
    }

    public LocalDate getRecordedAt() {
        return recordedAt;
    }

    public void setRecordedAt(LocalDate recordedAt) {
        this.recordedAt = recordedAt;
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


package com.agritrack.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * JPA Entity representing actionable agronomic and weather hazard advisories.
 */
@Entity
@Table(name = "advisories", uniqueConstraints = {
    @UniqueConstraint(name = "uk_advisories_dedup", columnNames = {"farm_id", "dedup_key"})
})
public class Advisory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "farm_id", nullable = false)
    private Farm farm;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "field_id")
    private Field field;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "crop_cycle_id")
    private CropCycle cropCycle;

    @Column(name = "rule_code", nullable = false, length = 50)
    private String ruleCode;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(name = "advisory_type", nullable = false, length = 30)
    private String advisoryType;

    @Column(nullable = false, length = 20)
    private String severity;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "trigger_condition", nullable = false, length = 255)
    private String triggerCondition;

    @Column(name = "recommended_action", nullable = false, columnDefinition = "TEXT")
    private String recommendedAction;

    @Column(nullable = false, length = 20)
    private String status = "ACTIVE";

    @Column(name = "valid_until")
    private LocalDateTime validUntil;

    @Column(name = "dedup_key", length = 100)
    private String dedupKey;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Advisory() {
    }

    public Advisory(Farm farm, Field field, CropCycle cropCycle, String ruleCode,
                    String category, String advisoryType, String severity, String title,
                    String message, String triggerCondition, String recommendedAction,
                    String status, LocalDateTime validUntil, String dedupKey) {
        this.farm = farm;
        this.field = field;
        this.cropCycle = cropCycle;
        this.ruleCode = ruleCode;
        this.category = category;
        this.advisoryType = advisoryType;
        this.severity = severity;
        this.title = title;
        this.message = message;
        this.triggerCondition = triggerCondition;
        this.recommendedAction = recommendedAction;
        this.status = status != null ? status : "ACTIVE";
        this.validUntil = validUntil;
        this.dedupKey = dedupKey;
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.status == null) {
            this.status = "ACTIVE";
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

    public Farm getFarm() {
        return farm;
    }

    public void setFarm(Farm farm) {
        this.farm = farm;
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

    public String getRuleCode() {
        return ruleCode;
    }

    public void setRuleCode(String ruleCode) {
        this.ruleCode = ruleCode;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getAdvisoryType() {
        return advisoryType;
    }

    public void setAdvisoryType(String advisoryType) {
        this.advisoryType = advisoryType;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getTriggerCondition() {
        return triggerCondition;
    }

    public void setTriggerCondition(String triggerCondition) {
        this.triggerCondition = triggerCondition;
    }

    public String getRecommendedAction() {
        return recommendedAction;
    }

    public void setRecommendedAction(String recommendedAction) {
        this.recommendedAction = recommendedAction;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getValidUntil() {
        return validUntil;
    }

    public void setValidUntil(LocalDateTime validUntil) {
        this.validUntil = validUntil;
    }

    public String getDedupKey() {
        return dedupKey;
    }

    public void setDedupKey(String dedupKey) {
        this.dedupKey = dedupKey;
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


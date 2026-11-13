package com.agritrack.dto;

import com.agritrack.entity.Advisory;

import java.time.LocalDateTime;

public class AdvisoryResponse {

    private Long id;
    private Long farmId;
    private String farmName;
    private Long fieldId;
    private String fieldName;
    private Long cropCycleId;
    private String cropCycleName;
    private String ruleCode;
    private String category;
    private String advisoryType;
    private String severity;
    private String title;
    private String message;
    private String triggerCondition;
    private String recommendedAction;
    private String status;
    private LocalDateTime validUntil;
    private String dedupKey;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public AdvisoryResponse() {
    }

    public static AdvisoryResponse fromEntity(Advisory advisory) {
        AdvisoryResponse dto = new AdvisoryResponse();
        dto.setId(advisory.getId());
        if (advisory.getFarm() != null) {
            dto.setFarmId(advisory.getFarm().getId());
            dto.setFarmName(advisory.getFarm().getFarmName());
        }
        if (advisory.getField() != null) {
            dto.setFieldId(advisory.getField().getId());
            dto.setFieldName(advisory.getField().getFieldName());
        }
        if (advisory.getCropCycle() != null) {
            dto.setCropCycleId(advisory.getCropCycle().getId());
            dto.setCropCycleName(advisory.getCropCycle().getCropName());
        }
        dto.setRuleCode(advisory.getRuleCode());
        dto.setCategory(advisory.getCategory());
        dto.setAdvisoryType(advisory.getAdvisoryType());
        dto.setSeverity(advisory.getSeverity());
        dto.setTitle(advisory.getTitle());
        dto.setMessage(advisory.getMessage());
        dto.setTriggerCondition(advisory.getTriggerCondition());
        dto.setRecommendedAction(advisory.getRecommendedAction());
        dto.setStatus(advisory.getStatus());
        dto.setValidUntil(advisory.getValidUntil());
        dto.setDedupKey(advisory.getDedupKey());
        dto.setCreatedAt(advisory.getCreatedAt());
        dto.setUpdatedAt(advisory.getUpdatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Long getCropCycleId() {
        return cropCycleId;
    }

    public void setCropCycleId(Long cropCycleId) {
        this.cropCycleId = cropCycleId;
    }

    public String getCropCycleName() {
        return cropCycleName;
    }

    public void setCropCycleName(String cropCycleName) {
        this.cropCycleName = cropCycleName;
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


package com.agritrack.dto;

import com.agritrack.entity.Notification;

import java.time.LocalDateTime;

public class NotificationResponse {

    private Long id;
    private Long userId;
    private String type;
    private String severity;
    private String title;
    private String message;
    private String relatedRoute;
    private String actionLabel;
    @com.fasterxml.jackson.annotation.JsonProperty("isRead")
    private boolean isRead;
    private LocalDateTime readAt;
    private String dedupKey;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Optional context metadata
    private Long farmId;
    private String farmName;
    private Long fieldId;
    private String fieldName;
    private Long cropCycleId;
    private String cropCycleName;
    private Long advisoryId;

    public NotificationResponse() {
    }

    public static NotificationResponse fromEntity(Notification entity) {
        NotificationResponse dto = new NotificationResponse();
        dto.setId(entity.getId());
        if (entity.getUser() != null) {
            dto.setUserId(entity.getUser().getId());
        }
        dto.setType(entity.getType());
        dto.setSeverity(entity.getSeverity());
        dto.setTitle(entity.getTitle());
        dto.setMessage(entity.getMessage());
        dto.setRelatedRoute(entity.getRelatedRoute());
        dto.setActionLabel(entity.getActionLabel());
        dto.setRead(entity.isRead());
        dto.setReadAt(entity.getReadAt());
        dto.setDedupKey(entity.getDedupKey());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());

        if (entity.getFarm() != null) {
            dto.setFarmId(entity.getFarm().getId());
            dto.setFarmName(entity.getFarm().getFarmName());
        }
        if (entity.getField() != null) {
            dto.setFieldId(entity.getField().getId());
            dto.setFieldName(entity.getField().getFieldName());
        }
        if (entity.getCropCycle() != null) {
            dto.setCropCycleId(entity.getCropCycle().getId());
            dto.setCropCycleName(entity.getCropCycle().getCropName());
        }
        if (entity.getAdvisory() != null) {
            dto.setAdvisoryId(entity.getAdvisory().getId());
        }

        return dto;
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
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

    public String getRelatedRoute() {
        return relatedRoute;
    }

    public void setRelatedRoute(String relatedRoute) {
        this.relatedRoute = relatedRoute;
    }

    public String getActionLabel() {
        return actionLabel;
    }

    public void setActionLabel(String actionLabel) {
        this.actionLabel = actionLabel;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }

    public LocalDateTime getReadAt() {
        return readAt;
    }

    public void setReadAt(LocalDateTime readAt) {
        this.readAt = readAt;
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

    public Long getAdvisoryId() {
        return advisoryId;
    }

    public void setAdvisoryId(Long advisoryId) {
        this.advisoryId = advisoryId;
    }
}

package com.agritrack.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class NotificationCreateRequest {

    @NotBlank(message = "Notification type is required")
    @Pattern(regexp = "^(WEATHER|IRRIGATION|CROP|HARVEST|SALES|PAYMENT|SYSTEM|ADVISORY)$",
             message = "Type must be WEATHER, IRRIGATION, CROP, HARVEST, SALES, PAYMENT, SYSTEM, or ADVISORY")
    private String type;

    @NotBlank(message = "Severity is required")
    @Pattern(regexp = "^(INFO|SUCCESS|WARNING|CRITICAL)$",
             message = "Severity must be INFO, SUCCESS, WARNING, or CRITICAL")
    private String severity;

    @NotBlank(message = "Title is required")
    @Size(max = 150, message = "Title must not exceed 150 characters")
    private String title;

    @NotBlank(message = "Message is required")
    private String message;

    private String relatedRoute;
    private String actionLabel;
    private Long farmId;
    private Long fieldId;
    private Long cropCycleId;
    private Long advisoryId;
    private String dedupKey;

    public NotificationCreateRequest() {
    }

    public NotificationCreateRequest(String type, String severity, String title, String message,
                                     String relatedRoute, String actionLabel, Long farmId,
                                     Long fieldId, Long cropCycleId, Long advisoryId, String dedupKey) {
        this.type = type;
        this.severity = severity;
        this.title = title;
        this.message = message;
        this.relatedRoute = relatedRoute;
        this.actionLabel = actionLabel;
        this.farmId = farmId;
        this.fieldId = fieldId;
        this.cropCycleId = cropCycleId;
        this.advisoryId = advisoryId;
        this.dedupKey = dedupKey;
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

    public Long getFarmId() {
        return farmId;
    }

    public void setFarmId(Long farmId) {
        this.farmId = farmId;
    }

    public Long getFieldId() {
        return fieldId;
    }

    public void setFieldId(Long fieldId) {
        this.fieldId = fieldId;
    }

    public Long getCropCycleId() {
        return cropCycleId;
    }

    public void setCropCycleId(Long cropCycleId) {
        this.cropCycleId = cropCycleId;
    }

    public Long getAdvisoryId() {
        return advisoryId;
    }

    public void setAdvisoryId(Long advisoryId) {
        this.advisoryId = advisoryId;
    }

    public String getDedupKey() {
        return dedupKey;
    }

    public void setDedupKey(String dedupKey) {
        this.dedupKey = dedupKey;
    }
}

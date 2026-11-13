package com.agritrack.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class AdvisoryStatusUpdateRequest {

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(ACKNOWLEDGED|DISMISSED)$",
             message = "Status must be ACKNOWLEDGED or DISMISSED")
    private String status;

    public AdvisoryStatusUpdateRequest() {
    }

    public AdvisoryStatusUpdateRequest(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}


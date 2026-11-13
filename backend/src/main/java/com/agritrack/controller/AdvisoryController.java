package com.agritrack.controller;

import com.agritrack.dto.AdvisoryResponse;
import com.agritrack.dto.AdvisoryStatusUpdateRequest;
import com.agritrack.dto.ApiResponse;
import com.agritrack.service.AdvisoryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for agronomic hazard advisories.
 */
@RestController
public class AdvisoryController {

    private final AdvisoryService advisoryService;

    public AdvisoryController(AdvisoryService advisoryService) {
        this.advisoryService = advisoryService;
    }

    @GetMapping("/farms/{farmId}/advisories")
    public ResponseEntity<ApiResponse<List<AdvisoryResponse>>> getAdvisoriesForFarm(
            @PathVariable Long farmId,
            @RequestParam(required = false) String status,
            Authentication authentication) {
        List<AdvisoryResponse> response = advisoryService.getAdvisoriesForFarm(farmId, status, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(response, "Farm advisories retrieved successfully"));
    }

    @PostMapping("/farms/{farmId}/advisories/evaluate")
    public ResponseEntity<ApiResponse<List<AdvisoryResponse>>> evaluateFarmAdvisories(
            @PathVariable Long farmId,
            Authentication authentication) {
        List<AdvisoryResponse> response = advisoryService.evaluateFarmAdvisories(farmId, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(response, "Advisories evaluated successfully"));
    }

    @GetMapping("/advisories")
    public ResponseEntity<ApiResponse<List<AdvisoryResponse>>> getAllAdvisories(
            @RequestParam(required = false) String status,
            Authentication authentication) {
        List<AdvisoryResponse> response = advisoryService.getAllAdvisoriesForUser(status, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(response, "Advisories retrieved successfully"));
    }

    @PatchMapping("/advisories/{id}/status")
    public ResponseEntity<ApiResponse<AdvisoryResponse>> updateAdvisoryStatus(
            @PathVariable Long id,
            @Valid @RequestBody AdvisoryStatusUpdateRequest request,
            Authentication authentication) {
        AdvisoryResponse response = advisoryService.updateAdvisoryStatus(id, request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(response, "Advisory status updated successfully"));
    }
}


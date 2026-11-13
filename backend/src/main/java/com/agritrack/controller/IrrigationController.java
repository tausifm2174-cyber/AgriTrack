package com.agritrack.controller;

import com.agritrack.dto.ApiResponse;
import com.agritrack.dto.IrrigationRequest;
import com.agritrack.dto.IrrigationResponse;
import com.agritrack.service.IrrigationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for precision Irrigation Schedule management.
 * Provides nested field routes and user collection/entity routes.
 */
@RestController
public class IrrigationController {

    private final IrrigationService irrigationService;

    public IrrigationController(IrrigationService irrigationService) {
        this.irrigationService = irrigationService;
    }

    @PostMapping("/fields/{fieldId}/irrigation")
    public ResponseEntity<ApiResponse<IrrigationResponse>> createIrrigation(
            @PathVariable Long fieldId,
            @Valid @RequestBody IrrigationRequest request,
            Authentication authentication) {
        IrrigationResponse response = irrigationService.createIrrigation(fieldId, request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Irrigation schedule created successfully"));
    }

    @GetMapping("/fields/{fieldId}/irrigation")
    public ResponseEntity<ApiResponse<List<IrrigationResponse>>> getIrrigationsByField(
            @PathVariable Long fieldId,
            Authentication authentication) {
        List<IrrigationResponse> responses = irrigationService.getIrrigationsByField(fieldId, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(responses, "Irrigation schedules retrieved successfully"));
    }

    @GetMapping("/irrigation")
    public ResponseEntity<ApiResponse<List<IrrigationResponse>>> getAllIrrigations(
            Authentication authentication) {
        List<IrrigationResponse> responses = irrigationService.getAllIrrigationsForUser(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(responses, "All irrigation schedules retrieved successfully"));
    }

    @GetMapping("/irrigation/{id}")
    public ResponseEntity<ApiResponse<IrrigationResponse>> getIrrigationById(
            @PathVariable Long id,
            Authentication authentication) {
        IrrigationResponse response = irrigationService.getIrrigationById(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(response, "Irrigation schedule retrieved successfully"));
    }

    @PutMapping("/irrigation/{id}")
    public ResponseEntity<ApiResponse<IrrigationResponse>> updateIrrigation(
            @PathVariable Long id,
            @Valid @RequestBody IrrigationRequest request,
            Authentication authentication) {
        IrrigationResponse response = irrigationService.updateIrrigation(id, request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(response, "Irrigation schedule updated successfully"));
    }

    @DeleteMapping("/irrigation/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteIrrigation(
            @PathVariable Long id,
            Authentication authentication) {
        irrigationService.deleteIrrigation(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(null, "Irrigation schedule deleted successfully"));
    }
}


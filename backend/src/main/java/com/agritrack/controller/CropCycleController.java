package com.agritrack.controller;

import com.agritrack.dto.ApiResponse;
import com.agritrack.dto.CropCycleRequest;
import com.agritrack.dto.CropCycleResponse;
import com.agritrack.service.CropCycleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Crop Cycle management operations.
 * Handles nested routes (/fields/{fieldId}/crop-cycles) and root collection/entity routes (/crop-cycles).
 */
@RestController
public class CropCycleController {

    private final CropCycleService cropCycleService;

    public CropCycleController(CropCycleService cropCycleService) {
        this.cropCycleService = cropCycleService;
    }

    @PostMapping("/fields/{fieldId}/crop-cycles")
    public ResponseEntity<ApiResponse<CropCycleResponse>> createCropCycle(
            @PathVariable Long fieldId,
            @Valid @RequestBody CropCycleRequest request,
            Authentication authentication) {
        CropCycleResponse response = cropCycleService.createCropCycle(fieldId, request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Crop cycle created successfully"));
    }

    @GetMapping("/fields/{fieldId}/crop-cycles")
    public ResponseEntity<ApiResponse<List<CropCycleResponse>>> getCropCyclesByField(
            @PathVariable Long fieldId,
            Authentication authentication) {
        List<CropCycleResponse> cycles = cropCycleService.getCropCyclesByField(fieldId, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(cycles, "Crop cycles retrieved successfully"));
    }

    @GetMapping("/crop-cycles")
    public ResponseEntity<ApiResponse<List<CropCycleResponse>>> getAllCropCycles(
            Authentication authentication) {
        List<CropCycleResponse> cycles = cropCycleService.getAllCropCyclesForUser(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(cycles, "All crop cycles retrieved successfully"));
    }

    @GetMapping("/crop-cycles/{id}")
    public ResponseEntity<ApiResponse<CropCycleResponse>> getCropCycleById(
            @PathVariable Long id,
            Authentication authentication) {
        CropCycleResponse response = cropCycleService.getCropCycleById(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(response, "Crop cycle retrieved successfully"));
    }

    @PutMapping("/crop-cycles/{id}")
    public ResponseEntity<ApiResponse<CropCycleResponse>> updateCropCycle(
            @PathVariable Long id,
            @Valid @RequestBody CropCycleRequest request,
            Authentication authentication) {
        CropCycleResponse response = cropCycleService.updateCropCycle(id, request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(response, "Crop cycle updated successfully"));
    }

    @DeleteMapping("/crop-cycles/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCropCycle(
            @PathVariable Long id,
            Authentication authentication) {
        cropCycleService.deleteCropCycle(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(null, "Crop cycle deleted successfully"));
    }
}


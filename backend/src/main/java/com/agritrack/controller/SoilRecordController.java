package com.agritrack.controller;

import com.agritrack.dto.ApiResponse;
import com.agritrack.dto.SoilRecordRequest;
import com.agritrack.dto.SoilRecordResponse;
import com.agritrack.service.SoilRecordService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Soil Record management operations.
 * Handles nested routes (/fields/{fieldId}/soil-records) and direct entity routes (/soil-records/{id}).
 */
@RestController
public class SoilRecordController {

    private final SoilRecordService soilRecordService;

    public SoilRecordController(SoilRecordService soilRecordService) {
        this.soilRecordService = soilRecordService;
    }

    @PostMapping("/fields/{fieldId}/soil-records")
    public ResponseEntity<ApiResponse<SoilRecordResponse>> createSoilRecord(
            @PathVariable Long fieldId,
            @Valid @RequestBody SoilRecordRequest request,
            Authentication authentication) {
        SoilRecordResponse response = soilRecordService.createSoilRecord(fieldId, request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Soil record created successfully"));
    }

    @GetMapping("/fields/{fieldId}/soil-records")
    public ResponseEntity<ApiResponse<List<SoilRecordResponse>>> getSoilRecordsByField(
            @PathVariable Long fieldId,
            Authentication authentication) {
        List<SoilRecordResponse> records = soilRecordService.getSoilRecordsByField(fieldId, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(records, "Soil records retrieved successfully"));
    }

    @GetMapping("/soil-records/{id}")
    public ResponseEntity<ApiResponse<SoilRecordResponse>> getSoilRecordById(
            @PathVariable Long id,
            Authentication authentication) {
        SoilRecordResponse record = soilRecordService.getSoilRecordById(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(record, "Soil record retrieved successfully"));
    }

    @PutMapping("/soil-records/{id}")
    public ResponseEntity<ApiResponse<SoilRecordResponse>> updateSoilRecord(
            @PathVariable Long id,
            @Valid @RequestBody SoilRecordRequest request,
            Authentication authentication) {
        SoilRecordResponse record = soilRecordService.updateSoilRecord(id, request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(record, "Soil record updated successfully"));
    }

    @DeleteMapping("/soil-records/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSoilRecord(
            @PathVariable Long id,
            Authentication authentication) {
        soilRecordService.deleteSoilRecord(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(null, "Soil record deleted successfully"));
    }
}

package com.agritrack.controller;

import com.agritrack.dto.ApiResponse;
import com.agritrack.dto.FieldRequest;
import com.agritrack.dto.FieldResponse;
import com.agritrack.service.FieldService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Field management operations.
 * Handles nested routes (/farms/{farmId}/fields) and direct entity routes (/fields/{id}).
 */
@RestController
public class FieldController {

    private final FieldService fieldService;

    public FieldController(FieldService fieldService) {
        this.fieldService = fieldService;
    }

    @PostMapping("/farms/{farmId}/fields")
    public ResponseEntity<ApiResponse<FieldResponse>> createField(
            @PathVariable Long farmId,
            @Valid @RequestBody FieldRequest request,
            Authentication authentication) {
        FieldResponse response = fieldService.createField(farmId, request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Field created successfully"));
    }

    @GetMapping("/farms/{farmId}/fields")
    public ResponseEntity<ApiResponse<List<FieldResponse>>> getFieldsByFarm(
            @PathVariable Long farmId,
            Authentication authentication) {
        List<FieldResponse> fields = fieldService.getFieldsByFarm(farmId, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(fields, "Fields retrieved successfully"));
    }

    @GetMapping("/fields/{id}")
    public ResponseEntity<ApiResponse<FieldResponse>> getFieldById(
            @PathVariable Long id,
            Authentication authentication) {
        FieldResponse field = fieldService.getFieldById(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(field, "Field retrieved successfully"));
    }

    @PutMapping("/fields/{id}")
    public ResponseEntity<ApiResponse<FieldResponse>> updateField(
            @PathVariable Long id,
            @Valid @RequestBody FieldRequest request,
            Authentication authentication) {
        FieldResponse field = fieldService.updateField(id, request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(field, "Field updated successfully"));
    }

    @DeleteMapping("/fields/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteField(
            @PathVariable Long id,
            Authentication authentication) {
        fieldService.deleteField(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(null, "Field deleted successfully"));
    }
}

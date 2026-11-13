package com.agritrack.controller;

import com.agritrack.dto.ApiResponse;
import com.agritrack.dto.FarmRequest;
import com.agritrack.dto.FarmResponse;
import com.agritrack.service.FarmService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Farm management operations.
 * Enforces authenticated access and user-isolated resources.
 */
@RestController
@RequestMapping("/farms")
public class FarmController {

    private final FarmService farmService;

    public FarmController(FarmService farmService) {
        this.farmService = farmService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FarmResponse>> createFarm(
            @Valid @RequestBody FarmRequest request,
            Authentication authentication) {
        FarmResponse response = farmService.createFarm(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Farm created successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FarmResponse>>> getAllFarms(
            Authentication authentication) {
        List<FarmResponse> farms = farmService.getAllFarmsForUser(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(farms, "Farms retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FarmResponse>> getFarmById(
            @PathVariable Long id,
            Authentication authentication) {
        FarmResponse farm = farmService.getFarmById(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(farm, "Farm retrieved successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FarmResponse>> updateFarm(
            @PathVariable Long id,
            @Valid @RequestBody FarmRequest request,
            Authentication authentication) {
        FarmResponse farm = farmService.updateFarm(id, request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(farm, "Farm updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFarm(
            @PathVariable Long id,
            Authentication authentication) {
        farmService.deleteFarm(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(null, "Farm deleted successfully"));
    }
}

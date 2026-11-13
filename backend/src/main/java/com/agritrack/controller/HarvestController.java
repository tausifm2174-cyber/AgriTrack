package com.agritrack.controller;

import com.agritrack.dto.ApiResponse;
import com.agritrack.dto.HarvestRequest;
import com.agritrack.dto.HarvestResponse;
import com.agritrack.service.HarvestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Harvest management.
 * Provides endpoints for creating, updating, querying, and deleting harvest records.
 */
@RestController
public class HarvestController {

    private final HarvestService harvestService;

    public HarvestController(HarvestService harvestService) {
        this.harvestService = harvestService;
    }

    @PostMapping("/crop-cycles/{cropCycleId}/harvests")
    public ResponseEntity<ApiResponse<HarvestResponse>> createHarvest(
            @PathVariable Long cropCycleId,
            @Valid @RequestBody HarvestRequest request,
            Authentication authentication) {
        HarvestResponse response = harvestService.createHarvest(cropCycleId, request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Harvest created successfully"));
    }

    @GetMapping("/crop-cycles/{cropCycleId}/harvests")
    public ResponseEntity<ApiResponse<List<HarvestResponse>>> getHarvestsByCropCycle(
            @PathVariable Long cropCycleId,
            Authentication authentication) {
        List<HarvestResponse> harvests = harvestService.getHarvestsByCropCycle(cropCycleId, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(harvests, "Harvests retrieved successfully"));
    }

    @GetMapping("/harvests")
    public ResponseEntity<ApiResponse<List<HarvestResponse>>> getAllHarvests(
            Authentication authentication) {
        List<HarvestResponse> harvests = harvestService.getAllHarvests(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(harvests, "All harvests retrieved successfully"));
    }

    @GetMapping("/harvests/{id}")
    public ResponseEntity<ApiResponse<HarvestResponse>> getHarvestById(
            @PathVariable Long id,
            Authentication authentication) {
        HarvestResponse response = harvestService.getHarvestById(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(response, "Harvest retrieved successfully"));
    }

    @PutMapping("/harvests/{id}")
    public ResponseEntity<ApiResponse<HarvestResponse>> updateHarvest(
            @PathVariable Long id,
            @Valid @RequestBody HarvestRequest request,
            Authentication authentication) {
        HarvestResponse response = harvestService.updateHarvest(id, request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(response, "Harvest updated successfully"));
    }

    @DeleteMapping("/harvests/{id}")
    public ResponseEntity<Void> deleteHarvest(
            @PathVariable Long id,
            Authentication authentication) {
        harvestService.deleteHarvest(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/fields/{fieldId}/harvests")
    public ResponseEntity<ApiResponse<List<HarvestResponse>>> getHarvestsByField(
            @PathVariable Long fieldId,
            Authentication authentication) {
        List<HarvestResponse> harvests = harvestService.getHarvestsByField(fieldId, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(harvests, "Field harvests retrieved successfully"));
    }

    @GetMapping("/farms/{farmId}/harvests")
    public ResponseEntity<ApiResponse<List<HarvestResponse>>> getHarvestsByFarm(
            @PathVariable Long farmId,
            Authentication authentication) {
        List<HarvestResponse> harvests = harvestService.getHarvestsByFarm(farmId, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(harvests, "Farm harvests retrieved successfully"));
    }
}

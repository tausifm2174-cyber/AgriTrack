package com.agritrack.controller;

import com.agritrack.dto.ApiResponse;
import com.agritrack.dto.SaleRequest;
import com.agritrack.dto.SaleResponse;
import com.agritrack.service.SaleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for commercial Sales transaction management.
 * Provides endpoints for creating, updating, querying, and deleting sales orders
 * with automated inventory reconciliation.
 */
@RestController
public class SaleController {

    private final SaleService saleService;

    public SaleController(SaleService saleService) {
        this.saleService = saleService;
    }

    @PostMapping("/harvests/{harvestId}/sales")
    public ResponseEntity<ApiResponse<SaleResponse>> createSale(
            @PathVariable Long harvestId,
            @Valid @RequestBody SaleRequest request,
            Authentication authentication) {
        SaleResponse response = saleService.createSale(harvestId, request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Sale created successfully"));
    }

    @GetMapping("/harvests/{harvestId}/sales")
    public ResponseEntity<ApiResponse<List<SaleResponse>>> getSalesByHarvest(
            @PathVariable Long harvestId,
            Authentication authentication) {
        List<SaleResponse> sales = saleService.getSalesByHarvest(harvestId, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(sales, "Harvest sales retrieved successfully"));
    }

    @GetMapping("/sales")
    public ResponseEntity<ApiResponse<List<SaleResponse>>> getAllSales(
            Authentication authentication) {
        List<SaleResponse> sales = saleService.getAllSales(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(sales, "All sales retrieved successfully"));
    }

    @GetMapping("/sales/{id}")
    public ResponseEntity<ApiResponse<SaleResponse>> getSaleById(
            @PathVariable Long id,
            Authentication authentication) {
        SaleResponse response = saleService.getSaleById(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(response, "Sale retrieved successfully"));
    }

    @PutMapping("/sales/{id}")
    public ResponseEntity<ApiResponse<SaleResponse>> updateSale(
            @PathVariable Long id,
            @Valid @RequestBody SaleRequest request,
            Authentication authentication) {
        SaleResponse response = saleService.updateSale(id, request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(response, "Sale updated successfully"));
    }

    @DeleteMapping("/sales/{id}")
    public ResponseEntity<Void> deleteSale(
            @PathVariable Long id,
            Authentication authentication) {
        saleService.deleteSale(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}

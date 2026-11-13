package com.agritrack.controller;

import com.agritrack.dto.ApiResponse;
import com.agritrack.dto.MarketPriceRequest;
import com.agritrack.dto.MarketPriceResponse;
import com.agritrack.service.MarketPriceService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * REST Controller for APMC Mandi commodity market benchmark prices.
 * Read operations are accessible to all authenticated users.
 * Administrative operations (create, update, delete) are strictly restricted to ADMIN role.
 */
@RestController
public class MarketPriceController {

    private final MarketPriceService marketPriceService;

    public MarketPriceController(MarketPriceService marketPriceService) {
        this.marketPriceService = marketPriceService;
    }

    @GetMapping("/market-prices")
    public ResponseEntity<ApiResponse<List<MarketPriceResponse>>> getMarketPrices(
            @RequestParam(required = false) String crop,
            @RequestParam(required = false) String market,
            @RequestParam(required = false) String trend,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo) {
        List<MarketPriceResponse> prices = marketPriceService.getMarketPrices(crop, market, trend, date, dateFrom, dateTo);
        return ResponseEntity.ok(ApiResponse.success(prices, "Market prices retrieved successfully"));
    }

    @GetMapping("/market-prices/{id}")
    public ResponseEntity<ApiResponse<MarketPriceResponse>> getMarketPriceById(
            @PathVariable Long id) {
        MarketPriceResponse response = marketPriceService.getMarketPriceById(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Market price retrieved successfully"));
    }

    @PostMapping("/market-prices")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<MarketPriceResponse>> createMarketPrice(
            @Valid @RequestBody MarketPriceRequest request) {
        MarketPriceResponse response = marketPriceService.createMarketPrice(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Market price created successfully"));
    }

    @PutMapping("/market-prices/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<MarketPriceResponse>> updateMarketPrice(
            @PathVariable Long id,
            @Valid @RequestBody MarketPriceRequest request) {
        MarketPriceResponse response = marketPriceService.updateMarketPrice(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Market price updated successfully"));
    }

    @DeleteMapping("/market-prices/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMarketPrice(
            @PathVariable Long id) {
        marketPriceService.deleteMarketPrice(id);
        return ResponseEntity.noContent().build();
    }
}

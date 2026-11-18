package com.agritrack.controller;

import com.agritrack.dto.ApiResponse;
import com.agritrack.dto.MarketPriceHistoryResponse;
import com.agritrack.dto.MarketPriceRequest;
import com.agritrack.dto.MarketPriceResponse;
import com.agritrack.service.MarketPriceService;
import com.agritrack.service.mandi.MandiMarketDto;
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

    /**
     * Retrieves APMC markets available for a given state from the live Mandi provider.
     *
     * @param state State name (e.g. Karnataka)
     * @return List of markets and their districts
     */
    @GetMapping("/market-prices/markets")
    public ResponseEntity<ApiResponse<List<MandiMarketDto>>> getMarkets(
            @RequestParam(required = false) String state) {
        List<MandiMarketDto> markets = marketPriceService.getMarkets(state);
        return ResponseEntity.ok(ApiResponse.success(markets, "Markets retrieved successfully"));
    }

    /**
     * Retrieves APMC commodity market benchmark prices.
     * Supports state, district, crop, market, and date filters against the live Mandi provider.
     */
    @GetMapping("/market-prices")
    public ResponseEntity<ApiResponse<List<MarketPriceResponse>>> getMarketPrices(
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String crop,
            @RequestParam(required = false) String market,
            @RequestParam(required = false) String trend,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo) {
        List<MarketPriceResponse> prices = marketPriceService.getMarketPrices(state, district, crop, market, trend, date, dateFrom, dateTo);
        return ResponseEntity.ok(ApiResponse.success(prices, "Market prices retrieved successfully"));
    }

    /**
     * Retrieves historical price series for a specific APMC commodity from the live Mandi provider.
     */
    @GetMapping("/market-prices/history")
    public ResponseEntity<ApiResponse<List<MarketPriceHistoryResponse>>> getPriceHistory(
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String crop,
            @RequestParam(required = false) String market,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        List<MarketPriceHistoryResponse> history = marketPriceService.getPriceHistory(state, crop, market, from, to);
        return ResponseEntity.ok(ApiResponse.success(history, "Market price history retrieved successfully"));
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

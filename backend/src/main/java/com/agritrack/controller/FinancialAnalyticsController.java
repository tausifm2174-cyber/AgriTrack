package com.agritrack.controller;

import com.agritrack.dto.ApiResponse;
import com.agritrack.dto.MonthlyFinancialSummary;
import com.agritrack.dto.ProfitLossSummaryResponse;
import com.agritrack.service.FinancialAnalyticsService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * REST Controller for financial performance and Profit & Loss (P&L) analytics.
 * Surfaces user-scoped farm financial indicators, crop-wise margins, cost per quintal,
 * category distributions, and monthly trends.
 */
@RestController
@RequestMapping("/financials")
public class FinancialAnalyticsController {

    private final FinancialAnalyticsService financialAnalyticsService;

    public FinancialAnalyticsController(FinancialAnalyticsService financialAnalyticsService) {
        this.financialAnalyticsService = financialAnalyticsService;
    }

    @GetMapping("/profit-loss")
    public ResponseEntity<ApiResponse<ProfitLossSummaryResponse>> getProfitLossSummary(
            @RequestParam(required = false) Long farmId,
            @RequestParam(required = false) Long cropCycleId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Authentication authentication) {
        ProfitLossSummaryResponse response = financialAnalyticsService.getProfitLossSummary(
                farmId, cropCycleId, startDate, endDate, authentication.getName()
        );
        return ResponseEntity.ok(ApiResponse.success(response, "Profit & Loss summary retrieved successfully"));
    }

    @GetMapping("/monthly-trend")
    public ResponseEntity<ApiResponse<List<MonthlyFinancialSummary>>> getMonthlyTrend(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Long farmId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Authentication authentication) {
        List<MonthlyFinancialSummary> trends = financialAnalyticsService.getMonthlyTrend(
                year, farmId, startDate, endDate, authentication.getName()
        );
        return ResponseEntity.ok(ApiResponse.success(trends, "Monthly financial trends retrieved successfully"));
    }
}

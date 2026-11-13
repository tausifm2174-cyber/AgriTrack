package com.agritrack.controller;

import com.agritrack.dto.ApiResponse;
import com.agritrack.dto.ExpenseRequest;
import com.agritrack.dto.ExpenseResponse;
import com.agritrack.dto.ExpenseSummaryResponse;
import com.agritrack.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * REST Controller for operational Expense management.
 * Provides endpoints for creating, retrieving, filtering, updating, and deleting
 * farm-level, field-level, and crop-cycle-level expenditures.
 */
@RestController
@RequestMapping("/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ExpenseResponse>> createExpense(
            @Valid @RequestBody ExpenseRequest request,
            Authentication authentication) {
        ExpenseResponse response = expenseService.createExpense(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Expense created successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ExpenseResponse>>> getExpenses(
            @RequestParam(required = false) Long farmId,
            @RequestParam(required = false) Long fieldId,
            @RequestParam(required = false) Long cropCycleId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String paymentStatus,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Authentication authentication) {
        List<ExpenseResponse> expenses = expenseService.getFilteredExpenses(
                farmId, fieldId, cropCycleId, category, paymentStatus, startDate, endDate, authentication.getName()
        );
        return ResponseEntity.ok(ApiResponse.success(expenses, "Expenses retrieved successfully"));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<ExpenseSummaryResponse>> getExpenseSummary(
            @RequestParam(required = false) Long farmId,
            @RequestParam(required = false) Long cropCycleId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Authentication authentication) {
        ExpenseSummaryResponse summary = expenseService.getExpenseSummary(
                farmId, cropCycleId, startDate, endDate, authentication.getName()
        );
        return ResponseEntity.ok(ApiResponse.success(summary, "Expense summary retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ExpenseResponse>> getExpenseById(
            @PathVariable Long id,
            Authentication authentication) {
        ExpenseResponse response = expenseService.getExpenseById(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(response, "Expense retrieved successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ExpenseResponse>> updateExpense(
            @PathVariable Long id,
            @Valid @RequestBody ExpenseRequest request,
            Authentication authentication) {
        ExpenseResponse response = expenseService.updateExpense(id, request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(response, "Expense updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExpense(
            @PathVariable Long id,
            Authentication authentication) {
        expenseService.deleteExpense(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(null, "Expense deleted successfully"));
    }
}

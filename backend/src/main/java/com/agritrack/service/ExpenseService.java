package com.agritrack.service;

import com.agritrack.dto.ExpenseCategorySummary;
import com.agritrack.dto.ExpenseRequest;
import com.agritrack.dto.ExpenseResponse;
import com.agritrack.dto.ExpenseSummaryResponse;
import com.agritrack.entity.*;
import com.agritrack.exception.ResourceNotFoundException;
import com.agritrack.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service managing farm operational expenditures.
 * Enforces multi-tenant ownership via Farm -> User hierarchy, cross-entity relational consistency,
 * canonical category and payment normalization, and authoritative summary aggregations.
 */
@Service
public class ExpenseService {

    public static final List<String> CANONICAL_CATEGORIES = List.of(
            "Seeds",
            "Fertilizer",
            "Pesticides",
            "Irrigation",
            "Labour",
            "Machinery",
            "Fuel",
            "Transport",
            "Soil Testing",
            "Other"
    );

    public static final List<String> CANONICAL_PAYMENT_METHODS = List.of(
            "CASH",
            "UPI",
            "BANK_TRANSFER",
            "CHEQUE"
    );

    public static final List<String> CANONICAL_PAYMENT_STATUSES = List.of(
            "PAID",
            "PENDING"
    );

    private final ExpenseRepository expenseRepository;
    private final FarmRepository farmRepository;
    private final FieldRepository fieldRepository;
    private final CropCycleRepository cropCycleRepository;
    private final UserRepository userRepository;

    public ExpenseService(ExpenseRepository expenseRepository,
                          FarmRepository farmRepository,
                          FieldRepository fieldRepository,
                          CropCycleRepository cropCycleRepository,
                          UserRepository userRepository) {
        this.expenseRepository = expenseRepository;
        this.farmRepository = farmRepository;
        this.fieldRepository = fieldRepository;
        this.cropCycleRepository = cropCycleRepository;
        this.userRepository = userRepository;
    }

    private User getUserByEmail(String userEmail) {
        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));
    }

    public String normalizeCategory(String input) {
        if (input == null || input.isBlank()) {
            throw new IllegalArgumentException("Category is required");
        }
        String trimmed = input.trim();
        for (String canonical : CANONICAL_CATEGORIES) {
            if (canonical.equalsIgnoreCase(trimmed)) {
                return canonical;
            }
        }
        throw new IllegalArgumentException("Invalid category: " + input + ". Allowed: " + CANONICAL_CATEGORIES);
    }

    public String normalizePaymentMethod(String input) {
        if (input == null || input.isBlank()) {
            return null;
        }
        String trimmed = input.trim().toUpperCase().replace(" ", "_");
        for (String canonical : CANONICAL_PAYMENT_METHODS) {
            if (canonical.equals(trimmed)) {
                return canonical;
            }
        }
        throw new IllegalArgumentException("Invalid paymentMethod: " + input + ". Allowed: " + CANONICAL_PAYMENT_METHODS);
    }

    public String normalizePaymentStatus(String input) {
        if (input == null || input.isBlank()) {
            return "PAID";
        }
        String trimmed = input.trim().toUpperCase();
        for (String canonical : CANONICAL_PAYMENT_STATUSES) {
            if (canonical.equals(trimmed)) {
                return canonical;
            }
        }
        throw new IllegalArgumentException("Invalid paymentStatus: " + input + ". Allowed: " + CANONICAL_PAYMENT_STATUSES);
    }

    private void validateExpenseData(ExpenseRequest request) {
        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }
        if (request.getExpenseDate() == null) {
            throw new IllegalArgumentException("Expense date is required");
        }
        if (request.getExpenseDate().isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("Expense date cannot be in the future");
        }
        if (request.getDescription() == null || request.getDescription().isBlank()) {
            throw new IllegalArgumentException("Description is required");
        }
        if (request.getDescription().length() > 255) {
            throw new IllegalArgumentException("Description must not exceed 255 characters");
        }
        if (request.getVendorName() != null && request.getVendorName().length() > 150) {
            throw new IllegalArgumentException("Vendor name must not exceed 150 characters");
        }
        if (request.getReceiptNumber() != null && request.getReceiptNumber().length() > 100) {
            throw new IllegalArgumentException("Receipt number must not exceed 100 characters");
        }
    }

    private ResolvedEntities resolveAndValidateEntities(Long farmId, Long fieldId, Long cropCycleId, Long userId) {
        if (farmId == null) {
            throw new IllegalArgumentException("farmId is required");
        }
        Farm farm = farmRepository.findByIdAndUserId(farmId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Farm not found with id: " + farmId));

        Field field = null;
        if (fieldId != null) {
            field = fieldRepository.findByIdAndFarmUserId(fieldId, userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Field not found with id: " + fieldId));
            if (!field.getFarm().getId().equals(farm.getId())) {
                throw new IllegalArgumentException("Field with id " + fieldId + " does not belong to farm " + farm.getId());
            }
        }

        CropCycle cropCycle = null;
        if (cropCycleId != null) {
            cropCycle = cropCycleRepository.findByIdAndFieldFarmUserId(cropCycleId, userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Crop cycle not found with id: " + cropCycleId));

            if (!cropCycle.getField().getFarm().getId().equals(farm.getId())) {
                throw new IllegalArgumentException("Crop cycle with id " + cropCycleId + " does not belong to farm " + farm.getId());
            }

            if (field != null && !cropCycle.getField().getId().equals(field.getId())) {
                throw new IllegalArgumentException("Crop cycle with id " + cropCycleId + " does not belong to field " + field.getId());
            }

            if (field == null) {
                field = cropCycle.getField();
            }
        }

        return new ResolvedEntities(farm, field, cropCycle);
    }

    private static class ResolvedEntities {
        final Farm farm;
        final Field field;
        final CropCycle cropCycle;

        ResolvedEntities(Farm farm, Field field, CropCycle cropCycle) {
            this.farm = farm;
            this.field = field;
            this.cropCycle = cropCycle;
        }
    }

    @Transactional
    public ExpenseResponse createExpense(ExpenseRequest request, String userEmail) {
        User user = getUserByEmail(userEmail);
        validateExpenseData(request);

        ResolvedEntities entities = resolveAndValidateEntities(
                request.getFarmId(), request.getFieldId(), request.getCropCycleId(), user.getId());

        String canonicalCategory = normalizeCategory(request.getCategory());
        String canonicalMethod = normalizePaymentMethod(request.getPaymentMethod());
        String canonicalStatus = normalizePaymentStatus(request.getPaymentStatus());

        Expense expense = new Expense(
                entities.farm,
                entities.field,
                entities.cropCycle,
                canonicalCategory,
                request.getDescription().trim(),
                request.getAmount().setScale(2, RoundingMode.HALF_UP),
                request.getExpenseDate(),
                request.getVendorName() != null ? request.getVendorName().trim() : null,
                canonicalMethod,
                canonicalStatus,
                request.getReceiptNumber() != null ? request.getReceiptNumber().trim() : null,
                request.getNotes() != null ? request.getNotes().trim() : null
        );

        Expense saved = expenseRepository.save(expense);
        return ExpenseResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public ExpenseResponse getExpenseById(Long id, String userEmail) {
        User user = getUserByEmail(userEmail);
        Expense expense = expenseRepository.findByIdAndFarmUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));
        return ExpenseResponse.fromEntity(expense);
    }

    @Transactional(readOnly = true)
    public List<ExpenseResponse> getFilteredExpenses(Long farmId, Long fieldId, Long cropCycleId,
                                                    String category, String paymentStatus,
                                                    LocalDate startDate, LocalDate endDate,
                                                    String userEmail) {
        User user = getUserByEmail(userEmail);

        if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("startDate cannot be after endDate");
        }

        if (farmId != null && !farmRepository.existsByIdAndUserId(farmId, user.getId())) {
            throw new ResourceNotFoundException("Farm not found with id: " + farmId);
        }

        String normCategory = (category != null && !category.isBlank()) ? category.trim() : null;
        String normStatus = (paymentStatus != null && !paymentStatus.isBlank()) ? paymentStatus.trim() : null;

        return expenseRepository.findFilteredExpenses(
                user.getId(), farmId, fieldId, cropCycleId, normCategory, normStatus, startDate, endDate
        ).stream().map(ExpenseResponse::fromEntity).collect(Collectors.toList());
    }

    @Transactional
    public ExpenseResponse updateExpense(Long id, ExpenseRequest request, String userEmail) {
        User user = getUserByEmail(userEmail);
        Expense expense = expenseRepository.findByIdAndFarmUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));

        validateExpenseData(request);
        ResolvedEntities entities = resolveAndValidateEntities(
                request.getFarmId(), request.getFieldId(), request.getCropCycleId(), user.getId());

        String canonicalCategory = normalizeCategory(request.getCategory());
        String canonicalMethod = normalizePaymentMethod(request.getPaymentMethod());
        String canonicalStatus = normalizePaymentStatus(request.getPaymentStatus());

        expense.setFarm(entities.farm);
        expense.setField(entities.field);
        expense.setCropCycle(entities.cropCycle);
        expense.setCategory(canonicalCategory);
        expense.setDescription(request.getDescription().trim());
        expense.setAmount(request.getAmount().setScale(2, RoundingMode.HALF_UP));
        expense.setExpenseDate(request.getExpenseDate());
        expense.setVendorName(request.getVendorName() != null ? request.getVendorName().trim() : null);
        expense.setPaymentMethod(canonicalMethod);
        expense.setPaymentStatus(canonicalStatus);
        expense.setReceiptNumber(request.getReceiptNumber() != null ? request.getReceiptNumber().trim() : null);
        expense.setNotes(request.getNotes() != null ? request.getNotes().trim() : null);

        Expense updated = expenseRepository.save(expense);
        return ExpenseResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteExpense(Long id, String userEmail) {
        User user = getUserByEmail(userEmail);
        Expense expense = expenseRepository.findByIdAndFarmUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));
        expenseRepository.delete(expense);
    }

    @Transactional(readOnly = true)
    public ExpenseSummaryResponse getExpenseSummary(Long farmId, Long cropCycleId,
                                                    LocalDate startDate, LocalDate endDate,
                                                    String userEmail) {
        User user = getUserByEmail(userEmail);

        if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("startDate cannot be after endDate");
        }

        if (farmId != null && !farmRepository.existsByIdAndUserId(farmId, user.getId())) {
            throw new ResourceNotFoundException("Farm not found with id: " + farmId);
        }

        if (cropCycleId != null && !cropCycleRepository.existsByIdAndFieldFarmUserId(cropCycleId, user.getId())) {
            throw new ResourceNotFoundException("Crop cycle not found with id: " + cropCycleId);
        }

        BigDecimal totalAmount = expenseRepository.sumExpensesByUserAndFilters(
                user.getId(), farmId, cropCycleId, startDate, endDate
        );
        if (totalAmount == null) {
            totalAmount = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        } else {
            totalAmount = totalAmount.setScale(2, RoundingMode.HALF_UP);
        }

        long totalCount = expenseRepository.countExpensesByUserAndFilters(
                user.getId(), farmId, cropCycleId, startDate, endDate
        );

        // Category breakdown
        Map<String, BigDecimal> categorySums = new HashMap<>();
        List<Object[]> categoryResults = expenseRepository.sumExpensesByCategory(
                user.getId(), farmId, cropCycleId, startDate, endDate
        );
        for (Object[] row : categoryResults) {
            String cat = (String) row[0];
            BigDecimal sum = (BigDecimal) row[1];
            if (cat != null && sum != null) {
                categorySums.put(cat.toLowerCase(), sum);
            }
        }

        List<ExpenseCategorySummary> categoryBreakdown = new ArrayList<>();
        for (String canonical : CANONICAL_CATEGORIES) {
            BigDecimal catTotal = categorySums.getOrDefault(canonical.toLowerCase(), BigDecimal.ZERO).setScale(2, RoundingMode.HALF_UP);
            BigDecimal percentage = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
            if (totalAmount.compareTo(BigDecimal.ZERO) > 0) {
                percentage = catTotal.multiply(BigDecimal.valueOf(100))
                        .divide(totalAmount, 2, RoundingMode.HALF_UP);
            }
            categoryBreakdown.add(new ExpenseCategorySummary(canonical, catTotal, percentage));
        }

        // Payment status breakdown
        Map<String, BigDecimal> paymentStatusBreakdown = new LinkedHashMap<>();
        paymentStatusBreakdown.put("PAID", BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP));
        paymentStatusBreakdown.put("PENDING", BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP));

        List<Object[]> statusResults = expenseRepository.sumExpensesByPaymentStatus(
                user.getId(), farmId, cropCycleId, startDate, endDate
        );
        for (Object[] row : statusResults) {
            String status = (String) row[0];
            BigDecimal sum = (BigDecimal) row[1];
            if (status != null && sum != null) {
                paymentStatusBreakdown.put(status.toUpperCase(), sum.setScale(2, RoundingMode.HALF_UP));
            }
        }

        return new ExpenseSummaryResponse(totalAmount, totalCount, categoryBreakdown, paymentStatusBreakdown);
    }
}

package com.agritrack;

import com.agritrack.dto.ExpenseCategorySummary;
import com.agritrack.dto.ExpenseRequest;
import com.agritrack.dto.ExpenseResponse;
import com.agritrack.dto.ExpenseSummaryResponse;
import com.agritrack.entity.*;
import com.agritrack.exception.ResourceNotFoundException;
import com.agritrack.repository.*;
import com.agritrack.service.ExpenseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ExpenseService Unit Tests")
class ExpenseServiceTest {

    @Mock
    private ExpenseRepository expenseRepository;

    @Mock
    private FarmRepository farmRepository;

    @Mock
    private FieldRepository fieldRepository;

    @Mock
    private CropCycleRepository cropCycleRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ExpenseService expenseService;

    private User testUser;
    private Farm testFarm;
    private Field testField;
    private CropCycle testCycle;
    private Expense testExpense;

    @BeforeEach
    void setUp() {
        testUser = new User("Ramesh Kumar", "ramesh@example.com", "9876543210", "pwd_hash", Role.FARMER);
        testUser.setId(10L);

        testFarm = new Farm(testUser, "Green Valley Farm", "Karnal", new BigDecimal("45.50"), "Acres", "Main plot", "Active");
        testFarm.setId(100L);

        testField = new Field(testFarm, "North Field - Sector A", new BigDecimal("12.50"), "Acres", "Alluvial", "Drip", "Active", "Vegetative phase");
        testField.setId(500L);

        testCycle = new CropCycle(
                testField, "Wheat", "HD-2967", "Rabi",
                LocalDate.of(2026, 11, 1), LocalDate.of(2027, 4, 15), null,
                "Sowing", 1, 10, "Active", "Optimal"
        );
        testCycle.setId(900L);

        testExpense = new Expense(
                testFarm, testField, testCycle, "Seeds",
                "Certified wheat seed purchase", new BigDecimal("5400.00"),
                LocalDate.of(2026, 11, 2), "National Seeds Corp", "UPI", "PAID",
                "VOUCH-2026-0112", "Foundation seed"
        );
        testExpense.setId(1L);
    }

    @Test
    @DisplayName("Should create farm-level expense successfully")
    void shouldCreateFarmLevelExpense() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(farmRepository.findByIdAndUserId(100L, 10L)).thenReturn(Optional.of(testFarm));
        when(expenseRepository.save(any(Expense.class))).thenAnswer(invocation -> {
            Expense e = invocation.getArgument(0);
            e.setId(2L);
            return e;
        });

        ExpenseRequest request = new ExpenseRequest();
        request.setFarmId(100L);
        request.setCategory("Fuel");
        request.setDescription("Diesel for tractor general transport");
        request.setAmount(new BigDecimal("3500.00"));
        request.setExpenseDate(LocalDate.now());
        request.setPaymentMethod("CASH");
        request.setPaymentStatus("PAID");

        ExpenseResponse response = expenseService.createExpense(request, "ramesh@example.com");

        assertThat(response).isNotNull();
        assertThat(response.getFarmId()).isEqualTo(100L);
        assertThat(response.getFieldId()).isNull();
        assertThat(response.getCropCycleId()).isNull();
        assertThat(response.getCategory()).isEqualTo("Fuel");
        assertThat(response.getAmount()).isEqualByComparingTo("3500.00");
    }

    @Test
    @DisplayName("Should create field-linked expense successfully")
    void shouldCreateFieldLinkedExpense() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(farmRepository.findByIdAndUserId(100L, 10L)).thenReturn(Optional.of(testFarm));
        when(fieldRepository.findByIdAndFarmUserId(500L, 10L)).thenReturn(Optional.of(testField));
        when(expenseRepository.save(any(Expense.class))).thenAnswer(invocation -> {
            Expense e = invocation.getArgument(0);
            e.setId(3L);
            return e;
        });

        ExpenseRequest request = new ExpenseRequest();
        request.setFarmId(100L);
        request.setFieldId(500L);
        request.setCategory("Irrigation");
        request.setDescription("Drip line maintenance");
        request.setAmount(new BigDecimal("1800.00"));
        request.setExpenseDate(LocalDate.now());

        ExpenseResponse response = expenseService.createExpense(request, "ramesh@example.com");

        assertThat(response).isNotNull();
        assertThat(response.getFieldId()).isEqualTo(500L);
        assertThat(response.getCategory()).isEqualTo("Irrigation");
    }

    @Test
    @DisplayName("Should create crop-cycle-linked expense successfully")
    void shouldCreateCropCycleLinkedExpense() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(farmRepository.findByIdAndUserId(100L, 10L)).thenReturn(Optional.of(testFarm));
        when(fieldRepository.findByIdAndFarmUserId(500L, 10L)).thenReturn(Optional.of(testField));
        when(cropCycleRepository.findByIdAndFieldFarmUserId(900L, 10L)).thenReturn(Optional.of(testCycle));
        when(expenseRepository.save(any(Expense.class))).thenReturn(testExpense);

        ExpenseRequest request = new ExpenseRequest();
        request.setFarmId(100L);
        request.setFieldId(500L);
        request.setCropCycleId(900L);
        request.setCategory("Seeds");
        request.setDescription("Certified wheat seed purchase");
        request.setAmount(new BigDecimal("5400.00"));
        request.setExpenseDate(LocalDate.of(2026, 11, 2));

        ExpenseResponse response = expenseService.createExpense(request, "ramesh@example.com");

        assertThat(response).isNotNull();
        assertThat(response.getCropCycleId()).isEqualTo(900L);
        assertThat(response.getCropName()).isEqualTo("Wheat");
    }

    @Test
    @DisplayName("Should normalize valid canonical categories case-insensitively")
    void shouldNormalizeValidCategories() {
        assertThat(expenseService.normalizeCategory("seeds")).isEqualTo("Seeds");
        assertThat(expenseService.normalizeCategory("FERTILIZER")).isEqualTo("Fertilizer");
        assertThat(expenseService.normalizeCategory("pesticides")).isEqualTo("Pesticides");
        assertThat(expenseService.normalizeCategory("labour")).isEqualTo("Labour");
        assertThat(expenseService.normalizeCategory("Labour")).isEqualTo("Labour");
        assertThat(expenseService.normalizeCategory("Soil Testing")).isEqualTo("Soil Testing");
        assertThat(expenseService.normalizeCategory("MACHINERY")).isEqualTo("Machinery");
        assertThat(expenseService.normalizeCategory("fuel")).isEqualTo("Fuel");
        assertThat(expenseService.normalizeCategory("transport")).isEqualTo("Transport");
        assertThat(expenseService.normalizeCategory("Other")).isEqualTo("Other");
    }

    @Test
    @DisplayName("Should reject invalid category or unapproved alias with IllegalArgumentException")
    void shouldRejectInvalidCategory() {
        assertThatThrownBy(() -> expenseService.normalizeCategory("Entertainment"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid category");

        assertThatThrownBy(() -> expenseService.normalizeCategory("labor"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid category");

        assertThatThrownBy(() -> expenseService.normalizeCategory("fertilizers"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid category");
    }

    @Test
    @DisplayName("Should reject zero and negative amounts")
    void shouldRejectZeroAndNegativeAmounts() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));

        ExpenseRequest zeroRequest = new ExpenseRequest();
        zeroRequest.setFarmId(100L);
        zeroRequest.setCategory("Fuel");
        zeroRequest.setDescription("Diesel");
        zeroRequest.setAmount(BigDecimal.ZERO);
        zeroRequest.setExpenseDate(LocalDate.now());

        assertThatThrownBy(() -> expenseService.createExpense(zeroRequest, "ramesh@example.com"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Amount must be greater than zero");

        zeroRequest.setAmount(new BigDecimal("-100.00"));
        assertThatThrownBy(() -> expenseService.createExpense(zeroRequest, "ramesh@example.com"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Amount must be greater than zero");
    }

    @Test
    @DisplayName("Should reject future expense dates")
    void shouldRejectFutureExpenseDates() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));

        ExpenseRequest futureRequest = new ExpenseRequest();
        futureRequest.setFarmId(100L);
        futureRequest.setCategory("Fuel");
        futureRequest.setDescription("Diesel");
        futureRequest.setAmount(new BigDecimal("1000.00"));
        futureRequest.setExpenseDate(LocalDate.now().plusDays(2));

        assertThatThrownBy(() -> expenseService.createExpense(futureRequest, "ramesh@example.com"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Expense date cannot be in the future");
    }

    @Test
    @DisplayName("Should reject invalid payment method")
    void shouldRejectInvalidPaymentMethod() {
        assertThatThrownBy(() -> expenseService.normalizePaymentMethod("BITCOIN"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid paymentMethod");
    }

    @Test
    @DisplayName("Should reject invalid payment status")
    void shouldRejectInvalidPaymentStatus() {
        assertThatThrownBy(() -> expenseService.normalizePaymentStatus("REFUNDED"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid paymentStatus");
    }

    @Test
    @DisplayName("Should reject when farm does not belong to authenticated user")
    void shouldRejectUnauthorizedFarm() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(farmRepository.findByIdAndUserId(999L, 10L)).thenReturn(Optional.empty());

        ExpenseRequest request = new ExpenseRequest();
        request.setFarmId(999L);
        request.setCategory("Seeds");
        request.setDescription("Unauthorized seeds");
        request.setAmount(new BigDecimal("500.00"));
        request.setExpenseDate(LocalDate.now());

        assertThatThrownBy(() -> expenseService.createExpense(request, "ramesh@example.com"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Farm not found");
    }

    @Test
    @DisplayName("Should reject field-farm mismatch")
    void shouldRejectFieldFarmMismatch() {
        Farm otherFarm = new Farm(testUser, "Other Farm", "Rohtak", new BigDecimal("20.00"), "Acres", null, "Active");
        otherFarm.setId(200L);

        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(farmRepository.findByIdAndUserId(200L, 10L)).thenReturn(Optional.of(otherFarm));
        when(fieldRepository.findByIdAndFarmUserId(500L, 10L)).thenReturn(Optional.of(testField)); // testField belongs to 100L

        ExpenseRequest request = new ExpenseRequest();
        request.setFarmId(200L);
        request.setFieldId(500L);
        request.setCategory("Labour");
        request.setDescription("Labor mismatch");
        request.setAmount(new BigDecimal("1000.00"));
        request.setExpenseDate(LocalDate.now());

        assertThatThrownBy(() -> expenseService.createExpense(request, "ramesh@example.com"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("does not belong to farm");
    }

    @Test
    @DisplayName("Should reject crop-cycle-field mismatch")
    void shouldRejectCropCycleFieldMismatch() {
        Field otherField = new Field(testFarm, "South Field", new BigDecimal("10.00"), "Acres", "Clay", "Flood", "Active", null);
        otherField.setId(501L);

        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(farmRepository.findByIdAndUserId(100L, 10L)).thenReturn(Optional.of(testFarm));
        when(fieldRepository.findByIdAndFarmUserId(501L, 10L)).thenReturn(Optional.of(otherField));
        when(cropCycleRepository.findByIdAndFieldFarmUserId(900L, 10L)).thenReturn(Optional.of(testCycle)); // testCycle belongs to 500L

        ExpenseRequest request = new ExpenseRequest();
        request.setFarmId(100L);
        request.setFieldId(501L);
        request.setCropCycleId(900L);
        request.setCategory("Seeds");
        request.setDescription("Cycle mismatch");
        request.setAmount(new BigDecimal("1000.00"));
        request.setExpenseDate(LocalDate.now());

        assertThatThrownBy(() -> expenseService.createExpense(request, "ramesh@example.com"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("does not belong to field");
    }

    @Test
    @DisplayName("Should update expense successfully")
    void shouldUpdateExpenseSuccessfully() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(expenseRepository.findByIdAndFarmUserId(1L, 10L)).thenReturn(Optional.of(testExpense));
        when(farmRepository.findByIdAndUserId(100L, 10L)).thenReturn(Optional.of(testFarm));
        when(expenseRepository.save(any(Expense.class))).thenReturn(testExpense);

        ExpenseRequest request = new ExpenseRequest();
        request.setFarmId(100L);
        request.setCategory("Fuel");
        request.setDescription("Updated diesel bill");
        request.setAmount(new BigDecimal("4200.00"));
        request.setExpenseDate(LocalDate.of(2026, 11, 3));
        request.setPaymentMethod("UPI");
        request.setPaymentStatus("PAID");

        ExpenseResponse response = expenseService.updateExpense(1L, request, "ramesh@example.com");

        assertThat(response).isNotNull();
        assertThat(testExpense.getAmount()).isEqualByComparingTo("4200.00");
        assertThat(testExpense.getCategory()).isEqualTo("Fuel");
    }

    @Test
    @DisplayName("Should delete expense successfully")
    void shouldDeleteExpenseSuccessfully() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(expenseRepository.findByIdAndFarmUserId(1L, 10L)).thenReturn(Optional.of(testExpense));
        doNothing().when(expenseRepository).delete(testExpense);

        expenseService.deleteExpense(1L, "ramesh@example.com");

        verify(expenseRepository, times(1)).delete(testExpense);
    }

    @Test
    @DisplayName("Should filter expenses and reject invalid date ranges")
    void shouldFilterExpensesAndRejectInvalidDateRanges() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(farmRepository.existsByIdAndUserId(100L, 10L)).thenReturn(true);
        when(expenseRepository.findFilteredExpenses(
                eq(10L), eq(100L), isNull(), isNull(), eq("Seeds"), isNull(), any(LocalDate.class), any(LocalDate.class)
        )).thenReturn(List.of(testExpense));

        List<ExpenseResponse> results = expenseService.getFilteredExpenses(
                100L, null, null, "Seeds", null, LocalDate.of(2026, 1, 1), LocalDate.of(2026, 12, 31), "ramesh@example.com"
        );

        assertThat(results).hasSize(1);

        assertThatThrownBy(() -> expenseService.getFilteredExpenses(
                100L, null, null, null, null, LocalDate.of(2026, 12, 31), LocalDate.of(2026, 1, 1), "ramesh@example.com"
        )).isInstanceOf(IllegalArgumentException.class).hasMessageContaining("startDate cannot be after endDate");
    }

    @Test
    @DisplayName("Should aggregate expense summary correctly")
    void shouldAggregateExpenseSummaryCorrectly() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(expenseRepository.sumExpensesByUserAndFilters(eq(10L), isNull(), isNull(), isNull(), isNull()))
                .thenReturn(new BigDecimal("10000.00"));
        when(expenseRepository.countExpensesByUserAndFilters(eq(10L), isNull(), isNull(), isNull(), isNull()))
                .thenReturn(2L);

        List<Object[]> categoryRows = List.of(
                new Object[]{"Seeds", new BigDecimal("6000.00")},
                new Object[]{"Fertilizer", new BigDecimal("4000.00")}
        );
        when(expenseRepository.sumExpensesByCategory(eq(10L), isNull(), isNull(), isNull(), isNull()))
                .thenReturn(categoryRows);

        List<Object[]> statusRows = List.of(
                new Object[]{"PAID", new BigDecimal("8000.00")},
                new Object[]{"PENDING", new BigDecimal("2000.00")}
        );
        when(expenseRepository.sumExpensesByPaymentStatus(eq(10L), isNull(), isNull(), isNull(), isNull()))
                .thenReturn(statusRows);

        ExpenseSummaryResponse summary = expenseService.getExpenseSummary(null, null, null, null, "ramesh@example.com");

        assertThat(summary.getTotalExpenseAmount()).isEqualByComparingTo("10000.00");
        assertThat(summary.getTotalExpenseCount()).isEqualTo(2L);
        assertThat(summary.getCategoryBreakdown()).hasSize(10);

        ExpenseCategorySummary seedsCat = summary.getCategoryBreakdown().stream()
                .filter(c -> c.getCategory().equals("Seeds")).findFirst().orElseThrow();
        assertThat(seedsCat.getTotalAmount()).isEqualByComparingTo("6000.00");
        assertThat(seedsCat.getPercentageOfExpenses()).isEqualByComparingTo("60.00");

        ExpenseCategorySummary fertCat = summary.getCategoryBreakdown().stream()
                .filter(c -> c.getCategory().equals("Fertilizer")).findFirst().orElseThrow();
        assertThat(fertCat.getTotalAmount()).isEqualByComparingTo("4000.00");
        assertThat(fertCat.getPercentageOfExpenses()).isEqualByComparingTo("40.00");

        assertThat(summary.getPaymentStatusBreakdown().get("PAID")).isEqualByComparingTo("8000.00");
        assertThat(summary.getPaymentStatusBreakdown().get("PENDING")).isEqualByComparingTo("2000.00");
    }
}

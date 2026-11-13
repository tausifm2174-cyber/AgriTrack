package com.agritrack;

import com.agritrack.dto.*;
import com.agritrack.entity.*;
import com.agritrack.exception.ResourceNotFoundException;
import com.agritrack.repository.*;
import com.agritrack.service.FinancialAnalyticsService;
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
@DisplayName("FinancialAnalyticsService Unit Tests")
class FinancialAnalyticsServiceTest {

    @Mock
    private SaleRepository saleRepository;

    @Mock
    private ExpenseRepository expenseRepository;

    @Mock
    private HarvestRepository harvestRepository;

    @Mock
    private FarmRepository farmRepository;

    @Mock
    private CropCycleRepository cropCycleRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private FinancialAnalyticsService analyticsService;

    private User testUser;
    private Farm testFarm;
    private Field testField;
    private CropCycle testCycle;

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
    }

    @Test
    @DisplayName("Should calculate margin correctly under various revenue and expense scenarios")
    void shouldCalculateMarginCorrectly() {
        // Positive margin: Revenue 100,000, Expenses 40,000 -> Net 60,000 -> Margin 60.00%
        BigDecimal margin1 = analyticsService.calculateMargin(new BigDecimal("100000.00"), new BigDecimal("40000.00"));
        assertThat(margin1).isEqualByComparingTo("60.00");

        // Zero revenue, zero expenses -> Margin 0.00%
        BigDecimal margin2 = analyticsService.calculateMargin(BigDecimal.ZERO, BigDecimal.ZERO);
        assertThat(margin2).isEqualByComparingTo("0.00");

        // Zero revenue, positive expenses -> Margin -100.00%
        BigDecimal margin3 = analyticsService.calculateMargin(BigDecimal.ZERO, new BigDecimal("25000.00"));
        assertThat(margin3).isEqualByComparingTo("-100.00");

        // Negative margin (loss): Revenue 50,000, Expenses 80,000 -> Net -30,000 -> Margin -60.00%
        BigDecimal margin4 = analyticsService.calculateMargin(new BigDecimal("50000.00"), new BigDecimal("80000.00"));
        assertThat(margin4).isEqualByComparingTo("-60.00");
    }

    @Test
    @DisplayName("Should aggregate overall Profit & Loss correctly")
    void shouldAggregateOverallProfitAndLoss() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(saleRepository.sumRevenueByUserAndFilters(eq(10L), isNull(), isNull(), isNull(), isNull()))
                .thenReturn(new BigDecimal("150000.00"));
        when(expenseRepository.sumExpensesByUserAndFilters(eq(10L), isNull(), isNull(), isNull(), isNull()))
                .thenReturn(new BigDecimal("90000.00"));

        when(cropCycleRepository.findAllByFieldFarmUserId(10L)).thenReturn(List.of(testCycle));
        when(farmRepository.findAllByUserId(10L)).thenReturn(List.of(testFarm));

        // Sub-aggregations
        List<Object[]> revByCrop = Collections.singletonList(new Object[]{900L, new BigDecimal("150000.00")});
        when(saleRepository.sumRevenueByCropCycle(eq(10L), isNull(), isNull(), isNull()))
                .thenReturn(revByCrop);

        List<Object[]> expByCrop = Collections.singletonList(new Object[]{900L, new BigDecimal("90000.00")});
        when(expenseRepository.sumExpensesByCropCycle(eq(10L), isNull(), isNull(), isNull()))
                .thenReturn(expByCrop);

        List<Object[]> yieldByCrop = Collections.singletonList(new Object[]{900L, new BigDecimal("5000.00")}); // 5000 kg = 50 quintals
        when(harvestRepository.sumHarvestedQuantityByCropCycle(eq(10L), isNull()))
                .thenReturn(yieldByCrop);

        List<Object[]> revByFarm = Collections.singletonList(new Object[]{100L, new BigDecimal("150000.00")});
        when(saleRepository.sumRevenueByFarm(eq(10L), isNull(), isNull()))
                .thenReturn(revByFarm);

        List<Object[]> expByFarm = Collections.singletonList(new Object[]{100L, new BigDecimal("90000.00")});
        when(expenseRepository.sumExpensesByFarm(eq(10L), isNull(), isNull()))
                .thenReturn(expByFarm);

        List<Object[]> catRows = Collections.singletonList(new Object[]{"Seeds", new BigDecimal("30000.00")});
        when(expenseRepository.sumExpensesByCategory(eq(10L), isNull(), isNull(), isNull(), isNull()))
                .thenReturn(catRows);

        List<Object[]> monthlyRev = Collections.singletonList(new Object[]{2026, 11, new BigDecimal("150000.00")});
        when(saleRepository.sumMonthlyRevenue(eq(10L), isNull(), isNull(), isNull(), isNull()))
                .thenReturn(monthlyRev);

        List<Object[]> monthlyExp = Collections.singletonList(new Object[]{2026, 11, new BigDecimal("90000.00")});
        when(expenseRepository.sumMonthlyExpenses(eq(10L), isNull(), isNull(), isNull(), isNull()))
                .thenReturn(monthlyExp);

        ProfitLossSummaryResponse pnl = analyticsService.getProfitLossSummary(null, null, null, null, "ramesh@example.com");

        assertThat(pnl).isNotNull();
        assertThat(pnl.getTotalRevenue()).isEqualByComparingTo("150000.00");
        assertThat(pnl.getTotalExpenses()).isEqualByComparingTo("90000.00");
        assertThat(pnl.getNetProfit()).isEqualByComparingTo("60000.00");
        assertThat(pnl.getProfitMarginPercent()).isEqualByComparingTo("40.00");

        // Crop verification
        assertThat(pnl.getCropSummaries()).hasSize(1);
        CropFinancialSummary crop = pnl.getCropSummaries().get(0);
        assertThat(crop.getCropName()).isEqualTo("Wheat");
        assertThat(crop.getRevenue()).isEqualByComparingTo("150000.00");
        assertThat(crop.getExpenses()).isEqualByComparingTo("90000.00");
        assertThat(crop.getNetProfit()).isEqualByComparingTo("60000.00");
        assertThat(crop.getNetMarginPercent()).isEqualByComparingTo("40.00");
        assertThat(crop.getHarvestYieldKg()).isEqualByComparingTo("5000.00");
        // Cost per quintal = 90000 / (5000 / 100) = 90000 / 50 = 1800.00
        assertThat(crop.getCostPerQuintal()).isEqualByComparingTo("1800.00");

        // Farm verification
        assertThat(pnl.getFarmSummaries()).hasSize(1);
        FarmFinancialSummary farm = pnl.getFarmSummaries().get(0);
        assertThat(farm.getFarmName()).isEqualTo("Green Valley Farm");
        assertThat(farm.getNetProfit()).isEqualByComparingTo("60000.00");

        // Monthly trends
        assertThat(pnl.getMonthlyTrends()).hasSize(1);
        MonthlyFinancialSummary trend = pnl.getMonthlyTrends().get(0);
        assertThat(trend.getMonthLabel()).isEqualTo("2026-11");
        assertThat(trend.getNetProfit()).isEqualByComparingTo("60000.00");
    }

    @Test
    @DisplayName("Should protect against division by zero when crop harvest yield is zero")
    void shouldProtectAgainstDivisionByZeroOnZeroYield() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(cropCycleRepository.findAllByFieldFarmUserId(10L)).thenReturn(List.of(testCycle));
        when(farmRepository.findAllByUserId(10L)).thenReturn(List.of(testFarm));

        List<Object[]> expByCrop = Collections.singletonList(new Object[]{900L, new BigDecimal("20000.00")});
        when(expenseRepository.sumExpensesByCropCycle(eq(10L), isNull(), isNull(), isNull()))
                .thenReturn(expByCrop);
        List<Object[]> emptyYield = List.of();
        when(harvestRepository.sumHarvestedQuantityByCropCycle(eq(10L), isNull()))
                .thenReturn(emptyYield); // No harvests recorded -> yield = 0

        ProfitLossSummaryResponse pnl = analyticsService.getProfitLossSummary(null, null, null, null, "ramesh@example.com");

        CropFinancialSummary crop = pnl.getCropSummaries().get(0);
        assertThat(crop.getHarvestYieldKg()).isEqualByComparingTo("0.00");
        assertThat(crop.getCostPerQuintal()).isEqualByComparingTo("0.00");
    }

    @Test
    @DisplayName("Should reject invalid date ranges in P&L")
    void shouldRejectInvalidDateRangesInPnl() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));

        assertThatThrownBy(() -> analyticsService.getProfitLossSummary(
                null, null, LocalDate.of(2026, 12, 31), LocalDate.of(2026, 1, 1), "ramesh@example.com"
        )).isInstanceOf(IllegalArgumentException.class).hasMessageContaining("startDate cannot be after endDate");
    }

    @Test
    @DisplayName("Should reject nonexistent or unauthorized farm in P&L")
    void shouldRejectUnauthorizedFarmInPnl() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(farmRepository.existsByIdAndUserId(999L, 10L)).thenReturn(false);

        assertThatThrownBy(() -> analyticsService.getProfitLossSummary(
                999L, null, null, null, "ramesh@example.com"
        )).isInstanceOf(ResourceNotFoundException.class).hasMessageContaining("Farm not found");
    }
}

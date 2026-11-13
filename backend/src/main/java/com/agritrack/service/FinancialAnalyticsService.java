package com.agritrack.service;

import com.agritrack.dto.*;
import com.agritrack.entity.CropCycle;
import com.agritrack.entity.Farm;
import com.agritrack.entity.User;
import com.agritrack.exception.ResourceNotFoundException;
import com.agritrack.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;

/**
 * Service orchestrating financial analytics and Profit & Loss (P&L) computations.
 * Correlates commercial sales revenues (from SaleRepository), operational expenditures (from ExpenseRepository),
 * and physical harvest yields (from HarvestRepository) to produce authoritative financial metrics.
 */
@Service
public class FinancialAnalyticsService {

    private final SaleRepository saleRepository;
    private final ExpenseRepository expenseRepository;
    private final HarvestRepository harvestRepository;
    private final FarmRepository farmRepository;
    private final CropCycleRepository cropCycleRepository;
    private final UserRepository userRepository;

    public FinancialAnalyticsService(SaleRepository saleRepository,
                                     ExpenseRepository expenseRepository,
                                     HarvestRepository harvestRepository,
                                     FarmRepository farmRepository,
                                     CropCycleRepository cropCycleRepository,
                                     UserRepository userRepository) {
        this.saleRepository = saleRepository;
        this.expenseRepository = expenseRepository;
        this.harvestRepository = harvestRepository;
        this.farmRepository = farmRepository;
        this.cropCycleRepository = cropCycleRepository;
        this.userRepository = userRepository;
    }

    private User getUserByEmail(String userEmail) {
        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));
    }

    /**
     * Calculates net profit margin percentage using canonical P&L rules:
     * - (Net Profit / Total Revenue) * 100
     * - If Total Revenue == 0:
     *     - if expenses == 0 -> 0.00
     *     - if expenses > 0 -> -100.00
     */
    public BigDecimal calculateMargin(BigDecimal revenue, BigDecimal expenses) {
        if (revenue == null || revenue.compareTo(BigDecimal.ZERO) == 0) {
            if (expenses == null || expenses.compareTo(BigDecimal.ZERO) == 0) {
                return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
            } else {
                return BigDecimal.valueOf(-100.00).setScale(2, RoundingMode.HALF_UP);
            }
        }
        BigDecimal safeExpenses = expenses != null ? expenses : BigDecimal.ZERO;
        BigDecimal netProfit = revenue.subtract(safeExpenses);
        return netProfit.multiply(BigDecimal.valueOf(100))
                .divide(revenue, 2, RoundingMode.HALF_UP);
    }

    @Transactional(readOnly = true)
    public ProfitLossSummaryResponse getProfitLossSummary(Long farmId, Long cropCycleId,
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

        // 1. Overall Revenue & Expenses
        BigDecimal totalRevenue = saleRepository.sumRevenueByUserAndFilters(
                user.getId(), farmId, cropCycleId, startDate, endDate
        );
        totalRevenue = (totalRevenue != null) ? totalRevenue.setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);

        BigDecimal totalExpenses = expenseRepository.sumExpensesByUserAndFilters(
                user.getId(), farmId, cropCycleId, startDate, endDate
        );
        totalExpenses = (totalExpenses != null) ? totalExpenses.setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);

        BigDecimal netProfit = totalRevenue.subtract(totalExpenses).setScale(2, RoundingMode.HALF_UP);
        BigDecimal marginPercent = calculateMargin(totalRevenue, totalExpenses);

        // 2. Crop-wise financial summaries
        List<CropFinancialSummary> cropSummaries = buildCropSummaries(user.getId(), farmId, cropCycleId, startDate, endDate);

        // 3. Farm-wise financial summaries
        List<FarmFinancialSummary> farmSummaries = buildFarmSummaries(user.getId(), farmId, startDate, endDate);

        // 4. Category breakdown
        List<ExpenseCategorySummary> categoryBreakdown = buildCategoryBreakdown(user.getId(), farmId, cropCycleId, startDate, endDate, totalExpenses);

        // 5. Monthly trends
        List<MonthlyFinancialSummary> monthlyTrends = getMonthlyTrend(null, farmId, startDate, endDate, userEmail);

        return new ProfitLossSummaryResponse(
                totalRevenue, totalExpenses, netProfit, marginPercent,
                cropSummaries, farmSummaries, categoryBreakdown, monthlyTrends
        );
    }

    private List<CropFinancialSummary> buildCropSummaries(Long userId, Long farmId, Long cropCycleId,
                                                          LocalDate startDate, LocalDate endDate) {
        List<CropCycle> cycles;
        if (cropCycleId != null) {
            CropCycle cycle = cropCycleRepository.findByIdAndFieldFarmUserId(cropCycleId, userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Crop cycle not found with id: " + cropCycleId));
            cycles = List.of(cycle);
        } else if (farmId != null) {
            cycles = cropCycleRepository.findAllByFieldFarmIdAndFieldFarmUserId(farmId, userId);
        } else {
            cycles = cropCycleRepository.findAllByFieldFarmUserId(userId);
        }

        // Map crop cycle ID -> revenue
        Map<Long, BigDecimal> revenueByCycle = new HashMap<>();
        List<Object[]> revResults = saleRepository.sumRevenueByCropCycle(userId, farmId, startDate, endDate);
        for (Object[] row : revResults) {
            Long cycleId = (Long) row[0];
            BigDecimal sum = (BigDecimal) row[1];
            if (cycleId != null && sum != null) {
                revenueByCycle.put(cycleId, sum.setScale(2, RoundingMode.HALF_UP));
            }
        }

        // Map crop cycle ID -> expenses
        Map<Long, BigDecimal> expensesByCycle = new HashMap<>();
        List<Object[]> expResults = expenseRepository.sumExpensesByCropCycle(userId, farmId, startDate, endDate);
        for (Object[] row : expResults) {
            Long cycleId = (Long) row[0];
            BigDecimal sum = (BigDecimal) row[1];
            if (cycleId != null && sum != null) {
                expensesByCycle.put(cycleId, sum.setScale(2, RoundingMode.HALF_UP));
            }
        }

        // Map crop cycle ID -> harvested quantity kg
        Map<Long, BigDecimal> yieldByCycle = new HashMap<>();
        List<Object[]> yieldResults = harvestRepository.sumHarvestedQuantityByCropCycle(userId, farmId);
        for (Object[] row : yieldResults) {
            Long cycleId = (Long) row[0];
            BigDecimal sum = (BigDecimal) row[1];
            if (cycleId != null && sum != null) {
                yieldByCycle.put(cycleId, sum.setScale(2, RoundingMode.HALF_UP));
            }
        }

        List<CropFinancialSummary> summaries = new ArrayList<>();
        for (CropCycle cycle : cycles) {
            BigDecimal rev = revenueByCycle.getOrDefault(cycle.getId(), BigDecimal.ZERO).setScale(2, RoundingMode.HALF_UP);
            BigDecimal exp = expensesByCycle.getOrDefault(cycle.getId(), BigDecimal.ZERO).setScale(2, RoundingMode.HALF_UP);
            BigDecimal profit = rev.subtract(exp).setScale(2, RoundingMode.HALF_UP);
            BigDecimal margin = calculateMargin(rev, exp);
            BigDecimal yieldKg = yieldByCycle.getOrDefault(cycle.getId(), BigDecimal.ZERO).setScale(2, RoundingMode.HALF_UP);

            BigDecimal costPerQuintal = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
            if (yieldKg.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal quintals = yieldKg.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
                if (quintals.compareTo(BigDecimal.ZERO) > 0) {
                    costPerQuintal = exp.divide(quintals, 2, RoundingMode.HALF_UP);
                }
            }

            summaries.add(new CropFinancialSummary(
                    cycle.getId(),
                    cycle.getCropName(),
                    cycle.getVariety(),
                    cycle.getSeason(),
                    rev,
                    exp,
                    profit,
                    margin,
                    yieldKg,
                    costPerQuintal
            ));
        }

        return summaries;
    }

    private List<FarmFinancialSummary> buildFarmSummaries(Long userId, Long farmId,
                                                          LocalDate startDate, LocalDate endDate) {
        List<Farm> farms;
        if (farmId != null) {
            Farm farm = farmRepository.findByIdAndUserId(farmId, userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Farm not found with id: " + farmId));
            farms = List.of(farm);
        } else {
            farms = farmRepository.findAllByUserId(userId);
        }

        Map<Long, BigDecimal> revByFarm = new HashMap<>();
        List<Object[]> revResults = saleRepository.sumRevenueByFarm(userId, startDate, endDate);
        for (Object[] row : revResults) {
            Long fId = (Long) row[0];
            BigDecimal sum = (BigDecimal) row[1];
            if (fId != null && sum != null) {
                revByFarm.put(fId, sum.setScale(2, RoundingMode.HALF_UP));
            }
        }

        Map<Long, BigDecimal> expByFarm = new HashMap<>();
        List<Object[]> expResults = expenseRepository.sumExpensesByFarm(userId, startDate, endDate);
        for (Object[] row : expResults) {
            Long fId = (Long) row[0];
            BigDecimal sum = (BigDecimal) row[1];
            if (fId != null && sum != null) {
                expByFarm.put(fId, sum.setScale(2, RoundingMode.HALF_UP));
            }
        }

        List<FarmFinancialSummary> summaries = new ArrayList<>();
        for (Farm farm : farms) {
            BigDecimal rev = revByFarm.getOrDefault(farm.getId(), BigDecimal.ZERO).setScale(2, RoundingMode.HALF_UP);
            BigDecimal exp = expByFarm.getOrDefault(farm.getId(), BigDecimal.ZERO).setScale(2, RoundingMode.HALF_UP);
            BigDecimal profit = rev.subtract(exp).setScale(2, RoundingMode.HALF_UP);
            BigDecimal margin = calculateMargin(rev, exp);

            summaries.add(new FarmFinancialSummary(
                    farm.getId(),
                    farm.getFarmName(),
                    rev,
                    exp,
                    profit,
                    margin
            ));
        }

        return summaries;
    }

    private List<ExpenseCategorySummary> buildCategoryBreakdown(Long userId, Long farmId, Long cropCycleId,
                                                                LocalDate startDate, LocalDate endDate,
                                                                BigDecimal totalExpenses) {
        Map<String, BigDecimal> categorySums = new HashMap<>();
        List<Object[]> categoryResults = expenseRepository.sumExpensesByCategory(
                userId, farmId, cropCycleId, startDate, endDate
        );
        for (Object[] row : categoryResults) {
            String cat = (String) row[0];
            BigDecimal sum = (BigDecimal) row[1];
            if (cat != null && sum != null) {
                categorySums.put(cat.toLowerCase(), sum);
            }
        }

        List<ExpenseCategorySummary> categoryBreakdown = new ArrayList<>();
        for (String canonical : ExpenseService.CANONICAL_CATEGORIES) {
            BigDecimal catTotal = categorySums.getOrDefault(canonical.toLowerCase(), BigDecimal.ZERO).setScale(2, RoundingMode.HALF_UP);
            BigDecimal percentage = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
            if (totalExpenses != null && totalExpenses.compareTo(BigDecimal.ZERO) > 0) {
                percentage = catTotal.multiply(BigDecimal.valueOf(100))
                        .divide(totalExpenses, 2, RoundingMode.HALF_UP);
            }
            categoryBreakdown.add(new ExpenseCategorySummary(canonical, catTotal, percentage));
        }

        return categoryBreakdown;
    }

    @Transactional(readOnly = true)
    public List<MonthlyFinancialSummary> getMonthlyTrend(Integer year, Long farmId,
                                                         LocalDate startDate, LocalDate endDate,
                                                         String userEmail) {
        User user = getUserByEmail(userEmail);

        if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("startDate cannot be after endDate");
        }

        if (farmId != null && !farmRepository.existsByIdAndUserId(farmId, user.getId())) {
            throw new ResourceNotFoundException("Farm not found with id: " + farmId);
        }

        Map<String, BigDecimal> monthlyRevenue = new HashMap<>();
        List<Object[]> revRows = saleRepository.sumMonthlyRevenue(user.getId(), farmId, year, startDate, endDate);
        for (Object[] row : revRows) {
            Number rowYear = (Number) row[0];
            Number rowMonth = (Number) row[1];
            BigDecimal sum = (BigDecimal) row[2];
            if (rowYear != null && rowMonth != null && sum != null) {
                String key = String.format("%04d-%02d", rowYear.intValue(), rowMonth.intValue());
                monthlyRevenue.put(key, sum.setScale(2, RoundingMode.HALF_UP));
            }
        }

        Map<String, BigDecimal> monthlyExpenses = new HashMap<>();
        List<Object[]> expRows = expenseRepository.sumMonthlyExpenses(user.getId(), farmId, year, startDate, endDate);
        for (Object[] row : expRows) {
            Number rowYear = (Number) row[0];
            Number rowMonth = (Number) row[1];
            BigDecimal sum = (BigDecimal) row[2];
            if (rowYear != null && rowMonth != null && sum != null) {
                String key = String.format("%04d-%02d", rowYear.intValue(), rowMonth.intValue());
                monthlyExpenses.put(key, sum.setScale(2, RoundingMode.HALF_UP));
            }
        }

        Set<String> allKeys = new TreeSet<>();
        allKeys.addAll(monthlyRevenue.keySet());
        allKeys.addAll(monthlyExpenses.keySet());

        List<MonthlyFinancialSummary> trend = new ArrayList<>();
        for (String key : allKeys) {
            String[] parts = key.split("-");
            int y = Integer.parseInt(parts[0]);
            int m = Integer.parseInt(parts[1]);

            BigDecimal rev = monthlyRevenue.getOrDefault(key, BigDecimal.ZERO).setScale(2, RoundingMode.HALF_UP);
            BigDecimal exp = monthlyExpenses.getOrDefault(key, BigDecimal.ZERO).setScale(2, RoundingMode.HALF_UP);
            BigDecimal profit = rev.subtract(exp).setScale(2, RoundingMode.HALF_UP);

            trend.add(new MonthlyFinancialSummary(y, m, key, rev, exp, profit));
        }

        return trend;
    }
}

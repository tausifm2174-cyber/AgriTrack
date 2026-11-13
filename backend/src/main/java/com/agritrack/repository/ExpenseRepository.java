package com.agritrack.repository;

import com.agritrack.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA Repository for Expense entities.
 * Enforces multi-tenant ownership via the Expense -> Farm -> User relationship.
 */
@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    Optional<Expense> findByIdAndFarmUserId(Long id, Long userId);

    boolean existsByIdAndFarmUserId(Long id, Long userId);

    List<Expense> findAllByFarmUserId(Long userId);

    @Query("SELECT e FROM Expense e " +
           "WHERE e.farm.user.id = :userId " +
           "AND (:farmId IS NULL OR e.farm.id = :farmId) " +
           "AND (:fieldId IS NULL OR e.field.id = :fieldId) " +
           "AND (:cropCycleId IS NULL OR e.cropCycle.id = :cropCycleId) " +
           "AND (:category IS NULL OR LOWER(e.category) = LOWER(:category)) " +
           "AND (:paymentStatus IS NULL OR LOWER(e.paymentStatus) = LOWER(:paymentStatus)) " +
           "AND (:startDate IS NULL OR e.expenseDate >= :startDate) " +
           "AND (:endDate IS NULL OR e.expenseDate <= :endDate) " +
           "ORDER BY e.expenseDate DESC, e.id DESC")
    List<Expense> findFilteredExpenses(@Param("userId") Long userId,
                                      @Param("farmId") Long farmId,
                                      @Param("fieldId") Long fieldId,
                                      @Param("cropCycleId") Long cropCycleId,
                                      @Param("category") String category,
                                      @Param("paymentStatus") String paymentStatus,
                                      @Param("startDate") LocalDate startDate,
                                      @Param("endDate") LocalDate endDate);

    @Query("SELECT COALESCE(SUM(e.amount), 0.00) FROM Expense e " +
           "WHERE e.farm.user.id = :userId " +
           "AND (:farmId IS NULL OR e.farm.id = :farmId) " +
           "AND (:cropCycleId IS NULL OR e.cropCycle.id = :cropCycleId) " +
           "AND (:startDate IS NULL OR e.expenseDate >= :startDate) " +
           "AND (:endDate IS NULL OR e.expenseDate <= :endDate)")
    BigDecimal sumExpensesByUserAndFilters(@Param("userId") Long userId,
                                           @Param("farmId") Long farmId,
                                           @Param("cropCycleId") Long cropCycleId,
                                           @Param("startDate") LocalDate startDate,
                                           @Param("endDate") LocalDate endDate);

    @Query("SELECT COUNT(e) FROM Expense e " +
           "WHERE e.farm.user.id = :userId " +
           "AND (:farmId IS NULL OR e.farm.id = :farmId) " +
           "AND (:cropCycleId IS NULL OR e.cropCycle.id = :cropCycleId) " +
           "AND (:startDate IS NULL OR e.expenseDate >= :startDate) " +
           "AND (:endDate IS NULL OR e.expenseDate <= :endDate)")
    long countExpensesByUserAndFilters(@Param("userId") Long userId,
                                      @Param("farmId") Long farmId,
                                      @Param("cropCycleId") Long cropCycleId,
                                      @Param("startDate") LocalDate startDate,
                                      @Param("endDate") LocalDate endDate);

    @Query("SELECT e.category, COALESCE(SUM(e.amount), 0.00) FROM Expense e " +
           "WHERE e.farm.user.id = :userId " +
           "AND (:farmId IS NULL OR e.farm.id = :farmId) " +
           "AND (:cropCycleId IS NULL OR e.cropCycle.id = :cropCycleId) " +
           "AND (:startDate IS NULL OR e.expenseDate >= :startDate) " +
           "AND (:endDate IS NULL OR e.expenseDate <= :endDate) " +
           "GROUP BY e.category")
    List<Object[]> sumExpensesByCategory(@Param("userId") Long userId,
                                         @Param("farmId") Long farmId,
                                         @Param("cropCycleId") Long cropCycleId,
                                         @Param("startDate") LocalDate startDate,
                                         @Param("endDate") LocalDate endDate);

    @Query("SELECT e.paymentStatus, COALESCE(SUM(e.amount), 0.00) FROM Expense e " +
           "WHERE e.farm.user.id = :userId " +
           "AND (:farmId IS NULL OR e.farm.id = :farmId) " +
           "AND (:cropCycleId IS NULL OR e.cropCycle.id = :cropCycleId) " +
           "AND (:startDate IS NULL OR e.expenseDate >= :startDate) " +
           "AND (:endDate IS NULL OR e.expenseDate <= :endDate) " +
           "GROUP BY e.paymentStatus")
    List<Object[]> sumExpensesByPaymentStatus(@Param("userId") Long userId,
                                              @Param("farmId") Long farmId,
                                              @Param("cropCycleId") Long cropCycleId,
                                              @Param("startDate") LocalDate startDate,
                                              @Param("endDate") LocalDate endDate);

    @Query("SELECT e.cropCycle.id, COALESCE(SUM(e.amount), 0.00) FROM Expense e " +
           "WHERE e.farm.user.id = :userId " +
           "AND e.cropCycle IS NOT NULL " +
           "AND (:farmId IS NULL OR e.farm.id = :farmId) " +
           "AND (:startDate IS NULL OR e.expenseDate >= :startDate) " +
           "AND (:endDate IS NULL OR e.expenseDate <= :endDate) " +
           "GROUP BY e.cropCycle.id")
    List<Object[]> sumExpensesByCropCycle(@Param("userId") Long userId,
                                         @Param("farmId") Long farmId,
                                         @Param("startDate") LocalDate startDate,
                                         @Param("endDate") LocalDate endDate);

    @Query("SELECT e.farm.id, COALESCE(SUM(e.amount), 0.00) FROM Expense e " +
           "WHERE e.farm.user.id = :userId " +
           "AND (:startDate IS NULL OR e.expenseDate >= :startDate) " +
           "AND (:endDate IS NULL OR e.expenseDate <= :endDate) " +
           "GROUP BY e.farm.id")
    List<Object[]> sumExpensesByFarm(@Param("userId") Long userId,
                                     @Param("startDate") LocalDate startDate,
                                     @Param("endDate") LocalDate endDate);

    @Query("SELECT FUNCTION('YEAR', e.expenseDate), FUNCTION('MONTH', e.expenseDate), COALESCE(SUM(e.amount), 0.00) " +
           "FROM Expense e " +
           "WHERE e.farm.user.id = :userId " +
           "AND (:farmId IS NULL OR e.farm.id = :farmId) " +
           "AND (:year IS NULL OR FUNCTION('YEAR', e.expenseDate) = :year) " +
           "AND (:startDate IS NULL OR e.expenseDate >= :startDate) " +
           "AND (:endDate IS NULL OR e.expenseDate <= :endDate) " +
           "GROUP BY FUNCTION('YEAR', e.expenseDate), FUNCTION('MONTH', e.expenseDate) " +
           "ORDER BY FUNCTION('YEAR', e.expenseDate) ASC, FUNCTION('MONTH', e.expenseDate) ASC")
    List<Object[]> sumMonthlyExpenses(@Param("userId") Long userId,
                                      @Param("farmId") Long farmId,
                                      @Param("year") Integer year,
                                      @Param("startDate") LocalDate startDate,
                                      @Param("endDate") LocalDate endDate);
}

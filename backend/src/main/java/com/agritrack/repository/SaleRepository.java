package com.agritrack.repository;

import com.agritrack.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA Repository for Sale entities.
 * Enforces ownership isolation through harvest -> cropCycle -> field -> farm -> user relationship.
 */
@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {

    List<Sale> findAllByHarvestIdAndHarvestCropCycleFieldFarmUserId(Long harvestId, Long userId);

    List<Sale> findAllByHarvestCropCycleFieldFarmUserId(Long userId);

    Optional<Sale> findByIdAndHarvestCropCycleFieldFarmUserId(Long id, Long userId);

    boolean existsByIdAndHarvestCropCycleFieldFarmUserId(Long id, Long userId);

    /**
     * Checks if any sales records reference a given harvest ID.
     * Used for referential integrity protection before harvest deletion.
     */
    boolean existsByHarvestId(Long harvestId);

    @Query("SELECT COALESCE(SUM(s.totalAmount), 0.00) FROM Sale s " +
           "WHERE s.harvest.cropCycle.field.farm.user.id = :userId " +
           "AND UPPER(s.status) <> 'CANCELLED' " +
           "AND (:farmId IS NULL OR s.harvest.cropCycle.field.farm.id = :farmId) " +
           "AND (:cropCycleId IS NULL OR s.harvest.cropCycle.id = :cropCycleId) " +
           "AND (:startDate IS NULL OR s.saleDate >= :startDate) " +
           "AND (:endDate IS NULL OR s.saleDate <= :endDate)")
    BigDecimal sumRevenueByUserAndFilters(@Param("userId") Long userId,
                                          @Param("farmId") Long farmId,
                                          @Param("cropCycleId") Long cropCycleId,
                                          @Param("startDate") LocalDate startDate,
                                          @Param("endDate") LocalDate endDate);

    @Query("SELECT s.harvest.cropCycle.id, COALESCE(SUM(s.totalAmount), 0.00) FROM Sale s " +
           "WHERE s.harvest.cropCycle.field.farm.user.id = :userId " +
           "AND UPPER(s.status) <> 'CANCELLED' " +
           "AND (:farmId IS NULL OR s.harvest.cropCycle.field.farm.id = :farmId) " +
           "AND (:startDate IS NULL OR s.saleDate >= :startDate) " +
           "AND (:endDate IS NULL OR s.saleDate <= :endDate) " +
           "GROUP BY s.harvest.cropCycle.id")
    List<Object[]> sumRevenueByCropCycle(@Param("userId") Long userId,
                                        @Param("farmId") Long farmId,
                                        @Param("startDate") LocalDate startDate,
                                        @Param("endDate") LocalDate endDate);

    @Query("SELECT s.harvest.cropCycle.field.farm.id, COALESCE(SUM(s.totalAmount), 0.00) FROM Sale s " +
           "WHERE s.harvest.cropCycle.field.farm.user.id = :userId " +
           "AND UPPER(s.status) <> 'CANCELLED' " +
           "AND (:startDate IS NULL OR s.saleDate >= :startDate) " +
           "AND (:endDate IS NULL OR s.saleDate <= :endDate) " +
           "GROUP BY s.harvest.cropCycle.field.farm.id")
    List<Object[]> sumRevenueByFarm(@Param("userId") Long userId,
                                    @Param("startDate") LocalDate startDate,
                                    @Param("endDate") LocalDate endDate);

    @Query("SELECT FUNCTION('YEAR', s.saleDate), FUNCTION('MONTH', s.saleDate), COALESCE(SUM(s.totalAmount), 0.00) FROM Sale s " +
           "WHERE s.harvest.cropCycle.field.farm.user.id = :userId " +
           "AND UPPER(s.status) <> 'CANCELLED' " +
           "AND (:farmId IS NULL OR s.harvest.cropCycle.field.farm.id = :farmId) " +
           "AND (:year IS NULL OR FUNCTION('YEAR', s.saleDate) = :year) " +
           "AND (:startDate IS NULL OR s.saleDate >= :startDate) " +
           "AND (:endDate IS NULL OR s.saleDate <= :endDate) " +
           "GROUP BY FUNCTION('YEAR', s.saleDate), FUNCTION('MONTH', s.saleDate) " +
           "ORDER BY FUNCTION('YEAR', s.saleDate) ASC, FUNCTION('MONTH', s.saleDate) ASC")
    List<Object[]> sumMonthlyRevenue(@Param("userId") Long userId,
                                     @Param("farmId") Long farmId,
                                     @Param("year") Integer year,
                                     @Param("startDate") LocalDate startDate,
                                     @Param("endDate") LocalDate endDate);
}

package com.agritrack.repository;

import com.agritrack.entity.MarketPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Spring Data JPA Repository for MarketPrice entities.
 * Shared reference data with flexible multi-criteria filtering.
 */
@Repository
public interface MarketPriceRepository extends JpaRepository<MarketPrice, Long> {

    List<MarketPrice> findAllByOrderByPriceDateDescCropNameAsc();

    /**
     * Finds market price records matching optional filters for crop, market, trend, date, and date range.
     */
    @Query("SELECT m FROM MarketPrice m WHERE " +
           "(:crop IS NULL OR LOWER(m.cropName) LIKE LOWER(CONCAT('%', :crop, '%'))) AND " +
           "(:market IS NULL OR LOWER(m.marketName) LIKE LOWER(CONCAT('%', :market, '%'))) AND " +
           "(:trend IS NULL OR UPPER(m.trend) = UPPER(:trend)) AND " +
           "(:date IS NULL OR m.priceDate = :date) AND " +
           "(:dateFrom IS NULL OR m.priceDate >= :dateFrom) AND " +
           "(:dateTo IS NULL OR m.priceDate <= :dateTo) " +
           "ORDER BY m.priceDate DESC, m.cropName ASC")
    List<MarketPrice> findWithFilters(@Param("crop") String crop,
                                      @Param("market") String market,
                                      @Param("trend") String trend,
                                      @Param("date") LocalDate date,
                                      @Param("dateFrom") LocalDate dateFrom,
                                      @Param("dateTo") LocalDate dateTo);
}

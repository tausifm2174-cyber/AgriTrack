package com.agritrack.repository;

import com.agritrack.entity.Harvest;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA Repository for Harvest entities.
 * Enforces ownership isolation through cropCycle -> field -> farm -> user relationship.
 */
@Repository
public interface HarvestRepository extends JpaRepository<Harvest, Long> {

    List<Harvest> findAllByCropCycleIdAndCropCycleFieldFarmUserId(Long cropCycleId, Long userId);

    List<Harvest> findAllByCropCycleFieldFarmUserId(Long userId);

    Optional<Harvest> findByIdAndCropCycleFieldFarmUserId(Long id, Long userId);

    boolean existsByIdAndCropCycleFieldFarmUserId(Long id, Long userId);

    List<Harvest> findAllByCropCycleFieldIdAndCropCycleFieldFarmUserId(Long fieldId, Long userId);

    List<Harvest> findAllByCropCycleFieldFarmIdAndCropCycleFieldFarmUserId(Long farmId, Long userId);

    /**
     * Finds a harvest by ID and authenticated user ID with pessimistic write locking
     * to prevent concurrent overselling during sales transactions.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT h FROM Harvest h WHERE h.id = :id AND h.cropCycle.field.farm.user.id = :userId")
    Optional<Harvest> findByIdAndCropCycleFieldFarmUserIdWithLock(@Param("id") Long id, @Param("userId") Long userId);
}

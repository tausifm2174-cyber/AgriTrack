package com.agritrack.repository;

import com.agritrack.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

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
}

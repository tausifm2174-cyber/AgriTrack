package com.agritrack.repository;

import com.agritrack.entity.CropCycle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA Repository for CropCycle entities.
 * Enforces ownership isolation through field -> farm -> user relationship.
 */
@Repository
public interface CropCycleRepository extends JpaRepository<CropCycle, Long> {

    List<CropCycle> findAllByFieldIdAndFieldFarmUserId(Long fieldId, Long userId);

    List<CropCycle> findAllByFieldFarmIdAndFieldFarmUserId(Long farmId, Long userId);

    List<CropCycle> findAllByFieldFarmUserId(Long userId);

    Optional<CropCycle> findByIdAndFieldFarmUserId(Long id, Long userId);

    boolean existsByIdAndFieldFarmUserId(Long id, Long userId);
}


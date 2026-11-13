package com.agritrack.repository;

import com.agritrack.entity.SoilRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA Repository for SoilRecord entities.
 * Includes ownership-isolated queries navigating Field -> Farm -> User.
 */
@Repository
public interface SoilRecordRepository extends JpaRepository<SoilRecord, Long> {

    List<SoilRecord> findAllByFieldIdAndFieldFarmUserId(Long fieldId, Long userId);

    Optional<SoilRecord> findByIdAndFieldFarmUserId(Long id, Long userId);

    boolean existsByIdAndFieldFarmUserId(Long id, Long userId);
}


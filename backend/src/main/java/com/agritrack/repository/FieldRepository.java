package com.agritrack.repository;

import com.agritrack.entity.Field;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA Repository for Field entities.
 * Includes ownership-isolated queries via the parent Farm and Farm's User.
 */
@Repository
public interface FieldRepository extends JpaRepository<Field, Long> {

    List<Field> findAllByFarmIdAndFarmUserId(Long farmId, Long userId);

    Optional<Field> findByIdAndFarmUserId(Long id, Long userId);

    boolean existsByIdAndFarmUserId(Long id, Long userId);
}


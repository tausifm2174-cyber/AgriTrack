package com.agritrack.repository;

import com.agritrack.entity.Farm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA Repository for Farm entities.
 * Includes user-isolated queries to enforce multi-tenant separation.
 */
@Repository
public interface FarmRepository extends JpaRepository<Farm, Long> {

    List<Farm> findAllByUserId(Long userId);

    Optional<Farm> findByIdAndUserId(Long id, Long userId);

    boolean existsByIdAndUserId(Long id, Long userId);
}


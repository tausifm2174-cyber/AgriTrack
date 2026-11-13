package com.agritrack.repository;

import com.agritrack.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA Repository for Activity entities.
 * Enforces ownership isolation through Field -> Farm -> User navigation.
 */
@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {

    List<Activity> findAllByFieldIdAndFieldFarmUserId(Long fieldId, Long userId);

    List<Activity> findAllByFieldFarmUserId(Long userId);

    Optional<Activity> findByIdAndFieldFarmUserId(Long id, Long userId);

    boolean existsByIdAndFieldFarmUserId(Long id, Long userId);
}


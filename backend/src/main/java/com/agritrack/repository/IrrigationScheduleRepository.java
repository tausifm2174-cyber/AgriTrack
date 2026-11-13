package com.agritrack.repository;

import com.agritrack.entity.IrrigationSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA Repository for IrrigationSchedule entities.
 * Enforces ownership isolation through Field -> Farm -> User navigation.
 */
@Repository
public interface IrrigationScheduleRepository extends JpaRepository<IrrigationSchedule, Long> {

    List<IrrigationSchedule> findAllByFieldIdAndFieldFarmUserId(Long fieldId, Long userId);

    List<IrrigationSchedule> findAllByFieldFarmUserId(Long userId);

    Optional<IrrigationSchedule> findByIdAndFieldFarmUserId(Long id, Long userId);

    boolean existsByIdAndFieldFarmUserId(Long id, Long userId);
}


package com.agritrack.repository;

import com.agritrack.entity.WeatherSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WeatherSnapshotRepository extends JpaRepository<WeatherSnapshot, Long> {

    Optional<WeatherSnapshot> findFirstByFarmIdAndFarmUserIdOrderByObservedAtDesc(Long farmId, Long userId);

    Optional<WeatherSnapshot> findFirstByFarmIdOrderByObservedAtDesc(Long farmId);

    List<WeatherSnapshot> findByFarmIdOrderByObservedAtDesc(Long farmId);
}


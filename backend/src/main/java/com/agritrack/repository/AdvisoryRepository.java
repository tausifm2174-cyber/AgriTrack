package com.agritrack.repository;

import com.agritrack.entity.Advisory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdvisoryRepository extends JpaRepository<Advisory, Long> {

    List<Advisory> findByFarmIdAndFarmUserIdOrderByCreatedAtDesc(Long farmId, Long userId);

    List<Advisory> findByFarmIdAndFarmUserIdAndStatusOrderByCreatedAtDesc(Long farmId, Long userId, String status);

    List<Advisory> findByFarmUserIdOrderByCreatedAtDesc(Long userId);

    List<Advisory> findByFarmUserIdAndStatusOrderByCreatedAtDesc(Long userId, String status);

    Optional<Advisory> findByIdAndFarmUserId(Long id, Long userId);

    Optional<Advisory> findByFarmIdAndDedupKey(Long farmId, String dedupKey);
}


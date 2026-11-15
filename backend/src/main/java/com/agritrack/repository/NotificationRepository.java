package com.agritrack.repository;

import com.agritrack.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    long countByUserIdAndIsReadFalse(Long userId);

    long countByUserIdAndIsReadTrue(Long userId);

    long countByUserId(Long userId);

    Page<Notification> findByUserId(Long userId, Pageable pageable);

    Page<Notification> findByUserIdAndIsRead(Long userId, boolean isRead, Pageable pageable);

    Page<Notification> findByUserIdAndType(Long userId, String type, Pageable pageable);

    Page<Notification> findByUserIdAndSeverity(Long userId, String severity, Pageable pageable);

    Page<Notification> findByUserIdAndTypeAndSeverity(Long userId, String type, String severity, Pageable pageable);

    Page<Notification> findByUserIdAndIsReadAndType(Long userId, boolean isRead, String type, Pageable pageable);

    Page<Notification> findByUserIdAndIsReadAndSeverity(Long userId, boolean isRead, String severity, Pageable pageable);

    Page<Notification> findByUserIdAndIsReadAndTypeAndSeverity(Long userId, boolean isRead, String type, String severity, Pageable pageable);

    Optional<Notification> findByIdAndUserId(Long id, Long userId);

    Optional<Notification> findByUserIdAndDedupKey(Long userId, String dedupKey);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true, n.readAt = :readAt WHERE n.user.id = :userId AND n.isRead = false")
    int markAllAsReadByUserId(@Param("userId") Long userId, @Param("readAt") LocalDateTime readAt);

    void deleteByUserId(Long userId);

    @Query("SELECT n.type, COUNT(n) FROM Notification n WHERE n.user.id = :userId GROUP BY n.type")
    List<Object[]> countGroupedByType(@Param("userId") Long userId);

    @Query("SELECT n.severity, COUNT(n) FROM Notification n WHERE n.user.id = :userId GROUP BY n.severity")
    List<Object[]> countGroupedBySeverity(@Param("userId") Long userId);
}

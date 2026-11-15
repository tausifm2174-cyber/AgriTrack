package com.agritrack.service;

import com.agritrack.dto.NotificationCreateRequest;
import com.agritrack.dto.NotificationResponse;
import com.agritrack.dto.NotificationSummaryResponse;
import com.agritrack.entity.*;
import com.agritrack.exception.ResourceNotFoundException;
import com.agritrack.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Service managing user-facing notification records and alerts.
 * Supports filtering, pagination, read/unread states, bulk acknowledgement,
 * and automatic bridging from agronomic advisories with deduplication.
 */
@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final FarmRepository farmRepository;
    private final FieldRepository fieldRepository;
    private final CropCycleRepository cropCycleRepository;
    private final AdvisoryRepository advisoryRepository;

    public NotificationService(
            NotificationRepository notificationRepository,
            UserRepository userRepository,
            FarmRepository farmRepository,
            FieldRepository fieldRepository,
            CropCycleRepository cropCycleRepository,
            AdvisoryRepository advisoryRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.farmRepository = farmRepository;
        this.fieldRepository = fieldRepository;
        this.cropCycleRepository = cropCycleRepository;
        this.advisoryRepository = advisoryRepository;
    }

    /**
     * Retrieves paginated notifications for the authenticated user, optionally filtered.
     */
    @Transactional(readOnly = true)
    public Page<NotificationResponse> getNotifications(
            Boolean unreadOnly,
            String type,
            String severity,
            Pageable pageable,
            String userEmail) {
        User user = getUserByEmail(userEmail);

        Page<Notification> pageResult;
        boolean hasUnread = unreadOnly != null && unreadOnly;
        boolean hasType = type != null && !type.trim().isEmpty();
        boolean hasSeverity = severity != null && !severity.trim().isEmpty();

        String normalizedType = hasType ? type.trim().toUpperCase() : null;
        String normalizedSeverity = hasSeverity ? severity.trim().toUpperCase() : null;

        if (hasUnread) {
            if (hasType && hasSeverity) {
                pageResult = notificationRepository.findByUserIdAndIsReadAndTypeAndSeverity(
                        user.getId(), false, normalizedType, normalizedSeverity, pageable);
            } else if (hasType) {
                pageResult = notificationRepository.findByUserIdAndIsReadAndType(
                        user.getId(), false, normalizedType, pageable);
            } else if (hasSeverity) {
                pageResult = notificationRepository.findByUserIdAndIsReadAndSeverity(
                        user.getId(), false, normalizedSeverity, pageable);
            } else {
                pageResult = notificationRepository.findByUserIdAndIsRead(user.getId(), false, pageable);
            }
        } else {
            if (hasType && hasSeverity) {
                pageResult = notificationRepository.findByUserIdAndTypeAndSeverity(
                        user.getId(), normalizedType, normalizedSeverity, pageable);
            } else if (hasType) {
                pageResult = notificationRepository.findByUserIdAndType(
                        user.getId(), normalizedType, pageable);
            } else if (hasSeverity) {
                pageResult = notificationRepository.findByUserIdAndSeverity(
                        user.getId(), normalizedSeverity, pageable);
            } else {
                pageResult = notificationRepository.findByUserId(user.getId(), pageable);
            }
        }

        return pageResult.map(NotificationResponse::fromEntity);
    }

    /**
     * Gets the count of unread notifications for the user.
     */
    @Transactional(readOnly = true)
    public long getUnreadCount(String userEmail) {
        User user = getUserByEmail(userEmail);
        return notificationRepository.countByUserIdAndIsReadFalse(user.getId());
    }

    /**
     * Aggregates notification metrics including read/unread totals and category/severity breakdowns.
     */
    @Transactional(readOnly = true)
    public NotificationSummaryResponse getNotificationSummary(String userEmail) {
        User user = getUserByEmail(userEmail);
        Long userId = user.getId();

        long total = notificationRepository.countByUserId(userId);
        long unread = notificationRepository.countByUserIdAndIsReadFalse(userId);
        long read = notificationRepository.countByUserIdAndIsReadTrue(userId);

        Map<String, Long> byType = new HashMap<>();
        List<Object[]> typeCounts = notificationRepository.countGroupedByType(userId);
        for (Object[] row : typeCounts) {
            String t = (String) row[0];
            Long count = ((Number) row[1]).longValue();
            byType.put(t, count);
        }

        Map<String, Long> bySeverity = new HashMap<>();
        List<Object[]> severityCounts = notificationRepository.countGroupedBySeverity(userId);
        for (Object[] row : severityCounts) {
            String s = (String) row[0];
            Long count = ((Number) row[1]).longValue();
            bySeverity.put(s, count);
        }

        return new NotificationSummaryResponse(total, unread, read, byType, bySeverity);
    }

    /**
     * Marks a specific notification as read. Idempotent.
     */
    @Transactional
    public NotificationResponse markAsRead(Long id, String userEmail) {
        User user = getUserByEmail(userEmail);
        Notification notification = notificationRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", id));

        if (!notification.isRead()) {
            notification.setRead(true);
            notification.setReadAt(LocalDateTime.now());
            notification = notificationRepository.save(notification);
        }

        return NotificationResponse.fromEntity(notification);
    }

    /**
     * Marks a specific notification as unread. Idempotent.
     */
    @Transactional
    public NotificationResponse markAsUnread(Long id, String userEmail) {
        User user = getUserByEmail(userEmail);
        Notification notification = notificationRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", id));

        if (notification.isRead()) {
            notification.setRead(false);
            notification.setReadAt(null);
            notification = notificationRepository.save(notification);
        }

        return NotificationResponse.fromEntity(notification);
    }

    /**
     * Marks all unread notifications for the user as read in bulk.
     * @return Number of records updated.
     */
    @Transactional
    public int markAllAsRead(String userEmail) {
        User user = getUserByEmail(userEmail);
        return notificationRepository.markAllAsReadByUserId(user.getId(), LocalDateTime.now());
    }

    /**
     * Deletes a single notification owned by the user.
     */
    @Transactional
    public void deleteNotification(Long id, String userEmail) {
        User user = getUserByEmail(userEmail);
        Notification notification = notificationRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", id));
        notificationRepository.delete(notification);
    }

    /**
     * Clears all notifications owned by the user.
     */
    @Transactional
    public void clearAllNotifications(String userEmail) {
        User user = getUserByEmail(userEmail);
        notificationRepository.deleteByUserId(user.getId());
    }

    /**
     * Programmatic creation of a notification with optional deduplication.
     */
    @Transactional
    public NotificationResponse createNotification(NotificationCreateRequest request, String userEmail) {
        User user = getUserByEmail(userEmail);

        if (request.getDedupKey() != null && !request.getDedupKey().trim().isEmpty()) {
            Optional<Notification> existingOpt = notificationRepository.findByUserIdAndDedupKey(
                    user.getId(), request.getDedupKey().trim());
            if (existingOpt.isPresent()) {
                log.info("Duplicate notification suppressed for user {} with dedupKey: {}",
                        user.getId(), request.getDedupKey());
                return NotificationResponse.fromEntity(existingOpt.get());
            }
        }

        Farm farm = null;
        if (request.getFarmId() != null) {
            farm = farmRepository.findByIdAndUserId(request.getFarmId(), user.getId()).orElse(null);
        }

        Field field = null;
        if (request.getFieldId() != null) {
            field = fieldRepository.findById(request.getFieldId()).orElse(null);
        }

        CropCycle cropCycle = null;
        if (request.getCropCycleId() != null) {
            cropCycle = cropCycleRepository.findById(request.getCropCycleId()).orElse(null);
        }

        Advisory advisory = null;
        if (request.getAdvisoryId() != null) {
            advisory = advisoryRepository.findById(request.getAdvisoryId()).orElse(null);
        }

        Notification notification = new Notification(
                user,
                farm,
                field,
                cropCycle,
                advisory,
                request.getType().toUpperCase(),
                request.getSeverity().toUpperCase(),
                request.getTitle(),
                request.getMessage(),
                request.getRelatedRoute(),
                request.getActionLabel(),
                request.getDedupKey()
        );

        Notification saved = notificationRepository.save(notification);
        return NotificationResponse.fromEntity(saved);
    }

    /**
     * Bridges an agronomic Advisory into a user Notification with deduplication.
     * Prevents duplicate alert spam during repeated weather sync evaluations.
     */
    @Transactional
    public Optional<Notification> createAdvisoryNotification(Advisory advisory) {
        if (advisory == null || advisory.getFarm() == null || advisory.getFarm().getUser() == null) {
            return Optional.empty();
        }

        User user = advisory.getFarm().getUser();
        String advisoryDedup = advisory.getDedupKey() != null ? advisory.getDedupKey() : ("ADV_" + advisory.getId());
        String dedupKey = "NOTIF_ADV_" + advisoryDedup;

        // Check if notification already exists for this advisory key
        Optional<Notification> existingOpt = notificationRepository.findByUserIdAndDedupKey(user.getId(), dedupKey);
        if (existingOpt.isPresent()) {
            log.debug("Advisory notification already exists for user {} dedupKey {}", user.getId(), dedupKey);
            return existingOpt;
        }

        // Map advisory rule/category to notification type & severity
        String notificationType = "ADVISORY";
        if (advisory.getRuleCode() != null && advisory.getRuleCode().contains("RAIN")) {
            notificationType = "WEATHER";
        } else if ("WATER_MANAGEMENT".equalsIgnoreCase(advisory.getCategory())) {
            notificationType = "IRRIGATION";
        } else if ("CROP_PROTECTION".equalsIgnoreCase(advisory.getCategory())) {
            notificationType = "CROP";
        }

        String severity = "INFO";
        if ("WARNING".equalsIgnoreCase(advisory.getSeverity()) || "CRITICAL".equalsIgnoreCase(advisory.getSeverity())) {
            severity = advisory.getSeverity().toUpperCase();
        }

        Notification notification = new Notification(
                user,
                advisory.getFarm(),
                advisory.getField(),
                advisory.getCropCycle(),
                advisory,
                notificationType,
                severity,
                advisory.getTitle(),
                advisory.getMessage(),
                "/weather",
                "View Advisory",
                dedupKey
        );

        Notification saved = notificationRepository.save(notification);
        log.info("Created notification ID {} for advisory ID {} (user ID {})", saved.getId(), advisory.getId(), user.getId());
        return Optional.of(saved);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }
}

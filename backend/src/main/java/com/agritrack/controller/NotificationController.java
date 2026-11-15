package com.agritrack.controller;

import com.agritrack.dto.ApiResponse;
import com.agritrack.dto.NotificationResponse;
import com.agritrack.dto.NotificationSummaryResponse;
import com.agritrack.service.NotificationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

/**
 * REST Controller for user-facing Notification & Alert Management.
 * Provides endpoints for retrieving, filtering, counting, acknowledging,
 * and managing notifications.
 */
@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    /**
     * Retrieves paginated notifications for the authenticated user with optional filtering.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<NotificationResponse>>> getNotifications(
            @RequestParam(required = false) Boolean unreadOnly,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String severity,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication) {
        // Enforce max page size of 100 to prevent denial of service
        int boundedSize = Math.max(1, Math.min(size, 100));
        int boundedPage = Math.max(0, page);
        Pageable pageable = PageRequest.of(boundedPage, boundedSize, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<NotificationResponse> result = notificationService.getNotifications(
                unreadOnly, type, severity, pageable, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(result, "Notifications retrieved successfully"));
    }

    /**
     * Returns unread notifications count for the badge counter.
     */
    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount(Authentication authentication) {
        long count = notificationService.getUnreadCount(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(Collections.singletonMap("unreadCount", count), "Unread notification count retrieved"));
    }

    /**
     * Returns an aggregated summary of notifications (total, unread, read, by type, by severity).
     */
    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<NotificationSummaryResponse>> getNotificationSummary(Authentication authentication) {
        NotificationSummaryResponse summary = notificationService.getNotificationSummary(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(summary, "Notification summary retrieved successfully"));
    }

    /**
     * Marks a specific notification as read.
     */
    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<NotificationResponse>> markAsRead(
            @PathVariable Long id,
            Authentication authentication) {
        NotificationResponse response = notificationService.markAsRead(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(response, "Notification marked as read"));
    }

    /**
     * Marks a specific notification as unread.
     */
    @PatchMapping("/{id}/unread")
    public ResponseEntity<ApiResponse<NotificationResponse>> markAsUnread(
            @PathVariable Long id,
            Authentication authentication) {
        NotificationResponse response = notificationService.markAsUnread(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(response, "Notification marked as unread"));
    }

    /**
     * Marks all unread notifications as read for the authenticated user.
     */
    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<Map<String, Object>>> markAllAsRead(Authentication authentication) {
        int count = notificationService.markAllAsRead(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(Collections.singletonMap("markedAsReadCount", count), "All unread notifications marked as read"));
    }

    /**
     * Deletes a single notification owned by the authenticated user.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(
            @PathVariable Long id,
            Authentication authentication) {
        notificationService.deleteNotification(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(null, "Notification deleted successfully"));
    }

    /**
     * Clears all notifications owned by the authenticated user.
     */
    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> clearAllNotifications(Authentication authentication) {
        notificationService.clearAllNotifications(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(null, "All notifications deleted successfully"));
    }
}

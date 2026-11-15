package com.agritrack;

import com.agritrack.dto.NotificationCreateRequest;
import com.agritrack.dto.NotificationResponse;
import com.agritrack.dto.NotificationSummaryResponse;
import com.agritrack.entity.*;
import com.agritrack.exception.ResourceNotFoundException;
import com.agritrack.repository.*;
import com.agritrack.service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private FarmRepository farmRepository;

    @Mock
    private FieldRepository fieldRepository;

    @Mock
    private CropCycleRepository cropCycleRepository;

    @Mock
    private AdvisoryRepository advisoryRepository;

    @InjectMocks
    private NotificationService notificationService;

    private User user;
    private Farm farm;
    private Notification sampleNotification;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("farmer@example.com");

        farm = new Farm();
        farm.setId(10L);
        farm.setFarmName("Green Acres");
        farm.setUser(user);

        sampleNotification = new Notification(
                user,
                farm,
                null,
                null,
                null,
                "WEATHER",
                "WARNING",
                "Heavy Rain Alert",
                "Rainfall exceeds 25mm",
                "/weather",
                "View Weather",
                "DEDUP_TEST_1"
        );
        sampleNotification.setId(100L);
        sampleNotification.setCreatedAt(LocalDateTime.now());
    }

    @Test
    @DisplayName("getNotifications returns paginated responses for user")
    void testGetNotifications() {
        when(userRepository.findByEmail("farmer@example.com")).thenReturn(Optional.of(user));
        Pageable pageable = PageRequest.of(0, 10);
        when(notificationRepository.findByUserId(1L, pageable))
                .thenReturn(new PageImpl<>(List.of(sampleNotification)));

        Page<NotificationResponse> result = notificationService.getNotifications(
                false, null, null, pageable, "farmer@example.com");

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("Heavy Rain Alert", result.getContent().get(0).getTitle());
        assertEquals("WEATHER", result.getContent().get(0).getType());
    }

    @Test
    @DisplayName("getNotifications with unreadOnly and type filters correctly")
    void testGetNotificationsFiltered() {
        when(userRepository.findByEmail("farmer@example.com")).thenReturn(Optional.of(user));
        Pageable pageable = PageRequest.of(0, 10);
        when(notificationRepository.findByUserIdAndIsReadAndType(1L, false, "WEATHER", pageable))
                .thenReturn(new PageImpl<>(List.of(sampleNotification)));

        Page<NotificationResponse> result = notificationService.getNotifications(
                true, "WEATHER", null, pageable, "farmer@example.com");

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(notificationRepository).findByUserIdAndIsReadAndType(1L, false, "WEATHER", pageable);
    }

    @Test
    @DisplayName("getUnreadCount returns correct count")
    void testGetUnreadCount() {
        when(userRepository.findByEmail("farmer@example.com")).thenReturn(Optional.of(user));
        when(notificationRepository.countByUserIdAndIsReadFalse(1L)).thenReturn(5L);

        long count = notificationService.getUnreadCount("farmer@example.com");
        assertEquals(5L, count);
    }

    @Test
    @DisplayName("getNotificationSummary aggregates metrics properly")
    void testGetNotificationSummary() {
        when(userRepository.findByEmail("farmer@example.com")).thenReturn(Optional.of(user));
        when(notificationRepository.countByUserId(1L)).thenReturn(10L);
        when(notificationRepository.countByUserIdAndIsReadFalse(1L)).thenReturn(4L);
        when(notificationRepository.countByUserIdAndIsReadTrue(1L)).thenReturn(6L);

        List<Object[]> typeRows = new ArrayList<>();
        typeRows.add(new Object[]{"WEATHER", 6L});
        typeRows.add(new Object[]{"IRRIGATION", 4L});
        when(notificationRepository.countGroupedByType(1L)).thenReturn(typeRows);

        List<Object[]> severityRows = new ArrayList<>();
        severityRows.add(new Object[]{"WARNING", 3L});
        severityRows.add(new Object[]{"INFO", 7L});
        when(notificationRepository.countGroupedBySeverity(1L)).thenReturn(severityRows);

        NotificationSummaryResponse summary = notificationService.getNotificationSummary("farmer@example.com");

        assertNotNull(summary);
        assertEquals(10L, summary.getTotal());
        assertEquals(4L, summary.getUnread());
        assertEquals(6L, summary.getRead());
        assertEquals(6L, summary.getByType().get("WEATHER"));
        assertEquals(3L, summary.getBySeverity().get("WARNING"));
    }

    @Test
    @DisplayName("markAsRead marks unread notification as read")
    void testMarkAsRead() {
        sampleNotification.setRead(false);
        sampleNotification.setReadAt(null);

        when(userRepository.findByEmail("farmer@example.com")).thenReturn(Optional.of(user));
        when(notificationRepository.findByIdAndUserId(100L, 1L)).thenReturn(Optional.of(sampleNotification));
        when(notificationRepository.save(any(Notification.class))).thenAnswer(invocation -> invocation.getArgument(0));

        NotificationResponse response = notificationService.markAsRead(100L, "farmer@example.com");

        assertTrue(response.isRead());
        assertNotNull(response.getReadAt());
        verify(notificationRepository).save(sampleNotification);
    }

    @Test
    @DisplayName("markAsRead is idempotent when notification is already read")
    void testMarkAsReadIdempotent() {
        sampleNotification.setRead(true);
        LocalDateTime originalTime = LocalDateTime.now().minusHours(1);
        sampleNotification.setReadAt(originalTime);

        when(userRepository.findByEmail("farmer@example.com")).thenReturn(Optional.of(user));
        when(notificationRepository.findByIdAndUserId(100L, 1L)).thenReturn(Optional.of(sampleNotification));

        NotificationResponse response = notificationService.markAsRead(100L, "farmer@example.com");

        assertTrue(response.isRead());
        assertEquals(originalTime, response.getReadAt());
        verify(notificationRepository, never()).save(any(Notification.class));
    }

    @Test
    @DisplayName("markAsUnread marks read notification as unread")
    void testMarkAsUnread() {
        sampleNotification.setRead(true);
        sampleNotification.setReadAt(LocalDateTime.now());

        when(userRepository.findByEmail("farmer@example.com")).thenReturn(Optional.of(user));
        when(notificationRepository.findByIdAndUserId(100L, 1L)).thenReturn(Optional.of(sampleNotification));
        when(notificationRepository.save(any(Notification.class))).thenAnswer(invocation -> invocation.getArgument(0));

        NotificationResponse response = notificationService.markAsUnread(100L, "farmer@example.com");

        assertFalse(response.isRead());
        assertNull(response.getReadAt());
        verify(notificationRepository).save(sampleNotification);
    }

    @Test
    @DisplayName("markAllAsRead updates bulk unread notifications")
    void testMarkAllAsRead() {
        when(userRepository.findByEmail("farmer@example.com")).thenReturn(Optional.of(user));
        when(notificationRepository.markAllAsReadByUserId(eq(1L), any(LocalDateTime.class))).thenReturn(7);

        int updatedCount = notificationService.markAllAsRead("farmer@example.com");
        assertEquals(7, updatedCount);
    }

    @Test
    @DisplayName("deleteNotification removes notification when owned by user")
    void testDeleteNotification() {
        when(userRepository.findByEmail("farmer@example.com")).thenReturn(Optional.of(user));
        when(notificationRepository.findByIdAndUserId(100L, 1L)).thenReturn(Optional.of(sampleNotification));

        notificationService.deleteNotification(100L, "farmer@example.com");
        verify(notificationRepository).delete(sampleNotification);
    }

    @Test
    @DisplayName("deleteNotification throws ResourceNotFoundException on cross-user access")
    void testDeleteNotificationNotFound() {
        when(userRepository.findByEmail("farmer@example.com")).thenReturn(Optional.of(user));
        when(notificationRepository.findByIdAndUserId(999L, 1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
                notificationService.deleteNotification(999L, "farmer@example.com"));
        verify(notificationRepository, never()).delete(any());
    }

    @Test
    @DisplayName("clearAllNotifications clears all notifications for user")
    void testClearAllNotifications() {
        when(userRepository.findByEmail("farmer@example.com")).thenReturn(Optional.of(user));

        notificationService.clearAllNotifications("farmer@example.com");
        verify(notificationRepository).deleteByUserId(1L);
    }

    @Test
    @DisplayName("createNotification with duplicate dedupKey is suppressed")
    void testCreateNotificationDedup() {
        when(userRepository.findByEmail("farmer@example.com")).thenReturn(Optional.of(user));
        when(notificationRepository.findByUserIdAndDedupKey(1L, "KEY_123"))
                .thenReturn(Optional.of(sampleNotification));

        NotificationCreateRequest req = new NotificationCreateRequest();
        req.setTitle("Duplicate Check");
        req.setMessage("Testing");
        req.setType("WEATHER");
        req.setSeverity("INFO");
        req.setDedupKey("KEY_123");

        NotificationResponse response = notificationService.createNotification(req, "farmer@example.com");
        assertNotNull(response);
        verify(notificationRepository, never()).save(any(Notification.class));
    }

    @Test
    @DisplayName("createAdvisoryNotification bridges Advisory into Notification with dedup key")
    void testCreateAdvisoryNotification() {
        Advisory advisory = new Advisory();
        advisory.setId(50L);
        advisory.setFarm(farm);
        advisory.setRuleCode("RULE_HEAVY_RAINFALL");
        advisory.setSeverity("WARNING");
        advisory.setTitle("Heavy Rainfall Warning");
        advisory.setMessage("Suspend irrigation");
        advisory.setDedupKey("RULE_HEAVY_RAINFALL_2026-11-15");

        when(notificationRepository.findByUserIdAndDedupKey(1L, "NOTIF_ADV_RULE_HEAVY_RAINFALL_2026-11-15"))
                .thenReturn(Optional.empty());
        when(notificationRepository.save(any(Notification.class))).thenAnswer(invocation -> {
            Notification n = invocation.getArgument(0);
            n.setId(201L);
            return n;
        });

        Optional<Notification> result = notificationService.createAdvisoryNotification(advisory);

        assertTrue(result.isPresent());
        assertEquals("Heavy Rainfall Warning", result.get().getTitle());
        assertEquals("WEATHER", result.get().getType());
        assertEquals("WARNING", result.get().getSeverity());
        assertEquals("NOTIF_ADV_RULE_HEAVY_RAINFALL_2026-11-15", result.get().getDedupKey());
        verify(notificationRepository).save(any(Notification.class));
    }

    @Test
    @DisplayName("createAdvisoryNotification suppresses duplicate when dedupKey exists")
    void testCreateAdvisoryNotificationDedupSuppression() {
        Advisory advisory = new Advisory();
        advisory.setId(50L);
        advisory.setFarm(farm);
        advisory.setDedupKey("RULE_HEAVY_RAINFALL_2026-11-15");

        when(notificationRepository.findByUserIdAndDedupKey(1L, "NOTIF_ADV_RULE_HEAVY_RAINFALL_2026-11-15"))
                .thenReturn(Optional.of(sampleNotification));

        Optional<Notification> result = notificationService.createAdvisoryNotification(advisory);

        assertTrue(result.isPresent());
        verify(notificationRepository, never()).save(any(Notification.class));
    }
}

package com.agritrack;

import com.agritrack.dto.NotificationResponse;
import com.agritrack.dto.NotificationSummaryResponse;
import com.agritrack.entity.Role;
import com.agritrack.entity.User;
import com.agritrack.exception.ResourceNotFoundException;
import com.agritrack.repository.UserRepository;
import com.agritrack.service.NotificationService;
import com.agritrack.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("NotificationController Tests")
class NotificationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUtil jwtUtil;

    @MockitoBean
    private NotificationService notificationService;

    @MockitoBean
    private UserRepository userRepository;

    private String validToken;
    private NotificationResponse sampleResponse;

    @BeforeEach
    void setUp() {
        User user = new User("Farmer Joe", "farmer@example.com", "9876543210", "pwd_hash", Role.FARMER);
        user.setId(10L);
        when(userRepository.findByEmail("farmer@example.com")).thenReturn(Optional.of(user));
        validToken = jwtUtil.generateToken(user);

        sampleResponse = new NotificationResponse();
        sampleResponse.setId(101L);
        sampleResponse.setUserId(10L);
        sampleResponse.setType("WEATHER");
        sampleResponse.setSeverity("WARNING");
        sampleResponse.setTitle("Heavy Rain Alert");
        sampleResponse.setMessage("Heavy rainfall anticipated");
        sampleResponse.setRelatedRoute("/weather");
        sampleResponse.setActionLabel("View Weather");
        sampleResponse.setRead(false);
        sampleResponse.setCreatedAt(LocalDateTime.now());
    }

    @Test
    @DisplayName("GET /notifications returns 401 Unauthorized when unauthenticated")
    void testGetNotificationsUnauthenticated() throws Exception {
        mockMvc.perform(get("/notifications"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /notifications returns 200 with paginated notifications")
    void testGetNotificationsSuccess() throws Exception {
        when(notificationService.getNotifications(isNull(), isNull(), isNull(), any(Pageable.class), eq("farmer@example.com")))
                .thenReturn(new PageImpl<>(List.of(sampleResponse)));

        mockMvc.perform(get("/notifications")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content[0].id").value(101))
                .andExpect(jsonPath("$.data.content[0].type").value("WEATHER"))
                .andExpect(jsonPath("$.data.content[0].severity").value("WARNING"))
                .andExpect(jsonPath("$.data.content[0].title").value("Heavy Rain Alert"));
    }

    @Test
    @DisplayName("GET /notifications/unread-count returns 200 with unread count")
    void testGetUnreadCount() throws Exception {
        when(notificationService.getUnreadCount("farmer@example.com")).thenReturn(3L);

        mockMvc.perform(get("/notifications/unread-count")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.unreadCount").value(3));
    }

    @Test
    @DisplayName("GET /notifications/summary returns 200 with summary metrics")
    void testGetSummary() throws Exception {
        NotificationSummaryResponse summary = new NotificationSummaryResponse(
                10L, 3L, 7L,
                Map.of("WEATHER", 6L, "ADVISORY", 4L),
                Map.of("WARNING", 3L, "INFO", 7L)
        );
        when(notificationService.getNotificationSummary("farmer@example.com")).thenReturn(summary);

        mockMvc.perform(get("/notifications/summary")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.total").value(10))
                .andExpect(jsonPath("$.data.unread").value(3))
                .andExpect(jsonPath("$.data.read").value(7))
                .andExpect(jsonPath("$.data.byType.WEATHER").value(6));
    }

    @Test
    @DisplayName("PATCH /notifications/{id}/read marks notification as read")
    void testMarkAsRead() throws Exception {
        sampleResponse.setRead(true);
        sampleResponse.setReadAt(LocalDateTime.now());
        when(notificationService.markAsRead(101L, "farmer@example.com")).thenReturn(sampleResponse);

        mockMvc.perform(patch("/notifications/101/read")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.isRead").value(true));
    }

    @Test
    @DisplayName("PATCH /notifications/{id}/unread marks notification as unread")
    void testMarkAsUnread() throws Exception {
        sampleResponse.setRead(false);
        sampleResponse.setReadAt(null);
        when(notificationService.markAsUnread(101L, "farmer@example.com")).thenReturn(sampleResponse);

        mockMvc.perform(patch("/notifications/101/unread")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.isRead").value(false));
    }

    @Test
    @DisplayName("PATCH /notifications/read-all marks all unread notifications as read")
    void testMarkAllAsRead() throws Exception {
        when(notificationService.markAllAsRead("farmer@example.com")).thenReturn(5);

        mockMvc.perform(patch("/notifications/read-all")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.markedAsReadCount").value(5));
    }

    @Test
    @DisplayName("DELETE /notifications/{id} deletes notification")
    void testDeleteNotification() throws Exception {
        doNothing().when(notificationService).deleteNotification(101L, "farmer@example.com");

        mockMvc.perform(delete("/notifications/101")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("DELETE /notifications/{id} returns 404 when notification not found or cross-user")
    void testDeleteNotificationNotFound() throws Exception {
        doThrow(new ResourceNotFoundException("Notification", "id", 999L))
                .when(notificationService).deleteNotification(999L, "farmer@example.com");

        mockMvc.perform(delete("/notifications/999")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("DELETE /notifications clears all notifications")
    void testClearAllNotifications() throws Exception {
        doNothing().when(notificationService).clearAllNotifications("farmer@example.com");

        mockMvc.perform(delete("/notifications")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}

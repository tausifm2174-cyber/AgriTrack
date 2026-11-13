package com.agritrack;

import com.agritrack.dto.ActivityRequest;
import com.agritrack.dto.ActivityResponse;
import com.agritrack.entity.Role;
import com.agritrack.entity.User;
import com.agritrack.exception.ResourceNotFoundException;
import com.agritrack.repository.UserRepository;
import com.agritrack.service.ActivityService;
import com.agritrack.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("ActivityController Tests")
class ActivityControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUtil jwtUtil;

    @MockitoBean
    private ActivityService activityService;

    @MockitoBean
    private UserRepository userRepository;

    private String validToken;

    @BeforeEach
    void setUp() {
        User user = new User("Farmer Joe", "farmer@example.com", "9876543210", "pwd_hash", Role.FARMER);
        user.setId(10L);
        when(userRepository.findByEmail("farmer@example.com")).thenReturn(Optional.of(user));
        validToken = jwtUtil.generateToken(user);
    }

    @Test
    @DisplayName("GET /activities without authentication returns HTTP 401")
    void shouldReturn401WhenUnauthenticated() throws Exception {
        mockMvc.perform(get("/activities"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /fields/{fieldId}/activities creates activity and returns HTTP 201")
    void shouldCreateActivity() throws Exception {
        ActivityResponse response = new ActivityResponse();
        response.setId(300L);
        response.setFieldId(10L);
        response.setTitle("Organic Top-Dressing");
        response.setActivityType("Fertilizing");
        response.setStatus("Planned");
        response.setActivityDate(LocalDate.of(2026, 11, 20));

        when(activityService.createActivity(eq(10L), any(ActivityRequest.class), eq("farmer@example.com")))
                .thenReturn(response);

        String payload = """
                {
                  "title": "Organic Top-Dressing",
                  "activityType": "Fertilizing",
                  "status": "Planned",
                  "priority": "Medium",
                  "activityDate": "2026-11-20",
                  "activityTime": "07:00 AM",
                  "durationHours": 2.5,
                  "operator": "Joe",
                  "quantity": 50.0,
                  "quantityUnit": "kg"
                }
                """;

        mockMvc.perform(post("/fields/10/activities")
                        .header("Authorization", "Bearer " + validToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(300))
                .andExpect(jsonPath("$.data.title").value("Organic Top-Dressing"));
    }

    @Test
    @DisplayName("POST /fields/{fieldId}/activities with invalid activityType returns HTTP 400")
    void shouldReturn400OnInvalidActivityType() throws Exception {
        String invalidPayload = """
                {
                  "title": "Invalid Type Test",
                  "activityType": "UnknownType",
                  "activityDate": "2026-11-20"
                }
                """;

        mockMvc.perform(post("/fields/10/activities")
                        .header("Authorization", "Bearer " + validToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidPayload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("GET /fields/{fieldId}/activities returns list")
    void shouldGetActivitiesByField() throws Exception {
        ActivityResponse response = new ActivityResponse();
        response.setId(300L);
        response.setTitle("Organic Top-Dressing");

        when(activityService.getActivitiesByField(10L, "farmer@example.com"))
                .thenReturn(List.of(response));

        mockMvc.perform(get("/fields/10/activities")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].title").value("Organic Top-Dressing"));
    }

    @Test
    @DisplayName("GET /activities returns all activities for user")
    void shouldGetAllActivities() throws Exception {
        ActivityResponse response = new ActivityResponse();
        response.setId(300L);
        response.setTitle("Organic Top-Dressing");

        when(activityService.getAllActivitiesForUser("farmer@example.com"))
                .thenReturn(List.of(response));

        mockMvc.perform(get("/activities")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].title").value("Organic Top-Dressing"));
    }

    @Test
    @DisplayName("GET /activities/{id} returns 404 when unowned or not found")
    void shouldReturn404WhenActivityNotFound() throws Exception {
        when(activityService.getActivityById(999L, "farmer@example.com"))
                .thenThrow(new ResourceNotFoundException("Activity not found with id: 999"));

        mockMvc.perform(get("/activities/999")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("DELETE /activities/{id} deletes successfully")
    void shouldDeleteActivity() throws Exception {
        mockMvc.perform(delete("/activities/300")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Activity deleted successfully"));
    }
}


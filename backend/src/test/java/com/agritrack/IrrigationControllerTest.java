package com.agritrack;

import com.agritrack.dto.IrrigationRequest;
import com.agritrack.dto.IrrigationResponse;
import com.agritrack.entity.Role;
import com.agritrack.entity.User;
import com.agritrack.exception.ResourceNotFoundException;
import com.agritrack.repository.UserRepository;
import com.agritrack.service.IrrigationService;
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
@DisplayName("IrrigationController Tests")
class IrrigationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUtil jwtUtil;

    @MockitoBean
    private IrrigationService irrigationService;

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
    @DisplayName("GET /irrigation without authentication returns HTTP 401")
    void shouldReturn401WhenUnauthenticated() throws Exception {
        mockMvc.perform(get("/irrigation"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /fields/{fieldId}/irrigation creates irrigation schedule and returns HTTP 201")
    void shouldCreateIrrigation() throws Exception {
        IrrigationResponse response = new IrrigationResponse();
        response.setId(400L);
        response.setFieldId(10L);
        response.setTitle("Field 1A Drip Run");
        response.setIrrigationMethod("Drip");
        response.setStatus("Scheduled");
        response.setDurationMinutes(60);

        when(irrigationService.createIrrigation(eq(10L), any(IrrigationRequest.class), eq("farmer@example.com")))
                .thenReturn(response);

        String payload = """
                {
                  "title": "Field 1A Drip Run",
                  "irrigationMethod": "Drip",
                  "status": "Scheduled",
                  "priority": "High",
                  "scheduledDate": "2026-11-20",
                  "scheduledTime": "06:30 AM",
                  "durationMinutes": 60,
                  "waterVolumeLitres": 18000.0,
                  "soilMoisture": 38.0
                }
                """;

        mockMvc.perform(post("/fields/10/irrigation")
                        .header("Authorization", "Bearer " + validToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(400))
                .andExpect(jsonPath("$.data.title").value("Field 1A Drip Run"));
    }

    @Test
    @DisplayName("POST /fields/{fieldId}/irrigation with invalid irrigationMethod returns HTTP 400")
    void shouldReturn400OnInvalidMethod() throws Exception {
        String invalidPayload = """
                {
                  "title": "Invalid Run",
                  "irrigationMethod": "ManualBucket",
                  "scheduledDate": "2026-11-20",
                  "durationMinutes": 60
                }
                """;

        mockMvc.perform(post("/fields/10/irrigation")
                        .header("Authorization", "Bearer " + validToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidPayload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("GET /fields/{fieldId}/irrigation returns list")
    void shouldGetIrrigationByField() throws Exception {
        IrrigationResponse response = new IrrigationResponse();
        response.setId(400L);
        response.setTitle("Field 1A Drip Run");

        when(irrigationService.getIrrigationsByField(10L, "farmer@example.com"))
                .thenReturn(List.of(response));

        mockMvc.perform(get("/fields/10/irrigation")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].title").value("Field 1A Drip Run"));
    }

    @Test
    @DisplayName("GET /irrigation returns all irrigation schedules for user")
    void shouldGetAllIrrigations() throws Exception {
        IrrigationResponse response = new IrrigationResponse();
        response.setId(400L);
        response.setTitle("Field 1A Drip Run");

        when(irrigationService.getAllIrrigationsForUser("farmer@example.com"))
                .thenReturn(List.of(response));

        mockMvc.perform(get("/irrigation")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].title").value("Field 1A Drip Run"));
    }

    @Test
    @DisplayName("GET /irrigation/{id} returns 404 when unowned or not found")
    void shouldReturn404WhenIrrigationNotFound() throws Exception {
        when(irrigationService.getIrrigationById(999L, "farmer@example.com"))
                .thenThrow(new ResourceNotFoundException("Irrigation schedule not found with id: 999"));

        mockMvc.perform(get("/irrigation/999")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("DELETE /irrigation/{id} deletes successfully")
    void shouldDeleteIrrigation() throws Exception {
        mockMvc.perform(delete("/irrigation/400")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Irrigation schedule deleted successfully"));
    }
}


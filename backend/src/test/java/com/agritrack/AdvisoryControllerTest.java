package com.agritrack;

import com.agritrack.dto.AdvisoryResponse;
import com.agritrack.dto.AdvisoryStatusUpdateRequest;
import com.agritrack.entity.Role;
import com.agritrack.entity.User;
import com.agritrack.exception.ResourceNotFoundException;
import com.agritrack.repository.UserRepository;
import com.agritrack.service.AdvisoryService;
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

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("AdvisoryController Tests")
class AdvisoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUtil jwtUtil;

    @MockitoBean
    private AdvisoryService advisoryService;

    @MockitoBean
    private UserRepository userRepository;

    private String validToken;
    private AdvisoryResponse sampleAdvisory;

    @BeforeEach
    void setUp() {
        User user = new User("Farmer Joe", "farmer@example.com", "9876543210", "pwd_hash", Role.FARMER);
        user.setId(10L);
        when(userRepository.findByEmail("farmer@example.com")).thenReturn(Optional.of(user));
        validToken = jwtUtil.generateToken(user);

        sampleAdvisory = new AdvisoryResponse();
        sampleAdvisory.setId(1L);
        sampleAdvisory.setFarmId(100L);
        sampleAdvisory.setFarmName("Nashik Farm");
        sampleAdvisory.setRuleCode("RULE_HEAVY_RAINFALL");
        sampleAdvisory.setCategory("WATER_MANAGEMENT");
        sampleAdvisory.setAdvisoryType("IRRIGATION");
        sampleAdvisory.setSeverity("WARNING");
        sampleAdvisory.setTitle("Heavy Rainfall Warning");
        sampleAdvisory.setMessage("Rainfall of 32.50 mm exceeds 25.0 mm threshold.");
        sampleAdvisory.setTriggerCondition("Rainfall > 25.0 mm (Current: 32.50 mm)");
        sampleAdvisory.setRecommendedAction("Suspend irrigation immediately.");
        sampleAdvisory.setStatus("ACTIVE");
        sampleAdvisory.setCreatedAt(LocalDateTime.now());
        sampleAdvisory.setUpdatedAt(LocalDateTime.now());
    }

    @Test
    @DisplayName("GET /farms/{farmId}/advisories returns 200 with list of farm advisories")
    void testGetFarmAdvisories() throws Exception {
        when(advisoryService.getAdvisoriesForFarm(100L, null, "farmer@example.com"))
                .thenReturn(List.of(sampleAdvisory));

        mockMvc.perform(get("/farms/100/advisories")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].id").value(1))
                .andExpect(jsonPath("$.data[0].ruleCode").value("RULE_HEAVY_RAINFALL"))
                .andExpect(jsonPath("$.data[0].severity").value("WARNING"));
    }

    @Test
    @DisplayName("GET /advisories returns 200 with all user advisories across farms")
    void testGetAllAdvisories() throws Exception {
        when(advisoryService.getAllAdvisoriesForUser(null, "farmer@example.com"))
                .thenReturn(List.of(sampleAdvisory));

        mockMvc.perform(get("/advisories")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].id").value(1));
    }

    @Test
    @DisplayName("POST /farms/{farmId}/advisories/evaluate evaluates and returns advisories")
    void testEvaluateAdvisories() throws Exception {
        when(advisoryService.evaluateFarmAdvisories(100L, "farmer@example.com"))
                .thenReturn(List.of(sampleAdvisory));

        mockMvc.perform(post("/farms/100/advisories/evaluate")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].ruleCode").value("RULE_HEAVY_RAINFALL"));
    }

    @Test
    @DisplayName("PATCH /advisories/{id}/status updates status to ACKNOWLEDGED with 200")
    void testUpdateStatusValid() throws Exception {
        sampleAdvisory.setStatus("ACKNOWLEDGED");
        when(advisoryService.updateAdvisoryStatus(eq(1L), any(AdvisoryStatusUpdateRequest.class), eq("farmer@example.com")))
                .thenReturn(sampleAdvisory);

        String json = "{\"status\": \"ACKNOWLEDGED\"}";

        mockMvc.perform(patch("/advisories/1/status")
                        .header("Authorization", "Bearer " + validToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("ACKNOWLEDGED"));
    }

    @Test
    @DisplayName("PATCH /advisories/{id}/status rejects invalid or unpermitted status (e.g. RESOLVED or ACTIVE) with 400 Bad Request")
    void testUpdateStatusInvalid() throws Exception {
        String json1 = "{\"status\": \"RESOLVED\"}";

        mockMvc.perform(patch("/advisories/1/status")
                        .header("Authorization", "Bearer " + validToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json1))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));

        String json2 = "{\"status\": \"ACTIVE\"}";

        mockMvc.perform(patch("/advisories/1/status")
                        .header("Authorization", "Bearer " + validToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json2))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("PATCH /advisories/{id}/status returns 404 when advisory not found")
    void testUpdateStatusNotFound() throws Exception {
        when(advisoryService.updateAdvisoryStatus(eq(999L), any(AdvisoryStatusUpdateRequest.class), eq("farmer@example.com")))
                .thenThrow(new ResourceNotFoundException("Advisory not found with id: 999"));

        String json = "{\"status\": \"DISMISSED\"}";

        mockMvc.perform(patch("/advisories/999/status")
                        .header("Authorization", "Bearer " + validToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Advisory not found with id: 999"));
    }
}


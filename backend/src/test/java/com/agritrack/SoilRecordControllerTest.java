package com.agritrack;

import com.agritrack.dto.SoilRecordRequest;
import com.agritrack.dto.SoilRecordResponse;
import com.agritrack.entity.Role;
import com.agritrack.entity.User;
import com.agritrack.exception.ResourceNotFoundException;
import com.agritrack.repository.UserRepository;
import com.agritrack.service.SoilRecordService;
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
@DisplayName("SoilRecordController Tests")
class SoilRecordControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUtil jwtUtil;

    @MockitoBean
    private SoilRecordService soilRecordService;

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
    @DisplayName("GET /soil-records/1 without authentication returns HTTP 401")
    void shouldReturn401WhenUnauthenticated() throws Exception {
        mockMvc.perform(get("/soil-records/1"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /fields/{fieldId}/soil-records creates record and returns HTTP 201")
    void shouldCreateSoilRecord() throws Exception {
        SoilRecordResponse response = new SoilRecordResponse();
        response.setId(100L);
        response.setFieldId(10L);
        response.setSoilType("Alluvial Loam");
        response.setPh(new BigDecimal("6.80"));
        response.setRecordedAt(LocalDate.of(2026, 3, 28));

        when(soilRecordService.createSoilRecord(eq(10L), any(SoilRecordRequest.class), eq("farmer@example.com")))
                .thenReturn(response);

        String payload = """
                {
                  "soilType": "Alluvial Loam",
                  "ph": 6.80,
                  "nitrogen": 285.0,
                  "phosphorus": 22.0,
                  "potassium": 290.0,
                  "organicMatter": 0.72,
                  "moisture": 42.0,
                  "recordedAt": "2026-03-28",
                  "notes": "Optimal"
                }
                """;

        mockMvc.perform(post("/fields/10/soil-records")
                        .header("Authorization", "Bearer " + validToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.ph").value(6.80))
                .andExpect(jsonPath("$.data.fieldId").value(10));
    }

    @Test
    @DisplayName("GET /fields/{fieldId}/soil-records returns records for field")
    void shouldGetSoilRecordsByField() throws Exception {
        SoilRecordResponse response = new SoilRecordResponse();
        response.setId(100L);
        response.setSoilType("Alluvial Loam");

        when(soilRecordService.getSoilRecordsByField(10L, "farmer@example.com"))
                .thenReturn(List.of(response));

        mockMvc.perform(get("/fields/10/soil-records")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].soilType").value("Alluvial Loam"));
    }

    @Test
    @DisplayName("GET /soil-records/{id} returns 404 when record not found or not owned")
    void shouldReturn404WhenSoilRecordNotFound() throws Exception {
        when(soilRecordService.getSoilRecordById(999L, "farmer@example.com"))
                .thenThrow(new ResourceNotFoundException("Soil record not found with id: 999"));

        mockMvc.perform(get("/soil-records/999")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("DELETE /soil-records/{id} deletes soil record successfully")
    void shouldDeleteSoilRecord() throws Exception {
        mockMvc.perform(delete("/soil-records/100")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Soil record deleted successfully"));
    }
}

package com.agritrack;

import com.agritrack.dto.FieldRequest;
import com.agritrack.dto.FieldResponse;
import com.agritrack.entity.Role;
import com.agritrack.entity.User;
import com.agritrack.exception.ResourceNotFoundException;
import com.agritrack.repository.UserRepository;
import com.agritrack.service.FieldService;
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
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("FieldController Tests")
class FieldControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUtil jwtUtil;

    @MockitoBean
    private FieldService fieldService;

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
    @DisplayName("GET /fields/1 without authentication returns HTTP 401")
    void shouldReturn401WhenUnauthenticated() throws Exception {
        mockMvc.perform(get("/fields/1"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /farms/{farmId}/fields creates field under farm and returns HTTP 201")
    void shouldCreateFieldUnderFarm() throws Exception {
        FieldResponse response = new FieldResponse();
        response.setId(10L);
        response.setFarmId(1L);
        response.setFieldName("Sector A");
        response.setArea(new BigDecimal("12.50"));
        response.setAreaUnit("Acres");

        when(fieldService.createField(eq(1L), any(FieldRequest.class), eq("farmer@example.com")))
                .thenReturn(response);

        String payload = """
                {
                  "fieldName": "Sector A",
                  "area": 12.50,
                  "areaUnit": "Acres",
                  "soilType": "Alluvial",
                  "irrigationType": "Drip"
                }
                """;

        mockMvc.perform(post("/farms/1/fields")
                        .header("Authorization", "Bearer " + validToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.fieldName").value("Sector A"))
                .andExpect(jsonPath("$.data.farmId").value(1));
    }

    @Test
    @DisplayName("GET /farms/{farmId}/fields returns fields for farm")
    void shouldGetFieldsByFarm() throws Exception {
        FieldResponse response = new FieldResponse();
        response.setId(10L);
        response.setFieldName("Sector A");

        when(fieldService.getFieldsByFarm(1L, "farmer@example.com")).thenReturn(List.of(response));

        mockMvc.perform(get("/farms/1/fields")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].fieldName").value("Sector A"));
    }

    @Test
    @DisplayName("GET /fields/{id} returns 404 when field not found or not owned")
    void shouldReturn404WhenFieldNotFound() throws Exception {
        when(fieldService.getFieldById(999L, "farmer@example.com"))
                .thenThrow(new ResourceNotFoundException("Field not found with id: 999"));

        mockMvc.perform(get("/fields/999")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("DELETE /fields/{id} deletes field successfully")
    void shouldDeleteField() throws Exception {
        mockMvc.perform(delete("/fields/10")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Field deleted successfully"));
    }
}

package com.agritrack;

import com.agritrack.dto.FarmRequest;
import com.agritrack.dto.FarmResponse;
import com.agritrack.entity.Role;
import com.agritrack.entity.User;
import com.agritrack.exception.ResourceNotFoundException;
import com.agritrack.repository.UserRepository;
import com.agritrack.service.FarmService;
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
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("FarmController Tests")
class FarmControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUtil jwtUtil;

    @MockitoBean
    private FarmService farmService;

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
    @DisplayName("GET /farms without authentication returns HTTP 401")
    void shouldReturn401WhenUnauthenticated() throws Exception {
        mockMvc.perform(get("/farms"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /farms creates farm and returns HTTP 201")
    void shouldCreateFarm() throws Exception {
        FarmResponse response = new FarmResponse();
        response.setId(1L);
        response.setUserId(10L);
        response.setFarmName("Green Valley Farm");
        response.setLocation("Karnal");
        response.setTotalArea(new BigDecimal("45.50"));
        response.setAreaUnit("Acres");
        response.setStatus("Active");
        response.setCreatedAt(LocalDateTime.now());
        response.setUpdatedAt(LocalDateTime.now());

        when(farmService.createFarm(any(FarmRequest.class), eq("farmer@example.com"))).thenReturn(response);

        String payload = """
                {
                  "farmName": "Green Valley Farm",
                  "location": "Karnal",
                  "totalArea": 45.50,
                  "areaUnit": "Acres",
                  "status": "Active"
                }
                """;

        mockMvc.perform(post("/farms")
                        .header("Authorization", "Bearer " + validToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.farmName").value("Green Valley Farm"))
                .andExpect(jsonPath("$.data.id").value(1));
    }

    @Test
    @DisplayName("GET /farms returns list of user farms")
    void shouldReturnUserFarms() throws Exception {
        FarmResponse response = new FarmResponse();
        response.setId(1L);
        response.setFarmName("Green Valley Farm");
        when(farmService.getAllFarmsForUser("farmer@example.com")).thenReturn(List.of(response));

        mockMvc.perform(get("/farms")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].farmName").value("Green Valley Farm"));
    }

    @Test
    @DisplayName("GET /farms/{id} returns 404 if farm not found or not owned")
    void shouldReturn404WhenFarmNotFound() throws Exception {
        when(farmService.getFarmById(999L, "farmer@example.com"))
                .thenThrow(new ResourceNotFoundException("Farm not found with id: 999"));

        mockMvc.perform(get("/farms/999")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("DELETE /farms/{id} deletes farm successfully")
    void shouldDeleteFarm() throws Exception {
        mockMvc.perform(delete("/farms/1")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Farm deleted successfully"));
    }
}

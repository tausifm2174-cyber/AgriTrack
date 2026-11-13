package com.agritrack;

import com.agritrack.dto.HarvestRequest;
import com.agritrack.dto.HarvestResponse;
import com.agritrack.entity.Role;
import com.agritrack.entity.User;
import com.agritrack.exception.ResourceNotFoundException;
import com.agritrack.repository.UserRepository;
import com.agritrack.service.HarvestService;
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
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("HarvestController Tests")
class HarvestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUtil jwtUtil;

    @MockitoBean
    private HarvestService harvestService;

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
    @DisplayName("GET /harvests without authentication returns HTTP 401")
    void shouldReturn401WhenUnauthenticated() throws Exception {
        mockMvc.perform(get("/harvests"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /crop-cycles/{cropCycleId}/harvests creates harvest and returns HTTP 201")
    void shouldCreateHarvest() throws Exception {
        HarvestResponse response = new HarvestResponse();
        response.setId(300L);
        response.setCropCycleId(10L);
        response.setHarvestDate(LocalDate.of(2027, 3, 20));
        response.setHarvestedQuantityKg(new BigDecimal("5000.00"));
        response.setStatus("HARVESTED");

        when(harvestService.createHarvest(eq(10L), any(HarvestRequest.class), eq("farmer@example.com")))
                .thenReturn(response);

        String json = """
                {
                    "harvestDate": "2027-03-20",
                    "harvestedQuantityKg": 5000.00,
                    "expectedYieldKg": 4800.00,
                    "qualityGrade": "A",
                    "qualityScore": 88
                }
                """;

        mockMvc.perform(post("/crop-cycles/10/harvests")
                        .header("Authorization", "Bearer " + validToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(300L))
                .andExpect(jsonPath("$.data.status").value("HARVESTED"));
    }

    @Test
    @DisplayName("POST /crop-cycles/{cropCycleId}/harvests with missing harvestDate returns HTTP 400")
    void shouldReturn400WhenMissingRequiredFields() throws Exception {
        String json = """
                {
                    "harvestedQuantityKg": 5000.00
                }
                """;

        mockMvc.perform(post("/crop-cycles/10/harvests")
                        .header("Authorization", "Bearer " + validToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("GET /harvests returns all harvests with HTTP 200")
    void shouldReturnAllHarvests() throws Exception {
        HarvestResponse response = new HarvestResponse();
        response.setId(300L);
        response.setStatus("HARVESTED");

        when(harvestService.getAllHarvests("farmer@example.com")).thenReturn(List.of(response));

        mockMvc.perform(get("/harvests")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].id").value(300L));
    }

    @Test
    @DisplayName("GET /harvests/{id} returns harvest when found")
    void shouldReturnHarvestById() throws Exception {
        HarvestResponse response = new HarvestResponse();
        response.setId(300L);
        response.setStatus("HARVESTED");

        when(harvestService.getHarvestById(300L, "farmer@example.com")).thenReturn(response);

        mockMvc.perform(get("/harvests/300")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(300L));
    }

    @Test
    @DisplayName("GET /harvests/{id} returns HTTP 404 when unowned or not found")
    void shouldReturn404WhenHarvestNotFound() throws Exception {
        when(harvestService.getHarvestById(999L, "farmer@example.com"))
                .thenThrow(new ResourceNotFoundException("Harvest not found with id: 999"));

        mockMvc.perform(get("/harvests/999")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("DELETE /harvests/{id} returns HTTP 204 on success")
    void shouldDeleteHarvest() throws Exception {
        doNothing().when(harvestService).deleteHarvest(300L, "farmer@example.com");

        mockMvc.perform(delete("/harvests/300")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isNoContent());
    }
}

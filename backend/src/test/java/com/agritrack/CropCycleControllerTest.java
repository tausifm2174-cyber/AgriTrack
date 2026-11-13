package com.agritrack;

import com.agritrack.dto.CropCycleRequest;
import com.agritrack.dto.CropCycleResponse;
import com.agritrack.entity.Role;
import com.agritrack.entity.User;
import com.agritrack.exception.ResourceNotFoundException;
import com.agritrack.repository.UserRepository;
import com.agritrack.service.CropCycleService;
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
@DisplayName("CropCycleController Tests")
class CropCycleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUtil jwtUtil;

    @MockitoBean
    private CropCycleService cropCycleService;

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
    @DisplayName("GET /crop-cycles without authentication returns HTTP 401")
    void shouldReturn401WhenUnauthenticated() throws Exception {
        mockMvc.perform(get("/crop-cycles"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /fields/{fieldId}/crop-cycles creates crop cycle and returns HTTP 201")
    void shouldCreateCropCycle() throws Exception {
        CropCycleResponse response = new CropCycleResponse();
        response.setId(200L);
        response.setFieldId(10L);
        response.setCropName("Wheat");
        response.setVariety("Sharbati");
        response.setSeason("Rabi");
        response.setSowingDate(LocalDate.of(2026, 11, 15));
        response.setExpectedHarvestDate(LocalDate.of(2027, 3, 15));

        when(cropCycleService.createCropCycle(eq(10L), any(CropCycleRequest.class), eq("farmer@example.com")))
                .thenReturn(response);

        String payload = """
                {
                  "cropName": "Wheat",
                  "variety": "Sharbati",
                  "season": "Rabi",
                  "sowingDate": "2026-11-15",
                  "expectedHarvestDate": "2027-03-15",
                  "currentStage": "Vegetative Growth",
                  "currentStageStep": 2,
                  "progressPercent": 45,
                  "status": "Active"
                }
                """;

        mockMvc.perform(post("/fields/10/crop-cycles")
                        .header("Authorization", "Bearer " + validToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(200))
                .andExpect(jsonPath("$.data.cropName").value("Wheat"))
                .andExpect(jsonPath("$.data.variety").value("Sharbati"));
    }

    @Test
    @DisplayName("POST /fields/{fieldId}/crop-cycles with missing required fields returns HTTP 400")
    void shouldReturn400OnValidationFailure() throws Exception {
        String invalidPayload = """
                {
                  "cropName": "",
                  "variety": "Sharbati"
                }
                """;

        mockMvc.perform(post("/fields/10/crop-cycles")
                        .header("Authorization", "Bearer " + validToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidPayload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("GET /fields/{fieldId}/crop-cycles returns list of crop cycles for field")
    void shouldGetCropCyclesByField() throws Exception {
        CropCycleResponse response = new CropCycleResponse();
        response.setId(200L);
        response.setCropName("Wheat");

        when(cropCycleService.getCropCyclesByField(10L, "farmer@example.com"))
                .thenReturn(List.of(response));

        mockMvc.perform(get("/fields/10/crop-cycles")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].cropName").value("Wheat"));
    }

    @Test
    @DisplayName("GET /crop-cycles returns all user crop cycles")
    void shouldGetAllUserCropCycles() throws Exception {
        CropCycleResponse response = new CropCycleResponse();
        response.setId(200L);
        response.setCropName("Wheat");

        when(cropCycleService.getAllCropCyclesForUser("farmer@example.com"))
                .thenReturn(List.of(response));

        mockMvc.perform(get("/crop-cycles")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].cropName").value("Wheat"));
    }

    @Test
    @DisplayName("GET /crop-cycles/{id} returns crop cycle by ID")
    void shouldGetCropCycleById() throws Exception {
        CropCycleResponse response = new CropCycleResponse();
        response.setId(200L);
        response.setCropName("Wheat");

        when(cropCycleService.getCropCycleById(200L, "farmer@example.com"))
                .thenReturn(response);

        mockMvc.perform(get("/crop-cycles/200")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.cropName").value("Wheat"));
    }

    @Test
    @DisplayName("GET /crop-cycles/{id} returns 404 when unowned or nonexistent")
    void shouldReturn404WhenCropCycleNotFound() throws Exception {
        when(cropCycleService.getCropCycleById(999L, "farmer@example.com"))
                .thenThrow(new ResourceNotFoundException("Crop cycle not found with id: 999"));

        mockMvc.perform(get("/crop-cycles/999")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("PUT /crop-cycles/{id} updates crop cycle successfully")
    void shouldUpdateCropCycle() throws Exception {
        CropCycleResponse response = new CropCycleResponse();
        response.setId(200L);
        response.setCropName("Wheat");
        response.setVariety("Sharbati");

        when(cropCycleService.updateCropCycle(eq(200L), any(CropCycleRequest.class), eq("farmer@example.com")))
                .thenReturn(response);

        String payload = """
                {
                  "cropName": "Wheat",
                  "variety": "Sharbati",
                  "season": "Rabi",
                  "sowingDate": "2026-11-15",
                  "expectedHarvestDate": "2027-03-20",
                  "currentStage": "Flowering",
                  "currentStageStep": 3,
                  "progressPercent": 65,
                  "status": "Active"
                }
                """;

        mockMvc.perform(put("/crop-cycles/200")
                        .header("Authorization", "Bearer " + validToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(200));
    }

    @Test
    @DisplayName("DELETE /crop-cycles/{id} deletes crop cycle successfully")
    void shouldDeleteCropCycle() throws Exception {
        mockMvc.perform(delete("/crop-cycles/200")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Crop cycle deleted successfully"));
    }
}


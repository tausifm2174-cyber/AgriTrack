package com.agritrack;

import com.agritrack.dto.WeatherForecastResponse;
import com.agritrack.dto.WeatherSnapshotResponse;
import com.agritrack.dto.WeatherSyncResponse;
import com.agritrack.entity.Role;
import com.agritrack.entity.User;
import com.agritrack.exception.ResourceNotFoundException;
import com.agritrack.repository.UserRepository;
import com.agritrack.service.WeatherService;
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
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("WeatherController Tests")
class WeatherControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUtil jwtUtil;

    @MockitoBean
    private WeatherService weatherService;

    @MockitoBean
    private UserRepository userRepository;

    private String validToken;
    private WeatherSnapshotResponse sampleSnapshot;

    @BeforeEach
    void setUp() {
        User user = new User("Farmer Joe", "farmer@example.com", "9876543210", "pwd_hash", Role.FARMER);
        user.setId(10L);
        when(userRepository.findByEmail("farmer@example.com")).thenReturn(Optional.of(user));
        validToken = jwtUtil.generateToken(user);

        sampleSnapshot = new WeatherSnapshotResponse();
        sampleSnapshot.setId(1L);
        sampleSnapshot.setFarmId(100L);
        sampleSnapshot.setFarmName("Nashik Farm");
        sampleSnapshot.setLocation("Nashik, Maharashtra");
        sampleSnapshot.setTemperature(new BigDecimal("28.50"));
        sampleSnapshot.setFeelsLike(new BigDecimal("30.20"));
        sampleSnapshot.setHumidity(65);
        sampleSnapshot.setWindSpeedKmh(new BigDecimal("14.00"));
        sampleSnapshot.setRainfallMm(new BigDecimal("0.00"));
        sampleSnapshot.setConditionText("Clear Sky");
        sampleSnapshot.setConditionCode("CLEAR");
        sampleSnapshot.setProvider("SIMULATION");
        sampleSnapshot.setCached(false);
    }

    @Test
    @DisplayName("GET /farms/{farmId}/weather/current returns 200 with current weather")
    void testGetCurrentWeather() throws Exception {
        when(weatherService.getCurrentWeather(100L, "farmer@example.com")).thenReturn(sampleSnapshot);

        mockMvc.perform(get("/farms/100/weather/current")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.farmId").value(100))
                .andExpect(jsonPath("$.data.temperature").value(28.50))
                .andExpect(jsonPath("$.data.conditionCode").value("CLEAR"));
    }

    @Test
    @DisplayName("GET /farms/{farmId}/weather/forecast returns 200 with 7-day forecast")
    void testGetForecast() throws Exception {
        WeatherForecastResponse day1 = new WeatherForecastResponse();
        day1.setId(1L);
        day1.setFarmId(100L);
        day1.setForecastDate(LocalDate.now());
        day1.setDayLabel("Today");
        day1.setMinTemp(new BigDecimal("20.00"));
        day1.setMaxTemp(new BigDecimal("30.00"));
        day1.setHumidity(60);
        day1.setRainChancePercent(10);
        day1.setRainMm(new BigDecimal("0.00"));
        day1.setWindSpeedKmh(new BigDecimal("12.00"));
        day1.setConditionText("Sunny");
        day1.setConditionCode("SUNNY");

        when(weatherService.getForecast(100L, "farmer@example.com")).thenReturn(List.of(day1));

        mockMvc.perform(get("/farms/100/weather/forecast")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].farmId").value(100))
                .andExpect(jsonPath("$.data[0].dayLabel").value("Today"))
                .andExpect(jsonPath("$.data[0].minTemp").value(20.00));
    }

    @Test
    @DisplayName("POST /farms/{farmId}/weather/sync returns 200 with fresh sync response")
    void testSyncWeather() throws Exception {
        WeatherSyncResponse syncResponse = new WeatherSyncResponse(
                sampleSnapshot,
                List.of(),
                "SIMULATION",
                LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(30)
        );

        when(weatherService.syncWeather(100L, "farmer@example.com")).thenReturn(syncResponse);

        mockMvc.perform(post("/farms/100/weather/sync")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.provider").value("SIMULATION"))
                .andExpect(jsonPath("$.data.current.temperature").value(28.50));
    }

    @Test
    @DisplayName("GET /farms/{farmId}/weather/current returns 400 when farm location is unset")
    void testMissingLocationReturns400() throws Exception {
        when(weatherService.getCurrentWeather(100L, "farmer@example.com"))
                .thenThrow(new IllegalArgumentException("Farm location is not set. Please update the farm location to retrieve weather data."));

        mockMvc.perform(get("/farms/100/weather/current")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Farm location is not set. Please update the farm location to retrieve weather data."));
    }

    @Test
    @DisplayName("GET /farms/{farmId}/weather/current returns 404 when farm is not found")
    void testFarmNotFoundReturns404() throws Exception {
        when(weatherService.getCurrentWeather(999L, "farmer@example.com"))
                .thenThrow(new ResourceNotFoundException("Farm not found with id: 999"));

        mockMvc.perform(get("/farms/999/weather/current")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Farm not found with id: 999"));
    }
}


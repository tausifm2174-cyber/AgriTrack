package com.agritrack;

import com.agritrack.dto.WeatherForecastResponse;
import com.agritrack.dto.WeatherSnapshotResponse;
import com.agritrack.dto.WeatherSyncResponse;
import com.agritrack.entity.Farm;
import com.agritrack.entity.User;
import com.agritrack.entity.WeatherForecast;
import com.agritrack.entity.WeatherSnapshot;
import com.agritrack.exception.ResourceNotFoundException;
import com.agritrack.repository.FarmRepository;
import com.agritrack.repository.UserRepository;
import com.agritrack.repository.WeatherForecastRepository;
import com.agritrack.repository.WeatherSnapshotRepository;
import com.agritrack.service.AdvisoryRuleEngineService;
import com.agritrack.service.WeatherService;
import com.agritrack.service.weather.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("WeatherService Unit Tests")
class WeatherServiceTest {

    @Mock
    private FarmRepository farmRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private WeatherSnapshotRepository weatherSnapshotRepository;

    @Mock
    private WeatherForecastRepository weatherForecastRepository;

    @Mock
    private OpenWeatherMapClient openWeatherMapClient;

    @Mock
    private SimulationFallbackWeatherClient simulationFallbackWeatherClient;

    @Mock
    private AdvisoryRuleEngineService advisoryRuleEngineService;

    private WeatherService weatherService;

    private User user;
    private Farm farm;

    @BeforeEach
    void setUp() {
        weatherService = new WeatherService(
                farmRepository,
                userRepository,
                weatherSnapshotRepository,
                weatherForecastRepository,
                openWeatherMapClient,
                simulationFallbackWeatherClient,
                advisoryRuleEngineService,
                30 // 30 mins TTL
        );

        user = new User();
        user.setId(1L);
        user.setEmail("farmer@example.com");

        farm = new Farm();
        farm.setId(10L);
        farm.setFarmName("Nashik Vineyard");
        farm.setLocation("Nashik, Maharashtra");
        farm.setUser(user);
    }

    @Test
    @DisplayName("getCurrentWeather returns cached snapshot on cache hit")
    void testGetCurrentWeatherCacheHit() {
        when(userRepository.findByEmail("farmer@example.com")).thenReturn(Optional.of(user));
        when(farmRepository.findByIdAndUserId(10L, 1L)).thenReturn(Optional.of(farm));

        WeatherSnapshot cachedSnapshot = new WeatherSnapshot(
                farm, new BigDecimal("28.00"), new BigDecimal("29.50"),
                60, new BigDecimal("12.00"), "NE", new BigDecimal("0.00"),
                new BigDecimal("1012.00"), "Clear", "CLEAR", null, null,
                LocalDateTime.now().minusMinutes(10), // within 30 min TTL
                "OPEN_WEATHER"
        );
        cachedSnapshot.setId(100L);

        when(weatherSnapshotRepository.findFirstByFarmIdAndFarmUserIdOrderByObservedAtDesc(10L, 1L))
                .thenReturn(Optional.of(cachedSnapshot));

        WeatherSnapshotResponse response = weatherService.getCurrentWeather(10L, "farmer@example.com");

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(100L);
        assertThat(response.getCached()).isTrue();
        assertThat(response.getTemperature()).isEqualByComparingTo(new BigDecimal("28.00"));
        verifyNoInteractions(simulationFallbackWeatherClient);
        verify(weatherSnapshotRepository, never()).save(any());
    }

    @Test
    @DisplayName("getCurrentWeather triggers sync on cache miss and returns fresh data")
    void testGetCurrentWeatherCacheMissSyncs() {
        when(userRepository.findByEmail("farmer@example.com")).thenReturn(Optional.of(user));
        when(farmRepository.findByIdAndUserId(10L, 1L)).thenReturn(Optional.of(farm));
        when(weatherSnapshotRepository.findFirstByFarmIdAndFarmUserIdOrderByObservedAtDesc(10L, 1L))
                .thenReturn(Optional.empty());

        CurrentWeatherData currentData = new CurrentWeatherData(
                new BigDecimal("30.00"), new BigDecimal("32.00"), 55,
                new BigDecimal("14.00"), "E", new BigDecimal("0.00"),
                new BigDecimal("1011.00"), "Sunny", "SUNNY", null, null, LocalDateTime.now()
        );
        ForecastDayData fDay = new ForecastDayData(
                LocalDate.now(), "Today", new BigDecimal("22.00"), new BigDecimal("32.00"),
                55, 10, BigDecimal.ZERO, new BigDecimal("14.00"), "Sunny", "SUNNY"
        );
        WeatherPayload payload = new WeatherPayload(currentData, List.of(fDay), "SIMULATION");

        when(openWeatherMapClient.isConfigured()).thenReturn(false);
        when(simulationFallbackWeatherClient.fetchWeatherData(farm.getLocation())).thenReturn(payload);

        when(weatherSnapshotRepository.save(any(WeatherSnapshot.class))).thenAnswer(i -> {
            WeatherSnapshot ws = i.getArgument(0);
            ws.setId(200L);
            return ws;
        });

        when(weatherForecastRepository.save(any(WeatherForecast.class))).thenAnswer(i -> {
            WeatherForecast wf = i.getArgument(0);
            wf.setId(300L);
            return wf;
        });

        WeatherSnapshotResponse response = weatherService.getCurrentWeather(10L, "farmer@example.com");

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(200L);
        assertThat(response.getCached()).isFalse();
        assertThat(response.getProvider()).isEqualTo("SIMULATION");
        verify(advisoryRuleEngineService).evaluateAndGenerateAdvisories(eq(farm), any(), any());
    }

    @Test
    @DisplayName("Blank farm location throws IllegalArgumentException (rejects with 400)")
    void testBlankLocationThrowsException() {
        farm.setLocation("   ");
        when(userRepository.findByEmail("farmer@example.com")).thenReturn(Optional.of(user));
        when(farmRepository.findByIdAndUserId(10L, 1L)).thenReturn(Optional.of(farm));

        assertThatThrownBy(() -> weatherService.getCurrentWeather(10L, "farmer@example.com"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Farm location is not set");
    }

    @Test
    @DisplayName("Non-existent farm throws ResourceNotFoundException (404)")
    void testFarmNotFoundThrowsException() {
        when(userRepository.findByEmail("farmer@example.com")).thenReturn(Optional.of(user));
        when(farmRepository.findByIdAndUserId(999L, 1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> weatherService.getCurrentWeather(999L, "farmer@example.com"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Farm not found");
    }

    @Test
    @DisplayName("syncWeather forces provider fetch and updates advisories")
    void testSyncWeatherForcesRefresh() {
        when(userRepository.findByEmail("farmer@example.com")).thenReturn(Optional.of(user));
        when(farmRepository.findByIdAndUserId(10L, 1L)).thenReturn(Optional.of(farm));

        CurrentWeatherData currentData = new CurrentWeatherData(
                new BigDecimal("29.00"), new BigDecimal("30.50"), 70,
                new BigDecimal("15.00"), "NW", new BigDecimal("5.00"),
                new BigDecimal("1010.00"), "Showers", "RAIN", null, null, LocalDateTime.now()
        );
        ForecastDayData fDay = new ForecastDayData(
                LocalDate.now(), "Today", new BigDecimal("20.00"), new BigDecimal("30.00"),
                70, 60, new BigDecimal("5.00"), new BigDecimal("15.00"), "Showers", "RAIN"
        );
        WeatherPayload payload = new WeatherPayload(currentData, List.of(fDay), "SIMULATION");

        when(openWeatherMapClient.isConfigured()).thenReturn(false);
        when(simulationFallbackWeatherClient.fetchWeatherData(farm.getLocation())).thenReturn(payload);

        when(weatherSnapshotRepository.save(any(WeatherSnapshot.class))).thenAnswer(i -> {
            WeatherSnapshot ws = i.getArgument(0);
            ws.setId(501L);
            return ws;
        });

        when(weatherForecastRepository.save(any(WeatherForecast.class))).thenAnswer(i -> {
            WeatherForecast wf = i.getArgument(0);
            wf.setId(601L);
            return wf;
        });

        WeatherSyncResponse syncResponse = weatherService.syncWeather(10L, "farmer@example.com");

        assertThat(syncResponse).isNotNull();
        assertThat(syncResponse.getCurrent().getId()).isEqualTo(501L);
        assertThat(syncResponse.getForecast()).hasSize(1);
        assertThat(syncResponse.getProvider()).isEqualTo("SIMULATION");
        verify(advisoryRuleEngineService).evaluateAndGenerateAdvisories(eq(farm), any(), any());
    }
}


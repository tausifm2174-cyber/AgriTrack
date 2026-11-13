package com.agritrack;

import com.agritrack.entity.Advisory;
import com.agritrack.entity.Farm;
import com.agritrack.entity.User;
import com.agritrack.entity.WeatherSnapshot;
import com.agritrack.repository.AdvisoryRepository;
import com.agritrack.service.AdvisoryRuleEngineService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AdvisoryRuleEngineService Unit Tests")
class AdvisoryRuleEngineServiceTest {

    @Mock
    private AdvisoryRepository advisoryRepository;

    @InjectMocks
    private AdvisoryRuleEngineService ruleEngine;

    private Farm farm;

    @BeforeEach
    void setUp() {
        User user = new User();
        user.setId(1L);
        farm = new Farm();
        farm.setId(10L);
        farm.setFarmName("Green Valley Farm");
        farm.setLocation("Pune, Maharashtra");
        farm.setUser(user);

        lenient().when(advisoryRepository.save(any(Advisory.class))).thenAnswer(invocation -> invocation.getArgument(0));
    }

    private WeatherSnapshot createSnapshot(BigDecimal temp, Integer humidity, BigDecimal wind, BigDecimal rain) {
        WeatherSnapshot snapshot = new WeatherSnapshot();
        snapshot.setFarm(farm);
        snapshot.setTemperature(temp);
        snapshot.setFeelsLike(temp);
        snapshot.setHumidity(humidity);
        snapshot.setWindSpeedKmh(wind);
        snapshot.setRainfallMm(rain);
        snapshot.setConditionText("Clear");
        snapshot.setConditionCode("CLEAR");
        snapshot.setObservedAt(LocalDateTime.now());
        snapshot.setProvider("TEST");
        return snapshot;
    }

    @Test
    @DisplayName("Normal condition: exact boundary values (25.0mm, 85%, 20.0km/h, 35.0C) do NOT trigger any advisory")
    void testBoundaryExactValuesDoNotTrigger() {
        WeatherSnapshot snapshot = createSnapshot(
                new BigDecimal("35.0"), // temp <= 35.0
                85,                     // humidity <= 85
                new BigDecimal("20.0"), // wind <= 20.0
                new BigDecimal("25.0")  // rain <= 25.0
        );

        List<Advisory> advisories = ruleEngine.evaluateAndGenerateAdvisories(farm, snapshot, Collections.emptyList());

        assertThat(advisories).isEmpty();
        verify(advisoryRepository, never()).save(any());
    }

    @Test
    @DisplayName("Rule 1 (Rainfall): 25.01 mm triggers WARNING for Heavy Rainfall")
    void testRainfallBoundaryTrigger() {
        WeatherSnapshot snapshot = createSnapshot(
                new BigDecimal("28.0"),
                60,
                new BigDecimal("10.0"),
                new BigDecimal("25.01") // > 25.0
        );

        when(advisoryRepository.findByFarmIdAndDedupKey(eq(farm.getId()), anyString())).thenReturn(Optional.empty());

        List<Advisory> advisories = ruleEngine.evaluateAndGenerateAdvisories(farm, snapshot, Collections.emptyList());

        assertThat(advisories).hasSize(1);
        Advisory adv = advisories.get(0);
        assertThat(adv.getRuleCode()).isEqualTo(AdvisoryRuleEngineService.RULE_HEAVY_RAINFALL);
        assertThat(adv.getSeverity()).isEqualTo("WARNING");
        assertThat(adv.getCategory()).isEqualTo("WATER_MANAGEMENT");
        assertThat(adv.getAdvisoryType()).isEqualTo("IRRIGATION");
        assertThat(adv.getTitle()).isEqualTo("Heavy Rainfall Warning");
        assertThat(adv.getStatus()).isEqualTo("ACTIVE");
    }

    @Test
    @DisplayName("Rule 2 (Humidity): 86% triggers WARNING for Fungal Disease Risk")
    void testHumidityBoundaryTrigger() {
        WeatherSnapshot snapshot = createSnapshot(
                new BigDecimal("28.0"),
                86, // > 85
                new BigDecimal("10.0"),
                new BigDecimal("0.0")
        );

        when(advisoryRepository.findByFarmIdAndDedupKey(eq(farm.getId()), anyString())).thenReturn(Optional.empty());

        List<Advisory> advisories = ruleEngine.evaluateAndGenerateAdvisories(farm, snapshot, Collections.emptyList());

        assertThat(advisories).hasSize(1);
        Advisory adv = advisories.get(0);
        assertThat(adv.getRuleCode()).isEqualTo(AdvisoryRuleEngineService.RULE_HIGH_HUMIDITY);
        assertThat(adv.getSeverity()).isEqualTo("WARNING");
        assertThat(adv.getCategory()).isEqualTo("CROP_PROTECTION");
        assertThat(adv.getAdvisoryType()).isEqualTo("DISEASE");
        assertThat(adv.getTitle()).isEqualTo("Fungal Disease Risk Alert");
    }

    @Test
    @DisplayName("Rule 3 (Wind Speed): 20.01 km/h triggers ADVISORY for Spraying")
    void testWindSpeedBoundaryTrigger() {
        WeatherSnapshot snapshot = createSnapshot(
                new BigDecimal("28.0"),
                60,
                new BigDecimal("20.01"), // > 20.0
                new BigDecimal("0.0")
        );

        when(advisoryRepository.findByFarmIdAndDedupKey(eq(farm.getId()), anyString())).thenReturn(Optional.empty());

        List<Advisory> advisories = ruleEngine.evaluateAndGenerateAdvisories(farm, snapshot, Collections.emptyList());

        assertThat(advisories).hasSize(1);
        Advisory adv = advisories.get(0);
        assertThat(adv.getRuleCode()).isEqualTo(AdvisoryRuleEngineService.RULE_HIGH_WIND);
        assertThat(adv.getSeverity()).isEqualTo("ADVISORY");
        assertThat(adv.getCategory()).isEqualTo("FIELD_OPERATIONS");
        assertThat(adv.getAdvisoryType()).isEqualTo("SPRAY");
        assertThat(adv.getTitle()).isEqualTo("High Wind Spraying Advisory");
    }

    @Test
    @DisplayName("Rule 4 (Temperature): 35.01 C triggers ADVISORY for Heat Stress")
    void testTemperatureBoundaryTrigger() {
        WeatherSnapshot snapshot = createSnapshot(
                new BigDecimal("35.01"), // > 35.0
                60,
                new BigDecimal("10.0"),
                new BigDecimal("0.0")
        );

        when(advisoryRepository.findByFarmIdAndDedupKey(eq(farm.getId()), anyString())).thenReturn(Optional.empty());

        List<Advisory> advisories = ruleEngine.evaluateAndGenerateAdvisories(farm, snapshot, Collections.emptyList());

        assertThat(advisories).hasSize(1);
        Advisory adv = advisories.get(0);
        assertThat(adv.getRuleCode()).isEqualTo(AdvisoryRuleEngineService.RULE_HEAT_STRESS);
        assertThat(adv.getSeverity()).isEqualTo("ADVISORY");
        assertThat(adv.getCategory()).isEqualTo("WATER_MANAGEMENT");
        assertThat(adv.getAdvisoryType()).isEqualTo("HEAT");
        assertThat(adv.getTitle()).isEqualTo("Crop Heat Stress Advisory");
    }

    @Test
    @DisplayName("Simultaneous rules: all 4 rules trigger concurrently when thresholds exceeded")
    void testSimultaneousRulesTrigger() {
        WeatherSnapshot snapshot = createSnapshot(
                new BigDecimal("38.50"), // > 35.0
                90,                      // > 85
                new BigDecimal("25.00"), // > 20.0
                new BigDecimal("40.00")  // > 25.0
        );

        when(advisoryRepository.findByFarmIdAndDedupKey(eq(farm.getId()), anyString())).thenReturn(Optional.empty());

        List<Advisory> advisories = ruleEngine.evaluateAndGenerateAdvisories(farm, snapshot, Collections.emptyList());

        assertThat(advisories).hasSize(4);
        List<String> codes = advisories.stream().map(Advisory::getRuleCode).toList();
        assertThat(codes).containsExactlyInAnyOrder(
                AdvisoryRuleEngineService.RULE_HEAVY_RAINFALL,
                AdvisoryRuleEngineService.RULE_HIGH_HUMIDITY,
                AdvisoryRuleEngineService.RULE_HIGH_WIND,
                AdvisoryRuleEngineService.RULE_HEAT_STRESS
        );
    }

    @Test
    @DisplayName("Deduplication: existing active advisory is updated rather than duplicated")
    void testDeduplicationUpdatesExisting() {
        WeatherSnapshot snapshot = createSnapshot(
                new BigDecimal("36.00"),
                50,
                new BigDecimal("10.00"),
                new BigDecimal("0.00")
        );

        String dedupKey = AdvisoryRuleEngineService.RULE_HEAT_STRESS + "_" + LocalDate.now();
        Advisory existing = new Advisory(
                farm, null, null, AdvisoryRuleEngineService.RULE_HEAT_STRESS,
                "WATER_MANAGEMENT", "HEAT", "ADVISORY", "Old Title", "Old message",
                "Old cond", "Old action", "ACTIVE", LocalDateTime.now(), dedupKey
        );
        existing.setId(99L);

        when(advisoryRepository.findByFarmIdAndDedupKey(farm.getId(), dedupKey)).thenReturn(Optional.of(existing));

        List<Advisory> advisories = ruleEngine.evaluateAndGenerateAdvisories(farm, snapshot, Collections.emptyList());

        assertThat(advisories).hasSize(1);
        Advisory adv = advisories.get(0);
        assertThat(adv.getId()).isEqualTo(99L);
        assertThat(adv.getTitle()).isEqualTo("Crop Heat Stress Advisory");
        verify(advisoryRepository).save(existing);
    }
}


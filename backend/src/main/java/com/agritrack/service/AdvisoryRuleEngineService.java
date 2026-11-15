package com.agritrack.service;

import com.agritrack.entity.Advisory;
import com.agritrack.entity.Farm;
import com.agritrack.entity.WeatherForecast;
import com.agritrack.entity.WeatherSnapshot;
import com.agritrack.repository.AdvisoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Weather-based agronomic advisory rule engine.
 * Evaluates current meteorological observations against strict boundary thresholds
 * and generates actionable farming hazard advisories.
 */
@Service
public class AdvisoryRuleEngineService {

    public static final String RULE_HEAVY_RAINFALL = "RULE_HEAVY_RAINFALL";
    public static final String RULE_HIGH_HUMIDITY = "RULE_HIGH_HUMIDITY";
    public static final String RULE_HIGH_WIND = "RULE_HIGH_WIND";
    public static final String RULE_HEAT_STRESS = "RULE_HEAT_STRESS";

    private static final BigDecimal THRESHOLD_RAIN_MM = new BigDecimal("25.0");
    private static final int THRESHOLD_HUMIDITY_PERCENT = 85;
    private static final BigDecimal THRESHOLD_WIND_KMH = new BigDecimal("20.0");
    private static final BigDecimal THRESHOLD_TEMP_CELSIUS = new BigDecimal("35.0");

    private final AdvisoryRepository advisoryRepository;
    private final NotificationService notificationService;

    public AdvisoryRuleEngineService(AdvisoryRepository advisoryRepository, NotificationService notificationService) {
        this.advisoryRepository = advisoryRepository;
        this.notificationService = notificationService;
    }

    /**
     * Evaluates weather snapshots and forecasts against agronomic hazard rules.
     * Generates or updates active advisories with composite deduplication keys.
     * When no rules trigger, returns an empty list without creating database records.
     */
    @Transactional
    public List<Advisory> evaluateAndGenerateAdvisories(Farm farm, WeatherSnapshot snapshot, List<WeatherForecast> forecasts) {
        if (farm == null || snapshot == null) {
            return List.of();
        }

        List<Advisory> generated = new ArrayList<>();
        LocalDate today = LocalDate.now();

        // 1. Rule: Heavy Rainfall (Rainfall > 25.0 mm)
        if (snapshot.getRainfallMm() != null && snapshot.getRainfallMm().compareTo(THRESHOLD_RAIN_MM) > 0) {
            String dedupKey = RULE_HEAVY_RAINFALL + "_" + today;
            Advisory advisory = upsertAdvisory(
                    farm,
                    RULE_HEAVY_RAINFALL,
                    "WATER_MANAGEMENT",
                    "IRRIGATION",
                    "WARNING",
                    "Heavy Rainfall Warning",
                    "Rainfall of " + snapshot.getRainfallMm() + " mm exceeds the 25.0 mm threshold.",
                    "Rainfall > 25.0 mm (Current: " + snapshot.getRainfallMm() + " mm)",
                    "Suspend irrigation immediately and ensure proper drainage in low-lying fields to prevent waterlogging and root asphyxiation.",
                    today.atTime(23, 59, 59),
                    dedupKey
            );
            generated.add(advisory);
        }

        // 2. Rule: High Humidity (Humidity > 85%)
        if (snapshot.getHumidity() != null && snapshot.getHumidity() > THRESHOLD_HUMIDITY_PERCENT) {
            String dedupKey = RULE_HIGH_HUMIDITY + "_" + today;
            Advisory advisory = upsertAdvisory(
                    farm,
                    RULE_HIGH_HUMIDITY,
                    "CROP_PROTECTION",
                    "DISEASE",
                    "WARNING",
                    "Fungal Disease Risk Alert",
                    "Relative humidity of " + snapshot.getHumidity() + "% exceeds the 85% threshold, creating conditions conducive to fungal infection.",
                    "Humidity > 85% (Current: " + snapshot.getHumidity() + "%)",
                    "High humidity fosters fungal pathogens (e.g. blights, powdery mildew). Monitor crop canopy closely and consider preventive fungicide application.",
                    today.atTime(23, 59, 59),
                    dedupKey
            );
            generated.add(advisory);
        }

        // 3. Rule: High Wind (Wind Speed > 20.0 km/h)
        if (snapshot.getWindSpeedKmh() != null && snapshot.getWindSpeedKmh().compareTo(THRESHOLD_WIND_KMH) > 0) {
            String dedupKey = RULE_HIGH_WIND + "_" + today;
            Advisory advisory = upsertAdvisory(
                    farm,
                    RULE_HIGH_WIND,
                    "FIELD_OPERATIONS",
                    "SPRAY",
                    "ADVISORY",
                    "High Wind Spraying Advisory",
                    "Wind speed of " + snapshot.getWindSpeedKmh() + " km/h exceeds the 20.0 km/h spray threshold.",
                    "Wind Speed > 20.0 km/h (Current: " + snapshot.getWindSpeedKmh() + " km/h)",
                    "Postpone pesticide and foliar fertilizer spray operations to prevent spray drift, environmental contamination, and uneven chemical application.",
                    today.atTime(23, 59, 59),
                    dedupKey
            );
            generated.add(advisory);
        }

        // 4. Rule: Heat Stress (Temperature > 35.0 °C)
        if (snapshot.getTemperature() != null && snapshot.getTemperature().compareTo(THRESHOLD_TEMP_CELSIUS) > 0) {
            String dedupKey = RULE_HEAT_STRESS + "_" + today;
            Advisory advisory = upsertAdvisory(
                    farm,
                    RULE_HEAT_STRESS,
                    "WATER_MANAGEMENT",
                    "HEAT",
                    "ADVISORY",
                    "Crop Heat Stress Advisory",
                    "Ambient temperature of " + snapshot.getTemperature() + " °C exceeds the 35.0 °C heat threshold.",
                    "Temperature > 35.0 °C (Current: " + snapshot.getTemperature() + " °C)",
                    "High temperature increases crop evapotranspiration and wilting risk. Schedule supplemental light irrigation during early morning or evening hours to maintain root-zone moisture.",
                    today.atTime(23, 59, 59),
                    dedupKey
            );
            generated.add(advisory);
        }

        return generated;
    }

    private Advisory upsertAdvisory(Farm farm, String ruleCode, String category, String advisoryType,
                                    String severity, String title, String message, String triggerCondition,
                                    String recommendedAction, LocalDateTime validUntil, String dedupKey) {
        Optional<Advisory> existingOpt = advisoryRepository.findByFarmIdAndDedupKey(farm.getId(), dedupKey);
        Advisory advisory;
        if (existingOpt.isPresent()) {
            advisory = existingOpt.get();
            advisory.setCategory(category);
            advisory.setAdvisoryType(advisoryType);
            advisory.setSeverity(severity);
            advisory.setTitle(title);
            advisory.setMessage(message);
            advisory.setTriggerCondition(triggerCondition);
            advisory.setRecommendedAction(recommendedAction);
            advisory.setValidUntil(validUntil);
            if (!"ACKNOWLEDGED".equals(advisory.getStatus()) && !"DISMISSED".equals(advisory.getStatus())) {
                advisory.setStatus("ACTIVE");
            }
            Advisory saved = advisoryRepository.save(advisory);
            notificationService.createAdvisoryNotification(saved);
            return saved;
        } else {
            advisory = new Advisory(
                    farm, null, null, ruleCode, category, advisoryType, severity,
                    title, message, triggerCondition, recommendedAction, "ACTIVE",
                    validUntil, dedupKey
            );
            Advisory saved = advisoryRepository.save(advisory);
            notificationService.createAdvisoryNotification(saved);
            return saved;
        }
    }
}


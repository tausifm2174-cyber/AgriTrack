package com.agritrack.service;

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
import com.agritrack.service.weather.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Service managing meteorological observation snapshots and 7-day forecasts for farms.
 * Handles cache TTL policy, fallback simulation, and auto-evaluation of agronomic advisories.
 */
@Service
public class WeatherService {

    private static final Logger log = LoggerFactory.getLogger(WeatherService.class);

    private final FarmRepository farmRepository;
    private final UserRepository userRepository;
    private final WeatherSnapshotRepository weatherSnapshotRepository;
    private final WeatherForecastRepository weatherForecastRepository;
    private final OpenWeatherMapClient openWeatherMapClient;
    private final SimulationFallbackWeatherClient simulationFallbackWeatherClient;
    private final AdvisoryRuleEngineService advisoryRuleEngineService;
    private final int cacheTtlMinutes;

    public WeatherService(
            FarmRepository farmRepository,
            UserRepository userRepository,
            WeatherSnapshotRepository weatherSnapshotRepository,
            WeatherForecastRepository weatherForecastRepository,
            OpenWeatherMapClient openWeatherMapClient,
            SimulationFallbackWeatherClient simulationFallbackWeatherClient,
            AdvisoryRuleEngineService advisoryRuleEngineService,
            @Value("${app.weather.cache-ttl-minutes:30}") int cacheTtlMinutes) {
        this.farmRepository = farmRepository;
        this.userRepository = userRepository;
        this.weatherSnapshotRepository = weatherSnapshotRepository;
        this.weatherForecastRepository = weatherForecastRepository;
        this.openWeatherMapClient = openWeatherMapClient;
        this.simulationFallbackWeatherClient = simulationFallbackWeatherClient;
        this.advisoryRuleEngineService = advisoryRuleEngineService;
        this.cacheTtlMinutes = cacheTtlMinutes > 0 ? cacheTtlMinutes : 30;
    }

    private User getUserByEmail(String userEmail) {
        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));
    }

    private Farm getFarmAndValidate(Long farmId, Long userId) {
        Farm farm = farmRepository.findByIdAndUserId(farmId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Farm not found with id: " + farmId));

        if (farm.getLocation() == null || farm.getLocation().trim().isEmpty()) {
            throw new IllegalArgumentException("Farm location is not set. Please update the farm location to retrieve weather data.");
        }
        return farm;
    }

    /**
     * Retrieves current meteorological snapshot for the farm.
     * Serves from cache if recent snapshot exists within cache-ttl-minutes; otherwise syncs fresh data.
     */
    @Transactional
    public WeatherSnapshotResponse getCurrentWeather(Long farmId, String userEmail) {
        User user = getUserByEmail(userEmail);
        Farm farm = getFarmAndValidate(farmId, user.getId());

        LocalDateTime cacheThreshold = LocalDateTime.now().minusMinutes(cacheTtlMinutes);
        Optional<WeatherSnapshot> latestOpt = weatherSnapshotRepository
                .findFirstByFarmIdAndFarmUserIdOrderByObservedAtDesc(farmId, user.getId());

        if (latestOpt.isPresent() && latestOpt.get().getObservedAt().isAfter(cacheThreshold)) {
            return WeatherSnapshotResponse.fromEntity(latestOpt.get(), true);
        }

        WeatherSyncResponse syncResult = syncWeatherInternal(farm, user);
        return syncResult.getCurrent();
    }

    /**
     * Retrieves 7-day meteorological forecast for the farm.
     * Serves cached forecasts if available and fresh; otherwise syncs fresh data.
     */
    @Transactional
    public List<WeatherForecastResponse> getForecast(Long farmId, String userEmail) {
        User user = getUserByEmail(userEmail);
        Farm farm = getFarmAndValidate(farmId, user.getId());

        LocalDateTime cacheThreshold = LocalDateTime.now().minusMinutes(cacheTtlMinutes);
        List<WeatherForecast> forecasts = weatherForecastRepository
                .findByFarmIdAndFarmUserIdOrderByForecastDateAsc(farmId, user.getId());

        if (!forecasts.isEmpty() && forecasts.get(0).getFetchedAt().isAfter(cacheThreshold)) {
            return forecasts.stream().map(WeatherForecastResponse::fromEntity).toList();
        }

        WeatherSyncResponse syncResult = syncWeatherInternal(farm, user);
        return syncResult.getForecast();
    }

    /**
     * Explicitly syncs weather data from meteorological provider, refreshing snapshot and forecasts,
     * and automatically triggers the advisory rule engine.
     */
    @Transactional
    public WeatherSyncResponse syncWeather(Long farmId, String userEmail) {
        User user = getUserByEmail(userEmail);
        Farm farm = getFarmAndValidate(farmId, user.getId());
        return syncWeatherInternal(farm, user);
    }

    private WeatherSyncResponse syncWeatherInternal(Farm farm, User user) {
        WeatherPayload payload;
        if (openWeatherMapClient.isConfigured()) {
            try {
                payload = openWeatherMapClient.fetchWeatherData(farm.getLocation());
            } catch (Exception e) {
                log.warn("OpenWeatherMap fetch failed for farm {}: {}. Falling back to simulation.",
                        farm.getId(), e.getMessage());
                payload = simulationFallbackWeatherClient.fetchWeatherData(farm.getLocation());
            }
        } else {
            payload = simulationFallbackWeatherClient.fetchWeatherData(farm.getLocation());
        }

        CurrentWeatherData currentData = payload.getCurrent();
        LocalDateTime observedAt = currentData.getObservedAt() != null ? currentData.getObservedAt() : LocalDateTime.now();

        WeatherSnapshot snapshot = new WeatherSnapshot(
                farm,
                currentData.getTemperature(),
                currentData.getFeelsLike(),
                currentData.getHumidity(),
                currentData.getWindSpeedKmh(),
                currentData.getWindDirection(),
                currentData.getRainfallMm(),
                currentData.getPressureHpa(),
                currentData.getConditionText(),
                currentData.getConditionCode(),
                currentData.getUvIndex(),
                currentData.getAirQualityIndex(),
                observedAt,
                payload.getProvider()
        );
        WeatherSnapshot savedSnapshot = weatherSnapshotRepository.save(snapshot);

        // Upsert 7-day forecast
        List<WeatherForecast> savedForecasts = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        for (ForecastDayData fData : payload.getForecast()) {
            Optional<WeatherForecast> existingOpt = weatherForecastRepository
                    .findByFarmIdAndForecastDate(farm.getId(), fData.getForecastDate());

            WeatherForecast forecast;
            if (existingOpt.isPresent()) {
                forecast = existingOpt.get();
                forecast.setDayLabel(fData.getDayLabel());
                forecast.setMinTemp(fData.getMinTemp());
                forecast.setMaxTemp(fData.getMaxTemp());
                forecast.setHumidity(fData.getHumidity());
                forecast.setRainChancePercent(fData.getRainChancePercent());
                forecast.setRainMm(fData.getRainMm());
                forecast.setWindSpeedKmh(fData.getWindSpeedKmh());
                forecast.setConditionText(fData.getConditionText());
                forecast.setConditionCode(fData.getConditionCode());
                forecast.setFetchedAt(now);
            } else {
                forecast = new WeatherForecast(
                        farm,
                        fData.getForecastDate(),
                        fData.getDayLabel(),
                        fData.getMinTemp(),
                        fData.getMaxTemp(),
                        fData.getHumidity(),
                        fData.getRainChancePercent(),
                        fData.getRainMm(),
                        fData.getWindSpeedKmh(),
                        fData.getConditionText(),
                        fData.getConditionCode(),
                        now
                );
            }
            savedForecasts.add(weatherForecastRepository.save(forecast));
        }

        // Trigger advisory evaluation
        advisoryRuleEngineService.evaluateAndGenerateAdvisories(farm, savedSnapshot, savedForecasts);

        WeatherSnapshotResponse snapshotResponse = WeatherSnapshotResponse.fromEntity(savedSnapshot, false);
        List<WeatherForecastResponse> forecastResponses = savedForecasts.stream()
                .map(WeatherForecastResponse::fromEntity)
                .toList();

        return new WeatherSyncResponse(
                snapshotResponse,
                forecastResponses,
                payload.getProvider(),
                now,
                now.plusMinutes(cacheTtlMinutes)
        );
    }
}


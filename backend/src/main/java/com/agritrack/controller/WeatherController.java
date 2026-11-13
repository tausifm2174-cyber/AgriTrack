package com.agritrack.controller;

import com.agritrack.dto.ApiResponse;
import com.agritrack.dto.WeatherForecastResponse;
import com.agritrack.dto.WeatherSnapshotResponse;
import com.agritrack.dto.WeatherSyncResponse;
import com.agritrack.service.WeatherService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for farm meteorological weather synchronization and forecasting.
 */
@RestController
@RequestMapping("/farms/{farmId}/weather")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping("/current")
    public ResponseEntity<ApiResponse<WeatherSnapshotResponse>> getCurrentWeather(
            @PathVariable Long farmId,
            Authentication authentication) {
        WeatherSnapshotResponse response = weatherService.getCurrentWeather(farmId, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(response, "Current weather snapshot retrieved successfully"));
    }

    @GetMapping("/forecast")
    public ResponseEntity<ApiResponse<List<WeatherForecastResponse>>> getForecast(
            @PathVariable Long farmId,
            Authentication authentication) {
        List<WeatherForecastResponse> response = weatherService.getForecast(farmId, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(response, "Weather forecast retrieved successfully"));
    }

    @PostMapping("/sync")
    public ResponseEntity<ApiResponse<WeatherSyncResponse>> syncWeather(
            @PathVariable Long farmId,
            Authentication authentication) {
        WeatherSyncResponse response = weatherService.syncWeather(farmId, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(response, "Weather synced and advisories evaluated successfully"));
    }
}


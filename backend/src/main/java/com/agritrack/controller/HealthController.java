package com.agritrack.controller;

import com.agritrack.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Health check controller.
 * Provides a lightweight probe endpoint to verify that the Spring Boot application is operational.
 * Mounted at: GET /api/v1/health
 */
@RestController
@RequestMapping("/health")
public class HealthController {

    @Value("${spring.application.name:agritrack-backend}")
    private String applicationName;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkHealth() {
        Map<String, Object> statusDetails = new LinkedHashMap<>();
        statusDetails.put("application", "AgriTrack Backend");
        statusDetails.put("status", "UP");
        statusDetails.put("serverTime", LocalDateTime.now());

        ApiResponse<Map<String, Object>> response = ApiResponse.success(
                statusDetails,
                "AgriTrack API is operational"
        );

        return ResponseEntity.ok(response);
    }
}


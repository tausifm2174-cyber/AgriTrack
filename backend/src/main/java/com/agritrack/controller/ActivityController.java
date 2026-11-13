package com.agritrack.controller;

import com.agritrack.dto.ActivityRequest;
import com.agritrack.dto.ActivityResponse;
import com.agritrack.dto.ApiResponse;
import com.agritrack.service.ActivityService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for agricultural Activity management.
 * Provides nested field routes and user collection/entity routes.
 */
@RestController
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @PostMapping("/fields/{fieldId}/activities")
    public ResponseEntity<ApiResponse<ActivityResponse>> createActivity(
            @PathVariable Long fieldId,
            @Valid @RequestBody ActivityRequest request,
            Authentication authentication) {
        ActivityResponse response = activityService.createActivity(fieldId, request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Activity created successfully"));
    }

    @GetMapping("/fields/{fieldId}/activities")
    public ResponseEntity<ApiResponse<List<ActivityResponse>>> getActivitiesByField(
            @PathVariable Long fieldId,
            Authentication authentication) {
        List<ActivityResponse> activities = activityService.getActivitiesByField(fieldId, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(activities, "Activities retrieved successfully"));
    }

    @GetMapping("/activities")
    public ResponseEntity<ApiResponse<List<ActivityResponse>>> getAllActivities(
            Authentication authentication) {
        List<ActivityResponse> activities = activityService.getAllActivitiesForUser(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(activities, "All activities retrieved successfully"));
    }

    @GetMapping("/activities/{id}")
    public ResponseEntity<ApiResponse<ActivityResponse>> getActivityById(
            @PathVariable Long id,
            Authentication authentication) {
        ActivityResponse response = activityService.getActivityById(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(response, "Activity retrieved successfully"));
    }

    @PutMapping("/activities/{id}")
    public ResponseEntity<ApiResponse<ActivityResponse>> updateActivity(
            @PathVariable Long id,
            @Valid @RequestBody ActivityRequest request,
            Authentication authentication) {
        ActivityResponse response = activityService.updateActivity(id, request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(response, "Activity updated successfully"));
    }

    @DeleteMapping("/activities/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteActivity(
            @PathVariable Long id,
            Authentication authentication) {
        activityService.deleteActivity(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(null, "Activity deleted successfully"));
    }
}


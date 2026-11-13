package com.agritrack.controller;

import com.agritrack.dto.ApiResponse;
import com.agritrack.dto.UserResponse;
import com.agritrack.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller exposing protected user account operations.
 * Base path: /api/v1/users
 */
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Retrieves the profile of the currently authenticated user.
     * Requires a valid JWT Bearer token.
     *
     * @param authentication The Spring Security authentication principal.
     * @return HTTP 200 with UserResponse.
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        UserResponse response = userService.getCurrentUserProfile(email);
        return ResponseEntity.ok(ApiResponse.success(response, "User profile retrieved successfully"));
    }
}


package com.agritrack.controller;

import com.agritrack.dto.ApiResponse;
import com.agritrack.dto.AuthResponse;
import com.agritrack.dto.LoginRequest;
import com.agritrack.dto.RegisterRequest;
import com.agritrack.dto.UserResponse;
import com.agritrack.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller exposing public user authentication endpoints.
 * Base path: /api/v1/auth
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Registers a new farmer user account.
     *
     * @param request Validated registration payload.
     * @return HTTP 201 with UserResponse.
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(@Valid @RequestBody RegisterRequest request) {
        UserResponse response = authService.register(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "User registered successfully"));
    }

    /**
     * Authenticates a user with email and password.
     *
     * @param request Validated login payload.
     * @return HTTP 200 with JWT AuthResponse.
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Login successful"));
    }
}


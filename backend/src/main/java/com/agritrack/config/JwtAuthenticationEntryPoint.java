package com.agritrack.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * AuthenticationEntryPoint invoked when an unauthenticated user attempts to access a protected resource.
 * Formats the HTTP 401 response into AgriTrack's standard ApiResponse JSON structure.
 */
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationEntryPoint.class);
    private static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException {

        logger.warn("Unauthorized access attempt on URI: {} - Reason: {}", request.getRequestURI(), authException.getMessage());

        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        String message = "Full authentication is required to access this resource: " +
                (authException.getMessage() != null ? authException.getMessage().replace("\"", "\\\"") : "Unauthorized");

        String json = "{\"success\":false,\"message\":\"" + message + "\",\"data\":null,\"timestamp\":\"" +
                LocalDateTime.now().format(ISO_FORMATTER) + "\"}";

        response.getWriter().write(json);
    }
}

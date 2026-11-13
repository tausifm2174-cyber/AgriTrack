package com.agritrack.exception;

/**
 * Exception thrown when a JWT token is missing, invalid, expired, or malformed.
 */
public class JwtAuthenticationException extends RuntimeException {

    public JwtAuthenticationException(String message) {
        super(message);
    }

    public JwtAuthenticationException(String message, Throwable cause) {
        super(message, cause);
    }
}


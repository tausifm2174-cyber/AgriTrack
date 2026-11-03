package com.agritrack.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

/**
 * Standard API response wrapper for all AgriTrack REST endpoints.
 * Provides a uniform JSON structure across success and error responses.
 *
 * @param <T> The payload data type.
 */
public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;

    /**
     * Default constructor required for JSON serialization / deserialization.
     */
    public ApiResponse() {
        this.timestamp = LocalDateTime.now();
    }

    /**
     * Full constructor for manual initialization.
     *
     * @param success   Whether the operation succeeded.
     * @param message   A human-readable response message.
     * @param data      The payload object or null.
     * @param timestamp The response timestamp.
     */
    public ApiResponse(boolean success, String message, T data, LocalDateTime timestamp) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.timestamp = timestamp != null ? timestamp : LocalDateTime.now();
    }

    /**
     * Helper constructor initializing timestamp to current server time.
     *
     * @param success Whether the operation succeeded.
     * @param message A human-readable response message.
     * @param data    The payload object or null.
     */
    public ApiResponse(boolean success, String message, T data) {
        this(success, message, data, LocalDateTime.now());
    }

    // Static Factory Methods

    /**
     * Creates a successful response with payload and custom message.
     */
    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(true, message, data);
    }

    /**
     * Creates a successful response with payload and default message.
     */
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "Request completed successfully", data);
    }

    /**
     * Creates an error response with custom message and optional details payload.
     */
    public static <T> ApiResponse<T> error(String message, T data) {
        return new ApiResponse<>(false, message, data);
    }

    /**
     * Creates an error response with custom message and null data.
     */
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null);
    }

    // Getters and Setters

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}


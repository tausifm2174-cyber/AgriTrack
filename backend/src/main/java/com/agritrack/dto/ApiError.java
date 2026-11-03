package com.agritrack.dto;

/**
 * Data Transfer Object representing a specific field or constraint validation error.
 */
public class ApiError {

    private String field;
    private Object rejectedValue;
    private String message;

    public ApiError() {
    }

    public ApiError(String field, String message) {
        this.field = field;
        this.message = message;
    }

    public ApiError(String field, Object rejectedValue, String message) {
        this.field = field;
        this.rejectedValue = rejectedValue;
        this.message = message;
    }

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public Object getRejectedValue() {
        return rejectedValue;
    }

    public void setRejectedValue(Object rejectedValue) {
        this.rejectedValue = rejectedValue;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}


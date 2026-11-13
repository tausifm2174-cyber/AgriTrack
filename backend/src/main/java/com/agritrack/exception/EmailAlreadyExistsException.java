package com.agritrack.exception;

/**
 * Exception thrown when registration is attempted with an already registered email.
 */
public class EmailAlreadyExistsException extends RuntimeException {

    public EmailAlreadyExistsException(String message) {
        super(message);
    }
}


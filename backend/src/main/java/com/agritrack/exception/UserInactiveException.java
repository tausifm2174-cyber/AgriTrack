package com.agritrack.exception;

/**
 * Exception thrown when authentication is attempted on a deactivated user account.
 */
public class UserInactiveException extends RuntimeException {

    public UserInactiveException(String message) {
        super(message);
    }
}


package com.agritrack.service.mandi;

/**
 * Exception thrown when calls to the external Mandi API fail or return non-2xx status.
 */
public class MandiApiException extends RuntimeException {

    private final int statusCode;
    private final String endpoint;

    public MandiApiException(String message) {
        super(message);
        this.statusCode = 500;
        this.endpoint = null;
    }

    public MandiApiException(String message, int statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.endpoint = null;
    }

    public MandiApiException(String message, int statusCode, String endpoint) {
        super(message);
        this.statusCode = statusCode;
        this.endpoint = endpoint;
    }

    public MandiApiException(String message, Throwable cause) {
        super(message, cause);
        this.statusCode = 500;
        this.endpoint = null;
    }

    public MandiApiException(String message, int statusCode, Throwable cause) {
        super(message, cause);
        this.statusCode = statusCode;
        this.endpoint = null;
    }

    public MandiApiException(String message, int statusCode, String endpoint, Throwable cause) {
        super(message, cause);
        this.statusCode = statusCode;
        this.endpoint = endpoint;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public String getEndpoint() {
        return endpoint;
    }
}

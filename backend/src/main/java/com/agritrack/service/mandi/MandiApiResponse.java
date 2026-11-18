package com.agritrack.service.mandi;

import java.util.Map;

/**
 * Generic response wrapper returned by the external Mandi Price API.
 * Structure:
 * {
 *   "success": true,
 *   "data": [...],
 *   "meta": { ... }
 * }
 *
 * @param <T> Payload data type (e.g. List of markets or prices)
 */
public class MandiApiResponse<T> {

    private boolean success;
    private T data;
    private Map<String, Object> meta;

    public MandiApiResponse() {
    }

    public MandiApiResponse(boolean success, T data, Map<String, Object> meta) {
        this.success = success;
        this.data = data;
        this.meta = meta;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public Map<String, Object> getMeta() {
        return meta;
    }

    public void setMeta(Map<String, Object> meta) {
        this.meta = meta;
    }

    @Override
    public String toString() {
        return "MandiApiResponse{" +
                "success=" + success +
                ", data=" + data +
                ", meta=" + meta +
                '}';
    }
}

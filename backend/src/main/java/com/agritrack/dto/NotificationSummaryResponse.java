package com.agritrack.dto;

import java.util.Map;

public class NotificationSummaryResponse {

    private long total;
    private long unread;
    private long read;
    private Map<String, Long> byType;
    private Map<String, Long> bySeverity;

    public NotificationSummaryResponse() {
    }

    public NotificationSummaryResponse(long total, long unread, long read,
                                       Map<String, Long> byType, Map<String, Long> bySeverity) {
        this.total = total;
        this.unread = unread;
        this.read = read;
        this.byType = byType;
        this.bySeverity = bySeverity;
    }

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }

    public long getUnread() {
        return unread;
    }

    public void setUnread(long unread) {
        this.unread = unread;
    }

    public long getRead() {
        return read;
    }

    public void setRead(long read) {
        this.read = read;
    }

    public Map<String, Long> getByType() {
        return byType;
    }

    public void setByType(Map<String, Long> byType) {
        this.byType = byType;
    }

    public Map<String, Long> getBySeverity() {
        return bySeverity;
    }

    public void setBySeverity(Map<String, Long> bySeverity) {
        this.bySeverity = bySeverity;
    }
}

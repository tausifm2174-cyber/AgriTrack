package com.agritrack.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * Summary DTO aggregating overall operational expenses, category distribution, and payment status breakdown.
 */
public class ExpenseSummaryResponse {

    private BigDecimal totalExpenseAmount;
    private long totalExpenseCount;
    private List<ExpenseCategorySummary> categoryBreakdown;
    private Map<String, BigDecimal> paymentStatusBreakdown;

    public ExpenseSummaryResponse() {
    }

    public ExpenseSummaryResponse(BigDecimal totalExpenseAmount, long totalExpenseCount,
                                  List<ExpenseCategorySummary> categoryBreakdown,
                                  Map<String, BigDecimal> paymentStatusBreakdown) {
        this.totalExpenseAmount = totalExpenseAmount;
        this.totalExpenseCount = totalExpenseCount;
        this.categoryBreakdown = categoryBreakdown;
        this.paymentStatusBreakdown = paymentStatusBreakdown;
    }

    public BigDecimal getTotalExpenseAmount() {
        return totalExpenseAmount;
    }

    public void setTotalExpenseAmount(BigDecimal totalExpenseAmount) {
        this.totalExpenseAmount = totalExpenseAmount;
    }

    public long getTotalExpenseCount() {
        return totalExpenseCount;
    }

    public void setTotalExpenseCount(long totalExpenseCount) {
        this.totalExpenseCount = totalExpenseCount;
    }

    public List<ExpenseCategorySummary> getCategoryBreakdown() {
        return categoryBreakdown;
    }

    public void setCategoryBreakdown(List<ExpenseCategorySummary> categoryBreakdown) {
        this.categoryBreakdown = categoryBreakdown;
    }

    public Map<String, BigDecimal> getPaymentStatusBreakdown() {
        return paymentStatusBreakdown;
    }

    public void setPaymentStatusBreakdown(Map<String, BigDecimal> paymentStatusBreakdown) {
        this.paymentStatusBreakdown = paymentStatusBreakdown;
    }
}

package com.agritrack.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * Unified Profit & Loss (P&L) Analytics response aggregating overall financials,
 * crop-level viability, farm performance, expense category breakdown, and monthly trends.
 */
public class ProfitLossSummaryResponse {

    private BigDecimal totalRevenue;
    private BigDecimal totalExpenses;
    private BigDecimal netProfit;
    private BigDecimal profitMarginPercent;
    private List<CropFinancialSummary> cropSummaries;
    private List<FarmFinancialSummary> farmSummaries;
    private List<ExpenseCategorySummary> categoryBreakdown;
    private List<MonthlyFinancialSummary> monthlyTrends;

    public ProfitLossSummaryResponse() {
    }

    public ProfitLossSummaryResponse(BigDecimal totalRevenue, BigDecimal totalExpenses,
                                     BigDecimal netProfit, BigDecimal profitMarginPercent,
                                     List<CropFinancialSummary> cropSummaries,
                                     List<FarmFinancialSummary> farmSummaries,
                                     List<ExpenseCategorySummary> categoryBreakdown,
                                     List<MonthlyFinancialSummary> monthlyTrends) {
        this.totalRevenue = totalRevenue;
        this.totalExpenses = totalExpenses;
        this.netProfit = netProfit;
        this.profitMarginPercent = profitMarginPercent;
        this.cropSummaries = cropSummaries;
        this.farmSummaries = farmSummaries;
        this.categoryBreakdown = categoryBreakdown;
        this.monthlyTrends = monthlyTrends;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public BigDecimal getTotalExpenses() {
        return totalExpenses;
    }

    public void setTotalExpenses(BigDecimal totalExpenses) {
        this.totalExpenses = totalExpenses;
    }

    public BigDecimal getNetProfit() {
        return netProfit;
    }

    public void setNetProfit(BigDecimal netProfit) {
        this.netProfit = netProfit;
    }

    public BigDecimal getProfitMarginPercent() {
        return profitMarginPercent;
    }

    public void setProfitMarginPercent(BigDecimal profitMarginPercent) {
        this.profitMarginPercent = profitMarginPercent;
    }

    public List<CropFinancialSummary> getCropSummaries() {
        return cropSummaries;
    }

    public void setCropSummaries(List<CropFinancialSummary> cropSummaries) {
        this.cropSummaries = cropSummaries;
    }

    public List<FarmFinancialSummary> getFarmSummaries() {
        return farmSummaries;
    }

    public void setFarmSummaries(List<FarmFinancialSummary> farmSummaries) {
        this.farmSummaries = farmSummaries;
    }

    public List<ExpenseCategorySummary> getCategoryBreakdown() {
        return categoryBreakdown;
    }

    public void setCategoryBreakdown(List<ExpenseCategorySummary> categoryBreakdown) {
        this.categoryBreakdown = categoryBreakdown;
    }

    public List<MonthlyFinancialSummary> getMonthlyTrends() {
        return monthlyTrends;
    }

    public void setMonthlyTrends(List<MonthlyFinancialSummary> monthlyTrends) {
        this.monthlyTrends = monthlyTrends;
    }
}

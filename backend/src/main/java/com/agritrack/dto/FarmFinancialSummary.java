package com.agritrack.dto;

import java.math.BigDecimal;

/**
 * Farm-level financial summary capturing total commercial sales revenue,
 * operating expenses, net profit, and profit margin.
 */
public class FarmFinancialSummary {

    private Long farmId;
    private String farmName;
    private BigDecimal revenue;
    private BigDecimal expenses;
    private BigDecimal netProfit;
    private BigDecimal netMarginPercent;

    public FarmFinancialSummary() {
    }

    public FarmFinancialSummary(Long farmId, String farmName, BigDecimal revenue,
                                BigDecimal expenses, BigDecimal netProfit, BigDecimal netMarginPercent) {
        this.farmId = farmId;
        this.farmName = farmName;
        this.revenue = revenue;
        this.expenses = expenses;
        this.netProfit = netProfit;
        this.netMarginPercent = netMarginPercent;
    }

    public Long getFarmId() {
        return farmId;
    }

    public void setFarmId(Long farmId) {
        this.farmId = farmId;
    }

    public String getFarmName() {
        return farmName;
    }

    public void setFarmName(String farmName) {
        this.farmName = farmName;
    }

    public BigDecimal getRevenue() {
        return revenue;
    }

    public void setRevenue(BigDecimal revenue) {
        this.revenue = revenue;
    }

    public BigDecimal getExpenses() {
        return expenses;
    }

    public void setExpenses(BigDecimal expenses) {
        this.expenses = expenses;
    }

    public BigDecimal getNetProfit() {
        return netProfit;
    }

    public void setNetProfit(BigDecimal netProfit) {
        this.netProfit = netProfit;
    }

    public BigDecimal getNetMarginPercent() {
        return netMarginPercent;
    }

    public void setNetMarginPercent(BigDecimal netMarginPercent) {
        this.netMarginPercent = netMarginPercent;
    }
}

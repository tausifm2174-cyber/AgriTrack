package com.agritrack.dto;

import java.math.BigDecimal;

/**
 * Monthly financial trend point aggregating revenue, expenses, and net profit over a monthly cadence.
 */
public class MonthlyFinancialSummary {

    private Integer year;
    private Integer month;
    private String monthLabel;
    private BigDecimal revenue;
    private BigDecimal expenses;
    private BigDecimal netProfit;

    public MonthlyFinancialSummary() {
    }

    public MonthlyFinancialSummary(Integer year, Integer month, String monthLabel,
                                   BigDecimal revenue, BigDecimal expenses, BigDecimal netProfit) {
        this.year = year;
        this.month = month;
        this.monthLabel = monthLabel;
        this.revenue = revenue;
        this.expenses = expenses;
        this.netProfit = netProfit;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    public String getMonthLabel() {
        return monthLabel;
    }

    public void setMonthLabel(String monthLabel) {
        this.monthLabel = monthLabel;
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
}

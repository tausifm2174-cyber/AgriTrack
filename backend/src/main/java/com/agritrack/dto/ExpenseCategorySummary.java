package com.agritrack.dto;

import java.math.BigDecimal;

/**
 * Breakdown summary for an expense category including aggregate spend and relative percentage.
 */
public class ExpenseCategorySummary {

    private String category;
    private BigDecimal totalAmount;
    private BigDecimal percentageOfExpenses;

    public ExpenseCategorySummary() {
    }

    public ExpenseCategorySummary(String category, BigDecimal totalAmount, BigDecimal percentageOfExpenses) {
        this.category = category;
        this.totalAmount = totalAmount;
        this.percentageOfExpenses = percentageOfExpenses;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BigDecimal getPercentageOfExpenses() {
        return percentageOfExpenses;
    }

    public void setPercentageOfExpenses(BigDecimal percentageOfExpenses) {
        this.percentageOfExpenses = percentageOfExpenses;
    }
}

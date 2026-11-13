package com.agritrack.dto;

import java.math.BigDecimal;

/**
 * Crop-cycle-specific financial performance summary.
 * Aggregates commercial sales revenue, operational expenses, net margin,
 * total harvested physical yield, and production cost per quintal.
 */
public class CropFinancialSummary {

    private Long cropCycleId;
    private String cropName;
    private String variety;
    private String season;
    private BigDecimal revenue;
    private BigDecimal expenses;
    private BigDecimal netProfit;
    private BigDecimal netMarginPercent;
    private BigDecimal harvestYieldKg;
    private BigDecimal costPerQuintal;

    public CropFinancialSummary() {
    }

    public CropFinancialSummary(Long cropCycleId, String cropName, String variety, String season,
                                BigDecimal revenue, BigDecimal expenses, BigDecimal netProfit,
                                BigDecimal netMarginPercent, BigDecimal harvestYieldKg, BigDecimal costPerQuintal) {
        this.cropCycleId = cropCycleId;
        this.cropName = cropName;
        this.variety = variety;
        this.season = season;
        this.revenue = revenue;
        this.expenses = expenses;
        this.netProfit = netProfit;
        this.netMarginPercent = netMarginPercent;
        this.harvestYieldKg = harvestYieldKg;
        this.costPerQuintal = costPerQuintal;
    }

    public Long getCropCycleId() {
        return cropCycleId;
    }

    public void setCropCycleId(Long cropCycleId) {
        this.cropCycleId = cropCycleId;
    }

    public String getCropName() {
        return cropName;
    }

    public void setCropName(String cropName) {
        this.cropName = cropName;
    }

    public String getVariety() {
        return variety;
    }

    public void setVariety(String variety) {
        this.variety = variety;
    }

    public String getSeason() {
        return season;
    }

    public void setSeason(String season) {
        this.season = season;
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

    public BigDecimal getHarvestYieldKg() {
        return harvestYieldKg;
    }

    public void setHarvestYieldKg(BigDecimal harvestYieldKg) {
        this.harvestYieldKg = harvestYieldKg;
    }

    public BigDecimal getCostPerQuintal() {
        return costPerQuintal;
    }

    public void setCostPerQuintal(BigDecimal costPerQuintal) {
        this.costPerQuintal = costPerQuintal;
    }
}

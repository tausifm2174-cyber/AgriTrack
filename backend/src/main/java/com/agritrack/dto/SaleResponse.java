package com.agritrack.dto;

import com.agritrack.entity.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Response payload representing a Sale record with calculated financials and contextual metadata.
 */
public class SaleResponse {

    private Long id;
    private Long harvestId;
    private Long cropCycleId;
    private String cropName;
    private String variety;
    private Long fieldId;
    private String fieldName;
    private Long farmId;
    private String farmName;
    private String buyerName;
    private LocalDate saleDate;
    private BigDecimal quantityKg;
    private BigDecimal pricePerKg;
    private BigDecimal pricePerQuintal;
    private BigDecimal totalAmount;
    private String market;
    private String status;
    private String paymentStatus;
    private BigDecimal paidAmount;
    private BigDecimal balanceDue;
    private String paymentMethod;
    private String invoiceNumber;
    private BigDecimal referenceMarketPricePerQ;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public SaleResponse() {
    }

    public static SaleResponse fromEntity(Sale sale) {
        if (sale == null) {
            return null;
        }

        SaleResponse response = new SaleResponse();
        response.setId(sale.getId());
        response.setBuyerName(sale.getBuyerName());
        response.setSaleDate(sale.getSaleDate());
        response.setQuantityKg(sale.getQuantityKg());
        response.setPricePerKg(sale.getPricePerKg());
        response.setPricePerQuintal(sale.getPricePerQuintal());
        response.setTotalAmount(sale.getTotalAmount());
        response.setMarket(sale.getMarket());
        response.setStatus(sale.getStatus());
        response.setPaymentStatus(sale.getPaymentStatus());
        response.setPaidAmount(sale.getPaidAmount());
        response.setBalanceDue(sale.getBalanceDue());
        response.setPaymentMethod(sale.getPaymentMethod());
        response.setInvoiceNumber(sale.getInvoiceNumber());
        response.setReferenceMarketPricePerQ(sale.getReferenceMarketPricePerQ());
        response.setNotes(sale.getNotes());
        response.setCreatedAt(sale.getCreatedAt());
        response.setUpdatedAt(sale.getUpdatedAt());

        Harvest harvest = sale.getHarvest();
        if (harvest != null) {
            response.setHarvestId(harvest.getId());
            CropCycle cycle = harvest.getCropCycle();
            if (cycle != null) {
                response.setCropCycleId(cycle.getId());
                response.setCropName(cycle.getCropName());
                response.setVariety(cycle.getVariety());

                Field field = cycle.getField();
                if (field != null) {
                    response.setFieldId(field.getId());
                    response.setFieldName(field.getFieldName());

                    Farm farm = field.getFarm();
                    if (farm != null) {
                        response.setFarmId(farm.getId());
                        response.setFarmName(farm.getFarmName());
                    }
                }
            }
        }

        return response;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getHarvestId() {
        return harvestId;
    }

    public void setHarvestId(Long harvestId) {
        this.harvestId = harvestId;
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

    public Long getFieldId() {
        return fieldId;
    }

    public void setFieldId(Long fieldId) {
        this.fieldId = fieldId;
    }

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
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

    public String getBuyerName() {
        return buyerName;
    }

    public void setBuyerName(String buyerName) {
        this.buyerName = buyerName;
    }

    public LocalDate getSaleDate() {
        return saleDate;
    }

    public void setSaleDate(LocalDate saleDate) {
        this.saleDate = saleDate;
    }

    public BigDecimal getQuantityKg() {
        return quantityKg;
    }

    public void setQuantityKg(BigDecimal quantityKg) {
        this.quantityKg = quantityKg;
    }

    public BigDecimal getPricePerKg() {
        return pricePerKg;
    }

    public void setPricePerKg(BigDecimal pricePerKg) {
        this.pricePerKg = pricePerKg;
    }

    public BigDecimal getPricePerQuintal() {
        return pricePerQuintal;
    }

    public void setPricePerQuintal(BigDecimal pricePerQuintal) {
        this.pricePerQuintal = pricePerQuintal;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getMarket() {
        return market;
    }

    public void setMarket(String market) {
        this.market = market;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public BigDecimal getPaidAmount() {
        return paidAmount;
    }

    public void setPaidAmount(BigDecimal paidAmount) {
        this.paidAmount = paidAmount;
    }

    public BigDecimal getBalanceDue() {
        return balanceDue;
    }

    public void setBalanceDue(BigDecimal balanceDue) {
        this.balanceDue = balanceDue;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getInvoiceNumber() {
        return invoiceNumber;
    }

    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }

    public BigDecimal getReferenceMarketPricePerQ() {
        return referenceMarketPricePerQ;
    }

    public void setReferenceMarketPricePerQ(BigDecimal referenceMarketPricePerQ) {
        this.referenceMarketPricePerQ = referenceMarketPricePerQ;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

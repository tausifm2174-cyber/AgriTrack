package com.agritrack.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Request payload for creating or updating a commercial Sale transaction.
 */
public class SaleRequest {

    @NotBlank(message = "Buyer name is required")
    @Size(max = 150, message = "Buyer name cannot exceed 150 characters")
    private String buyerName;

    @NotNull(message = "Sale date is required")
    private LocalDate saleDate;

    @NotNull(message = "Quantity is required")
    @DecimalMin(value = "0.01", message = "Quantity must be greater than 0")
    private BigDecimal quantityKg;

    @NotNull(message = "Price per kg is required")
    @DecimalMin(value = "0.01", message = "Price per kg must be greater than 0")
    private BigDecimal pricePerKg;

    private BigDecimal pricePerQuintal;

    @Size(max = 150, message = "Market name cannot exceed 150 characters")
    private String market;

    @Pattern(regexp = "^(COMPLETED|PENDING|CANCELLED)$",
            message = "Status must be one of: COMPLETED, PENDING, CANCELLED")
    private String status;

    private String paymentStatus;

    @DecimalMin(value = "0.0", message = "Paid amount cannot be negative")
    private BigDecimal paidAmount;

    @Size(max = 50, message = "Payment method cannot exceed 50 characters")
    private String paymentMethod;

    @Size(max = 50, message = "Invoice number cannot exceed 50 characters")
    private String invoiceNumber;

    @DecimalMin(value = "0.0", message = "Reference market price must be non-negative")
    private BigDecimal referenceMarketPricePerQ;

    private String notes;

    // Getters and Setters

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
}

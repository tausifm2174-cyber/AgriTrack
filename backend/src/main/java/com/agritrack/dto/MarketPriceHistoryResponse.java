package com.agritrack.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;

/**
 * Historical daily price point response for an APMC commodity benchmark.
 */
public class MarketPriceHistoryResponse {

    private LocalDate date;
    private BigDecimal price;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;

    public MarketPriceHistoryResponse() {
    }

    public MarketPriceHistoryResponse(LocalDate date, BigDecimal price) {
        this.date = date;
        this.price = price;
    }

    public MarketPriceHistoryResponse(LocalDate date, BigDecimal price, BigDecimal minPrice, BigDecimal maxPrice) {
        this.date = date;
        this.price = price;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getMinPrice() {
        return minPrice;
    }

    public void setMinPrice(BigDecimal minPrice) {
        this.minPrice = minPrice;
    }

    public BigDecimal getMaxPrice() {
        return maxPrice;
    }

    public void setMaxPrice(BigDecimal maxPrice) {
        this.maxPrice = maxPrice;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MarketPriceHistoryResponse that = (MarketPriceHistoryResponse) o;
        return Objects.equals(date, that.date) &&
                Objects.equals(price, that.price) &&
                Objects.equals(minPrice, that.minPrice) &&
                Objects.equals(maxPrice, that.maxPrice);
    }

    @Override
    public int hashCode() {
        return Objects.hash(date, price, minPrice, maxPrice);
    }

    @Override
    public String toString() {
        return "MarketPriceHistoryResponse{" +
                "date=" + date +
                ", price=" + price +
                ", minPrice=" + minPrice +
                ", maxPrice=" + maxPrice +
                '}';
    }
}

package com.agritrack.service.mandi;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Objects;

/**
 * DTO representing an APMC commodity market price record from the external Mandi API.
 * Sourced from /v1/prices and /v1/prices/history.
 */
public class MandiPriceDto {

    private Long id;
    private String state;
    private String district;
    private String market;
    private String commodity;
    private String variety;
    private String grade;

    @JsonProperty("arrival_date")
    private LocalDate arrivalDate;

    @JsonProperty("min_price")
    private BigDecimal minPrice;

    @JsonProperty("max_price")
    private BigDecimal maxPrice;

    @JsonProperty("modal_price")
    private BigDecimal modalPrice;

    @JsonProperty("fetched_at")
    private OffsetDateTime fetchedAt;

    public MandiPriceDto() {
    }

    public MandiPriceDto(Long id, String state, String district, String market,
                         String commodity, String variety, String grade,
                         LocalDate arrivalDate, BigDecimal minPrice, BigDecimal maxPrice,
                         BigDecimal modalPrice, OffsetDateTime fetchedAt) {
        this.id = id;
        this.state = state;
        this.district = district;
        this.market = market;
        this.commodity = commodity;
        this.variety = variety;
        this.grade = grade;
        this.arrivalDate = arrivalDate;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.modalPrice = modalPrice;
        this.fetchedAt = fetchedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getMarket() {
        return market;
    }

    public void setMarket(String market) {
        this.market = market;
    }

    public String getCommodity() {
        return commodity;
    }

    public void setCommodity(String commodity) {
        this.commodity = commodity;
    }

    public String getVariety() {
        return variety;
    }

    public void setVariety(String variety) {
        this.variety = variety;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public LocalDate getArrivalDate() {
        return arrivalDate;
    }

    public void setArrivalDate(LocalDate arrivalDate) {
        this.arrivalDate = arrivalDate;
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

    public BigDecimal getModalPrice() {
        return modalPrice;
    }

    public void setModalPrice(BigDecimal modalPrice) {
        this.modalPrice = modalPrice;
    }

    public OffsetDateTime getFetchedAt() {
        return fetchedAt;
    }

    public void setFetchedAt(OffsetDateTime fetchedAt) {
        this.fetchedAt = fetchedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MandiPriceDto that = (MandiPriceDto) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(state, that.state) &&
                Objects.equals(district, that.district) &&
                Objects.equals(market, that.market) &&
                Objects.equals(commodity, that.commodity) &&
                Objects.equals(variety, that.variety) &&
                Objects.equals(grade, that.grade) &&
                Objects.equals(arrivalDate, that.arrivalDate) &&
                Objects.equals(minPrice, that.minPrice) &&
                Objects.equals(maxPrice, that.maxPrice) &&
                Objects.equals(modalPrice, that.modalPrice) &&
                Objects.equals(fetchedAt, that.fetchedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, state, district, market, commodity, variety, grade,
                arrivalDate, minPrice, maxPrice, modalPrice, fetchedAt);
    }

    @Override
    public String toString() {
        return "MandiPriceDto{" +
                "id=" + id +
                ", state='" + state + '\'' +
                ", district='" + district + '\'' +
                ", market='" + market + '\'' +
                ", commodity='" + commodity + '\'' +
                ", variety='" + variety + '\'' +
                ", grade='" + grade + '\'' +
                ", arrivalDate=" + arrivalDate +
                ", minPrice=" + minPrice +
                ", maxPrice=" + maxPrice +
                ", modalPrice=" + modalPrice +
                ", fetchedAt=" + fetchedAt +
                '}';
    }
}

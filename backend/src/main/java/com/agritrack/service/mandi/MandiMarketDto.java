package com.agritrack.service.mandi;

import java.util.Objects;

/**
 * DTO representing an APMC Mandi market location from the external Mandi API.
 * Sourced from /v1/markets?state={state}.
 */
public class MandiMarketDto {

    private String market;
    private String district;

    public MandiMarketDto() {
    }

    public MandiMarketDto(String market, String district) {
        this.market = market;
        this.district = district;
    }

    public String getMarket() {
        return market;
    }

    public void setMarket(String market) {
        this.market = market;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MandiMarketDto that = (MandiMarketDto) o;
        return Objects.equals(market, that.market) && Objects.equals(district, that.district);
    }

    @Override
    public int hashCode() {
        return Objects.hash(market, district);
    }

    @Override
    public String toString() {
        return "MandiMarketDto{" +
                "market='" + market + '\'' +
                ", district='" + district + '\'' +
                '}';
    }
}

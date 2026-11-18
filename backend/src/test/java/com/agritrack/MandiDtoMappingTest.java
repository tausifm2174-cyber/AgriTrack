package com.agritrack;

import com.agritrack.service.mandi.MandiApiResponse;
import com.agritrack.service.mandi.MandiMarketDto;
import com.agritrack.service.mandi.MandiPriceDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.json.JsonMapper;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("Mandi DTO & JSON Mapping Tests")
class MandiDtoMappingTest {

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = JsonMapper.builder().build();
    }

    @Test
    @DisplayName("Markets response deserializes correctly from Mandi API JSON")
    void testMarketsResponseDeserialization() throws Exception {
        String json = """
        {
          "success": true,
          "data": [
            {
              "market": "APMC Hubballi",
              "district": "Dharwad"
            },
            {
              "market": "Bengaluru APMC",
              "district": "Bengaluru"
            }
          ],
          "meta": {
            "count": 2,
            "state": "Karnataka"
          }
        }
        """;

        MandiApiResponse<List<MandiMarketDto>> response = objectMapper.readValue(
                json, new TypeReference<MandiApiResponse<List<MandiMarketDto>>>() {});

        assertThat(response.isSuccess()).isTrue();
        assertThat(response.getData()).hasSize(2);
        assertThat(response.getMeta()).containsEntry("count", 2);
        assertThat(response.getMeta()).containsEntry("state", "Karnataka");

        MandiMarketDto m1 = response.getData().get(0);
        assertThat(m1.getMarket()).isEqualTo("APMC Hubballi");
        assertThat(m1.getDistrict()).isEqualTo("Dharwad");

        MandiMarketDto m2 = response.getData().get(1);
        assertThat(m2.getMarket()).isEqualTo("Bengaluru APMC");
        assertThat(m2.getDistrict()).isEqualTo("Bengaluru");
    }

    @Test
    @DisplayName("Price response faithfully maps snake_case fields, BigDecimal, LocalDate, and OffsetDateTime")
    void testPriceResponseFieldMapping() throws Exception {
        String json = """
        {
          "success": true,
          "data": [
            {
              "id": 272197,
              "state": "Karnataka",
              "district": "Bengaluru South",
              "market": "Ramanagara APMC",
              "commodity": "Tomato",
              "variety": "Tomato",
              "grade": "Local",
              "arrival_date": "2026-10-16",
              "min_price": 1200.50,
              "max_price": 2000.75,
              "modal_price": 1600.00,
              "fetched_at": "2026-10-16T18:44:38.811+00:00"
            }
          ],
          "meta": {
            "count": 1,
            "state": "Karnataka",
            "commodity": "Tomato",
            "market": "Ramanagara APMC"
          }
        }
        """;

        MandiApiResponse<List<MandiPriceDto>> response = objectMapper.readValue(
                json, new TypeReference<MandiApiResponse<List<MandiPriceDto>>>() {});

        assertThat(response.isSuccess()).isTrue();
        assertThat(response.getData()).hasSize(1);

        MandiPriceDto price = response.getData().get(0);
        assertThat(price.getId()).isEqualTo(272197L);
        assertThat(price.getState()).isEqualTo("Karnataka");
        assertThat(price.getDistrict()).isEqualTo("Bengaluru South");
        assertThat(price.getMarket()).isEqualTo("Ramanagara APMC");
        assertThat(price.getCommodity()).isEqualTo("Tomato");
        assertThat(price.getVariety()).isEqualTo("Tomato");
        assertThat(price.getGrade()).isEqualTo("Local");

        // LocalDate mapping for arrival_date
        assertThat(price.getArrivalDate()).isEqualTo(LocalDate.of(2026, 10, 16));

        // BigDecimal mapping for min_price, max_price, modal_price
        assertThat(price.getMinPrice()).isEqualByComparingTo("1200.50");
        assertThat(price.getMaxPrice()).isEqualByComparingTo("2000.75");
        assertThat(price.getModalPrice()).isEqualByComparingTo("1600.00");

        // OffsetDateTime mapping for fetched_at
        assertThat(price.getFetchedAt()).isEqualTo(
                OffsetDateTime.of(2026, 10, 16, 18, 44, 38, 811000000, ZoneOffset.UTC)
        );
    }

    @Test
    @DisplayName("Historical price series deserializes with multiple daily points")
    void testHistoricalPriceSeriesDeserialization() throws Exception {
        String json = """
        {
          "success": true,
          "data": [
            {
              "id": 2511,
              "state": "Karnataka",
              "district": "Bengaluru South",
              "market": "Ramanagara APMC",
              "commodity": "Tomato",
              "variety": "Tomato",
              "grade": "Local",
              "arrival_date": "2026-07-28",
              "min_price": 1000,
              "max_price": 1500,
              "modal_price": 1200,
              "fetched_at": "2026-07-28T16:44:07.336+00:00"
            },
            {
              "id": 18483,
              "state": "Karnataka",
              "district": "Bengaluru South",
              "market": "Ramanagara APMC",
              "commodity": "Tomato",
              "variety": "Tomato",
              "grade": "Local",
              "arrival_date": "2026-07-29",
              "min_price": 800,
              "max_price": 1300,
              "modal_price": 1000,
              "fetched_at": "2026-07-29T16:15:10.044+00:00"
            }
          ],
          "meta": {
            "count": 2,
            "mode": "MARKET_SPECIFIC"
          }
        }
        """;

        MandiApiResponse<List<MandiPriceDto>> response = objectMapper.readValue(
                json, new TypeReference<MandiApiResponse<List<MandiPriceDto>>>() {});

        assertThat(response.getData()).hasSize(2);
        assertThat(response.getMeta()).containsEntry("mode", "MARKET_SPECIFIC");
        assertThat(response.getData().get(0).getArrivalDate()).isEqualTo(LocalDate.of(2026, 7, 28));
        assertThat(response.getData().get(1).getArrivalDate()).isEqualTo(LocalDate.of(2026, 7, 29));
    }

    @Test
    @DisplayName("Empty data array deserializes safely")
    void testEmptyDataDeserialization() throws Exception {
        String json = """
        {
          "success": true,
          "data": [],
          "meta": {
            "count": 0,
            "market": "Unknown APMC"
          }
        }
        """;

        MandiApiResponse<List<MandiPriceDto>> response = objectMapper.readValue(
                json, new TypeReference<MandiApiResponse<List<MandiPriceDto>>>() {});

        assertThat(response.isSuccess()).isTrue();
        assertThat(response.getData()).isEmpty();
        assertThat(response.getMeta()).containsEntry("count", 0);
    }
}

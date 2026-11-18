package com.agritrack;

import com.agritrack.service.mandi.MandiApiClient;
import com.agritrack.service.mandi.MandiApiException;
import com.agritrack.service.mandi.MandiMarketDto;
import com.agritrack.service.mandi.MandiPriceDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.*;

@DisplayName("Mandi API Client Tests")
class MandiApiClientTest {

    private static final String BASE_URL = "https://mandi-api.onrender.com/v1";

    private MockRestServiceServer mockServer;
    private MandiApiClient client;

    @BeforeEach
    void setUp() {
        RestClient.Builder builder = RestClient.builder().baseUrl(BASE_URL);
        mockServer = MockRestServiceServer.bindTo(builder).build();
        client = new MandiApiClient(builder.build(), BASE_URL);
    }

    @Test
    @DisplayName("getMarkets builds correct URL and returns market list")
    void testGetMarketsSuccess() {
        String mockResponse = """
        {
          "success": true,
          "data": [
            { "market": "APMC Hubballi", "district": "Dharwad" },
            { "market": "Ramanagara APMC", "district": "Bengaluru South" }
          ],
          "meta": { "count": 2, "state": "Karnataka" }
        }
        """;

        mockServer.expect(requestTo(BASE_URL + "/markets?state=Karnataka"))
                .andRespond(withSuccess(mockResponse, MediaType.APPLICATION_JSON));

        List<MandiMarketDto> markets = client.getMarkets("Karnataka");

        mockServer.verify();
        assertThat(markets).hasSize(2);
        assertThat(markets.get(0).getMarket()).isEqualTo("APMC Hubballi");
        assertThat(markets.get(0).getDistrict()).isEqualTo("Dharwad");
        assertThat(markets.get(1).getMarket()).isEqualTo("Ramanagara APMC");
    }

    @Test
    @DisplayName("getMarkets validates required state parameter")
    void testGetMarketsValidation() {
        assertThatThrownBy(() -> client.getMarkets(null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("State is required");

        assertThatThrownBy(() -> client.getMarkets("   "))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("State is required");
    }

    @Test
    @DisplayName("getPrices constructs query with date parameter and handles URL encoding")
    void testGetPricesWithDateSuccess() {
        String mockResponse = """
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
              "min_price": 1200,
              "max_price": 2000,
              "modal_price": 1600,
              "fetched_at": "2026-10-16T18:44:38.811+00:00"
            }
          ],
          "meta": { "count": 1 }
        }
        """;

        mockServer.expect(requestTo(BASE_URL + "/prices?state=Karnataka&commodity=Tomato&market=Ramanagara%20APMC&date=2026-10-16"))
                .andRespond(withSuccess(mockResponse, MediaType.APPLICATION_JSON));

        List<MandiPriceDto> prices = client.getPrices("Karnataka", "Tomato", "Ramanagara APMC", LocalDate.of(2026, 10, 16));

        mockServer.verify();
        assertThat(prices).hasSize(1);
        MandiPriceDto item = prices.get(0);
        assertThat(item.getMarket()).isEqualTo("Ramanagara APMC");
        assertThat(item.getCommodity()).isEqualTo("Tomato");
        assertThat(item.getModalPrice()).isEqualByComparingTo(BigDecimal.valueOf(1600));
        assertThat(item.getArrivalDate()).isEqualTo(LocalDate.of(2026, 10, 16));
    }

    @Test
    @DisplayName("getPrices omits date query parameter when date is null")
    void testGetPricesWithoutDateSuccess() {
        String mockResponse = """
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
              "min_price": 1200,
              "max_price": 2000,
              "modal_price": 1600,
              "fetched_at": "2026-10-16T18:44:38.811+00:00"
            }
          ],
          "meta": { "count": 1, "date": "LATEST" }
        }
        """;

        mockServer.expect(requestTo(BASE_URL + "/prices?state=Karnataka&commodity=Tomato&market=Ramanagara%20APMC"))
                .andRespond(withSuccess(mockResponse, MediaType.APPLICATION_JSON));

        List<MandiPriceDto> prices = client.getPrices("Karnataka", "Tomato", "Ramanagara APMC", null);

        mockServer.verify();
        assertThat(prices).hasSize(1);
    }

    @Test
    @DisplayName("getPrices validates required state, commodity, and market parameters")
    void testGetPricesValidation() {
        LocalDate date = LocalDate.of(2026, 10, 16);

        assertThatThrownBy(() -> client.getPrices(null, "Tomato", "Ramanagara APMC", date))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("State is required");

        assertThatThrownBy(() -> client.getPrices("Karnataka", "", "Ramanagara APMC", date))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Commodity is required");

        assertThatThrownBy(() -> client.getPrices("Karnataka", "Tomato", "   ", date))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Market is required");
    }

    @Test
    @DisplayName("getPriceHistory builds query with from and to date range")
    void testGetPriceHistorySuccess() {
        String mockResponse = """
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
              "arrival_date": "2026-09-01",
              "min_price": 1000,
              "max_price": 1500,
              "modal_price": 1200,
              "fetched_at": "2026-09-01T16:44:07.336+00:00"
            }
          ],
          "meta": { "count": 1, "mode": "MARKET_SPECIFIC" }
        }
        """;

        mockServer.expect(requestTo(BASE_URL + "/prices/history?state=Karnataka&commodity=Tomato&market=Ramanagara%20APMC&from=2026-09-01&to=2026-09-30"))
                .andRespond(withSuccess(mockResponse, MediaType.APPLICATION_JSON));

        List<MandiPriceDto> history = client.getPriceHistory("Karnataka", "Tomato", "Ramanagara APMC",
                LocalDate.of(2026, 9, 1), LocalDate.of(2026, 9, 30));

        mockServer.verify();
        assertThat(history).hasSize(1);
        assertThat(history.get(0).getArrivalDate()).isEqualTo(LocalDate.of(2026, 9, 1));
    }

    @Test
    @DisplayName("getPriceHistory validates date range boundaries")
    void testGetPriceHistoryValidation() {
        LocalDate from = LocalDate.of(2026, 9, 30);
        LocalDate to = LocalDate.of(2026, 9, 1);

        assertThatThrownBy(() -> client.getPriceHistory("Karnataka", "Tomato", "Ramanagara APMC", null, to))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("From date is required");

        assertThatThrownBy(() -> client.getPriceHistory("Karnataka", "Tomato", "Ramanagara APMC", from, null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("To date is required");

        assertThatThrownBy(() -> client.getPriceHistory("Karnataka", "Tomato", "Ramanagara APMC", from, to))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("To date cannot be before from date");
    }

    @Test
    @DisplayName("Client throws MandiApiException on HTTP 404 response")
    void testHandleHttp404Error() {
        mockServer.expect(requestTo(BASE_URL + "/markets?state=InvalidState"))
                .andRespond(withResourceNotFound());

        assertThatThrownBy(() -> client.getMarkets("InvalidState"))
                .isInstanceOf(MandiApiException.class)
                .satisfies(ex -> assertThat(((MandiApiException) ex).getStatusCode()).isEqualTo(404));

        mockServer.verify();
    }

    @Test
    @DisplayName("Client throws MandiApiException on HTTP 500 internal server error")
    void testHandleHttp500Error() {
        mockServer.expect(requestTo(BASE_URL + "/markets?state=Karnataka"))
                .andRespond(withServerError());

        assertThatThrownBy(() -> client.getMarkets("Karnataka"))
                .isInstanceOf(MandiApiException.class)
                .satisfies(ex -> assertThat(((MandiApiException) ex).getStatusCode()).isEqualTo(500));

        mockServer.verify();
    }
}

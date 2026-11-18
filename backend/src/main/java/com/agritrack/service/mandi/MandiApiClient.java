package com.agritrack.service.mandi;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.time.Duration;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

/**
 * Spring HTTP client integration component for the live external Mandi Price API.
 * Sourced from https://mandi-api.onrender.com/v1 (Keyless public APMC Mandi service).
 */
@Component
public class MandiApiClient {

    private static final Logger log = LoggerFactory.getLogger(MandiApiClient.class);

    private final RestClient restClient;
    private final String baseUrl;

    @Autowired
    public MandiApiClient(
            @Value("${mandi.api.base-url:https://mandi-api.onrender.com/v1}") String baseUrl,
            @Value("${mandi.api.timeout-seconds:10}") int timeoutSeconds) {
        this.baseUrl = baseUrl != null ? baseUrl.trim() : "https://mandi-api.onrender.com/v1";

        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(timeoutSeconds));
        factory.setReadTimeout(Duration.ofSeconds(timeoutSeconds));

        this.restClient = RestClient.builder()
                .baseUrl(this.baseUrl)
                .requestFactory(factory)
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.USER_AGENT, "AgriTrack-Backend/1.0")
                .build();
    }

    /**
     * Testing constructor allowing custom RestClient injection.
     *
     * @param restClient Configured RestClient (e.g. bound to MockRestServiceServer)
     * @param baseUrl Base URL
     */
    public MandiApiClient(RestClient restClient, String baseUrl) {
        this.restClient = restClient;
        this.baseUrl = baseUrl != null ? baseUrl.trim() : "https://mandi-api.onrender.com/v1";
    }

    public String getBaseUrl() {
        return baseUrl;
    }

    /**
     * Retrieve all APMC Mandi markets for a given state.
     * Endpoint: GET /v1/markets?state={state}
     *
     * @param state Indian state name (e.g. "Karnataka")
     * @return List of MandiMarketDto containing market name and administrative district
     */
    public List<MandiMarketDto> getMarkets(String state) {
        if (state == null || state.trim().isEmpty()) {
            throw new IllegalArgumentException("State is required to retrieve markets");
        }

        try {
            log.debug("Calling Mandi API /markets for state: {}", state.trim());
            MandiApiResponse<List<MandiMarketDto>> response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/markets")
                            .queryParam("state", state.trim())
                            .build())
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, (request, clientResponse) -> {
                        int status = clientResponse.getStatusCode().value();
                        log.warn("Mandi API /markets error: HTTP {}", status);
                        throw new MandiApiException("Mandi API /markets failed with status " + status, status);
                    })
                    .body(new ParameterizedTypeReference<MandiApiResponse<List<MandiMarketDto>>>() {});

            if (response == null || !response.isSuccess() || response.getData() == null) {
                return Collections.emptyList();
            }
            return response.getData();
        } catch (MandiApiException e) {
            throw e;
        } catch (Exception e) {
            log.warn("Failed to fetch Mandi markets for state '{}': {}", state, e.getMessage());
            throw new MandiApiException("Failed to fetch markets from Mandi API: " + e.getMessage(), e);
        }
    }

    /**
     * Retrieve APMC market benchmark prices for a specific state, commodity, and market.
     * Endpoint: GET /v1/prices?state={state}&commodity={commodity}&market={market}[&date={date}]
     *
     * @param state Indian state name (required)
     * @param commodity Agricultural commodity name (required, e.g. "Tomato", "Onion")
     * @param market Specific APMC market name (required for APMC isolation)
     * @param date Optional arrival date (if null, provider returns latest trading records)
     * @return List of MandiPriceDto matching criteria
     */
    public List<MandiPriceDto> getPrices(String state, String commodity, String market, LocalDate date) {
        if (state == null || state.trim().isEmpty()) {
            throw new IllegalArgumentException("State is required to retrieve prices");
        }
        if (commodity == null || commodity.trim().isEmpty()) {
            throw new IllegalArgumentException("Commodity is required to retrieve prices");
        }
        if (market == null || market.trim().isEmpty()) {
            throw new IllegalArgumentException("Market is required for market-specific price requests");
        }

        try {
            log.debug("Calling Mandi API /prices for state={}, commodity={}, market={}, date={}",
                    state.trim(), commodity.trim(), market.trim(), date);

            MandiApiResponse<List<MandiPriceDto>> response = restClient.get()
                    .uri(uriBuilder -> {
                        var builder = uriBuilder
                                .path("/prices")
                                .queryParam("state", state.trim())
                                .queryParam("commodity", commodity.trim())
                                .queryParam("market", market.trim());
                        if (date != null) {
                            builder.queryParam("date", date.toString());
                        }
                        return builder.build();
                    })
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, (request, clientResponse) -> {
                        int status = clientResponse.getStatusCode().value();
                        log.warn("Mandi API /prices error: HTTP {}", status);
                        throw new MandiApiException("Mandi API /prices failed with status " + status, status);
                    })
                    .body(new ParameterizedTypeReference<MandiApiResponse<List<MandiPriceDto>>>() {});

            if (response == null || !response.isSuccess() || response.getData() == null) {
                return Collections.emptyList();
            }
            return response.getData();
        } catch (MandiApiException e) {
            throw e;
        } catch (Exception e) {
            log.warn("Failed to fetch Mandi prices for state='{}', commodity='{}', market='{}': {}",
                    state, commodity, market, e.getMessage());
            throw new MandiApiException("Failed to fetch prices from Mandi API: " + e.getMessage(), e);
        }
    }

    /**
     * Retrieve market-specific historical price records for chart rendering and trend analysis.
     * Endpoint: GET /v1/prices/history?state={state}&commodity={commodity}&market={market}&from={from}&to={to}
     *
     * @param state Indian state name (required)
     * @param commodity Agricultural commodity name (required)
     * @param market Specific APMC market name (required for market-specific historical records)
     * @param from Start date (required, ISO YYYY-MM-DD)
     * @param to End date (required, ISO YYYY-MM-DD)
     * @return List of chronological daily MandiPriceDto records strictly belonging to the requested APMC
     */
    public List<MandiPriceDto> getPriceHistory(String state, String commodity, String market, LocalDate from, LocalDate to) {
        if (state == null || state.trim().isEmpty()) {
            throw new IllegalArgumentException("State is required to retrieve price history");
        }
        if (commodity == null || commodity.trim().isEmpty()) {
            throw new IllegalArgumentException("Commodity is required to retrieve price history");
        }
        if (market == null || market.trim().isEmpty()) {
            throw new IllegalArgumentException("Market is required for market-specific price history");
        }
        if (from == null) {
            throw new IllegalArgumentException("From date is required for price history");
        }
        if (to == null) {
            throw new IllegalArgumentException("To date is required for price history");
        }
        if (to.isBefore(from)) {
            throw new IllegalArgumentException("To date cannot be before from date");
        }

        try {
            log.debug("Calling Mandi API /prices/history for state={}, commodity={}, market={}, from={}, to={}",
                    state.trim(), commodity.trim(), market.trim(), from, to);

            MandiApiResponse<List<MandiPriceDto>> response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/prices/history")
                            .queryParam("state", state.trim())
                            .queryParam("commodity", commodity.trim())
                            .queryParam("market", market.trim())
                            .queryParam("from", from.toString())
                            .queryParam("to", to.toString())
                            .build())
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, (request, clientResponse) -> {
                        int status = clientResponse.getStatusCode().value();
                        log.warn("Mandi API /prices/history error: HTTP {}", status);
                        throw new MandiApiException("Mandi API /prices/history failed with status " + status, status);
                    })
                    .body(new ParameterizedTypeReference<MandiApiResponse<List<MandiPriceDto>>>() {});

            if (response == null || !response.isSuccess() || response.getData() == null) {
                return Collections.emptyList();
            }
            return response.getData();
        } catch (MandiApiException e) {
            throw e;
        } catch (Exception e) {
            log.warn("Failed to fetch Mandi price history for state='{}', commodity='{}', market='{}': {}",
                    state, commodity, market, e.getMessage());
            throw new MandiApiException("Failed to fetch price history from Mandi API: " + e.getMessage(), e);
        }
    }
}

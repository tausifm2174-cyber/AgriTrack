package com.agritrack;

import com.agritrack.dto.MarketPriceHistoryResponse;
import com.agritrack.dto.MarketPriceRequest;
import com.agritrack.dto.MarketPriceResponse;
import com.agritrack.entity.Role;
import com.agritrack.entity.User;
import com.agritrack.repository.UserRepository;
import com.agritrack.service.MarketPriceService;
import com.agritrack.service.mandi.MandiApiException;
import com.agritrack.service.mandi.MandiMarketDto;
import com.agritrack.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("MarketPriceController Tests")
class MarketPriceControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private JwtUtil jwtUtil;

        @MockitoBean
        private MarketPriceService marketPriceService;

        @MockitoBean
        private UserRepository userRepository;

        private String farmerToken;
        private String adminToken;

        @BeforeEach
        void setUp() {
                User farmer = new User("Farmer Joe", "farmer@example.com", "9876543210", "pwd_hash", Role.FARMER);
                farmer.setId(10L);
                when(userRepository.findByEmail("farmer@example.com")).thenReturn(Optional.of(farmer));
                farmerToken = jwtUtil.generateToken(farmer);

                User admin = new User("Admin Chief", "admin@example.com", "9999999999", "pwd_hash", Role.ADMIN);
                admin.setId(1L);
                when(userRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(admin));
                adminToken = jwtUtil.generateToken(admin);
        }

        @Test
        @DisplayName("GET /market-prices without authentication returns HTTP 401")
        void shouldReturn401WhenUnauthenticated() throws Exception {
                mockMvc.perform(get("/market-prices"))
                                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("GET /market-prices with FARMER token returns HTTP 200")
        void shouldAllowFarmerToReadMarketPrices() throws Exception {
                MarketPriceResponse response = new MarketPriceResponse();
                response.setId(1L);
                response.setCropName("Wheat");
                response.setPricePerQuintal(new BigDecimal("2450.00"));

                when(marketPriceService.getMarketPrices(any(), any(), any(), any(), any(), any(), any(), any()))
                                .thenReturn(List.of(response));

                mockMvc.perform(get("/market-prices")
                                .header("Authorization", "Bearer " + farmerToken))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.success").value(true))
                                .andExpect(jsonPath("$.data[0].cropName").value("Wheat"));
        }

        @Test
        @DisplayName("GET /market-prices/markets returns HTTP 200 and list of APMCs")
        void shouldAllowFarmerToGetMarkets() throws Exception {
                MandiMarketDto m1 = new MandiMarketDto("Ramanagara APMC", "Bengaluru South");
                when(marketPriceService.getMarkets("Karnataka")).thenReturn(List.of(m1));

                mockMvc.perform(get("/market-prices/markets?state=Karnataka")
                                .header("Authorization", "Bearer " + farmerToken))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.success").value(true))
                                .andExpect(jsonPath("$.data[0].market").value("Ramanagara APMC"))
                                .andExpect(jsonPath("$.data[0].district").value("Bengaluru South"));
        }

        @Test
        @DisplayName("GET /market-prices/markets with missing state returns HTTP 400")
        void shouldRejectMissingStateInGetMarkets() throws Exception {
                when(marketPriceService.getMarkets(null))
                                .thenThrow(new IllegalArgumentException("State is required"));

                mockMvc.perform(get("/market-prices/markets")
                                .header("Authorization", "Bearer " + farmerToken))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.success").value(false))
                                .andExpect(jsonPath("$.message").value("State is required"));
        }

        @Test
        @DisplayName("GET /market-prices with live query parameters returns HTTP 200")
        void shouldAllowFarmerToReadLiveMarketPrices() throws Exception {
                MarketPriceResponse response = new MarketPriceResponse();
                response.setId(272197L);
                response.setCropName("Tomato");
                response.setMarketName("Ramanagara APMC");
                response.setPricePerQuintal(new BigDecimal("1600.00"));
                response.setPricePerKg(new BigDecimal("16.00"));
                response.setTrend("RISING");

                when(marketPriceService.getMarketPrices(any(), any(), any(), any(), any(), any(), any(), any()))
                                .thenReturn(List.of(response));

                mockMvc.perform(get(
                                "/market-prices?state=Karnataka&district=Bengaluru%20South&market=Ramanagara%20APMC&crop=Tomato&date=2026-10-16")
                                .header("Authorization", "Bearer " + farmerToken))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.success").value(true))
                                .andExpect(jsonPath("$.data[0].marketName").value("Ramanagara APMC"))
                                .andExpect(jsonPath("$.data[0].pricePerKg").value(16.00))
                                .andExpect(jsonPath("$.data[0].trend").value("RISING"));
        }

        @Test
        @DisplayName("GET /market-prices/history returns HTTP 200 and historical points")
        void shouldAllowFarmerToGetPriceHistory() throws Exception {
                MarketPriceHistoryResponse pt = new MarketPriceHistoryResponse(
                                LocalDate.of(2026, 9, 1),
                                new BigDecimal("1500.00"),
                                new BigDecimal("1200.00"),
                                new BigDecimal("1800.00"));

                when(marketPriceService.getPriceHistory(any(), any(), any(), any(), any()))
                                .thenReturn(List.of(pt));

                mockMvc.perform(get(
                                "/market-prices/history?state=Karnataka&crop=Tomato&market=Ramanagara%20APMC&from=2026-09-01&to=2026-09-30")
                                .header("Authorization", "Bearer " + farmerToken))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.success").value(true))
                                .andExpect(jsonPath("$.data[0].date").value("2026-09-01"))
                                .andExpect(jsonPath("$.data[0].price").value(1500.00));
        }

        @Test
        @DisplayName("GET /market-prices/history with malformed date returns HTTP 400")
        void shouldRejectMalformedDateInHistory() throws Exception {
                mockMvc.perform(get(
                                "/market-prices/history?state=Karnataka&crop=Tomato&market=Ramanagara%20APMC&from=not-a-date&to=2026-09-30")
                                .header("Authorization", "Bearer " + farmerToken))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.success").value(false));
        }

        @Test
        @DisplayName("GET /market-prices/history with invalid date range returns HTTP 400")
        void shouldRejectInvalidDateRangeInHistory() throws Exception {
                when(marketPriceService.getPriceHistory(any(), any(), any(), eq(LocalDate.of(2026, 9, 30)),
                                eq(LocalDate.of(2026, 9, 1))))
                                .thenThrow(new IllegalArgumentException(
                                                "From date (2026-09-30) cannot be after to date (2026-09-01)"));

                mockMvc.perform(get(
                                "/market-prices/history?state=Karnataka&crop=Tomato&market=Ramanagara%20APMC&from=2026-09-30&to=2026-09-01")
                                .header("Authorization", "Bearer " + farmerToken))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.success").value(false))
                                .andExpect(jsonPath("$.message")
                                                .value("From date (2026-09-30) cannot be after to date (2026-09-01)"));
        }

        @Test
        @DisplayName("Provider MandiApiException becomes HTTP 502 with standardized JSON")
        void shouldMapMandiApiExceptionToBadGateway() throws Exception {
                when(marketPriceService.getMarkets("Karnataka"))
                                .thenThrow(new MandiApiException("Upstream 500 error", 500, "/markets"));

                mockMvc.perform(get("/market-prices/markets?state=Karnataka")
                                .header("Authorization", "Bearer " + farmerToken))
                                .andExpect(status().isBadGateway())
                                .andExpect(jsonPath("$.success").value(false))
                                .andExpect(jsonPath("$.message")
                                                .value("Mandi service provider error: Upstream 500 error"));
        }

        @Test
        @DisplayName("GET /market-prices/{id} with FARMER token returns HTTP 200")
        void shouldAllowFarmerToReadMarketPriceById() throws Exception {
                MarketPriceResponse response = new MarketPriceResponse();
                response.setId(1L);
                response.setCropName("Wheat");

                when(marketPriceService.getMarketPriceById(1L)).thenReturn(response);

                mockMvc.perform(get("/market-prices/1")
                                .header("Authorization", "Bearer " + farmerToken))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.success").value(true))
                                .andExpect(jsonPath("$.data.id").value(1L));
        }

        @Test
        @DisplayName("POST /market-prices with FARMER token is rejected with HTTP 403 Forbidden")
        void shouldRejectFarmerFromCreatingMarketPrice() throws Exception {
                String json = """
                                {
                                    "cropName": "Wheat",
                                    "variety": "Sharbati",
                                    "marketName": "APMC Nashik",
                                    "location": "Nashik, Maharashtra",
                                    "pricePerQuintal": 2450.00,
                                    "priceDate": "2026-10-02"
                                }
                                """;

                mockMvc.perform(post("/market-prices")
                                .header("Authorization", "Bearer " + farmerToken)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json))
                                .andExpect(status().isForbidden())
                                .andExpect(jsonPath("$.success").value(false))
                                .andExpect(jsonPath("$.message").value(
                                                "Access denied: You do not have permission to access this resource"));
        }

        @Test
        @DisplayName("PUT /market-prices/{id} with FARMER token is rejected with HTTP 403 Forbidden")
        void shouldRejectFarmerFromUpdatingMarketPrice() throws Exception {
                String json = """
                                {
                                    "cropName": "Wheat",
                                    "variety": "Sharbati",
                                    "marketName": "APMC Nashik",
                                    "location": "Nashik, Maharashtra",
                                    "pricePerQuintal": 2450.00,
                                    "priceDate": "2026-10-02"
                                }
                                """;

                mockMvc.perform(put("/market-prices/1")
                                .header("Authorization", "Bearer " + farmerToken)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json))
                                .andExpect(status().isForbidden())
                                .andExpect(jsonPath("$.success").value(false));
        }

        @Test
        @DisplayName("DELETE /market-prices/{id} with FARMER token is rejected with HTTP 403 Forbidden")
        void shouldRejectFarmerFromDeletingMarketPrice() throws Exception {
                mockMvc.perform(delete("/market-prices/1")
                                .header("Authorization", "Bearer " + farmerToken))
                                .andExpect(status().isForbidden())
                                .andExpect(jsonPath("$.success").value(false));
        }

        @Test
        @DisplayName("POST /market-prices with ADMIN token succeeds with HTTP 201")
        void shouldAllowAdminToCreateMarketPrice() throws Exception {
                MarketPriceResponse response = new MarketPriceResponse();
                response.setId(10L);
                response.setCropName("Wheat");
                response.setPricePerQuintal(new BigDecimal("2500.00"));

                when(marketPriceService.createMarketPrice(any(MarketPriceRequest.class))).thenReturn(response);

                String json = """
                                {
                                    "cropName": "Wheat",
                                    "variety": "Sharbati",
                                    "marketName": "APMC Nashik",
                                    "location": "Nashik, Maharashtra",
                                    "pricePerQuintal": 2500.00,
                                    "priceDate": "2026-10-02"
                                }
                                """;

                mockMvc.perform(post("/market-prices")
                                .header("Authorization", "Bearer " + adminToken)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json))
                                .andExpect(status().isCreated())
                                .andExpect(jsonPath("$.success").value(true))
                                .andExpect(jsonPath("$.data.id").value(10L));
        }

        @Test
        @DisplayName("PUT /market-prices/{id} with ADMIN token succeeds with HTTP 200")
        void shouldAllowAdminToUpdateMarketPrice() throws Exception {
                MarketPriceResponse response = new MarketPriceResponse();
                response.setId(10L);
                response.setCropName("Wheat");
                response.setPricePerQuintal(new BigDecimal("2550.00"));

                when(marketPriceService.updateMarketPrice(eq(10L), any(MarketPriceRequest.class))).thenReturn(response);

                String json = """
                                {
                                    "cropName": "Wheat",
                                    "variety": "Sharbati",
                                    "marketName": "APMC Nashik",
                                    "location": "Nashik, Maharashtra",
                                    "pricePerQuintal": 2550.00,
                                    "priceDate": "2026-10-02"
                                }
                                """;

                mockMvc.perform(put("/market-prices/10")
                                .header("Authorization", "Bearer " + adminToken)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.success").value(true))
                                .andExpect(jsonPath("$.data.pricePerQuintal").value(2550.00));
        }

        @Test
        @DisplayName("DELETE /market-prices/{id} with ADMIN token succeeds with HTTP 204")
        void shouldAllowAdminToDeleteMarketPrice() throws Exception {
                doNothing().when(marketPriceService).deleteMarketPrice(10L);

                mockMvc.perform(delete("/market-prices/10")
                                .header("Authorization", "Bearer " + adminToken))
                                .andExpect(status().isNoContent());
        }
}

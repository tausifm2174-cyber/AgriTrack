package com.agritrack;

import com.agritrack.dto.MarketPriceHistoryResponse;
import com.agritrack.dto.MarketPriceRequest;
import com.agritrack.dto.MarketPriceResponse;
import com.agritrack.entity.MarketPrice;
import com.agritrack.exception.ResourceNotFoundException;
import com.agritrack.repository.MarketPriceRepository;
import com.agritrack.service.MarketPriceService;
import com.agritrack.service.mandi.MandiApiClient;
import com.agritrack.service.mandi.MandiMarketDto;
import com.agritrack.service.mandi.MandiPriceDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("MarketPriceService Unit Tests")
class MarketPriceServiceTest {

    @Mock
    private MarketPriceRepository marketPriceRepository;

    @Mock
    private MandiApiClient mandiApiClient;

    @InjectMocks
    private MarketPriceService marketPriceService;

    private MarketPrice testPrice;

    @BeforeEach
    void setUp() {
        testPrice = new MarketPrice();
        testPrice.setId(1L);
        testPrice.setCropName("Wheat");
        testPrice.setVariety("Sharbati");
        testPrice.setMarketName("APMC Nashik");
        testPrice.setLocation("Nashik, Maharashtra");
        testPrice.setPricePerQuintal(new BigDecimal("2450.00"));
        testPrice.setPricePerKg(new BigDecimal("24.50"));
        testPrice.setPreviousPrice(new BigDecimal("2400.00"));
        testPrice.setPriceChange(new BigDecimal("50.00"));
        testPrice.setChangePercent(new BigDecimal("2.08"));
        testPrice.setTrend("RISING");
        testPrice.setQualityGrade("A");
        testPrice.setPriceDate(LocalDate.of(2026, 10, 2));
        testPrice.setSource("APMC Mandi Daily Bulletin (Sample)");
        testPrice.setArrivalVolumeQuintals(new BigDecimal("1420.00"));
        testPrice.setMinPrice(new BigDecimal("2320.00"));
        testPrice.setMaxPrice(new BigDecimal("2520.00"));
    }

    @Test
    @DisplayName("getMarketPrices without filters returns all records sorted")
    void shouldReturnAllMarketPricesWhenNoFilters() {
        when(marketPriceRepository.findAllByOrderByPriceDateDescCropNameAsc())
                .thenReturn(List.of(testPrice));

        List<MarketPriceResponse> responses = marketPriceService.getMarketPrices(null, null, null, null, null, null);

        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).getCropName()).isEqualTo("Wheat");
        assertThat(responses.get(0).getPricePerQuintal()).isEqualByComparingTo(new BigDecimal("2450.00"));
    }

    @Test
    @DisplayName("getMarkets passes state to provider, maps response, preserves district exactly, and invents no city")
    void shouldGetMarketsSuccessfully() {
        MandiMarketDto m1 = new MandiMarketDto("Ramanagara APMC", "Bengaluru South");
        MandiMarketDto m2 = new MandiMarketDto("APMC Hubballi", "Dharwad");
        when(mandiApiClient.getMarkets("Karnataka")).thenReturn(List.of(m1, m2));

        List<MandiMarketDto> result = marketPriceService.getMarkets("Karnataka");

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getMarket()).isEqualTo("Ramanagara APMC");
        assertThat(result.get(0).getDistrict()).isEqualTo("Bengaluru South");
        assertThat(result.get(1).getMarket()).isEqualTo("APMC Hubballi");
        assertThat(result.get(1).getDistrict()).isEqualTo("Dharwad");
        verify(mandiApiClient, times(1)).getMarkets("Karnataka");
    }

    @Test
    @DisplayName("getMarkets rejects null or blank state")
    void shouldRejectInvalidStateInGetMarkets() {
        assertThatThrownBy(() -> marketPriceService.getMarkets(null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("State is required");

        assertThatThrownBy(() -> marketPriceService.getMarkets("   "))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("State is required");
    }

    @Test
    @DisplayName("getMarketPrices maps live provider DTOs, performs exact APMC isolation, and calculates pricePerKg")
    void shouldGetLiveMarketPricesWithExactApmcIsolation() {
        LocalDate arrivalDate = LocalDate.of(2026, 10, 16);
        MandiPriceDto matching = new MandiPriceDto(
                272197L, "Karnataka", "Bengaluru South", "Ramanagara APMC",
                "Tomato", "Hybrid", "A", arrivalDate,
                new BigDecimal("1200.00"), new BigDecimal("2000.00"), new BigDecimal("1600.00"),
                OffsetDateTime.parse("2026-10-16T18:44:38.811Z")
        );
        // Rogue APMC record from external provider that must be filtered out by defensive isolation
        MandiPriceDto rogue = new MandiPriceDto(
                999999L, "Karnataka", "Bengaluru", "Bengaluru APMC",
                "Tomato", "Local", "B", arrivalDate,
                new BigDecimal("1000.00"), new BigDecimal("1500.00"), new BigDecimal("1300.00"),
                OffsetDateTime.parse("2026-10-16T18:44:38.811Z")
        );

        when(mandiApiClient.getPrices("Karnataka", "Tomato", "Ramanagara APMC", arrivalDate))
                .thenReturn(List.of(matching, rogue));

        // Mock history for previous price lookup: previous trading day was 2026-10-15 with price 1500.00
        MandiPriceDto prevDay = new MandiPriceDto(
                272000L, "Karnataka", "Bengaluru South", "Ramanagara APMC",
                "Tomato", "Hybrid", "A", LocalDate.of(2026, 10, 15),
                new BigDecimal("1100.00"), new BigDecimal("1900.00"), new BigDecimal("1500.00"),
                OffsetDateTime.parse("2026-10-15T18:00:00Z")
        );
        when(mandiApiClient.getPriceHistory(eq("Karnataka"), eq("Tomato"), eq("Ramanagara APMC"), any(), any()))
                .thenReturn(List.of(prevDay));

        List<MarketPriceResponse> responses = marketPriceService.getMarketPrices(
                "Karnataka", "Bengaluru South", "Tomato", "Ramanagara APMC", null, arrivalDate, null, null);

        // Verify exact APMC isolation: only Ramanagara APMC survives; rogue Bengaluru APMC is filtered out
        assertThat(responses).hasSize(1);
        MarketPriceResponse r = responses.get(0);
        assertThat(r.getId()).isEqualTo(272197L);
        assertThat(r.getCropName()).isEqualTo("Tomato");
        assertThat(r.getVariety()).isEqualTo("Hybrid");
        assertThat(r.getMarketName()).isEqualTo("Ramanagara APMC");
        assertThat(r.getLocation()).isEqualTo("Bengaluru South, Karnataka");
        assertThat(r.getPricePerQuintal()).isEqualByComparingTo(new BigDecimal("1600.00"));
        assertThat(r.getPricePerKg()).isEqualByComparingTo(new BigDecimal("16.00")); // modal_price / 100
        assertThat(r.getMinPrice()).isEqualByComparingTo(new BigDecimal("1200.00"));
        assertThat(r.getMaxPrice()).isEqualByComparingTo(new BigDecimal("2000.00"));
        assertThat(r.getQualityGrade()).isEqualTo("A");
        assertThat(r.getPriceDate()).isEqualTo(arrivalDate);
        assertThat(r.getSource()).isEqualTo("Ministry of Agriculture (data.gov.in / Agmarknet)");
        assertThat(r.getArrivalVolumeQuintals()).isNull(); // not fabricated

        // Verify previous price and trend calculation from real history
        assertThat(r.getPreviousPrice()).isEqualByComparingTo(new BigDecimal("1500.00"));
        assertThat(r.getPriceChange()).isEqualByComparingTo(new BigDecimal("100.00"));
        assertThat(r.getChangePercent()).isEqualByComparingTo(new BigDecimal("6.67"));
        assertThat(r.getTrend()).isEqualTo("RISING");
    }

    @Test
    @DisplayName("getMarketPrices leaves previous price null and trend STABLE when no historical trading day exists")
    void shouldKeepPreviousPriceNullWhenNoHistoryAvailable() {
        LocalDate arrivalDate = LocalDate.of(2026, 10, 16);
        MandiPriceDto matching = new MandiPriceDto(
                272197L, "Karnataka", "Bengaluru South", "Ramanagara APMC",
                "Tomato", "Hybrid", "A", arrivalDate,
                new BigDecimal("1200.00"), new BigDecimal("2000.00"), new BigDecimal("1600.00"),
                OffsetDateTime.parse("2026-10-16T18:44:38.811Z")
        );

        when(mandiApiClient.getPrices("Karnataka", "Tomato", "Ramanagara APMC", arrivalDate))
                .thenReturn(List.of(matching));
        when(mandiApiClient.getPriceHistory(eq("Karnataka"), eq("Tomato"), eq("Ramanagara APMC"), any(), any()))
                .thenReturn(Collections.emptyList());

        List<MarketPriceResponse> responses = marketPriceService.getMarketPrices(
                "Karnataka", "Bengaluru South", "Tomato", "Ramanagara APMC", null, arrivalDate, null, null);

        assertThat(responses).hasSize(1);
        MarketPriceResponse r = responses.get(0);
        assertThat(r.getPreviousPrice()).isNull();
        assertThat(r.getPriceChange()).isNull();
        assertThat(r.getChangePercent()).isNull();
        assertThat(r.getTrend()).isEqualTo("STABLE");
    }

    @Test
    @DisplayName("getMarketPrices returns empty list when provider returns no data or no matching APMC")
    void shouldReturnEmptyListWhenNoDataForApmc() {
        LocalDate arrivalDate = LocalDate.of(2026, 10, 16);
        when(mandiApiClient.getPrices("Karnataka", "Tomato", "Ramanagara APMC", arrivalDate))
                .thenReturn(Collections.emptyList());

        List<MarketPriceResponse> responses = marketPriceService.getMarketPrices(
                "Karnataka", "Bengaluru South", "Tomato", "Ramanagara APMC", null, arrivalDate, null, null);

        assertThat(responses).isEmpty();
        verifyNoInteractions(marketPriceRepository);
    }

    @Test
    @DisplayName("getMarketPrices returns empty list when district is passed without market")
    void shouldReturnEmptyListWhenDistrictProvidedWithoutMarket() {
        List<MarketPriceResponse> responses = marketPriceService.getMarketPrices(
                "Karnataka", "Bengaluru South", "Tomato", null, null, null, null, null);

        assertThat(responses).isEmpty();
        verifyNoInteractions(mandiApiClient);
        verifyNoInteractions(marketPriceRepository);
    }

    @Test
    @DisplayName("getPriceHistory forwards parameters, isolates APMC, maps modal price, and chronologically sorts")
    void shouldGetPriceHistoryWithApmcIsolationAndSorting() {
        LocalDate d1 = LocalDate.of(2026, 9, 2);
        LocalDate d2 = LocalDate.of(2026, 9, 1);
        MandiPriceDto p1 = new MandiPriceDto(1L, "Karnataka", "Bengaluru South", "Ramanagara APMC", "Tomato", "Local", "A", d1, new BigDecimal("1200"), new BigDecimal("1800"), new BigDecimal("1500"), null);
        MandiPriceDto p2 = new MandiPriceDto(2L, "Karnataka", "Bengaluru South", "Ramanagara APMC", "Tomato", "Local", "A", d2, new BigDecimal("1100"), new BigDecimal("1700"), new BigDecimal("1400"), null);
        MandiPriceDto otherMarket = new MandiPriceDto(3L, "Karnataka", "Bengaluru", "Other APMC", "Tomato", "Local", "A", d1, new BigDecimal("900"), new BigDecimal("1200"), new BigDecimal("1000"), null);

        when(mandiApiClient.getPriceHistory("Karnataka", "Tomato", "Ramanagara APMC", LocalDate.of(2026, 9, 1), LocalDate.of(2026, 9, 30)))
                .thenReturn(List.of(p1, otherMarket, p2));

        List<MarketPriceHistoryResponse> history = marketPriceService.getPriceHistory(
                "Karnataka", "Tomato", "Ramanagara APMC", LocalDate.of(2026, 9, 1), LocalDate.of(2026, 9, 30));

        assertThat(history).hasSize(2);
        // Assert chronological order (d2: Sep 1 comes before d1: Sep 2)
        assertThat(history.get(0).getDate()).isEqualTo(LocalDate.of(2026, 9, 1));
        assertThat(history.get(0).getPrice()).isEqualByComparingTo(new BigDecimal("1400.00"));
        assertThat(history.get(1).getDate()).isEqualTo(LocalDate.of(2026, 9, 2));
        assertThat(history.get(1).getPrice()).isEqualByComparingTo(new BigDecimal("1500.00"));
    }

    @Test
    @DisplayName("getPriceHistory validates required fields and date ordering")
    void shouldValidatePriceHistoryArguments() {
        LocalDate from = LocalDate.of(2026, 9, 30);
        LocalDate to = LocalDate.of(2026, 9, 1); // from after to

        assertThatThrownBy(() -> marketPriceService.getPriceHistory(null, "Tomato", "APMC", to, from))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("State is required");

        assertThatThrownBy(() -> marketPriceService.getPriceHistory("Karnataka", null, "APMC", to, from))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Crop is required");

        assertThatThrownBy(() -> marketPriceService.getPriceHistory("Karnataka", "Tomato", null, to, from))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Market is required");

        assertThatThrownBy(() -> marketPriceService.getPriceHistory("Karnataka", "Tomato", "APMC", null, from))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("From date is required");

        assertThatThrownBy(() -> marketPriceService.getPriceHistory("Karnataka", "Tomato", "APMC", to, null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("To date is required");

        assertThatThrownBy(() -> marketPriceService.getPriceHistory("Karnataka", "Tomato", "APMC", from, to))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("cannot be after to date");
    }

    @Test
    @DisplayName("getMarketPrices with filters calls repository findWithFilters")
    void shouldCallFilterQueryWhenFiltersProvided() {
        when(marketPriceRepository.findWithFilters("Wheat", "Nashik", "RISING", null, null, null))
                .thenReturn(List.of(testPrice));

        List<MarketPriceResponse> responses = marketPriceService.getMarketPrices("Wheat", "Nashik", "RISING", null, null, null);

        assertThat(responses).hasSize(1);
        verify(marketPriceRepository, times(1)).findWithFilters("Wheat", "Nashik", "RISING", null, null, null);
    }

    @Test
    @DisplayName("getMarketPriceById returns market price record when found")
    void shouldGetMarketPriceById() {
        when(marketPriceRepository.findById(1L)).thenReturn(Optional.of(testPrice));

        MarketPriceResponse response = marketPriceService.getMarketPriceById(1L);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getMarketName()).isEqualTo("APMC Nashik");
    }

    @Test
    @DisplayName("getMarketPriceById throws ResourceNotFoundException when record not found")
    void shouldThrowNotFoundWhenMarketPriceMissing() {
        when(marketPriceRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> marketPriceService.getMarketPriceById(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Market price record not found with id: 999");
    }

    @Test
    @DisplayName("createMarketPrice calculates pricePerKg, priceChange, changePercent, and trend automatically")
    void shouldCreateMarketPriceWithCalculatedFields() {
        MarketPriceRequest request = new MarketPriceRequest();
        request.setCropName("Maize");
        request.setVariety("Hybrid");
        request.setMarketName("Karnal Mandi");
        request.setLocation("Karnal, Haryana");
        request.setPricePerQuintal(new BigDecimal("1850.00"));
        request.setPreviousPrice(new BigDecimal("1880.00")); // -30.00 difference -> FALLING
        request.setPriceDate(LocalDate.of(2026, 10, 2));

        when(marketPriceRepository.save(any(MarketPrice.class))).thenAnswer(invocation -> {
            MarketPrice p = invocation.getArgument(0);
            p.setId(2L);
            return p;
        });

        MarketPriceResponse response = marketPriceService.createMarketPrice(request);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(2L);
        assertThat(response.getPricePerKg()).isEqualByComparingTo(new BigDecimal("18.50"));
        assertThat(response.getPriceChange()).isEqualByComparingTo(new BigDecimal("-30.00"));
        assertThat(response.getTrend()).isEqualTo("FALLING");
        assertThat(response.getChangePercent()).isEqualByComparingTo(new BigDecimal("-1.60"));
    }

    @Test
    @DisplayName("createMarketPrice rejects when maxPrice < minPrice")
    void shouldRejectWhenMaxPriceLessThanMinPrice() {
        MarketPriceRequest request = new MarketPriceRequest();
        request.setCropName("Barley");
        request.setVariety("Standard");
        request.setMarketName("Kota Mandi");
        request.setLocation("Kota, Rajasthan");
        request.setPricePerQuintal(new BigDecimal("1500.00"));
        request.setPriceDate(LocalDate.of(2026, 10, 2));
        request.setMinPrice(new BigDecimal("1600.00"));
        request.setMaxPrice(new BigDecimal("1400.00")); // invalid: max < min

        assertThatThrownBy(() -> marketPriceService.createMarketPrice(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Maximum price");

        verify(marketPriceRepository, never()).save(any());
    }

    @Test
    @DisplayName("createMarketPrice rejects when pricePerQuintal is zero or negative")
    void shouldRejectWhenPricePerQuintalNonPositive() {
        MarketPriceRequest request = new MarketPriceRequest();
        request.setCropName("Barley");
        request.setVariety("Standard");
        request.setMarketName("Kota Mandi");
        request.setLocation("Kota, Rajasthan");
        request.setPricePerQuintal(BigDecimal.ZERO);
        request.setPriceDate(LocalDate.of(2026, 10, 2));

        assertThatThrownBy(() -> marketPriceService.createMarketPrice(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Price per quintal must be greater than zero");
    }

    @Test
    @DisplayName("updateMarketPrice updates existing price record")
    void shouldUpdateMarketPriceSuccessfully() {
        MarketPriceRequest request = new MarketPriceRequest();
        request.setCropName("Wheat");
        request.setVariety("Sharbati");
        request.setMarketName("APMC Nashik");
        request.setLocation("Nashik, Maharashtra");
        request.setPricePerQuintal(new BigDecimal("2500.00"));
        request.setPriceDate(LocalDate.of(2026, 10, 3));

        when(marketPriceRepository.findById(1L)).thenReturn(Optional.of(testPrice));
        when(marketPriceRepository.save(any(MarketPrice.class))).thenAnswer(invocation -> invocation.getArgument(0));

        MarketPriceResponse response = marketPriceService.updateMarketPrice(1L, request);

        assertThat(response).isNotNull();
        assertThat(response.getPricePerQuintal()).isEqualByComparingTo(new BigDecimal("2500.00"));
        assertThat(response.getPricePerKg()).isEqualByComparingTo(new BigDecimal("25.00"));
    }

    @Test
    @DisplayName("deleteMarketPrice removes record")
    void shouldDeleteMarketPrice() {
        when(marketPriceRepository.findById(1L)).thenReturn(Optional.of(testPrice));

        marketPriceService.deleteMarketPrice(1L);

        verify(marketPriceRepository, times(1)).delete(testPrice);
    }
}
